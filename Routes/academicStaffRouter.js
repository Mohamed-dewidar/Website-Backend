const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const academic = require('../modelsFolder/academicStaffSchema').model;
const attendance = require('../modelsFolder/attendanceSchema').model;
const department = require('../modelsFolder/departmentSchema').model;
const faculty = require('../modelsFolder/facultiesSchema').model;
const course = require('../modelsFolder/courseSchema').model;
const request = require('../modelsFolder/requestSchema').model;
const { findOne } = require('../modelsFolder/academicStaffSchema').model;
const slots = require('../modelsFolder/slotSchema').model;
const slotRequest = require('../modelsFolder/slotLinkingSchema').model;
const { json } = require('express');


///////////////view profile//////////////////
router.get('/viewProfile', async (req, res) => {
    console.log("you reached the academic staff router");
    try {
        const asID = req.id;
        if (!asID) {
            return res.status(403).json({ msg: "authentication failed please relogin" });
        }
        const asMember = await academic.findOne({ id: asID });
        res.json({
            id: asMember.id,
            email: asMember.email,
            firstName: asMember.firstName,
            lastName: asMember.lastName,
            role: asMember.role,
            salary: asMember.salary
        })
    }



    catch (err) {
        res.json(err);
    }

});

//////////////update email//////////////////
router.put('/updateEmail', async (req, res) => {
    console.log("you reached the academic staff router specifically the update Email method");
    try {
        const { newEmail } = req.body;
        const asID = req.id;
        if (!asID) {
            return res.status(403).json({ msg: "authentication failed please relogin" });
        }

        const asMember = await academic.findOne({ id: asID });
        await asMember.updateOne({ email: newEmail })
        res.json({
            msg: "Your email has been updated to " + newEmail + "."
        })
    }
    catch (err) {
        res.json(err);
    }
});

/////////////update password///////////////
router.put('/updatePassword', async (req, res) => {
    console.log("you reached the academic staff router specifically the update password method");
    try {
        const { newPassword } = req.body;
        const asID = req.id;
        if (!asID) {
            return res.status(403).json({ msg: "authentication failed please relogin" });
        }

        const asMember = await academic.findOne({ id: asID });

        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        await asMember.updateOne({ password: hashedPassword })
        res.json({
            msg: "Your password has been updated to " + newPassword + "."
        })
    }
    catch (err) {
        res.json(err);
    }
});

////////////reset password///////////////
router.post('/resetPassword', async (req, res) => {
    console.log("you reqached the academic staff router");
    try {
        const asID = req.id;
        if (!asID) {
            return res.status(403).json({ msg: "authentication failed please relogin" });
        }

        const asMember = await academic.findOne({ id: asID });
        const defaultPassword = "123456";
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(defaultPassword, salt);
        await asMember.updateOne({ password: hashedPassword })

        res.json({
            msg: "Your password was reset to 123456"
        })
    }
    catch (err) {
        res.json(err);
    }
});

/////////////////assign instructor/////////////
router.post('/assignInstructor', async (req, res) => {

    const { instructorID, courseCode, departmentName, facultyName } = req.body;

    const asRole = req.role;

    if (!instructorID || !courseCode || !departmentName || !facultyName) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }

    console.log(asRole)

    if (asRole != 'hod') {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {



        const instructor = await academic.findOne({ id: instructorID.toLowerCase(), role: 'instructor' });
        if (!instructor) {
            return res.status(403).json({ msg: "Please enter a valid instructor id" });
        }


        const cou = await course.findOne({ courseCode: courseCode.toLowerCase() });
        if (!cou) {
            return res.status(403).json({ msg: "Please enter a valid course code" });
        }


        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep) {
            return res.status(400).json({ msg: "no such a department name" });
        }
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac) {
            return res.status(400).json({ msg: "no such a faculty name" });
        }


        //Faculty
        var depArray = fac.departments;
        var i = 0;
        for (i = 0; i < depArray.length; i++) {
            if (depArray[i].name === departmentName.toLowerCase())
                break;
        }


        var couArray = depArray[i].courses
        for (i = 0; i < couArray.length; i++) {
            if (couArray[i].courseCode === courseCode.toLowerCase())
                break;
        }
        var instArray = couArray[i].instructors
        for (var j = 0; j < instArray.length; j++) {
            if (instArray[j].id === instructorID.toLowerCase())
                return res.json({ msg: "This instructor is already assigned" })
        }


        couArray[i].instructors.push(instructor)

        // Department
        couArray = dep.courses

        couArray[i].instructors.push(instructor);

        //Course
        cou.instructors.push(instructor);


        await fac.save()
        await dep.save()
        await cou.save()


        res.json({
            msg: "The course instructor has been successfully assigned"
        })
    }
    catch (err) {
        res.json(err);
    }
});

////////////////delete instructor//////////////
router.delete('/deleteInstructor', async (req, res) => {

    const { instructorID, courseCode, departmentName, facultyName } = req.body;

    const asRole = req.role;

    if (!instructorID || !courseCode || !departmentName || !facultyName) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }


    if (asRole != 'hod') {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {



        const instructor = await academic.findOne({ id: instructorID.toLowerCase(), role: 'instructor' });
        if (!instructor) {
            return res.status(403).json({ msg: "Please enter a valid instructor id" });
        }


        const cou = await course.findOne({ courseCode: courseCode.toLowerCase() });
        if (!cou) {
            return res.status(403).json({ msg: "Please enter a valid course code" });
        }


        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep) {
            return res.status(400).json({ msg: "no such a department name" });
        }
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac) {
            return res.status(400).json({ msg: "no such faculty name" });
        }


        //Faculty
        var depArray = fac.departments;
        var i = 0;
        for (i = 0; i < depArray.length; i++) {
            if (depArray[i].name === departmentName.toLowerCase())
                break;
        }


        var couArray = depArray[i].courses;
        for (i = 0; i < couArray.length; i++) {
            if (couArray[i].courseCode === courseCode.toLowerCase())
                break;
        }


        var instArray = couArray[i].instructors
        var j = 0
        for (j = 0; j < instArray.length; j++) {

            if (instArray[j].id === instructorID.toLowerCase())
                break;

        }
        if (j === instArray.length)
            return res.json({ msg: "This id was not found" })

        instArray.pull(instArray[j]);

        // Department
        couArray = dep.courses

        instArray = couArray[i].instructors
        instArray.pull(instArray[j])

        //Course
        instArray = cou.instructors
        instArray.pull(instArray[j])


        await fac.save()
        await dep.save()
        await cou.save()


        res.json({
            msg: "The course instructor has been successfully removed"
        })
    }
    catch (err) {
        res.json(err);
    }
});

///////////////update instructor////////////
router.put('/updateInstructor', async (req, res) => {

    const { instructorID, courseCode, departmentName, facultyName, newInstructorID } = req.body;



    const asRole = req.role;

    if (!instructorID || !courseCode || !departmentName || !facultyName || !newInstructorID) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }

    if (asRole != 'hod') {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {



        const instructor = await academic.findOne({ id: instructorID.toLowerCase(), role: 'instructor' });
        const newInstructor = await academic.findOne({ id: newInstructorID.toLowerCase(), role: 'instructor' });
        if (!instructor || !newInstructor) {
            return res.status(403).json({ msg: "Please enter a valid instructor id" });
        }


        const cou = await course.findOne({ courseCode: courseCode.toLowerCase() });
        if (!cou) {
            return res.status(403).json({ msg: "Please enter a valid course code" });
        }


        const dep = await department.findOne({ name: departmentName.toLowerCase() })
        if (!dep) {
            return res.status(400).json({ msg: "no such a department name" });
        }
        const fac = await faculty.findOne({ name: facultyName.toLowerCase() })
        if (!fac) {
            return res.status(400).json({ msg: "no such a faculty name" });
        }


        //Faculty
        var depArray = fac.departments;
        var i = 0;
        for (i = 0; i < depArray.length; i++) {
            if (depArray[i].name === departmentName.toLowerCase())
                break;
        }


        var couArray = depArray[i].courses;
        for (i = 0; i < couArray.length; i++) {
            if (couArray[i].courseCode === courseCode.toLowerCase())
                break;
        }


        var instArray = couArray[i].instructors
        var j = 0
        for (j = 0; j < instArray.length; j++) {

            if (instArray[j].id === instructorID.toLowerCase())
                break;

        }
        if (j === instArray.length)
            return res.json({ msg: "This id was not found" })

        instArray.pull(instArray[j]);
        instArray.push(newInstructor);

        // Department
        couArray = dep.courses

        instArray = couArray[i].instructors
        instArray.pull(instArray[j])
        instArray.push(newInstructor);
        //Course
        instArray = cou.instructors
        instArray.pull(instArray[j])
        instArray.push(newInstructor);


        await fac.save()
        await dep.save()
        await cou.save()


        res.json({
            msg: "The course instructor has been successfully updated"
        })
    }
    catch (err) {
        res.json(err);
    }
});

//////////////view all staff/////////////////
router.get('/viewAllStaff', async (req, res) => {
    const asID = req.id
    const asRole = req.role;

    try {

        const hod = await academic.findOne({ id: asID })
        console.log(asID)

        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }

        const academicStaff = await academic.find({ department: hod.department })
        var array = [JSON]
        academicStaff.forEach((user) => {
            array.push({ Name: user.firstName, email: user.email })
        })

        res.send(array)
    }
    catch (err) {
        res.json(err);
    }
});

//////////////view course staff/////////////////
router.get('/viewCourseStaff/:code', async (req, res) => {
    const { code } = req.params;

    const asID = req.id
    const asRole = req.role;

    try {

        const hod = await academic.findOne({ id: asID })


        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }

        const cou = await course.findOne({ courseCode: code.toLowerCase() })
        if (!cou)
            return res.status(400).json({ msg: "course does not exist" })

        const courseInstructors = cou.instructors;
        const courseTAS = cou.teachingAssistants;

        var result = [JSON]

        courseInstructors.forEach((user) => {

            result.push({ Name: user.firstName, email: user.email })

        })
        courseTAS.forEach((user) => {
            result.push({ Name: user.firstName, email: user.email })
        })


        res.send(result)
    }
    catch (err) {
        res.json(err);
    }
});
router.post('/assigncoordinator',async(req, res)=>{
    try{
        const taID  = req.body.taID ;
        const asRole = req.role ;
        if(asRole != 'instructor'){
            return res.status(400).json({ msg: "authorization failed" });
        }
        if(! taID){
            return res.status(400).json({ msg: "enter teaching assistant id" });
        }

        let existingUser = await academic.findOne({id : taID}); 
        if(! existingUser){
            return res.status(400).json({ msg: "no such user exists with such id, enter correct id" });
        }
        existingUser.role = 'coordinator' ;
        await existingUser.save();
        return res.json({ msg: "coordinator assigned" });
    }
    catch(err){
        res.json(err)
    }
})
//////////////view all staff dayOff/////////////////
router.get('/viewAllStaffDayOFF', async (req, res) => {
    const asID = req.id
    const asRole = req.role;

    try {

        const hod = await academic.findOne({ id: asID })
        console.log(asID)

        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }

        const academicStaff = await academic.find({ department: hod.department })
        var dayOff
        var array = [JSON]
        academicStaff.forEach((user) => {

            console.log(dayOff)
            switch (user.dayOff) {
                case (0): dayOff = "Sunday"; break;
                case (1): dayOff = "Monday"; break;
                case (2): dayOff = "Tuseday"; break;
                case (3): dayOff = "Wednesday"; break;
                case (4): dayOff = "Thursday"; break;
                case (5): dayOff = "Friday"; break;
                case (6): dayOff = "Saturday"; break;
            }
            array.push({ Name: user.firstName, DayOFF: dayOff })
        })

        res.send(array)
    }
    catch (err) {
        res.json(err);
    }
});

//////////////view single staff dayOff/////////////////
router.get('/viewSingleStaff/DayOFF:id', async (req, res) => {
    const staffID = req.params.id;

    const asID = req.id
    const asRole = req.role;

    try {

        const hod = await academic.findOne({ id: asID })


        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }

        const staff = await academic.findOne({ id: staffID.toLowerCase() })
        if (!staff)
            return res.status(400).json({ msg: "staff member does not exist" })

        if (hod.department != staff.department) {
            return res.status(400).json({ msg: "This staff is not in your department" })
        }
        var dayOff


        switch (staff.dayOff) {
            case (0): dayOff = "Sunday"; break;
            case (1): dayOff = "Monday"; break;
            case (2): dayOff = "Tuseday"; break;
            case (3): dayOff = "Wednesday"; break;
            case (4): dayOff = "Thursday"; break;
            case (5): dayOff = "Friday"; break;
            case (6): dayOff = "Saturday"; break;
        }

        res.json({ Name: staff.firstName, DayOff: dayOff })
    }
    catch (err) {
        res.json(err);
    }
})



//////////////hod view requestes////////
router.get('/viewStaffRequests', async (req, res) => {
    const asID = req.id;
    const asRole = req.role;

    try {
        const hod = await academic.findOne({ id: asID })
        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }
        var requ = await request.find()
         requ.forEach(async (r)=>{
            var user = await academic.findOne({id:r.requestorID});
            if(!user){
                requ.remove(r)
               
            }
            else if(user.department!=hod.department || !(r.requestType==="CHANGEDAYOFF" || r.requestType==="LEAVE")){
                requ.remove(r)
            }
          })

        
        res.json(requ)
        

    }
    catch (err) {
        res.json(err);
    }
})
///////////VIEW ALL LINKINGREQUESTS/////////
router.get('/viewSlotLinkingRequests', async (req, res) => {
    
    const asRole = req.role;

    try {
       
        if (asRole != 'coordinator') {
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        var table = await slotRequest.find()
     
        res.json(table)
        

    }
    catch (err) {
        res.json(err);
    }
})

///////////////reject slot Linking request///////
router.put('/rejectLinking/:reqID', async(req,res)=>{
    const reqID = req.params.reqID;
    const coID = req.id;
    const asRole = req.role;
    try{
        if (asRole != 'coordinator') {
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        const slotLinkRequest = await slotRequest.findOne({amID:reqID});
        if(!slotLinkRequest){
            return res.status(404).json({ msg: "No requests found" });
        }
        slotLinkRequest.status='REJECTED';

        await slotLinkRequest.save();
        res.json({
            msg:"Request has been rejected"
        })

    }catch(err){
        res.json(err);
    }
})
///////////////accept a request as HOD////////////
router.put('/acceptChangeRequest', async(req,res)=>{
    const hodID = req.id;
    const asRole = req.role;
    const {requestID} =req.body;
    try{
        if(asRole!=='hod'){
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        var requ = await request.findOne({requestID:requestID});
        if(requ.requestType==='CHANGEDAYOFF'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            staffmember.dayOff=requ.dayOffReq;
            await staffmember.save();
            res.json({msg:"Day off changed Successfully"});
        }
        if(requ.requestType==='SICK'||requ.requestType==='MATERNITY'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            staffmember.annualLeaveBalance -= dayCount.getDate();
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            for(var i = startofLeave ; i <= endofLeave ; i++){
                staffmember.workingMap.set(i,504);
            }
            res.json({msg:"Sick leave added Successfully"});
        }
        if(requ.requestType==='COMPENSATION'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            staffmember.missingDays-= dayCount.getDate();
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            res.json({msg:"Compensation leave added Successfully"});
        }
        if(requ.requestType==='ACCIDENTAL'){
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            staffmember.missingDays-= dayCount.getDate();
            staffmember.annualLeaveBalance -= dayCount.getDate();
            res.json({
                msg:"Accidental leave has been accepted"
            })
        }
        if(requ.requestType==='ANNUAL'){
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            staffmember.annualLeaveBalance -= dayCount.getDate();
            for(var i = startofLeave ; i <= endofLeave ; i++){
                staffmember.workingMap.set(i,504);
            }
            res.json({
                msg:"Annual leave has been accepted"
            })
        }
        

    }catch(err){
            res.json(err);
    }
})
///////////////accept slot Linking request///////
router.put('/acceptLinking/:reqID', async(req,res)=>{
    const reqID = req.params.reqID;
    const coID = req.id;
    const asRole = req.role;
    try{
        if (asRole != 'coordinator') {
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        const slotLinkRequest = await slotRequest.findOne({amID:reqID});
        if(!slotLinkRequest){
            return res.status(404).json({ msg: "No requests found" });
        }
        slotLinkRequest.status='ACCEPTED';

        await slotLinkRequest.save();
        res.json({
            msg:"Request has been accepted"
        })

    }catch(err){
        res.json(err);
    }
})
///////////////accept a request as HOD////////////
router.put('/acceptChangeRequest', async(req,res)=>{
    const hodID = req.id;
    const asRole = req.role;
    const {requestID} =req.body;
    try{
        if(asRole!=='hod'){
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        var requ = await request.findOne({requestID:requestID});
        if(requ.requestType==='CHANGEDAYOFF'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            staffmember.dayOff=requ.dayOffReq;
            await staffmember.save();
            res.json({msg:"Day off changed Successfully"});
        }
        if(requ.requestType==='SICK'||requ.requestType==='MATERNITY'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            staffmember.annualLeaveBalance -= dayCount.getDate();
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            for(var i = startofLeave ; i <= endofLeave ; i++){
                staffmember.workingMap.set(i,504);
            }
            res.json({msg:"Sick leave added Successfully"});
        }
        if(requ.requestType==='COMPENSATION'){
            requ.status='ACCEPTED';
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            staffmember.missingDays-= dayCount.getDate();
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            res.json({msg:"Compensation leave added Successfully"});
        }
        if(requ.requestType==='ACCIDENTAL'){
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            staffmember.missingDays-= dayCount.getDate();
            staffmember.annualLeaveBalance -= dayCount.getDate();
            res.json({
                msg:"Accidental leave has been accepted"
            })
        }
        if(requ.requestType==='ANNUAL'){
            const staffID = requ.requestorID;
            const staffmember = academic.findOne({id:staffID});
            const dayCount = requ.leaveInterval.end-requ.leaveInterval.start;
            const startofLeave = requ.leaveInterval.start.getDate();
            const endofLeave =requ.leaveInterval.end.getDate();
            staffmember.annualLeaveBalance -= dayCount.getDate();
            for(var i = startofLeave ; i <= endofLeave ; i++){
                staffmember.workingMap.set(i,504);
            }
            res.json({
                msg:"Annual leave has been accepted"
            })
        }
        

    }catch(err){
            res.json(err);
    }
})
///////////////accept slot Linking request///////
router.put('/acceptLinking/:reqID', async(req,res)=>{
    const reqID = req.params.reqID;
    const coID = req.id;
    const asRole = req.role;
    try{
        if (asRole != 'coordinator') {
            return res.status(400).json({ msg: "You are not authorized to view this page" });
        }
        const slotLinkRequest = await slotRequest.findOne({amID:reqID});
        if(!slotLinkRequest){
            return res.status(404).json({ msg: "No requests found" });
        }
        slotLinkRequest.status='ACCEPTED';

        await slotLinkRequest.save();
        res.json({
            msg:"Request has been accepted"
        })

    }catch(err){
        res.json(err);
    }
})
///////////////reject request////////////
router.put('/rejectRequest/:reqID', async (req, res) => {

    try {
        const reqID = req.params.reqID

        const hodID = req.id
        const asRole = req.role;

        const hod = await academic.findOne({id:hodID})
        const requ = await request.findOne({requestID:reqID})

        requestor = await academic.findOne({id:requ.requestorID})
        

        if (asRole != 'hod') {
            return res.status(400).json({ msg: "Insufficient authorization" });
        }

        
        if(!requ){
            res.json({msg:"please enter a valid request id"})
        }
        
        if(!requestor){
            res.json({msg:"the request does not belong to an academic member"})
        }
        if(hod.department != requestor.department){
            res.json({msg:"the request does not belong to an academic member"})
        }
        requ.status='REJECTED'
        await requ.save()
        res.json({msg:"The request has been successfully rejected"})
    }
    catch (err) {
        res.json(err);
    }
});
////////////Change day-off Request///////
router.post('/changeDayOffReq',async(req,res)=>{
        const asID = req.id;
        const asRole = req.role;
        const {newDayOff} = req.body;
        try{
            if(asRole!=="ta" && asRole!=="coordinator"){
                return res.status(400).json({ msg: "You are not authorized to view this page" });
            }
            const userr = academic.findOne({id:asID});
            const dayOffRequest = new request({
                requestorID:asID,
                requestType:'CHANGEDAYOFF',
                gender:userr.gender,
                dayOffRequest:newDayOff
            })
           await dayOffRequest.save();
           res.json({msg:"request sent successfully"});


        }catch(err){
            res.json(err);
        }
});

router.post('/linkSlot',async(req,res)=>{
    console.log("LINK SLOT REACHED");
    try{
        const asID = req.id;
        const am = await academic.findOne({id:asID});
        const {date,slotNumber,room,courseCode} = req.body;
        if(am.role!=="ta"){
            res.json({msg:"You don't have permission to use this feature"});
        }
        const courseRequested = await course.findOne({courseCode:courseCode});
        if(!courseRequested){
            res.json({msg:"Incorrect Data"});
        }
        if(courseRequested.slotCoverage===1.0){
            res.json({msg:"This subject is full"});
        }
        let requestedSlot = await slots.findOne({date:date,slotNumber:slotNumber,room:room});
        if(!requestedSlot){
            res.json({msg:"The requested slot does not exist"});
        }
        if(requestedSlot.isCovered){
            res.json({msg:"This slot is already covered by another academic member"});
        }
         requestedSlot = new slotRequest ({
            amID:asID,
            date:date,
            slotNumber:slotNumber,
            room:room
                });
        

        await requestedSlot.save();

        res.json(
            { msg: "Your request has been sent successfully " }
        )
        


    }
    catch(err){
         res.json(err);
    }
})




///////////////send request/////////
router.post('/sendRequest', async (req, res) => {
    console.log("you reached the academic staff router specifically the send request method");
    try {
        const asID = req.id;
        const as = await academic.findOne({ id: asID });

        const { requestType, gender, startDay, startMonth, startYear, endDay, endMonth, endYear, replacementID, documents } = req.body;
        console.log(requestType);
        startDate = new Date(startYear, startMonth, startDay, 0, 0, 0, 0);
        endDate = new Date(endYear, endMonth, endDay, 0, 0, 0, 0);

        var count=await request.find({}).countDocuments();
        
        
        console.log(startDate);
        console.log(endDate);
        console.log(gender);
        console.log(requestType);
        console.log(replacementID);
        console.log(asID)


        if (!(as.gender === gender.toLowerCase())) {
            return res.status(403).json({ msg: "mismatching gender" });
        }
        count++;

        const userRequest = new request({
            requestID:count,
            requestorID: asID,
            replacementID: replacementID,
            requestType: requestType,
            gender: gender,
            documents: documents,
            leaveInterval: { start: startDate, end: endDate }

        });
        await userRequest.save();
        res.json(
            { msg: "Your request has been sent successfully " }
        )
    }
    catch (err) {
        res.json(err);
    }
})





///************** Course Instructor Functionalities */

//view all staff in/////
router.get('/viewStaffAtInstructorDep',async(req,res)=>{
    const asID=req.id;
    const asRole=req.role;

    try{
        if(asRole != 'instructor')
        return res.status(400).json({msg:"Insufficient authorization"})

        const inst=await academic.findOne({id:asID})
        const staff=await academic.find({department:inst.department})
        var data=[JSON]
        staff.forEach(async(user)=>{
                data.push({id:user.id,email:user.email,name:user.firstName})
        })

        res.send(data)

    }
    catch(err){
        res.json(err)
    }
})




router.get('/viewschedule', async(req,res) =>{
    try{
    const asID  = req.id ;
    if(!asID){
        return  res.status(400).json({ msg: "thers's no id, try logging in again" });
    }
    const existingUser =await academic.findOne({id:asID}) ;

    if(!existingUser){
        return res.status(400).json({ msg: "Insufficient authorization" });
    }
    const sch = existingUser.schedule

    let sat = sch.saturday ;
    let sun = sch.sunday ;
    let mon = sch.monday ;
    let tue = sch.tuesday ;
    let wed = sch.wednesday;
    let thu = sch.thurday ;
    let fri = sch.friday ;
    res.json({Saturday: sat , Sunday: sun , Monday: mon , Tuesday :tue, WednesDay:  wed, Thursday : thu , Friday :fri  });

    }
    catch(err){
        res.json(err);
    }
    
}
)

/////////////////add course slot/////////////
router.post('/addCourseSlot', async (req, res) => {

    const {courseCode, date, slotNumber, room,type} = req.body;

    const asRole = req.role;
    const asID = req.id;

    const Coo = await academic.findOne({id:asID})

    if (!courseCode || !date || !slotNumber || !room,type) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }

    console.log(asRole)
    const reqCou = await course.findOne({courseCode:courseCode})
    
    if(!reqCou){
        return res.status(400).json({ msg: "The course code is incorrect" });
    }
    const couCooID = reqCou.courseCoordinatorId

    const couCoo = await academic.findOne({id:couCooID})

    if (asRole != 'Coordinator' || !couCoo.equals(Coo)) {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {
        const reqSlots = reqCou.slots
        const addedSlot = await slots.findOne({date:date, slotNumber:slotNumber , room:room,type:type})
        if(!addedSlot){
            return res.status(400).json({ msg: "Slot was not found" });
        }
        addedSlot.isCovered = true;
        addedSlot.courseCOde = courseCode
        await reqSlots.push(addedSlot)
        await reqSlots.save()
        await addedSlot.save()
        
        res.json({msg:"The slot has been added successfully"})

    }
    catch (err) {
        res.json(err);
    }
});

/////////////////delete course slot/////////////
router.delete('/deleteCourseSlot', async (req, res) => {

    const {courseCode, date, slotNumber, room,type} = req.body;

    const asRole = req.role;
    const asID = req.id;

    const Coo = await academic.findOne({id:asID})

    if (!courseCode || !date || !slotNumber || !room,type) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }

    console.log(asRole)
    const reqCou = await course.findOne({courseCode:courseCode})
    
    if(!reqCou){
        return res.status(400).json({ msg: "The course code is incorrect" });
    }
    const couCooID = reqCou.courseCoordinatorId

    const couCoo = await academic.findOne({id:couCooID})

    if (asRole != 'Coordinator' || !couCoo.equals(Coo)) {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {
        const reqSlots = reqCou.slots
        const deletedSlot = await slots.findOne({courseCode:courseCode , date:date, slotNumber:slotNumber , room:room,type:type})
        if(!deletedSlot){
            return res.status(400).json({ msg: "Deleted slot not found" });
        }
        deletedSlot.isCovered = false;
        await reqSlots.pull(deletedSlot)
        await reqSlots.save()
        await deletedSlot.save()
        
        res.json({msg:"The slot has been deleted successfully"})

    }
    catch (err) {
        res.json(err);
    }
});

/////////////////update course slot/////////////
router.put('/updateCourseSlot', async (req, res) => {

    const {courseCode, deletedDate, deletedSlotNumber, deletedRoom,deletedType, addedDate, addedSlotNumber, addedRoom,addedType} = req.body;

    const asRole = req.role;
    const asID = req.id;

    const Coo = await academic.findOne({id:asID})

    if (!courseCode || !deletedDate || !deletedSlotNumber || !deletedRoom||deletedType|| !addedDate || !addedSlotNumber || !addedRoom||addedType) {
        return res.status(400).json({ msg: 'Enter the missing data' })

    }

    console.log(asRole)
    const reqCou = await course.findOne({courseCode:courseCode})
    
    if(!reqCou){
        return res.status(400).json({ msg: "The course code is incorrect" });
    }
    const couCooID = reqCou.courseCoordinatorId

    const couCoo = await academic.findOne({id:couCooID})

    if (asRole != 'Coordinator' || !couCoo.equals(Coo)) {
        return res.status(400).json({ msg: "Insufficient authorization" });
    }

    try {
        const reqSlots = reqCou.slots
        const addedSlot = await slots.findOne({courseCode:courseCode , date:addedDate, slotNumber:addedSlotNumber , room:addedRoom,type:addedType})
        if(!addedSlot){
            return res.status(400).json({ msg: "Slot was not found" });
        }
        const deletedSlot = await slots.findOne({courseCode:courseCode , date:deletedDate, slotNumber:deletedSlotNumber , room:DeletedRoom,type:deletedType})
        if(!deletedSlot){
            return res.status(400).json({ msg: "Deleted slot was not found" });
        }
        deletedSlot.isCovered = false;
        await reqSlots.pull(deletedSlot)
        await reqSlots.save()
        await deletedSlot.save()

        if(!addedSlot){
            return res.status(400).json({ msg: "Added slot was not found" });
        }

        addedSlot.isCovered = true;
        await reqSlots.push(addedSlot)
        await reqSlots.save()
        await addedSlot.save()
        
        res.json({msg:"The slot has been updated successfully"})

    }
    catch (err) {
        res.json(err);
    }
});

module.exports = router;



