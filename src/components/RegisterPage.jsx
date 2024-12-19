import React, { useState } from "react";
import axios from "axios";
import "../style.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false); // State to control popup visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
    setMessage(""); // Clear success message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!formData.firstname) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // API Request
    try {
      const response = await axios.post("http://localhost:4000/api/register", formData);
      if (response.status === 200) {
        setMessage("Registration successful!");
        setPopupVisible(true); // Show popup on successful registration
        setTimeout(() => {
          // Redirect to login page after 3 seconds
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors((prev) => (({
          ...prev,
          server: error.response.data.message || "Registration failed.",
        })));
      } else {
        setErrors((prev) => (({
          ...prev,
          server: "An unexpected error occurred.",
        })));
      }
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-image">
        <img src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg?semt=ais_hybrid" alt="Register" />
      </div>
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>

          {/* Success Message Popup */}
          {popupVisible && <div className="popup">{message}</div>}

          {/* First Name Input */}
          <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            {errors.firstname && <span className="error">{errors.firstname}</span>}
          </div>

          {/* Last Name Input */}
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            {errors.lastname && <span className="error">{errors.lastname}</span>}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Username Input */}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-register">
            Register
          </button>

          {/* Server Error Message */}
          {errors.server && <div className="error server-error">{errors.server}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;