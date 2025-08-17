import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Your styles

const API_URL = 'https://autoforgx-backend.onrender.com/api'; // Or use process.env.REACT_APP_API_URL

// Hero Component for Home Page
const Hero = () => (
  <section className="hero">
    <h1>Welcome to AutoForgX</h1>
    <p>Your premier platform for professional online courses. Unlock your potential with expert-led learning.</p>
    <Link to="/courses" className="cta-button">Explore Courses</Link>
  </section>
);

// Featured Courses Component (for Home)
const FeaturedCourses = ({ courses }) => (
  <section className="featured-courses">
    <h2>Featured Courses</h2>
    <div className="course-grid">
      {courses.slice(0, 3).map(course => (
        <div key={course._id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p className="price">${course.price}</p>
          <button>Learn More</button>
        </div>
      ))}
    </div>
  </section>
);

// Testimonials Component (for Home)
const Testimonials = () => (
  <section className="testimonials">
    <h2>What Our Students Say</h2>
    <div className="testimonial-grid">
      <div className="testimonial-card">"Amazing courses! Transformed my career." - Alex</div>
      <div className="testimonial-card">"User-friendly platform with top-notch content." - Jordan</div>
    </div>
  </section>
);

// Home Page
const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/courses`).then(res => setCourses(res.data));
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <FeaturedCourses courses={courses} />
      <Testimonials />
      <Link to="/signup" className="cta-button secondary">Get Started Today</Link>
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
const App = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Router>
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
    </Router>
  );
};

export default App;
