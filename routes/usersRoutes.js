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

// GET request to list all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM users');
        res.render('users/listUsers', { users: rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to add a new user (render form)
router.get('/add', (req, res) => {
    res.render('users/addUser');
});

// POST request to add a new user
router.post('/add', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.promise().execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
        res.redirect('/users');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to edit a user (render form)
router.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.render('users/editUser', { user: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to edit a user
router.post('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.promise().execute('UPDATE users SET username = ?, password = ?, role = ? WHERE user_id = ?', [username, hashedPassword, role, userId]);
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET request to delete a user (render confirmation page)
router.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await connection.promise().execute('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.render('users/deleteUser', { user: rows[0] });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST request to delete a user
router.post('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await connection.promise().execute('DELETE FROM users WHERE user_id = ?', [userId]);
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
