const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const hr = require('../modelsFolder/HrSchema').model
const academic = require('../modelsFolder/academicStaffSchema').model
const room = require('../modelsFolder/roomSchema').model
const faculty = require('../modelsFolder/facultiesSchema').model
const department = require('../modelsFolder/departmentSchema').model
const course = require('../modelsFolder/courseSchema').model
const request = require('../modelsFolder/requestSchema').model
const { findOne } = require('../modelsFolder/HrSchema').model;
const { sub } = require('../JWTPassword');
const { restart } = require('nodemon');
const { response } = require('express');



//ADD Location
router.post('/addlocation', async (req, res) => {
    const { name, capacity, type } = req.body;
    if (!name || !capacity || !type) {
        return res.status(400).json({ msg: "Please enter missing info" });
    }
    const loc = new room({
        name: name,
        capacity: capacity,
        type: type
    })
    try {
        const check = await room.findOne({ name: name.toLowerCase() })
        if (check) {
            if (check.type === type.toLowerCase())
                return res.status(400).json({ msg: "this room is exists with same type" })
        }
        const saved = await loc.save();
        res.json(saved);
    } catch (err) {
        res.json(err);
    }

});

//Update Location
router.put('/updatelocation', async (req, res) => {
    const { name, capacity, type } = req.body;
    if (!name)
        return res.json({ msg: "Enter a location number" })
    try {
        const loc = await room.findOne({ name: name.toLowerCase() })
        if (!loc)
            return res.json({ msg: "Enter a valid location number" })
        if (capacity)
            await loc.update({ capacity: capacity })
        if (type)
            await loc.update({ type: type.toLowerCase() })
        res.json({ msg: "updated" })
    }
    catch (err) {
        res.json(err)
    }
})

//Delete Location
router.delete('/deletelocation', async (req, res) => {
    const { name } = req.body;

    try {
        const loc = await room.findOne({ name: name.toLowerCase() })
        if (!loc)
            return res.json({ msg: "Enter a valid location" })
        await room.delete({ name: name.toLowerCase() });
        res.json({ msg: "Deleted" })

    } catch (err) {
        res.json(err);
    }

})
//VIEW ALL REQUESTS
router.get('/viewrequests', async(req,res) =>{
   console.log("View All Requests:")
   try{
    const all = await request.find({});
    res.json({all})
   }catch(err){
       res.send(err)
   }
})
//VIEW REQUESTS FROM A SINGLE USER
router.post('/viewrequestfrom',async(req,res)=>{
    console.log("View staff requests:")
    const userID = req.body.userID;

    try{
        
    const userRequest = await request.findOne({requestorID:userID.toLowerCase()});
    if(!userRequest)
    return res.status(400).json({msg : "No such a request with that user id"})
   
    res.json({
        userRequest
        // id:userRequest.requestorID,
        // type:userRequest.requestType,
        // gender:userRequest.gender,
        // documents:userRequest.documents,
        // interval:userRequest.leaveInterval
    })
    }catch(err){
        res.send(err)
    }
})
//ADD faculty
router.post('/addfaculty', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.json({ msg: "Please enter missing info" });
    }
    const fac = new faculty({
        name: name

    })
    try {
        const check = await faculty.findOne({ name: name.toLowerCase() });
        if (check) {
            return res.status(400).json({ msg: "faculty exists" })
        }
        const saved = await fac.save();
        res.json(saved);
    } catch (err) {
        res.json(err);
    }

});


//Update faculty
router.put('/updatefaculty', async (req, res) => {
    const { name, newName } = req.body;
    if (!name || !newName)
        return res.json({ msg: "Enter a the missing data" })

    try {
        const fac = await faculty.findOne({ name: name.toLowerCase() })

        if (!fac)
            return res.json({ msg: "Enter a valid data" })

        await fac.update({ name: newName.toLowerCase() })
        res.json({ msg: "Updated" })

    }
    catch (err) {
        res.json(err)
    }
})


//Delete faculty
router.delete('/deletefaculty', async (req, res) => {
    const { name } = req.body;

    try {
        const fac = await faculty.findOne({ name: name.toLowerCase() })
        if (!fac)
            return res.json({ msg: "Enter a valid Faculty" })
        await fac.delete({ name: name.toLowerCase() });
        res.json({ msg: "Deleted" })

    } catch (err) {
        res.json(err);
    }

})


//Add department
router.post('/adddepartment', async (req, res) => {
    const { name, facultyName, hodID } = req.body;
    if (!name || !facultyName || !hodID) {
        return res.json({ msg: "Please enter missing info" });
    }
    const dep = new department({
        name: name,
        HODId: hodID
    })
    try {
        const check = await department.findOne({ name: name.toLowerCase() });
        if (check) {
            return res.status(400).json({ msg: "department exists" })
        }

        const fac = await faculty.findOne({ name: facultyName.toLowerCase() });
        if (!fac)
            return res.status(400).json({ msg: "wrong faculty name" })
        const as = await academic.findOne({ id: hodID.toLowerCase() })
        if (!as)
            return res.status(400).json({ msg: "no such a ID" })

        await fac.departments.push(dep);
        await fac.save();
        const saved = await dep.save();
        res.json(saved);
    } catch (err) {
        res.json(err);
    }

});

//Update Department name
router.put('/updatedepartmentname', async (req, res) => {
    const { name, newName, facultyName } = req.body;

    if (!name || !newName || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    try {
        const dep = await department.findOne({ name: name.toLowerCase() })
        if (!dep)
            return res.json({ msg: "No Such department exists" })
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() });
        if (!fac)
            return res.status(400).json({ msg: "No Such faculty exists" })

        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++) {
            if (departmentArray[i].name === name.toLowerCase())
                break;
        }

        departmentArray[i].name = newName;
        await fac.save();
        await dep.update({ name: newName });

        res.json({ msg: "Updated" })

    }
    catch (err) {
        res.json(err)
    }
})

//Update Department HOD
router.put('/updatedepartmenthod', async (req, res) => {
    const { name, newHodId, facultyName } = req.body;

    if (!name || !newHodId || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    try {
        const dep = await department.findOne({ name: name.toLowerCase() })
        if (!dep)
            return res.json({ msg: "No Such a department exists" })
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() });
        if (!fac)
            return res.status(400).json({ msg: "No Such a faculty exists" })
        const as = await academic.findOne({ id: newHodId.toLowerCase() })
        if (!as)
            return res.status(400).json({ msg: "No Such a user exists" })



        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++) {
            if (departmentArray[i].name === name.toLowerCase())
                break;
        }

        departmentArray[i].HODId = newHodId;
        await fac.save();
        await dep.update({ HODId: newHodId });

        res.json({ msg: "Updated" })

    }
    catch (err) {
        res.json(err)
    }
})

//Delete Department
router.delete('/deletedepartment', async (req, res) => {
    const { name, facultyName } = req.body;
    if (!name || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    try {
        const dep = await department.findOne({ name: name.toLowerCase() })
        if (!dep)
            return res.json({ msg: "No Such a department exists" })
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() });
        if (!fac)
            return res.status(400).json({ msg: "No Such a faculty exists" })

        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++) {
            if (departmentArray[i].name === name.toLowerCase())
                break;
        }

        departmentArray.pull(departmentArray[i])
        await fac.save();
        await dep.deleteOne({ name: name.toLowerCase() })

        res.json({ msg: "Deleted" })

    } catch (err) {
        res.json(err);
    }

})

//ADD Course
router.post('/addcourse', async (req, res) => {
    const { code, departmentName, facultyName } = req.body;
    if (!code || !departmentName || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    const subject = new course({
        courseCode: code
    })

    try {

        const check = await course.findOne({ courseCode: code.toLowerCase() })
        if (check)
            return res.status(400).json({ msg: "course exists" })

        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep) {
            return res.json({ msg: "No Such a department exists" })
        }
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac)
            return res.status(400).json({ msg: "No Such a faculty exists" })




        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++)
            if (departmentArray[i].name === departmentName.toLowerCase())
                break;

        departmentArray[i].courses.push(subject);
        await fac.save();

        dep.courses.push(subject)
        await dep.save();

        const saved = await subject.save();
        res.json(saved);

    } catch (err) {
        res.status(400).send(err)
    }
})

//Update Course
router.put('/updatecoursecode', async (req, res) => {
    const { code, newCode, departmentName, facultyName } = req.body;
    if (!code || !newCode || !departmentName || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    try {
        const cou = await course.findOne({ courseCode: code.toLowerCase() })
        if (!cou)
            return res.status(400).json({ msg: "no such a course exists" })
        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep)
            return res.status(400).json({ msg: "No Such a department exists" })
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac)
            return res.status(400).json({ msg: "No Such a faculty exists" })


        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++) {

            if (departmentArray[i].name === departmentName.toLowerCase())
                break;
        }

        let courseArray = departmentArray[i].courses
        for (i = 0; i < courseArray.length; i++) {

            if (courseArray[i].courseCode === code.toLowerCase())
                break
        }

        courseArray[i].courseCode = newCode;
        courseArray = dep.courses
        courseArray[i].courseCode = newCode
        await fac.save()
        await dep.save()
        await cou.update({ courseCode: newCode })
        res.json({ msg: "Updated" })

    } catch (err) {
        res.status(400).json(err)
    }


})


//Delete Course
router.delete('/deletecourse', async (req, res) => {
    const { code, departmentName, facultyName } = req.body;
    if (!code || !departmentName || !facultyName)
        return res.json({ msg: "Enter the missing data" })

    try {
        const cou = await course.findOne({ courseCode: code.toLowerCase() })
        if (!cou)
            return res.status(400).json({ msg: "no such a course exists" })
        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep)
            return res.status(400).json({ msg: "No Such a department exists" })
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac)
            return res.status(400).json({ msg: "No Such a faculty exists" })

        let departmentArray = fac.departments;
        var i = 0;
        for (i = 0; i < departmentArray.length; i++) {
            if (departmentArray[i].name === departmentName.toLowerCase())
                break;
        }

        let courseArray = departmentArray[i].courses
        for (i = 0; i < courseArray.length; i++) {
            if (courseArray[i].courseCode === code.toLowerCase())
                break
        }
        courseArray.pull(courseArray[i])
        courseArray = dep.courses
        courseArray.pull(courseArray[i])

        await fac.save()
        await dep.save()
        await cou.deleteOne({ courseCode: code })

        res.json({ msg: "Deleted" })

    } catch (err) {
        res.json(err);
    }

})


//ADD User
router.post('/adduser', async (req, res) => {

    const { email, fName, lName, salary, office, role, gender , facultyName , departmentName} = req.body;
    if (!email || !fName || !lName || !salary || !office || !role || !gender ) {
        return res.status(400).json({ msg: "Please enter missing info" });
    }



    try {
        //email check
        var hrUser = await hr.findOne({ email: email })
        var acUser = await academic.findOne({ email: email })
        if (hrUser || acUser) {
            return res.status(400).json({ msg: "user exists" })
        }
        //password
        const password = "123456"
        const salt = await bcryptjs.genSalt();
        const passwordHashed = await bcryptjs.hash(password, salt);

        //Office
        const loc = await room.findOne({ name: office })
        if (!loc)
            return res.status(400).json({ msg: "no such a office exists" })
        if (loc.type != "office")
            return res.status(400).json({ msg: "this room is not an office" })
        //ID
        var hrCount = await hr.find({}).countDocuments();
        var acCount = await academic.find({}).countDocuments();
        var hrId = "hr-"
        var acId = "ac-"
        if (role.toLowerCase() === "hr") {
            hrCount++;
            hrId = hrId.concat(hrCount.toString())
            hrUser = new hr({
                id: hrId,
                email: email,
                firstName: fName,
                lastName: lName,
                password: passwordHashed,
                salary: parseInt(salary),
                role: role,
                office: office,
                gender: gender,
                faculty : facultyName,
                department : departmentName
            })
            const saved = await hrUser.save();

            res.json(saved);

        }
        if (role.toLowerCase() === "instructor" || "ta" || "hod" || "coordinator") {
            acCount++;
            acId = acId.concat(acCount.toString())
            acUser = new academic({
                id: acId,
                email: email,
                firstName: fName,
                lastName: lName,
                password: passwordHashed,
                salary: parseInt(salary),
                role: role,
                office: office,
                gender: gender,
                faculty : facultyName,
                department : departmentName
            })
            const saved = await acUser.save()
            res.json(saved);
        }
        else {
            return res.status(400).json({ msg: "wrong role name" })
        }
    }
    catch (err) {
        res.json(err);
    }

});


//Update staff role   
router.put('/updatestaffrole', async (req, res) => {
    const { userId, newRole } = req.body;
    if (!userId || !newRole)
        return res.status(400).json({ msg: "Enter the missing info" })

    var idCheck = userId.split("-");



    try {
        if (idCheck[0] === "hr") {
            const hrUser = await hr.findOne({ id: userId.toLowerCase() })
            if (!hrUser)
                return res.status(400).json({ msg: "NO such a user" })

            hrUser.role = newRole;
            const saved = await hrUser.save();
            res.json({ id: saved.id, role: saved.role })

        }
        if (idCheck[0] === "ac") {
            const acUser = await academic.findOne({ id: userId.toLowerCase() })
            if (!acUser)
                return res.status(400).json({ msg: "NO such a user" })

            acUser.role = newRole;
            const saved = await acUser.save();
            res.json({ id: saved.id, role: saved.role })

        } else {
            return res.status(400).json({ msg: "Wrong id format" })
        }


    } catch (err) {
        res.status(403).send(err)
    }

})


//Update staff office
router.put('/updatestaffoffice', async (req, res) => {
    const { userId, newLocation } = req.body;
    if (!userId || !newLocation)
        return res.status(400).json({ msg: "Enter the missing info" })

    var idCheck = userId.split("-");



    try {
        const loc = await room.findOne({ name: newLocation.toLowerCase() })
        if (!loc)
            return res.status(400).json({ msg: "This room does not exist" })

        if (idCheck[0] === "hr") {
            const hrUser = await hr.findOne({ id: userId.toLowerCase() })
            if (!hrUser)
                return res.status(400).json({ msg: "NO such a user" })

            hrUser.office = newLocation;
            const saved = await hrUser.save();
            res.json({ id: saved.id, room: saved.office })

        }
        if (idCheck[0] === "ac") {
            const acUser = await academic.findOne({ id: userId.toLowerCase() })
            if (!acUser)
                return res.status(400).json({ msg: "NO such a user" })

            acUser.office = newLocation;
            const saved = await acUser.save();
            res.json({ id: saved.id, room: saved.office })

        } else {
            return res.status(400).json({ msg: "Wrong id format" })
        }


    } catch (err) {
        res.status(403).send(err)
    }

})


//Delete staff member
router.delete('/deletestaff', async (req, res) => {
    const { staffId } = req.body;
    if (!staffId)
        return res.status(400).json({ msg: "Enter the missing info" })

    var idCheck = staffId.split("-");
    try {

        if (idCheck[0] === "hr") {
            const hrUser = await hr.deleteOne({ id: staffId.toLowerCase() })
            if (!hrUser)
                return res.status(400).json({ msg: "wrong staff id" })


            res.json({ msg: "Deleted" })

        }
        if (idCheck[0] === "ac") {
            const acUser = await academic.findOneAndDelete({ id: staffId.toLowerCase() })
            if (!acUser)
                return res.status(400).json({ msg: "wrong staff id" })

            res.json(acUser)

        } else {
            return res.status(400).json({ msg: "Wrong id format" })
        }


    } catch (err) {
        res.status(403).send(err)
    }
})





router.get('/viewProfile', async (req,res) =>{
    console.log("you reqached the hr router");
        try{
            const hrID = req.id;
            console.log(hrID) ;
        if(!hrID){
            return res.status(403).json({msg:"authentication failed please relogin"});
          }
        const asMember = await hr.findOne({id:hrID});
        res.json({
            id:asMember.id,
            email:asMember.email,
            firstName:asMember.firstName,
            lastName:asMember.lastName,
            role:asMember.role,
            salary:asMember.salary
        })
        }
        
       
    
    catch(err){
        res.json(err);
    }

});


router.post('/resetPassword', async (req,res) =>{
    console.log("you reqached the academic staff router");
        try{
            const hrID = req.id;
        if(!hrID){
            return res.status(403).json({msg:"authentication failed please relogin"});
          }
        const hrMember = await hr.findOne({id:hrID});
        const defaultPassword = "123456" ;
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(defaultPassword,salt);
        await hrMember.updateOne({password:hashedPassword})
        
        res.json({
           msg:"Your password was reset to 123456"
        })
        }
    catch(err){
        res.json(err);
    }
});

router.post('/updateEmail', async (req,res) =>{
    console.log("you reqached the academic staff router specifically the update Email method");
        try{
            const {newEmail}=req.body;
            const hrID = req.id;
        if(!hrID){
            return res.status(403).json({msg:"authentication failed please relogin"});
          }
        const asMember = await hr.findOne({id:hrID});
        await asMember.updateOne({email:newEmail})
        res.json({
           msg:"Your email has been updated to " +newEmail+"."
        })
        }
    catch(err){
        res.json(err);
    }
});


router.post('/updatePassword', async (req,res) =>{
    console.log("you reqached the HR router specifically the update password method");
        try{
            const {newPassword}=req.body;
            const hrID = req.id;
        if(!hrID){
            return res.status(403).json({msg:"authentication failed please relogin"});
          }
        const asMember = await hr.findOne({id:hrID});

        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(newPassword,salt);
        await asMember.updateOne({password:hashedPassword})
        res.json({
           msg:"Your password has been updated to " +newPassword+"."
        })
        }
    catch(err){
        res.json(err);
    }
});

router.get('/StaffMemberAttendace/:staffId',async(req,res)=>{
        const staffId=req.params.staffId;


        try{
                const staff=await academic.findOne({id:staffId})
                if(!staff)
                return res.status(400).json({msg : "wrong user id"})

                 
                const attendance=staff.workingMap;
                res.json({msg :attendance})

        }catch(err){
            res.send(err)
        }
})




///• View staff members with missing hours/days
router.get('/StaffMissingHours/:staffId',async(req,res)=>{
            const staffID=req.params.staffId

            try{
                    
                const user=await academic.findOne({id:staffId})
                if(!user)
                return res.status(400).json({msg : "wrong user id"})
            
                var data=user.missingDays

                res.json({msg : data})


            }
            catch(err){
                res.send(err)
            }
})


///Update salary
router.put('/updatesalary',async(req,res)=>{
    const {id,newSalary} = req.body

    try{
        var idCheck = id.split("-");
            if(idCheck[0]==='hr'){
                    const hrUser=await hr.findOne({id:id})
                    if (!hrUser)
                    return res.status(400).json({ msg: "NO such a user" })

                    hrUser.salary= newSalary;
                    var saved= await hrUser.save();
                res.json(saved)
            }

            if(idCheck[0]==='ac'){
                const acUser=await academic.findOne({id:id})
                if (!acUser)
                return res.status(400).json({ msg: "NO such a user" })

                acUser.salary= newSalary;
                var saved= await acUser.save();
                 res.json(saved)
            }
    }
    catch(err){
        res.send(err)
    }
})
module.exports = router;
