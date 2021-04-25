const express = require('express');
const router = express.Router();
const LogInMethod = require('./login.js');
const RegisterMethod = require('./register.js');

router.post('/login',LogInMethod) ;
router.post('/Register',RegisterMethod) ;


module.exports = router;
