const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studentdb')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Define Schema and Model
const Student = mongoose.model('Student', { name: String, rollNo: String });

// 1. CREATE
app.post('/api/students', async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json({ message: "Student Created", data: newStudent });
});

// 2. READ (Get all)
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 3. UPDATE
app.put('/api/students/:id', async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Student Updated", data: updatedStudent });
});

// 4. DELETE
app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Deleted" });
});

// Start Server
app.listen(3000, () => console.log('CRUD API Server running on port 3000'));
