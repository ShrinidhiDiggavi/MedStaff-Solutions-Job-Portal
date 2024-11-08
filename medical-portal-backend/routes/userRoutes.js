const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); // to handle file paths
const mysql = require('mysql2');

// Ensure `db` is defined and connected to your database
const db = mysql.createConnection({
    host: 'localhost', // Update with your database details
    user: 'root',
    password: 'Sksm@246 ',
    database: 'job_portal'
});

// Route to download a user's resume as a PDF
router.get('/api/users/:userId/resume', (req, res) => {
    const userId = req.params.userId;

    // Fetch resume path from the database
    const query = 'SELECT resume FROM users WHERE id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching resume path:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct full path to the resume file
        const filePath = path.resolve(__dirname, results[0].resume);

        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');

        // Send the file as a response
        res.sendFile(filePath, (sendError) => {
            if (sendError) {
                console.error('Error sending file:', sendError);
                res.status(500).json({ message: 'Error downloading file' });
            }
        });
    });
});

// Route to delete a user and their resume file (for admin panel)
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT resume FROM users WHERE id = ?';

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error fetching user for deletion:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resumePath = results[0].resume;

        // Query to delete the user from the database
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        db.query(deleteQuery, [userId], (deleteError, deleteResults) => {
            if (deleteError) {
                console.error('Error deleting user:', deleteError);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (deleteResults.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Delete the resume file from the server
            fs.unlink(resumePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error deleting resume file:', unlinkError);
                    return res.status(500).json({ message: 'User deleted, but resume file could not be deleted.' });
                }
                res.json({ message: 'User and resume deleted successfully' });
            });
        });
    });
});

module.exports = router;
