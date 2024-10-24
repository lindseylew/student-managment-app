import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useParams } from "react-router-dom";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditStudent = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState({ name: "", age: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/students/${studentId}`
        );
        setStudent(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/update_student/${studentId}`,
        student
      );
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
      setStudent({ name: "", age: "", email: "" });
    } catch (error) {
      const message = error.response
        ? error.response.data.error
        : "Error updating student";
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Name"
        variant="outlined"
        value={student.name}
        onChange={(e) => setStudent({ ...student, name: e.target.value })}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Age"
        variant="outlined"
        type="number"
        value={student.age}
        onChange={(e) =>
          setStudent({ ...student, age: parseInt(e.target.value) })
        }
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        variant="outlined"
        type="email"
        value={student.email}
        onChange={(e) => setStudent({ ...student, email: e.target.value })}
        required
        fullWidth
        margin="normal"
      />
      <Button variant="contained" type="submit">
        Update Student
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditStudent;
