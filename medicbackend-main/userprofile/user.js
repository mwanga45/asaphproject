const express  =  require("express")
const {pool} =  require("../dbconn/db")
const {isAuthenticated} = require("../middleware/auth")
const {body, validationResult} = require('express-validator')
const router = express.Router()

router.get("/",async(req,res)=>{
    try{
     const query1 =  "SELECT username,phone, email, address FROM  Users WHERE id = $1"
     const userId = req.user.id
     const {rows, rowCount}= await pool.query(query1,[userId])

     if (rowCount === 0){
        return res.status(404).json({message:"Service iS Not Exists"})
     }
     return res.status(200).json({userInfo:rows[0]})
     
    }catch(err){
        console.error("Something went wrong", err)
        return res.status(500).json({message:"Internal Server Error Or Network Error"})
    }

})
// return service 
router.get("/seviceAvailable",async(req,res)=>{
    try{
        const query1 = "SELECT id ,servicename, duration_minutes, fee FROM  service_tb ORDER BY servicename ASC;"
        const {rows, rowCount}=  await pool.query(query1)
        if (rowCount === 0){
            return res.status(404).json({message:"No Service  is already registered yet"})
        }
        return res.status(200).json({rows})
    }catch(err){
        console.error("Something went wrong", err)
        return res.status(500).json({message:"Network Error or Internal ServerError "})
    }
})
// register Service
router.post("/assignService",
    [
      body("servicename").notEmpty().withMessage("Please Insert name Service")
      .isLength({min:4}).withMessage("Please make sure The atleast servicename have 4 character"),
      body("fee").notEmpty().withMessage("Please Make sure your assign Fee"),
      body("duration").notEmpty().withMessage("Please Make sure  you assign Duration")
    ]
    ,async(req,res)=>{
        const errors =  validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        try{
        const {servicename, fee, duration} = req.body
        
        const query1 = `INSERT INTO service_tb(servicename,fee,duration_minutes) VALUES($1,$2,$3)`
        const query2 = "SELECT servicename FROM service_tb WHERE servicename = $1"
        const {rowCount}= await pool.query(query2,[servicename]) 
        if (rowCount > 0){
            return res.status(400).json({message:"The Service name is already been register"})
        }
        await pool.query(query1,[servicename,fee, duration])
        return res.status(200).json({message:"Successfuly Register: ", servicename})

        }catch(err){
            console.error("Something Went error", err)
            return res.status(500).json("Internal Server Error")
        }
})
// router.delete("/deleteservice", async(req,res)=>{

// })


module.exports= router