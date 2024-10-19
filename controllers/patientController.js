const Report = require('../models/reports');
const User = require('../models/user');

// Method to register a new patient
module.exports.register = async function(req, res) {
    try {
        // Check if the user already exists
        let user = await User.findOne({ username: req.body.number });

        if (user) {
            return res.status(200).json({
                message: 'User Already Registered',
                data: { user: user }
            });
        }

        // Create a new user (patient)
        user = await User.create({
            username: req.body.number,
            name: req.body.name,
            password: '12345', // Consider hashing the password before saving
            type: 'Patient'
        });

        return res.status(201).json({
            message: 'Patient registered successfully',
            data: user
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Method to create a report for a specific patient
module.exports.createReport = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(422).json({
                message: "Patient does not exist"
            });
        }

        const report = await Report.create({
            createdByDoctor: req.user.id,  // Ensure JWT is validated to get req.user
            patient: req.params.id,
            status: req.body.status,
            date: new Date()
        });

        // Assuming 'reports' is an array field in the User model
        user.reports.push(report._id);
        await user.save();

        return res.status(201).json({
            message: 'Report created successfully',
            data: report
        });

    } catch (error) {
        console.error('Error:', error);  // Log the actual error
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message  // Send the error message for easier debugging
        });
     }
}

// Method to retrieve all reports for a specific patient
module.exports.patientReports = async function(req, res) {
    try {
        const reports = await Report.find({ patient: req.params.id }).populate('createdByDoctor').sort('date');

        const reportData = reports.map(report => {
            const originalDate = report.date;
            const dateObj = new Date(originalDate);
            const formattedDate = dateObj.toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            return {
                createdByDoctor: report.createdByDoctor.name,
                status: report.status,
                date: formattedDate
            };
        });

        return res.status(200).json({
            message: `List of Reports of User with id - ${req.params.id}`,
            reports: reportData    
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
