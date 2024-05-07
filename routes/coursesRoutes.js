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

// GET request to list all courses
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM courses');
        res.render('courses/listCourses', { courses: rows });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to add a new course (render form)
router.get('/add', (req, res) => {
    res.render('courses/addCourse');
});

// POST request to add a new course
router.post('/add', async (req, res) => {
    const { course_name, credits } = req.body;
    try {
        await connection.promise().execute('INSERT INTO courses (course_name, credits) VALUES (?, ?)', [course_name, credits]);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to edit a course (render form)
router.get('/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM courses WHERE course_id = ?', [courseId]);
        if (rows.length === 0) {
            res.status(404).send('Course not found');
        } else {
            res.render('courses/editCourse', { course: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to edit a course
router.post('/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    const { course_name, credits } = req.body;
    try {
        await connection.promise().execute('UPDATE courses SET course_name = ?, credits = ? WHERE course_id = ?', [course_name, credits, courseId]);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to delete a course (render confirmation page)
router.get('/delete/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM courses WHERE course_id = ?', [courseId]);
        if (rows.length === 0) {
            res.status(404).send('Course not found');
        } else {
            res.render('courses/deleteCourse', { course: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to delete a course
router.post('/delete/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        await connection.promise().execute('DELETE FROM courses WHERE course_id = ?', [courseId]);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
