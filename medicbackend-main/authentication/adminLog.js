// require('dotenv').config
const express = require("express")
const { pool } = require("../dbconn/db")
const { body, validationResult } = require("express-validator")
const bycrpt =  require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()


router.post('/login', [
    body('username').notEmpty().withMessage("Please make sure enter username field"),
    body('password').notEmpty().withMessage("Please make sure enter password field")

], async (req, res) => {
const errors =  validationResult(req) 
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}
try{
    const { username, password} =   req.body
    const {rows, rowCount} =  await pool.query(`SELECT id , username, password ,role FROM adm_tb WHERE username = $1 `, [username]) 
    if (rowCount === 0){
        return res.status(400).json({Message:"Password or Username is Wrong"})
    }
    const usernfo = rows[0]
    const  comparedpassword  =   await bycrpt.compare(password, usernfo.password)
    if (!comparedpassword){
        return res.status(400).json({messege:"Password or username incorrect "})
    }
  const token =  jwt.sign(
    {
        username:usernfo.username,
        id:usernfo.id,
        role:usernfo.role
    },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRES_IN}
    
  )

  return res.status(200).json({
    messege:"Successfuly login",
    token,
  })
}catch(err){
    console.error("Something went wrong",err)
    return res.status(500).json({messege:"InterServer Error",err})
}
})

router.post('/register', async(req,res)=>{
  try{
    const {password, username} =  req.body
    const salt =   await bycrpt.genSalt(10)
    const  hashpassword  =  await  bycrpt.hash(password,salt)
    await pool.query(`INSERT INTO  adm_tb (username,password,role) VALUES($1,$2,$3j2)`, [username, hashpassword, "adm"])
     return res.status(201).json({message:"Successfuly registered"})


  }catch(err){
    console.error("something went wrong", err)
  }
})
module.exports = router

