const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { pool } = require("../dbconn/db");
const router = express.Router();

const validateID = (workingId, specialist) => {
  try {
    const id = workingId.toUpperCase().trim();
    const parts = id.split(/[-/]/);
    if (parts.length !== 4) return false;
    const [clinicCode, specInit, roleCode, num] = parts;
    if (!/^\d+$/.test(num)) return false;
    const expectedInit = specialist
      .toUpperCase()
      .trim()
      .substring(0, specInit.length);
    return specInit === expectedInit;
  } catch {
    return false;
  }
};

router.post(
  "/",
  [
    body("doctorname")
      .trim()
      .notEmpty()
      .withMessage("Please fill the doctorname field")
      .isLength({ min: 6 })
      .withMessage("The name must have at least six characters"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please fill the password field")
      .isLength({ min: 6 })
      .withMessage("Password must have at least six characters"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("specialist")
      .trim()
      .notEmpty()
      .withMessage("Please fill the specialist field"),
    body("phone").trim().notEmpty().withMessage("Please fill the phone field"),
    body("working_id")
      .trim()
      .notEmpty()
      .withMessage("Please fill the working_id field"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorname, password, email, specialist, phone, working_id } =
      req.body;

    if (!validateID(working_id, specialist)) {
      return res.status(400).json({
        message: "Invalid working_id format or specialist code mismatch",
      });
    }

    try {
      const { rowCount: emailExists } = await pool.query(
        "SELECT 1 FROM doctors WHERE email = $1",
        [email]
      );
      if (emailExists > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const { rowCount: specFound } = await pool.query(
        "SELECT 1 FROM specialist WHERE specialist = $1",
        [specialist]
      );
      if (specFound === 0) {
        return res.status(404).json({ message: "Specialist not found" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await pool.query(
        `INSERT INTO doctors
         (doctorname, password, email, specialist_name, phone, working_id, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [doctorname, hashPassword, email, specialist, phone, working_id, "dkt"]
      );

      return res.status(201).json({ message: "Successfully registered" });
    } catch (err) {
      console.error("Something went wrong:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
router.post(
  "/specialist",
  [
    body("specialist")
      .trim()
      .notEmpty()
      .withMessage({ message: "Please make sure you fill the  field " })
      .isLength({ min: 6 })
      .withMessage({
        message: "Make sure the specialistname got atleast 6 character",
      }),
    body("specialistInfo")
      .trim()
      .notEmpty()
      .withMessage({ message: "Please make sure you fill this field" })
      .isLength({ min: 7 })
      .withMessage({
        message: "Make sure the details having atleast 7 character",
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { specialist, specialistInfo } = req.body;
      const query1 = "SELECT 1 FROM specialist WHERE specialist = $1";
      const { rowCount: specFound } = await pool.query(query1, [specialist]);

      if (specFound > 0) {
        return res.status(400).json({
          message: "The specilaist is already been registered in system",
        });
      }
      const query = `INSERT INTO specialist (specialist,specialistInfo) VALUES($1, $2)`;
      await pool.query(query, [specialist, specialistInfo]);
      return res
        .status(201)
        .json({ message: "sucessfuly register", name: specialist });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
// assign the staff sheduling
router.post(
  "/assignshedule",
  [
    body("doctor_id")
      .trim()
      .notEmpty()
      .withMessage("System require doctors Id"),
    body("day_of_week")
      .trim()
      .notEmpty()
      .withMessage("System require day of Week ")
      .isInt({ min: 0, max: 6 })
      .withMessage("day_of_week must be 0–6"),
    body("start_time")
      .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
      .withMessage("Starting time must be in format HH:MM:SS (24hrs)"),
    body("end_time")
      .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
      .withMessage("Ending time must be in format of HH:MM:SS (24hrs)")
      .custom((end, { req }) => {
        if (end <= req.body.start_time) {
          throw new Error("end_time must be later than start_time");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { doctor_id, day_of_week, start_time, end_time } = req.body;
      const { rowCount: exists } = await pool.query(
        "SELECT 1 FROM doctors WHERE  id = $1",
        [doctor_id]
      );

      if (!exists) {
        return res.status(400).json({ message: "Staff not Exists exists" });
      }
      const { rowCount: existshedule } = await pool.query(
        "SELECT 1 FROM doctor_working_hours WHERE doctor_id = $1 AND day_of_week = $2",
        [doctor_id, day_of_week]
      );
      if (existshedule) {
        return res
          .status(400)
          .json({ message: "Staff shedule is already exist " });
      }
      await pool.query(
        `INSERT INTO doctor_working_hours (doctor_id, day_of_week, start_time , end_time) VALUES($1,$2,$3,$4)`,
        [doctor_id, day_of_week, start_time, end_time]
      );
      const { rows: doctorInfo } = await pool.query(
        "SELECT d.doctorname, d.working_id , w.start_time,w.end_time FROM doctors  AS d JOIN doctor_working_hours AS w ON  d.id = w.doctor_id  WHERE w.doctor_id = $1 AND w.day_of_week = $2 ",
        [doctor_id, day_of_week]
      );
      return res
        .status(201)
        .json({ message: "successfuly  assign", doctorInfo });
    } catch (err) {
      console.error("Something went wrong", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/assign_dkt_Service",
  [
    body("doctorId")
      .notEmpty()
      .withMessage("Please make sure  request have doctor_id "),
    body("serviceId")
      .notEmpty()
      .withMessage("Please make sure  request have service_id"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { doctorId, serviceId } = req.body;
    try {
      // make sure  both id for the doctor and service exists

      const { rowCount: docId } = await pool.query(
        `SELECT 1 FROM doctors WHERE id = $1`,
        [doctorId]
      );
      const { rowCount: servId } = await pool.query(
        `SELECT  1 FROM service_tb WHERE id = $1`,
        [serviceId]
      );
      if (docId === 0 || servId === 0) {
        return res
          .status(400)
          .json({ message: "doctor_Id or service_Id not exist " });
      }
      await pool.query(
        `INSERT INTO  doctor_services (doctor_id , service_id) VALUES($1,$2)`,
        [doctorId, serviceId]
      );

      const { rows } = await pool.query(
        `SELECT 
           d.doctorname,
           s.servicename
         FROM doctor_services ds
         JOIN doctors d
           ON d.id = ds.doctor_id
         JOIN service_tb s
           ON s.id = ds.service_id
         WHERE ds.doctor_id = $1
           AND ds.service_id = $2`,
        [doctorId, serviceId]
      );
      return res.status(200).json({ newAssign: rows[0] });
    } catch (err) {
      console.error("Something went wrong here", err);
      return res.status(500).json({ message: "Internal server Error" });
    }
  }
);

router.get("/getdoctors", async (req, res) => {
  try {
    const { rows: data, rowCount: count } = await pool.query(
      `SELECT * FROM doctors `
    );

    if (count === 0) {
      return res
        .status(404)
        .json({ message: "Data Available yet", success: true, data: [] });
    }
    return res
      .status(200)
      .json({ message: "Successfuly", success: true, data });
  } catch (err) {
    console.error("Something went wrong", err);
    return res.status(500).json({ message: "InternalserverError" });
  }
});

module.exports = router;
