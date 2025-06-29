const express = require("express");
const loginRouter = require("../authentication/login");
const registerRouter = require("../authentication/reg");
const Profile = require("../userprofile/user");
const SmS = require("../SMS/sms_handler")
const doctorservice = require('../services/doctorsServices')
const admiLogin = require('../authentication/adminLog')
const booking = require('../services/bookService')
const router = express.Router();

router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/profile", Profile);
router.use("/sms",SmS)
router.use("/dktreg",doctorservice)
router.use('/adm',admiLogin)
router.use('/booking', booking)

module.exports = router;
