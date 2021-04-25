const jwt =require('jsonwebtoken');
const JWT_Password= require('../JWTPassword');
const academic = require('../modelsFolder/academicStaffSchema').model;

const authenticationMethod = async(req,res,next)=>{
    try{
        const token=req.header('authToken');
        if(!token){
            return res.status(403).json({msg:"authentication failed"});
     }
        const verified = jwt.verify(token,JWT_Password);
        console.log(verified);
        console.log("you reached line 13 in academic staff Authorization.js");
        
        
        if(!verified){
               return res.status(403).json({msg:"authorization failed"});
        }
       const isAcademicStaff = await academic.findOne({id:verified.id});

        if(!isAcademicStaff){
            return res.status(401).json({msg:"Not authorized"});
        }
        req.role=verified.role;
        req.id = verified.id ;
        console.log("you reached line 26") ;
        next();
        
    }
    catch(error){
        console.log("you reached line 24 in authentication.js");  
     res.status(500).json({error:error.message});
 
    }
 }


 

 module.exports = authenticationMethod;