import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const validateForm = () => {
    // Implement your form validation logic here
    // For simplicity, just check if all fields are non-empty in this example
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const password = document.getElementById('formPassword').value;

    return name.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fill in all the required fields.');
      return;
    }

    const signupData = {
      name: e.target.elements.formName.value,
      email: e.target.elements.formEmail.value,
      password: e.target.elements.formPassword.value,
      role: 'user',
    };

    try {
      // Make the signup API request
      const response = await axios.post('https://back-dvsv.onrender.com/auth/user/signup', signupData);

      // Check for successful response
      if (response.status === 200) {
        setSuccess('User signed up successfully!');
        // Navigate to the login page after a brief delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100 m-4">
        {/* Left Section with Text and Image */}
        <div className="col-md-6 col-lg-6 d-none d-md-block text-center">
          <div className="mb-4">
            {/* Replace with your image path */}
            <img src="data:image/jpeg;base64,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" alt="E-commerce" className="img-fluid" />
          </div>
          <div>
            <h2 className="mb-3">Join Our E-commerce Community</h2>
            <p>Sign up and explore amazing deals!</p>
          </div>
        </div>

        {/* Right Section with Signup Form */}
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="card mt-5">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSignUp}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Sign Up
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <p>Already have an account?</p>
                <Button variant="outline-primary" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
