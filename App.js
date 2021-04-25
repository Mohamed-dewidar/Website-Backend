const express = require('express');
const app = express();
const {connect} = require('mongoose');
const mongoose = require('mongoose');
app.use(express.json());
var cookieParser = require('cookie-parser')


const URL="mongodb://monz1996:monimoni123@cluster0-shard-00-00.v3v8r.mongodb.net:27017,cluster0-shard-00-01.v3v8r.mongodb.net:27017,cluster0-shard-00-02.v3v8r.mongodb.net:27017/MONZ?ssl=true&replicaSet=atlas-6evmof-shard-0&authSource=admin&retryWrites=true&w=majority";
app.use(cookieParser());

const logInMethod = require('./routes/login.js');
app.post('/login',logInMethod) ;

const registerMethod = require('./routes/register.js');
app.post('/register',registerMethod) ;


const logOutMethod = require('./routes/logout.js');
app.post('/logout',logOutMethod);

const HRRouter = require('./routes/HRRouter');

const authenticationMethod = require('./routes/HRAuthorization.js');
app.use('/hr',authenticationMethod,HRRouter);

const academicStaffRouter = require('./routes/academicStaffRouter.js')
const academicStaffAuthorizationMethod = require('./routes/academicStaffAuthorization.js') ;
app.use('/as',academicStaffAuthorizationMethod,academicStaffRouter);


app.listen(3000,()=>{
    console.log('connected to port 3000')
});


//DATABASE SETUP
const connectionParams={
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
};

//Database URL


//connect to database
mongoose.connect(URL,connectionParams).then(()=>{
    console.log('DB is connected');
   // useUnifiedTopology=trues
}).catch(()=>{
    console.log('Failed to connect to DB');
});
