const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const passport = require('passport');

// Route to register a new patient
router.post('/register', passport.authenticate('jwt', { session: false }), patientController.register);

// Route to create a report for a specific patient
router.post('/:id/create_report', passport.authenticate('jwt', { session: false }), patientController.createReport);


// Route to get all reports for a specific patient
router.get('/:id/all_reports', passport.authenticate('jwt', { session: false }), patientController.patientReports);

module.exports = router;



