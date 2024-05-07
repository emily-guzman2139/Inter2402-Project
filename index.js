// index.js
const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Set up views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON bodies
app.use(express.json());
// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Database connection setup (you need to replace dbConfig with your actual MySQL connection details)
const mysql = require('mysql2');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'college_management_system'
};

const connection = mysql.createConnection(dbConfig);

// Check if the database connection is successful
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Require and use routes
const usersRoutes = require('./routes/usersRoutes');
const studentsRoutes = require('./routes/studentsRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const enrollmentsRoutes = require('./routes/enrollmentsRoutes');

app.use('/users', usersRoutes);
app.use('/students', studentsRoutes);
app.use('/courses', coursesRoutes);
app.use('/faculty', facultyRoutes);
app.use('/enrollments', enrollmentsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
