import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await fetch('https://back-dvsv.onrender.com/auth/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages
        if (response.status === 401) {
          setError('Invalid email or password');
        } else if (response.status === 404) {
          setError('User not found');
        } else {
          setError(data.message || 'Login failed');
        }
        return;
      }

      // Store user information and token in the state or global state management
      // For simplicity, let's store them in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      setError('');
      // Redirect to the home page or any other page
      navigate('/');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Navigate to the signup page
    navigate('/signup');
  };

  return (
    <div className="container-fluid">
    <div className="row justify-content-center align-items-center min-vh-100 m-4">
      {/* Right Section with Login Form */}
      <div className="col-md-6 col-lg-6 col-sm-12">
        <div className="card mt-5">
          <div className="card-body p-4">
            <h2 className="text-center mb-4" style={{ color: '#3498db' }}>
              Welcome Back!
            </h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Log In
              </Button>
            </Form>

            <div className="mt-3 text-center">
              <p>Don't have an account?</p>
              <Button variant="outline-success" onClick={handleSignUp}>
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Left Section with Text and Image */}
      <div className="col-md-6 col-lg-6 d-none d-md-block text-center">
        <div className="mb-4">
          {/* Replace the image path with the actual path */}
          <img src="/image" alt="E-commerce" className="img-fluid" />
        </div>
        <div>
          <h2 className="mb-3" style={{ color: '#2ecc71' }}>
            Explore Our E-commerce World
          </h2>
          <p>Discover amazing deals and shop with confidence!</p>
        </div>
      </div>
    </div>
  </div>
);
};
export default Login;
