const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'college_management_system'
});

// Check MySQL connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the database');
});


// GET request to list all enrollments
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM enrollments');
        res.render('enrollments/listEnrollments', { enrollments: rows });
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).send('Error 1');
    }
});

// GET request to enroll a student in a course (render form)
router.get('/enrollStudent', async (req, res) => {
    try {
        const [students] = await connection.promise().execute('SELECT * FROM students');
        const [courses] = await connection.promise().execute('SELECT * FROM courses');
        const [faculty] = await connection.promise().execute('SELECT * FROM faculty');
        res.render('enrollments/enrollStudent', { students, courses, faculty });
    } catch (error) {
        console.error('Error fetching data for enrollment:', error);
        res.status(500).send('Error 2');
    }
});

// POST request to enroll a student in a course
router.post('/enrollStudent', async (req, res) => {
    const { student_id, course_id, faculty_id } = req.body;
    try {
        await connection.promise().execute('INSERT INTO enrollments (student_id, course_id, faculty_id) VALUES (?, ?, ?)', [student_id, course_id, faculty_id]);
        res.redirect('/enrollments');
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).send('Error 3');
    }
});

// GET request to remove a faculty member from a course (render confirmation page)
router.get('/removeFaculty/:id', async (req, res) => {
    const enrollmentId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM enrollments WHERE enrollment_id = ?', [enrollmentId]);
        if (rows.length === 0) {
            res.status(404).send('Enrollment not found');
        } else {
            res.render('enrollments/removeFaculty', { enrollment: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching enrollment:', error);
        res.status(500).send('Error 4');
    }
});

// POST request to remove a faculty member from a course
router.post('/removeFaculty/:id', async (req, res) => {
    const enrollmentId = req.params.id;
    try {
        await connection.promise().execute('UPDATE enrollments SET faculty_id = NULL WHERE enrollment_id = ?', [enrollmentId]);
        res.redirect('/enrollments');
    } catch (error) {
        console.error('Error removing faculty from enrollment:', error);
        res.status(500).send('Error 5');
    }
});

module.exports = router;
