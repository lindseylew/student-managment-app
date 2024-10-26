import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Snackbar,
} from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
    } catch (err) {
      setError("Invalid credentials");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%", mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            autofocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="body2" align="center">
              <Link to="/forgot_password">Forgot Passowrd</Link>
            </Typography>
            <Typography variant="body2" align="center">
              <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error}
        />
      </Box>
    </Container>
  );
};

export default Login;
