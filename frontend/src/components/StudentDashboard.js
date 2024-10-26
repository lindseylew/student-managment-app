import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const StudentDashboard = () => {
    const { id } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            try{
            const response = await axios.get(`${apiUrl}/students/${id}`);
            setStudentData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    fetchStudentData();
}, [id]);

if (loading) {
    return <CircularProgress />
}

if (error) {
    return <Typography color='error'>Error fetching data: {error.message}</Typography>;
}

return (
    <Box sx={{padding: 2}}>
        <Typography variant='h4' gutterBottom>
            Student Dashboard
        </Typography>
        <Paper elevation={3} sx={{padding: 2, marginBottom: 2}}>
            <Typography variant='h6'>Profile Overview</Typography>
            <Typography variant='body1'>
                Welcome, {studentData.name}!  Here is your profile overview.
            </Typography>
            <Typography variant='body1'>Email: {studentData.email}</Typography>
        </Paper>
        <Paper elevation={3} sx={{padding: 2}}>
            <Typography variant='h6'>Upcoming Assignments</Typography>
        </Paper>
    </Box>
);
};

export default StudentDashboard;