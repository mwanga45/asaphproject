const express       = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt        = require("bcrypt");
const router        = express.Router();
const { pool }      = require("../dbconn/db");

router.post(
  "/", 
  [
    body("username").notEmpty().withMessage("Please fill the required input field"),
    body("email")
      .notEmpty().withMessage("Please provide an email")
      .isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty().withMessage("Please provide a password")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").notEmpty().withMessage("Please insert phone field"),
    body("address").notEmpty().withMessage("Please fill the address field"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, phone, address } = req.body;

      
      const { rowCount } = await pool.query(
        "SELECT 1 FROM users WHERE email = $1",
        [email]
      );
      if (rowCount > 0) {
        return res.status(409).json({ message: "User or email already exists" });
      }

    
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      
      await pool.query(
        `INSERT INTO users (username, password, email, phone, address, role)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [username, hashPassword, email, phone, address, "user"]
      );

      return res.status(201).json({ message: "Successfully created new account" });
    } catch (err) {
      console.error("Something went wrong", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
