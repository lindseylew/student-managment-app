import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register`, formData);
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "An error occurred");
        setMessage("");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 8,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2}}>
            Register
          </Button>
        </form>
      </Box>
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Register;
