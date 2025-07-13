const express = require('express');
const { pool } = require('../dbconn/db');
const router = express.Router();

// GET /predict-service-bookings
router.get('/predictservicebookings', async (req, res) => {
  try {
    // Count bookings for each service, include all services
    const query = `
      SELECT st.servicename, COALESCE(COUNT(b.id), 0) as booking_count
      FROM service_tb st
      LEFT JOIN bookings b ON b.service_id = st.id
      GROUP BY st.servicename
      ORDER BY booking_count DESC
    `;
    const { rows } = await pool.query(query);
    
    const result = {};
    rows.forEach(row => {
      result[row.servicename] = {
        booking_count: Number(row.booking_count),
        expected_patients: Number(row.booking_count) 
      };
    });
    res.json({ prediction: result });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /booking-slots-stats
router.get('/bookingslotsstats', async (req, res) => {
  try {
    // Get total slots and booked slots for each service, include all services
    const query = `
      SELECT st.servicename,
        COALESCE(SUM(EXTRACT(EPOCH FROM (w.end_time - w.start_time)) / 60), 0) as total_minutes,
        st.duration_minutes,
        COALESCE(COUNT(b.id), 0) as booked_slots
      FROM service_tb st
      LEFT JOIN doctor_services ds ON ds.service_id = st.id
      LEFT JOIN doctor_working_hours w ON w.doctor_id = ds.doctor_id
      LEFT JOIN bookings b ON b.service_id = st.id AND b.status IN ('confirmed','completed')
      GROUP BY st.servicename, st.duration_minutes
      ORDER BY st.servicename
    `;
    const { rows } = await pool.query(query);
    const result = {};
    rows.forEach(row => {
      // Calculate total slots as total_minutes / duration_minutes
      const totalSlots = row.duration_minutes > 0 ? Math.floor(row.total_minutes / row.duration_minutes) : 0;
      result[row.servicename] = {
        total_slots: totalSlots,
        booked_slots: Number(row.booked_slots)
      };
    });
    res.json({ slots: result });
  } catch (err) {
    console.error('Booking slots stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /today-bookings
router.get('/today-bookings', async (req, res) => {
  try {
    const query = `
      SELECT b.id, u.username AS patient_name, s.servicename, d.doctorname, b.start_time, b.end_time, u.phone, b.booking_date
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN service_tb s ON b.service_id = s.id
      LEFT JOIN doctors d ON b.doctor_id = d.id
      WHERE b.booking_date = CURRENT_DATE
      ORDER BY b.start_time ASC
    `;
    const { rows } = await pool.query(query);
    res.json({ bookings: rows });
  } catch (err) {
    console.error('Today bookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
