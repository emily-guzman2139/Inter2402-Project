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


// GET request to list all faculty
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM faculty');
        res.render('faculty/listFaculty', { faculty: rows });
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to add a new faculty member (render form)
router.get('/add', (req, res) => {
    res.render('faculty/addFaculty');
});

// POST request to add a new faculty member
router.post('/add', async (req, res) => {
    const { first_name, last_name, email } = req.body;
    try {
        await connection.promise().execute('INSERT INTO faculty (first_name, last_name, email) VALUES (?, ?, ?)', [first_name, last_name, email]);
        res.redirect('/faculty');
    } catch (error) {
        console.error('Error adding faculty member:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to edit a faculty member (render form)
router.get('/edit/:id', async (req, res) => {
    const facultyId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM faculty WHERE faculty_id = ?', [facultyId]);
        if (rows.length === 0) {
            res.status(404).send('Faculty member not found');
        } else {
            res.render('faculty/editFaculty', { faculty: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching faculty member:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to edit a faculty member
router.post('/edit/:id', async (req, res) => {
    const facultyId = req.params.id;
    const { first_name, last_name, email } = req.body;
    try {
        await connection.promise().execute('UPDATE faculty SET first_name = ?, last_name = ?, email = ? WHERE faculty_id = ?', [first_name, last_name, email, facultyId]);
        res.redirect('/faculty');
    } catch (error) {
        console.error('Error updating faculty member:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to delete a faculty member (render confirmation page)
router.get('/delete/:id', async (req, res) => {
    const facultyId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM faculty WHERE faculty_id = ?', [facultyId]);
        if (rows.length === 0) {
            res.status(404).send('Faculty member not found');
        } else {
            res.render('faculty/deleteFaculty', { faculty: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching faculty member:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to delete a faculty member
router.post('/delete/:id', async (req, res) => {
    const facultyId = req.params.id;
    try {
        await connection.promise().execute('DELETE FROM faculty WHERE faculty_id = ?', [facultyId]);
        res.redirect('/faculty');
    } catch (error) {
        console.error('Error deleting faculty member:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
