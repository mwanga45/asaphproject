require('dotenv').config();          
const express   = require('express');
const axios     = require('axios');
const {isAuthenticated} = require("../middleware/auth")
const router    = express.Router();


router.post('/', async (req, res) => {
  const { phone, message } = req.body;

  
  if (!phone || !message) {
    return res.status(400).json({
      error: "Both 'phone' and 'message' fields are required."
    });
  }

  const apiKey    = process.env.SMS_KEY;
  const secretKey = process.env.SMS_SECRETE;
  const INFO = process.env.BEEM_ID
  const authHeader = 'Basic ' + Buffer
    .from(`${apiKey}:${secretKey}`)
    .toString('base64');


  const data = {
    source_addr:INFO,
    encoding: 0,
    message,
    recipients: [
      { recipient_id: 1, dest_addr: phone }
    ]
  };

  try {
    const response = await axios.post(
      'https://apisms.beem.africa/v1/send',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      }
    );

    return res.json(response.data);
  } catch (err) {
    console.error("Beem API error:", err.response?.data || err.message);
    const status = err.response?.status || 500;
    return res
      .status(status)
      .json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
