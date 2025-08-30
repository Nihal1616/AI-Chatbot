import React, { useState, useContext } from "react";
import axios from "axios";
import { MyContext } from "./MyContext";
import "./Authentication.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get auth functions from context
  const { setAuthToken, setUsername, setIsAuthenticated } =
    useContext(MyContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? `${server}/api/login` : `${server}/api/signup`;

      const dataToSend = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, dataToSend);

      if (isLogin) {
        // Login flow
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem(
            "username",
            response.data.username || formData.username
          );

          setAuthToken(response.data.token);
          setUsername(response.data.username || formData.username);
          setIsAuthenticated(true);

          setMessage("Login successful! Redirecting...");
        } else {
          setError(response.data.message || "Login failed");
        }
      } else {
        // Signup flow → redirect to login
        setMessage("Signup successful! Please login.");
        setIsLogin(true); // switch to login form
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {isLogin
              ? "Sign in to continue chatting"
              : "Join us to start chatting"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
