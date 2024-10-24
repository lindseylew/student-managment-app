import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddStudent from "./components/AddStudent";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

import StudentList from "./components/StudentList";
import EditStudent from "./components/EditStudent";

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar>
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
        <div style={{ padding: "40px" }}>
          <Routes>
            <Route exact path="/" component={Home} />
            <Route path="/students_list" element={<StudentList />} />
            <Route path="/add_student" element={<AddStudent />} />
            <Route path="/edit/:studentId" element={<EditStudent />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

const Home = () => <h2>Welcome to the Student Management System</h2>;

export default App;
