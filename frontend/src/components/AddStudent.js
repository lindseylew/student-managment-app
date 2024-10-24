import React, { useState } from "react";
import axios from'axios';
import { TextField, Button, Box, Typography } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL

const AddStudent = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let formErrors = {};
    let valid = true;

    if (!name) {
      valid = false;
      formErrors.name = "Name is required.";
    }

    if (!email) {
      valid = false;
      formErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        valid = false;
        formErrors.email = 'Email is not valid.';
    }

    if (!age) {
      valid = false;
      formErrors.age = 'Age is required.';
    } else if (isNaN(age)) {
      valid = false;
      formErrors.age = 'Age must be a number'
    }

    setErrors(formErrors);
    return valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setSuccessMessage('');

    if (validateForm()) {
    try {
      const response = await axios.post(`${apiUrl}/add_student`, {
        name,
        age,
        email,
      });
      setSuccessMessage(response.data.message);
      setName('');
      setAge('')
      setEmail('');
    } catch (err) {
      setErrors(err.response?.data?.error || 'An error occurred while adding the student.');
    }
  }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant='h4' component='h2' gutterBottom>
        Add Student
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Age"
        variant="outlined"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        fullWidth
        margin="normal"
        error={!!errors.age}
        helperText={errors.age}
      />
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email}
      />
      <Button variant="contained" type="submit">
        Add Student
      </Button>
      {successMessage && <Typography color='green' mt={2}>{successMessage}</Typography>}
    </Box>
  );
};

export default AddStudent;
