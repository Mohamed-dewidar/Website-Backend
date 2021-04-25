const express = require('express');
const router = express.Router();
const as = require('../modelsFolder/academicStaffSchema').model;
const hr = require('../modelsFolder/HrSchema.js').model;
const jwt =require('jsonwebtoken');
const bcryptjs =require('bcryptjs');
const JWT_Password= require('../JWTPassword');


const logInMethod = async(req,res)=>{
    try{
        console.log("you reached the login method");
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({msg:"Please Enter valid valid email or password"});
        }
        let existingUser= await hr.findOne({email:email});
        if(!existingUser) existingUser= await as.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({msg:"User is not registered"});
        }
       
        const isMatched=await bcryptjs.compare(password,existingUser.password);
        if(!isMatched)
        {
             return res.status(400).json({msg:"Invalid credentials"});
        }
     
        const dateRightNow = new Date();
        const isFirstLogin = existingUser.lastLogout===null;
        
        for(var i = existingUser.lastLogout ; i < dateRightNow ; i.setDate(i.getDate()+1)){
            if(isFirstLogin)
            break;
            switch(i.getDay()){
                case 5 :
                    existingUser.workingMap.set(i.getDate(),0); break;
                case existingUser.dayOff:
                    existingUser.workingMap.set(i.getDate(),0); break;
                default:{
                    existingUser.missingDays += 1;
                    existingUser.workingMap.set(i.getDate(),0);
                }
                    
            }
 }
        
        const payload = { id :existingUser.id, role : existingUser.role} ; 
      
        const token = jwt.sign(payload,JWT_Password );
       res.cookie('authToken',token) ;
      
        res.send( {token} );
       
    }

    catch(error){
        res.status(500).json({error:error.message});
    }
}

module.exports = logInMethod;
