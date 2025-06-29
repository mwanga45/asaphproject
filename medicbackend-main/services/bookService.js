const express = require("express");
const { pool } = require("../dbconn/db");
const { isAuthenticated } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const moment = require("moment-timezone");
const { HandleBookingsms } = require("../SMS/sms_respond");
const router = express.Router();

function generateTimeSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  let current = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");

  while (current.clone().add(durationMinutes, "minutes").isSameOrBefore(end)) {
    const next = current.clone().add(durationMinutes, "minutes");
    slots.push({
      start_time: current.format("HH:mm"),
      end_time: next.format("HH:mm"),
    });
    current = next;
  }

  return slots;
}

function dayName(n) {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return names[n] || null;
}

router.post(
  "/getslot",
  [
    body("servicename")
      .trim()
      .notEmpty()
      .withMessage("servicename is required"),
    body("duration_minutes")
      .isInt({ min: 1, max: 480 })
      .withMessage("duration_minutes must be between 1 and 480"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { servicename, duration_minutes } = req.body;
    const today = moment().startOf("day");
    const endDate = today.clone().add(4, "days");
    const todayStr = today.format("YYYY-MM-DD");
    const endStr = endDate.format("YYYY-MM-DD");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Fetch working hours
      const { rows: workingRows } = await client.query(
        `SELECT w.doctor_id, d.doctorname, w.day_of_week, w.start_time, w.end_time
         FROM doctor_working_hours w
         JOIN doctors d ON d.id = w.doctor_id
         JOIN doctor_services ds ON ds.doctor_id = d.id
         JOIN service_tb st ON st.id = ds.service_id
         WHERE st.servicename = $1`,
        [servicename]
      );
      if (workingRows.length === 0) {
        await client.query("COMMIT");
        return res
          .status(200)
          .json({ message: "No time slots available for this service yet" });
      }
      // Build schedule map
      const schedule = {};
      workingRows.forEach((r) => {
        if (!schedule[r.doctor_id]) {
          schedule[r.doctor_id] = { doctorname: r.doctorname, days: {} };
        }
        schedule[r.doctor_id].days[r.day_of_week] = {
          start: r.start_time,
          end: r.end_time,
        };
      });

      // Fetch bookings in next 5 days
      const { rows: bookedRows } = await client.query(
        `SELECT doctor_id, booking_date, day_of_week, start_time, end_time, status
         FROM bookings
         WHERE service_id = (
           SELECT id FROM service_tb WHERE servicename = $1
         )
         AND booking_date BETWEEN $2 AND $3
         AND status IN ('confirmed','completed')`,
        [servicename, todayStr, endStr]
      );

      await client.query("COMMIT");

      // Build result arrays outside transaction
      const available = [];
      const booked = [];

      for (let i = 0; i < 5; i++) {
        const date = today.clone().add(i, "days");
        const dateStr = date.format("YYYY-MM-DD");
        const dow = date.day();

        for (const [docId, docData] of Object.entries(schedule)) {
          const hours = docData.days[dow];
          if (!hours) continue;

          const slots = generateTimeSlots(
            hours.start,
            hours.end,
            duration_minutes
          );

          // identify booked for this doctor/date
          const bookedForDate = bookedRows
            .filter((b) => b.doctor_id == docId && b.booking_date === dateStr)
            .map((b) => `${b.start_time}-${b.end_time}`);

          // separate available and booked
          slots.forEach((s) => {
            const key = `${s.start_time}-${s.end_time}`;
            const entry = {
              doctor_id: Number(docId),
              doctorname: docData.doctorname,
              date: dateStr,
              day_name: dayName(dow),
              start_time: s.start_time,
              end_time: s.end_time,
            };
            if (bookedForDate.includes(key)) booked.push(entry);
            else available.push(entry);
          });
        }
      }

      return res.status(200).json({ available, booked });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error in getslot:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  }
);

router.post(
  "/makebooking",
  isAuthenticated,

  body("Selectedbooking")
    .isArray({ min: 1 })
    .withMessage("Selectedbooking must be a non-empty array"),

  body("Selectedbooking[0].doctor_id")
    .isInt()
    .withMessage("doctor_id must be an integer"),
  body("Selectedbooking[0].doctorname")
    .isString()
    .notEmpty()
    .withMessage("doctorname is required"),
  body("Selectedbooking[0].startTime")
    .isString()
    .notEmpty()
    .withMessage("startTime is required"),
  body("Selectedbooking[0].endTime")
    .isString()
    .notEmpty()
    .withMessage("endTime is required"),
  body("Selectedbooking[0].date")
    .isISO8601()
    .withMessage("date must be a valid ISO date"),
  body("Selectedbooking[0].dayname")
    .isString()
    .notEmpty()
    .withMessage("dayname is required"),
  body("Selectedbooking[0].serviceId")
    .isString()
    .notEmpty()
    .withMessage("serviceId is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error({ errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 2) Pull userId from the decoded token (set by isAuthenticated)
      const userId = req.user.id;

      // 3) Extract Selectedbooking from body
      const { Selectedbooking } = req.body;
      const firstItem = Selectedbooking[0];
      const {
        doctor_id,
        doctorname,
        startTime,
        endTime,
        date,
        dayname,
        serviceId,
      } = firstItem;

      // 4) Verify that the doctor exists and matches both doctorname AND doctor_id
      const checkDoctorQuery = `
        SELECT 1
        FROM doctors
        WHERE id = $1
          AND doctorname = $2
        LIMIT 1
      `;
      const { rowCount: countDoc } = await client.query(checkDoctorQuery, [
        doctor_id,
        doctorname,
      ]);
      if (countDoc === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: "Doctor information is incorrect or does not exist.",
        });
      }
      const Getsername = `SELECT servicename FROM service_tb WHERE id = $1 `
      const {rows:servname,rowCount:countserv} = await client.query(Getsername,[serviceId])
       if (countserv === 0){
        await client.query("ROLLBACK")
       }
      const checkUserQuery = `
        SELECT username, phone
        FROM users
        WHERE id = $1
        LIMIT 1
      `;
      const { rows: userRows } = await client.query(checkUserQuery, [userId]);

      if (userRows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "User not found." });
      }

      const Text = `Hi ${userRows.username}, your booking is confirmed!
                    📅 Date: {{Date}}
                    ⏰ Time: ${startTime} – ${endTime}
                    📍 Service: ${servname.servicename}
                    Thank you for choosing us and call us at 0748933859 if your need more information.
`;
     HandleBookingsms(userRows.phone,Text)
      const insertBookingQuery = `
        INSERT INTO booking
          (user_id, doctor_id, service_id, booking_date, start_time, end_time, status, day_of_week)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `;
      const insertValues = [
        userId,
        doctor_id,
        serviceId,
        date,
        startTime,
        endTime,
        "confirmed",
        dayname,
      ];
      const { rows: bookingRows } = await client.query(
        insertBookingQuery,
        insertValues
      );

      await client.query("COMMIT");
      return res.status(200).json({
        message: "Booking created successfully.",
        bookingId: bookingRows[0].id,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Something went wrong in /makebooking:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  }
);

module.exports = router;
