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

// GET request to list all students
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM students');
        res.render('students/listStudents', { students: rows });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to add a new student (render form)
router.get('/add', (req, res) => {
    res.render('students/addStudent');
});

// POST request to add a new student
router.post('/add', async (req, res) => {
    const { first_name, last_name, email } = req.body;
    try {
        await connection.promise().execute('INSERT INTO students (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, email]);
        res.redirect('/students');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Cannot add student');
    }
});

// GET request to edit a student (render form)
router.get('/edit/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM students WHERE student_id = ?', [studentId]);
        if (rows.length === 0) {
            res.status(404).send('Student not found');
        } else {
            res.render('students/editStudent', { student: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to edit a student
router.post('/edit/:id', async (req, res) => {
    const studentId = req.params.id;
    const { first_name, last_name, email } = req.body;
    try {
        await connection.promise().execute('UPDATE students SET first_name = ?, last_name = ?, email = ? WHERE student_id = ?', [first_name, last_name, email, studentId]);
        res.redirect('/students');
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to delete a student (render confirmation page)
router.get('/delete/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM students WHERE student_id = ?', [studentId]);
        if (rows.length === 0) {
            res.status(404).send('Student not found');
        } else {
            res.render('students/deleteStudent', { student: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to delete a student
router.post('/delete/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        await connection.promise().execute('DELETE FROM students WHERE student_id = ?', [studentId]);
        res.redirect('/students');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
