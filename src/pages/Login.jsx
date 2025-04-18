/**
 * Login.jsx - Login Page Component
 *
 * This component provides a login interface for users to authenticate.
 */

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

/**
 * LoginPage Component
 *
 * Provides a login interface for user authentication.
 *
 * @returns {JSX.Element} The rendered login page
 */
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log("Login attempt with:", { email, password });
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h4" component="h1" className="login-title">
          Login to CryptoSage
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="login-form">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
          >
            Login
          </Button>
          <Box className="login-links">
            <Link to="/forgot-password" className="login-link">
              Forgot Password?
            </Link>
            <Link to="/register" className="login-link">
              Create Account
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
