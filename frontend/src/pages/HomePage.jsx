import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

// Import MUI components
import { Box, Button, Container, Divider, Paper, TextField, Typography } from '@mui/material';

const HomePage = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomId) {
            navigate(`/room/${roomId}`);
        }
    };

    const createNewRoom = () => {
        const newRoomId = uuidV4();
        navigate(`/room/${newRoomId}`);
    };

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Brand Tagline */}
                <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Connect, Collaborate, Contribute
                </Typography>
                <Typography variant="h4" align="center" color="text.secondary" paragraph>
                    or just Chat and Chill
                </Typography>

                {/* Form Card using MUI Paper */}
                <Paper 
                    elevation={3}
                    sx={{
                        mt: 6,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '500px'
                    }}
                >
                    <Typography component="h2" variant="h5" align="center" sx={{ mb: 2 }}>
                        Start or Join a Meeting
                    </Typography>
                    
                    {/* Join Room Form */}
                    <Box component="form" onSubmit={handleJoin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="roomId"
                            label="Enter Room ID"
                            name="roomId"
                            autoFocus
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Join Room
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ my: 2 }}>OR</Divider>

                    {/* Create Room Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={createNewRoom}
                        sx={{ py: 1.5 }}
                    >
                        Create a New Room
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default HomePage;
