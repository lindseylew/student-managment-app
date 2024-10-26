import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material'
import axios from 'axios';

const TeacherDashboard = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const response = await axios.get('endpoint');
                setTeacherData(response.data);
            } catch (error) {
                console.error('Error fetching teacher data: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
                <CircularProgress />
            </Box>
        );
    }
    if (!teacherData) {
        return <Typography>Error: Teacher data not found.</Typography>;
    }

    return (
        <Container>
            <Typography variant='h4' gutterBottom>
                Welcome, {teacherData.name}
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4}}>
                <Typography variant='h6'>Profile Information</Typography>
                <Typography>Name: {teacherData.name}</Typography>
                <Typography>Email: {teacherData.Email}</Typography>
                <Typography>Subjects: {teacherData.subjects}</Typography>
            </Paper>

            <Typography variant='h6' gutterBottom>
                Assigned Classes
            </Typography>
        </Container>
    )
};

export default TeacherDashboard;


