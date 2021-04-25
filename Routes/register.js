const bcryptjs=require('bcryptjs');
const { findOne } = require('../modelsFolder/academicStaffSchema');
const as = require('../modelsFolder/academicStaffSchema').model;
const hr = require('../modelsFolder/HrSchema').model;

const registerMethod = async(req,res)=>{
    try{
        let {id,email,password,passwordCheck,salary,fName,lName,role}=req.body;
  
  if(!email||!password){
      return res.status(400).json({msg:"Please Enter valid valid email or password"});
  }
  if(password.length<5){
      return res.status(400).json({msg:"The password must be at least 5 characters"});

  }
  if(password!=passwordCheck){
    return res.status(400).json({msg:"Please enter the same password twice"});
 
  }

  let user = await as.findOne({email:email});
  if(!user) user = await hr.findOne({email:email});
  if(user){
    return res
    .status(400)
    .json({msg:"User already registered"});
  }
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password,salt);
  if(role === 'HR'){
    const newHR= new hr({
        id:id,
        email:email,
        password:hashedPassword,
        firstName:fName,
        lastName:lName,
        salary: salary,
        role:role
    });
    const HRSaved = await newHR.save();
    res.json(HRSaved);
  }
  else if(role === 'AS'){
    const newAS= new as({
        id:id,
        email:email,
        password:hashedPassword,
        firstName:fName,
        lastName:lName,
        salary: salary,
        role:role
    });
    const ASSaved = await newAS.save();
    res.json(ASSaved);
  }
  else{
    return res
    .status(400)
    .json({msg:"Role is incorrect"});
  }
  
    }
    catch(error){
        res.status(500).json({msg:error.message});
    }
  
}


module.exports = registerMethod;
