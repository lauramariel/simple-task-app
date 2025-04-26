const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const dbHost = process.env.DB_HOST || 'localhost';  // The database host (can be an IP or hostname)
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'task_manager';

// Connect to MySQL
const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,        // change if needed
  password: dbPassword,        // add your password if you have one
  database: dbName
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Get DB connection
app.get('/get-db-ip', (req, res) => {
    res.json({ dbIp: dbHost });  // Send the database IP to the frontend
  });
  

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ id: results.insertId, title });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});
// Toggle complete/incomplete
app.put('/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    });
  });

app.patch('/tasks/:id', (req, res) => {
const { id } = req.params;
const { completed } = req.body;

// Update task in the database (example with MySQL)
const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
db.query(query, [completed, id], (err, result) => {
    if (err) return res.status(500).send('Error updating task');
    res.send({ message: 'Task updated' });
});
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
