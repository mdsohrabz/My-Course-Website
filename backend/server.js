
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Change this to a strong secret in production

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your Atlas URI)
mongoose.connect('mongodb+srv://mdsohrab069:Tg620209@cluster0.ib4d6ym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const User = mongoose.model('User', userSchema);

// Course model
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number
});
const Course = mongoose.model('Course', courseSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send('User created');
  } catch (err) {
    res.status(400).send('Error creating user');
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.userId = decoded.userId;
    next();
  });
};

// Get courses
app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Purchase course (simulate)
app.post('/api/purchase', verifyToken, async (req, res) => {
  const { courseId } = req.body;
  const user = await User.findById(req.userId);
  if (user.purchasedCourses.includes(courseId)) {
    return res.status(400).send('Already purchased');
  }
  user.purchasedCourses.push(courseId);
  await user.save();
  res.send('Course purchased');
});

// Get user dashboard
app.get('/api/dashboard', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId).populate('purchasedCourses');
  res.json(user.purchasedCourses);
});

// Seed some sample courses (run once manually if needed)
app.get('/api/seed', async (req, res) => {
  await Course.deleteMany({});
  await Course.insertMany([
    { title: 'Intro to AI', description: 'Learn AI basics', price: 49 },
    { title: 'Web Development', description: 'Build websites', price: 99 }
  ]);
  res.send('Seeded');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
