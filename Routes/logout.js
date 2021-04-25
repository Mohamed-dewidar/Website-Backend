const logOutMethod = async(req,res)=>{

    try{
        const token = req.header('authToken');
        if(!token){
            return res.status(403).json({msg:"authentication failed"});
        }
        const verified = jwt.verify(token,JWT_Password);
        if(!verified){
               return res.status(403).json({msg:"authorization failed"});
        }
        const tokenID = verified.id ;
        const tokenRole = verified.role;
        let existingUser ;
        switch (tokenRole){
            case "hr":
                existingUser = await hr.findOne({id:tokenID});
                break ;
            default :
                existingUser = await as.findOne({id:tokenID});
                break;        

        }
        if(!existingUser){
            return res.status(400).json({msg:"User is not registered"});
        }
        const dateRN = new Date();
        if(dateRN.getHours()>19){
            dateRN.setHours(19);
            dateRN.setMinutes(0);
        }
        if(dateRN.getHours()<7){
            dateRN.setHours(7);
            dateRN.setMinutes(0);
        }
        existingUser.lastLogout = Date.now();
        if(!existingUser.workingMap.has(dateRN.getDate())){
            var work = dateRN.getTime()-existingUser.lastLogin.getTime();
            existingUser.workingMap.set(dateRN.getDate(),60*work/(1000 * 3600));
        }
        else if(existingUser.workingMap.has(dateRN.getDate())){
            var work = dateRN.getTime()-existingUser.lastLogin.getTime();
            var currenttime =  existingUser.workingMap.get(dateRN.getDate());
            existingUser.workingMap.set(dateRN.getDate(),60*work/(1000 * 3600)+currenttime);
        }
        res.clearCookie('authToken');
        res.send("cookie cleared");
    }
    catch(error){

    }

}

module.exports = logOutMethod;