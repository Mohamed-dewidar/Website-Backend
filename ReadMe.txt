**Root file is App.js
**PORT Number 3000
**all data save in database in lowercase , except for enum it is saved in UpperCase
**we have 4 roles for academic staff (ta,coordinator,instructor,hod)  --- and only hr role

//////////////////////////




Functionality: lOGIN
Route: localhost:3000/login
Request type: POST
Request body:{
    "email" : "testx@dev.com",
    "password" : "123456"
}
Response :	TOKEN , json file contains added Faculty
    Note : 1- it is required to enter valid data.
        2- all body data should be entered





//////////////////////////////////////


****HR Functionalities*****


Functionality: View their profile.
Route: /hr/viewprofile
Request type: GET
Parameters: no parameters but user should be signed in 
Example of how to call the route: /hr/viewprofile
reposnse: JSON file containing user profile. Example:- {
    "id": "1234",
    "email": "test1234@test.com",
    "firstName": "testfn",
    "lastName": "testln",
    "role": "HR",
    "salary": 20
}


Functionality: hr staff can resest their password to the default system password 123456.
Route: /hr/resetpassword
Request type: POST
Parameters: no parameters but user should be signed in 
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /hr/resetpassword
reposnse: confirmation message in the res.JSON, msg:"Your password has been reset to  123456"

Functionality: hr staff can update their password to a password of their choice.
Route: /hr/updatepassword
Request type: POST
Parameters: the new update in the req body as raw JSON Example :{"newPassword":"hr123456"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /hr/updatepassword
reposnse: confirmation message in the res.JSON, msg:"Your password has been updated to  hr123456"

Functionality: hr staff can update their email to an email of their choice.
Route: /hr/updateemail
Request type: POST
Parameters: the new email in the req body as raw JSON Example :{"newEmail":"hrtestmail@test.com"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /hr/updateemail
reposnse: confirmation message in the res.JSON, msg:"Your password has been updated  to  as123456"



1-
Functionality: ADD Location
Route: hr/addlocation
Request type: POST
Request body: {"name" : "C7.201","capacity" : 25,"type" : "office"}
Response : {
    "_id": "5fdf9248be07cd21289af6b2",
    "name": "C7.201",
    "capacity": 25,
    "type": "room",
    "__v": 0
}  JSON FILE conation the added location
 Note : 1- it is required to enter valid data.
        2- all body data should be entered


2-
Functionality: Update Location
Route: /hr/updatelocation
Request type: PUT
Request body: {"name" : "C7.201",   "capacity" : 30, "type" : "lab"}
Response : {"msg": "Updated"}
    

3-
Functionality: Delete Location
Route: /hr/deletelocation
Request type: DELETE
Request body: {"name" : "C7.201"}
Response : {"msg": "Deleted"}



4-
Functionality: Add Faculty
Route: /hr/addfaculty
Request type: POST
Request body: {"name" : "Arch"}
Response : { "_id": "5fdfb46ec3b87c31f8e17f4e",
    "name": "Arch",
    "departments": [],
    "__v": 0} , json file contains added Faculty
    Note : 1- it is required to enter valid data.
        2- all body data should be entered


 5-
Functionality: Update Faculty
Route: /hr/updatefaculty
Request type: PUT
Request body: { "name" : "Archtec","newName" : "Arch"}
Response : {"msg": "Updated"} 
Note : 1- it is required to enter valid data.
        2- all body data should be entered

6-
Functionality: Delete Faculty
Route: /hr/deletefaculty
Request type: DELETE
Request body: { "name" : "Arch"}
Response : {"msg": "Deleted"}
Note : 1- it is required to enter valid data.
        2- all body data should be entered


7-
Functionality: Add department
Route: /hr/adddepartment
Request type: POST
Request body: {"name" : "MET5","facultyName" : "Engi","hodID" : "as-1"}
Response : {
    "_id": "5fdfc98437dd041ce83bc13f",
    "name": "MET5",
    "HODId": "as-1",
    "courses": [],
    "__v": 0} , json file contains added department
    Note : 1- it is required to enter valid data.
        2- all body data should be entered

 8-
 Functionality: Update department name
Route: /hr/updatedepartmentname
Request type: PUT
Request body: { "name" : "METX", "newName" : "MET4", "facultyName" : "Engi"}
Response : {"msg": "Updated"}    

Functionality: Update department HOD
Route: /hr/updatedepartmenthod
Request type: PUT
Request body: { "name" : "METX", "newHodId" : "as-2", "facultyName" : "Engi"}
Response : {"msg": "Updated"} 

Note : 1- it is required to enter valid data.
        2- all body data should be entered

9-
Functionality: Delete department
Route: /hr/deletedepartment
Request type: DELETE
Request body: { "name" : "MET7","facultyName" : "Engi"}
Response : {"msg": "Deleted"}
Note : 1- it is required to enter valid data.
        2- all body data should be entered

10-
Functionality: Add course
Route: /hr/addcourse
Request type: POST
Request body: {"code" : "csen702","departmentName" : "MET7","facultyName" : "Engi"}

Response :  { "slotCoverage": 0, "courseCoordinatorId": null, "_id": "5fe0159f21f82809c811918f",
             "courseCode": "csen702",  "instructors": [],  "teachingAssistants": [],  "slots": [], "__v": 0} 
             json file contains added department
Note : 1- it is required to enter valid data.
        2- all body data should be entered

 11-
 Functionality: Update course code
Route: /hr/updatecoursecode
Request type: PUT
Request body: { "code" : "CSEN703","newCode" : "CSEN705", "departmentName" : "MET", "facultyName" : "Engi"}
Response : {"msg": "Updated"}   
Note : 1- it is required to enter valid data.
        2- all body data should be entered


12-
Functionality: Delete course
Route: /hr/deletecourse
Request type: DELETE
Request body: { "code" : "CSEN705", "departmentName" : "MET", "facultyName" : "Engi"}
Response : {"msg": "Deleted"}
Note : 1- it is required to enter valid data.
        2- all body data should be entered


13-
Functionality: Add user
Route: /hr/adduser
Request type: POST
Request body: {"email" : "hr2@dev.com", "fName" : "Jack", "lName" : "Nickleson", 
                    "salary" : "902342123", "office" : "c7.201", "role" : "hr" }

Response :  {  "office": "c7.201",  "new": true,  "dayOff": "saturday",  "_id": "5fe0e867371cac383ca7f143",
             "id": "hr-nan",  "email": "hr2@dev.com",  "firstName": "jack",  "lastName": "nickleson",
            "password": "$2a$10$YXdU494dmilw5OIAmoR8aOpsMD7eYurulI/kSjLKQeWgp5YUrtJNS",  "salary": 902342123,
            "role": "hr",
             "__v": 0} ,
            json file contains added user

Note : 1- it is required to enter valid data.
        2- all body data should be entered
        3-thers is 2 roles{hr & ac}


14-
 Functionality: Update staff role
Route: /hr/updatestaffrole
Request type: PUT
Request body: {  "userId" : "ac-5",  "newRole" : "ta"}
Response : { {"id": "ac-5",  "role": "ta"}}   
Note : 1- it is required to enter valid data.
        2- all body data should be entered



Functionality: Update staff location
Route: /hr/updatestaffoffice
Request type: PUT
Request body: {  "userId" : "ac-5",  "newLocation" : "c7.203"}
Response : { {"id": "ac-5",  "room": "c7.203"}}   
Note : 1- it is required to enter valid data.
        2- all body data should be entered


15-
Functionality: Delete staff member
Route: /hr/deletestaff
Request type: DELETE
Request body: {  "staffId" : "ac-4"}
Response : {"msg": "Deleted"}
Note : 1- it is required to enter valid data.
        2- all body data should be entered


16-

Functionality:View any staff member attendance record.
Route: /hr/StaffMemberAttendace/:staffId
Request type: GET
Parameters: staff id
example : localhost:3000/hr/StaffMemberAttendace/ac-2
Response : in case of success res>>json file with attendace record as hashmap
		in case of fail res>>empty json file or proper msg



17-
Functionality:View any staff member attendance record.
Route: /hr/StaffMissingHours/:staffId
Request type: GET
Parameters: staff id
example : localhost:3000/hr/StaffMissingHours/ac-2
Response : in case of success res>>json file with missing days 
		in case of fail res>>empty json file or proper msg

18-
Functionality: Update staff salary
Route: /hr/updatesalary
Request type: PUT
Request body: {"id" : "ac-2", "newSalary" : "2000"}  .>>>> staff member id --- new salary
Response : json file conatin the saved user , with new salary updated 
incase of fail or error you will get proper msg
Note : 1- it is required to enter valid data.
        2- all body data should be entered




   ///////////////////////////////////

**Academic Members Functionalities**

///*****4.2  Course Instructor Functionalities/////////
NOTE: 1-Enter valid data if needed
	2-you need to be login as instructor



Functionality: View the coverage of course(s) he/she is assigned to
Route: /as/InstructorCourseCoverage/:courseCode
Request type: GET
Parameters: course code
example : as/InstructorCourseCoverage/csen702
Response : {   "coverage": 0 }




Functionality: view all staff in his depratment
Route: /as/viewStaffAtInstructorDep
Request type: GET
Parameters: none
Response :[
    {},
    {
        "id": "ac-3",
        "email": "test22@dev.com",
        "name": "michel"
    },
    {
        "id": "ac-4",
        "email": "test23@dev.com",
        "name": "michel"
    },
   ]



Functionality: View the slots’ assignment of course(s) he/she is assigned to.
Route: /as/InstructorViewSlots/:courseCode
Request type: GET
Parameters: course code
example : localhost:3000/as/InstructorViewSlots/csen702
Response : Json file contains the slot number , slot date and course ,
otherwise it will res with proper msg


Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned
Route: /as/InstructorAssginSlot
Request type: POST
Request body: {"courseCode" : "csen702", "staffID" : "ac-3", "slotNum" : "2", 
                    "Date" : "2020-12-11T22:00:00.000+00:00", "room" : "c7.201" }

Response :  {msg : "assigned"}
            json file contains added user

Note : 1- it is required to enter valid data.
        2- all body data should be entered
//////////////////////


////////////////////////HOD////////////////////////////////////////
Functionality: Head of department can assign an instructor to one of his courses.
Route: /as/assignInstructor
Request type: POST
Parameters: the new instructor in the req body as raw JSON Example :{instructorID: "as-123" ,courseCode: "csen701",departmentName: "met",facultyName:"engineering"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/assignInstructor
reposnse: confirmation message in the res.JSON, msg:"The course instructor has bees successfully assigned" 


Functionality: Head of department can remove an instructor to one of his courses.
Route: /as/deleteInstructor
Request type: DELETE
Parameters: the instructor to be removed in the req body as raw JSON Example :{instructorID: "as-123" ,courseCode: "csen701",departmentName: "met",facultyName:"engineering"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/deleteInstructor
reposnse: confirmation message in the res.JSON, msg:"The course instructor has been successfully removed" 


Functionality: Head of department can update an instructor to one of his courses.
Route: /as/updateInstructor
Request type: PUT
Parameters: the instructor to be updated and the instructor to be removed in the req body as raw JSON Example :{instructorID: "as-123" ,courseCode: "csen701",departmentName: "met",facultyName:"engineering", newInstructorID: "as-5147"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/updateInstructor
reposnse: confirmation message in the res.JSON, msg:"The course instructor has been successfully updated" 



Functionality: Head of department can view all staff in his department.
Route: /as/viewAllStaff
Request type: GET
Parameters: No parameters required
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewAllStaff
reposnse: A jason file with all the staff will be returned



 Functionality: Head of department can view all staff from one of his courses.
Route: as/viewCourseStaff
Request type: GET
Parameters: The code of the course is required in the URL 
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewAllStaff/csen702
reposnse: A jason file with all the course staff will be returned


 Functionality: Head of department can view all staff's dayoff from his department.
Route: as/viewAllStaffDayOFF
Request type: GET
Parameters: No parameter required
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewAllStaffDayOFF
reposnse: A jason file with all the department staff's dayoff will be returned


Functionality: View their schedule.
Route: /as/viewschedule
Request type: get
Parameters: no paarameters but user should be signed in 
Example of how to call the route: /as/viewprofile
reposnse: msg:{"coordinator assigned}

Functionality: assign course coordinator

Route: /as/assigncoordinator
Request type: post
Parameters: ta's id -the one who's going to be the coordinator- 
Example of how to call the route: /as/assigncoordinator
reposnse: JSON file containing user schedule eg: {
  saturday:"",
  sunday
}


 Functionality: Head of department can view one of the staff's dayoff from his department.
Route: as/viewSingleStaffDayOFF
Request type: GET
Parameters: The id of the staff is requird in the URL
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewAllStaffDayOFF/as-122
reposnse: A jason file with all the staff's dayoff will be returned


 Functionality: Head of department can view all staff's requests in his department.
Route: as/viewStaffRequests
Request type: GET
Parameters: No parameters required
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewStaffRequests
reposnse: A jason file with all the staff's request will be returned


 Functionality: Head of department reject a staff's requests in his department.
Route: as/rejectRequest
Request type: PUT
Parameters: The request ID is required
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewStaffRequests/123
confirmation message in the res.JSON, msg:"The request has been successfully rejected" 




 Functionality: Head of department can view the coverage of one of the courses in his department.
Route: as/viewCourseCoverage
Request type: GET
Parameters: The course code should be sent in the url
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/viewCourseCoverage/csen702
The coverage of the course should be returned
///////////////////////////////////////////////////////////////


/////////////////////////CourseCoordinator/////////
 Functionality:Course coordinator can add course slot in his course.
Route: as/addCourseSlot
Request type: POST
Parameters: {courseCode, date, slotNumber, room,type} should be sent in the body
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/addCourseSlot
confirmation message in the res.JSON, msg:"The slot has been added successfully"


 Functionality:Course coordinator can delete course slot in his course.
Route: as/deleteCourseSlot
Request type: DELETE
Parameters: {courseCode, date, slotNumber, room,type} should be sent in the body
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/addCourseSlot
confirmation message in the res.JSON, msg:"The slot has been deleted successfully"

Functionality:Course coordinator can update course slot in his course.
Route: as/updateCourseSlot
Request type: PUT
Parameters: {courseCode, deletedDate, deletedSlotNumber, deletedRoom,deletedType,addedDate, addedSlotNumber, addedRoom,addedType} should be sent in the body
(the token aquired from the /login response should be added to the request header ('authToken' :"/*the token*/")) 
Example of how to call the route: /as/updateCourseSlot
confirmation message in the res.JSON, msg:"The slot has been updated successfully"
        	

////////////////


4.1 HOD Functionalities
5-
Functionality: accept a request
Route:'/acceptChangeRequest'
Request Type: PUT
Parameters: N/A
Example of how to call the route: 'as/acceptChangeRequest'
Response:
in case of success :"Leave added successfully"
in case of failure , the reason will be stated.


4.2 Course Instructor Functionalities
4.3 Course Coordinator Functionalities
1-
Functionality: view "slot linking" requests from their TA's
Route: /viewSlotLinkingRequests
Request type: GET
Parameters: N/A
Example of how to call the route : as/viewSlotLinkingRequests
Response: a json object containing linking requests as follows:
{
amID:"ac-23451"
date:2020-12-11T22:00:00.000+00:00
slotNumber:3
room:"C7.201"
status:'PENDING'
}

2-
Functionality: Accept/Reject slot linking request;
Route:'/acceptLinking/:reqID' OR '/rejectLinking/:reqID'
Request type:PUT
Parameters: reqID, the requestor's ID.
Example of how to call the route:'as/acceptLinking/:reqID'
Response:
in case of successful acceptance: "Request has been accepted"
in case of successful rejection : "Request has been rejected"
in case of failure of either, the reason will be specified.

4.4 Academic member Functionalities

3-
Functionality: send a "slot linking" request to the coordinator of the subject
Route:'/linkSlot'
Request type: POST
Parameters: N/A
Example of how to call the route:'as/linkSlot'
Response:
in case of success :"Your request has been sent successfully "
in case of failure, the reason for failure will be stated

4-
Functionality: request a changing of their day off
Route:'/changeDayOffReq'
Request Type: POST
Parameters: N/A
Example of how to call the route: 'as/changeDayOffReq'
Response:
in case of success :"Request sent successfully"
in case of failure , the reason will be stated.

//////////////


Functionality: Academic staff can resest their password to the default system password 123456.
Route: /as/resetpassword
Request type: POST
Parameters: no parameters but user should be signed in 
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /as/resetpassword
reposnse: confirmation message in the res.JSON, msg:"Your password has been reset to  123456"

Functionality: Academic staff can update their password to a password of their choice.
Route: /as/updatepassword
Request type: POST
Parameters: the new password in the req body as raw JSON Example :{"newPassword":"as123456"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /as/updatepassword
reposnse: confirmation message in the res.JSON, msg:"Your password has been updated  to  as123456"

Functionality: Academic staff can update their email to an email of their choice.
Route: /as/updateemail
Request type: POST
Parameters: the new email in the req body as raw JSON Example :{"newEmail":"astestmail@test.com"}
(the token aquired from the /login response should be added to the request header ('authToken' :"/the token/")) 
Example of how to call the route: /as/updateemail
reposnse: confirmation message in the res.JSON, msg:"Your password has been updated  to  as123456"

//////////////////////////////////////



