const express = require('express');
const router = express.Router();

const doctor = require('../controllers/doctorController')

try{
router.post('/register',doctor.create)
router.post('/login',doctor.createSession)
}
catch (error) {
    console.log('Error in registering doctor:', error);
    return res.status(500).json({
        message: "Internal Server Error"
    });
}


module.exports = router;