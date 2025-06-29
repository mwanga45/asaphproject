require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const  bcrypt  = require("bcrypt");
const { pool } = require("../dbconn/db");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post(
  "/",
  [
    body("email")
      .notEmpty()
      .withMessage({ message: "Please make sure this email is correct" }),
    body("password")
      .notEmpty()
      .withMessage({ message: "Please make sure fill password field" }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const query1 =
        "SELECT id , username , password, email FROM  users  WHERE email = $1";
      const Result = await pool.query(query1, [email]);
      if (Result.rowCount === 0) {
        return res
          .status(400)
          .json({ message: "Failed to Login. Email or Password is Wrong " });
      }
      const usr = Result.rows[0];
      const IspwrValid = await bcrypt.compare(password, usr.password);

      if (!IspwrValid) {
        return res
          .status(400)
          .json({ message: "failed to login. email or password is wrong" });
      }
      const token = jwt.sign(
        {
          username: usr.username,
          email: usr.email,
          id: usr.id,
        },
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
      );
      console.log(token);
      return res.status(200).json({
        message: "Successfuly login",
        user: {
          username: usr.username,
          id: usr.id,
          email: usr.email,
        },
        token,
      });
    } catch (err) {
      console.error("Something went wrong here:", err);
      return res.status(500).json({ message: "InternaServer Error" });
    }
  }
);

module.exports = router;