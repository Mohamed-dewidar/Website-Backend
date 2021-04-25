const express = require('express');
const router = express.Router()
const as = require('../modelsFolder/academicStaffSchema')
const hr = require('../modelsFolder/HrSchema')
const jwt =require('jsonwebtoken');
const JWT_Password="r)ch\4g<=FWw;uzdj/:;$'aj4m`7aeDdXD9'T#r-C:p}>RBJsu";

router.route('/login/:email/:pass')
.post(async (req,res) =>{
    const mail=  req.params.email;
    const pass = req.params.pass;
    
    if(!mail){
        return res.status(401).json({msg : 'Email is required to sign in'})
    }
    if(!pass){ 
        return res.status(401).json({msg : 'Password is required to sign in'})
    }
    let user = null;
    if(!user)user = await hr.findOne({Email :mail , Password : pass})
    if(!user) {
        user =  await as.findOne({Email :mail , Password : pass})
    }

    if(user){
        res.json({msg: 'You have successfully loged in'})
        const  token=jwt.sign({_id:user.Id,role:user.Role},JWT_Password);
    }
    else{
        res.json({msg: 'Incorrect Email/Password'})
    }
    
})
module.exports = router;