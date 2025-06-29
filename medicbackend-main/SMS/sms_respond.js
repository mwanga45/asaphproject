require("dotenv").config()
const axios = require('axios')
const HandleBookingsms = async(phone, message) => {
    if (!phone || !message) {
        return console.error("something went wrong")
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
        { recipient_id: 1, dest_addr: phone }]
      }
    
    
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
    
        console.log("SMS sent successfully:", response.data);
      } catch (err) {
        console.error("Beem API error:", err.response?.data || err.message);
      }
    
}
module.exports = {
    HandleBookingsms
}