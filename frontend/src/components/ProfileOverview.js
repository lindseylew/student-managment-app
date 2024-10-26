import React, { useState } from 'react';
import { TextField, Button, Typography, Card, CardContent } from '@mui/material';

const ProfileOverview = ({ student }) => {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);

    const handleEditToggle = () => {
        setEditing(!editing)
    };

    const handleSave = () => {
        console.log("Updated information: ", { name, email });
        setEditing(false);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant='h5'>Profile Overview</Typography>
                {editing ? (
                    <>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            margin='normal'
                        />
                        <TextField
                            label='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin='normal'
                        />
                        <Button variant='contailned' color='primary' onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant='outlined' onClick={handleEditToggle}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                    <Typography variant='h6'>Name: {name}</Typography>
                    <Typography variant='h6'>Email: {email}</Typography>
                    <Button variant='outlined' onClick={handleEditToggle}>
                        Edit Profile
                    </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default ProfileOverview;