const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    await Student.create({
      name,
      email,
      password: hash,
      course,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  const student = await Student.findById(req.studentId).select('-password');
  res.json(student);
});

// Get Expenses
router.get('/expenses', authMiddleware, async (req, res) => {
  const student = await Student.findById(req.studentId);
  res.json(student.expenses);
});

// Add Expense
router.post('/expenses', authMiddleware, async (req, res) => {
  const { title, amount, category } = req.body;

  const student = await Student.findById(req.studentId);

  student.expenses.push({
    title,
    amount,
    category,
  });

  await student.save();

  res.json({ message: 'Expense added successfully' });
});

// Delete Expense
router.delete('/expenses/:id', authMiddleware, async (req, res) => {
  const student = await Student.findById(req.studentId);

  student.expenses = student.expenses.filter(
    (item) => item._id.toString() !== req.params.id
  );

  await student.save();

  res.json({ message: 'Expense deleted successfully' });
});

module.exports = router;