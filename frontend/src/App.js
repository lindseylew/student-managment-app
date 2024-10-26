import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import StudentList from "./components/StudentList";
import EditStudent from "./components/EditStudent";
import StudentDashboard from "./components/StudentDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import TeacherDashboard from "./components/TeacherDashboard";

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div style={{ padding: "40px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot_password" element={<ForgotPassword/>} />
            <Route path="/students_list" element={<StudentList />} />
            <Route path="/add_student" element={<AddStudent />} />
            <Route path="/edit/:studentId" element={<EditStudent />} />
            <Route path="/student_dashboard/:id" element={<StudentDashboard />} />
            <Route path="/teacher_dashboard/:id" element={<TeacherDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  return (
    <AppBar position='static'>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Student Management System
      </Typography>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button color="inherit" component={Link} to="/students_list">
        Student List
      </Button>
      <Button color="inherit" component={Link} to="/add_student">
        Add Student
      </Button>
    </Toolbar>
  </AppBar>
  );
};

export default App;
