import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/forgot_password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error occured, please try again.");
    }
  };

  return (
    <Box sx={{ vpaddiing: 3, maxWidth: 400, margin: "auto" }}>
      <Paper sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
        <Typography>Forgot Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" vaiant="contained" sx={{ marginTop: 2 }}>
            Reset Password
          </Button>
        </form>
        {message && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
