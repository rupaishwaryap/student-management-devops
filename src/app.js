const express = require('express');

const app = express();
app.use(express.json());

let students = [
  { id: 1, name: 'Asha', course: 'Computer Science', year: 2 },
  { id: 2, name: 'Rahul', course: 'Information Technology', year: 3 }
];
let nextId = 3;

app.get('/', (_req, res) => {
  res.json({ message: 'Student Management API is running' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/api/students', (_req, res) => res.json(students));

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) return res.status(404).json({ error: 'Student not found' });
  return res.json(student);
});

app.post('/api/students', (req, res) => {
  const { name, course, year } = req.body;
  if (!name || !course || !Number.isInteger(year) || year < 1) {
    return res.status(400).json({
      error: 'name, course and a positive integer year are required'
    });
  }
  const student = { id: nextId++, name, course, year };
  students.push(student);
  return res.status(201).json(student);
});

app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const existingLength = students.length;
  students = students.filter(s => s.id !== id);
  if (students.length === existingLength) {
    return res.status(404).json({ error: 'Student not found' });
  }
  return res.status(200).json({ message: 'Student deleted successfully' });
});

// Test helper: reset the in-memory sample data before each test.
app.resetStudents = () => {
  students = [
    { id: 1, name: 'Asha', course: 'Computer Science', year: 2 },
    { id: 2, name: 'Rahul', course: 'Information Technology', year: 3 }
  ];
  nextId = 3;
};

module.exports = app;
