import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations (npm install framer-motion)
import axios from 'axios';
import './App.css'; // Your styles

const API_URL = 'https://autoforgx-backend.onrender.com/api';

// Home Component (your provided code, cleaned up)
const Home = () => {
  const [courses, setCourses] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/courses`).then(res => setCourses(res.data));

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { quote: "Transformed my career with top-notch courses!", author: "Alex Johnson" },
    { quote: "User-friendly and packed with valuable content.", author: "Jordan Lee" },
    { quote: "Best investment in my professional growth.", author: "Taylor Smith" },
  ];

  const benefits = [
    { title: "Expert Instructors", description: "Learn from industry leaders.", icon: "👨‍🏫" },
    { title: "Flexible Learning", description: "Study at your own pace.", icon: "⏰" },
    { title: "Certified Courses", description: "Earn recognized certificates.", icon: "🏆" },
    { title: "Community Support", description: "Join discussions and forums.", icon: "🤝" },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Unlock Your Potential with AutoForgX</h1>
        <p>Elevate your skills through expert-led online courses designed for professionals like you.</p>
        <Link to="/courses" className="cta-button">Browse Courses</Link>
      </motion.section>

      {/* Why Choose Us Section */}
      <section className="benefits-section">
        <h2>Why Choose AutoForgX?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="benefit-icon">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses-section">
        <h2>Featured Courses</h2>
        <div className="courses-grid">
          {courses.slice(0, 4).map((course) => (
            <motion.div
              key={course._id}
              className="course-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span className="course-price">${course.price}</span>
              <Link to="/courses" className="course-button">Enroll Now</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Students Say</h2>
        <motion.div
          className="testimonial-card"
          key={testimonialIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>"{testimonials[testimonialIndex].quote}"</p>
          <span>- {testimonials[testimonialIndex].author}</span>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of professionals advancing their careers.</p>
        <Link to="/signup" className="cta-button">Sign Up Free</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 AutoForgX. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

// Courses Page (Grid Layout)
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    axios.get(`${API_URL}/courses`, { headers: { Authorization: `Bearer ${token}` } }).then(res => setCourses(res.data));
  }, [navigate]);

  const handlePurchase = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/purchase`, { courseId: id }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Course purchased!');
  };

  return (
    <div className="courses-page">
      <h1>Available Courses</h1>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p className="price">${course.price}</p>
            <button onClick={() => handlePurchase(course._id)}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Signup Page (With Form Validation)
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await axios.post(`${API_URL}/signup`, { email, password });
      navigate('/login');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

// Login Page (Similar to Signup)
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Dashboard Page (Table View)
const Dashboard = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    axios.get(`${API_URL}/purchased`, { headers: { Authorization: `Bearer ${token}` } }).then(res => setPurchasedCourses(res.data));
  }, [navigate]);

  return (
    <div className="dashboard-page">
      <h1>Your Dashboard</h1>
      <table className="course-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {purchasedCourses.map(course => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>${course.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/courses" className="cta-button">Buy More Courses</Link>
    </div>
  );
};

// Main App Component
function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        {localStorage.getItem('token') ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
