// frontend/src/pages/RoomPage.jsx (Final Version with PeerJS)

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { useAuth } from '../contexts/AuthContext';

// Import MUI components and icons
import { Box, Grid, Paper, TextField, Button, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallEndIcon from '@mui/icons-material/CallEnd';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// A simple component to render a peer's video stream.
const PeerVideo = ({ stream, username }) => {
    const ref = useRef();
    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <Paper elevation={3} sx={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
            <video playsInline autoPlay ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
                {username}
            </Typography>
        </Paper>
    );
}

const RoomPage = () => {
    const [peers, setPeers] = useState([]); // Will now store { peerId, stream, username }
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const socketRef = useRef();
    const peerRef = useRef();
    const userVideoRef = useRef();
    const streamRef = useRef();
    const chatContainerRef = useRef();
    const peersRef = useRef({}); // Use a ref to store active call objects: { peerId: call }

    const { roomId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    useEffect(() => {
        //commented below for local use only
        //socketRef.current = io('http://localhost:8000', { auth: { token } });
        // Connect to the backend socket server using the environment variable
          socketRef.current = io(import.meta.env.VITE_BACKEND_URL, { auth: { token } });

        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                streamRef.current = stream;
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = stream;
                }

                // Initialize PeerJS
                const peer = new Peer();
                peerRef.current = peer;

                peer.on('open', peerId => {
                    // Once we have our unique peer ID, we join the socket room
                    socketRef.current.emit('join-room', roomId, peerId);
                });

                // Listen for incoming calls from other peers
                peer.on('call', call => {
                    // Answer the call, sending our own stream
                    call.answer(streamRef.current);

                    // When we receive the other person's stream
                    call.on('stream', remoteStream => {
                        if (!peersRef.current[call.peer]) {
                            peersRef.current[call.peer] = call;
                            setPeers(prev => [...prev, { peerId: call.peer, stream: remoteStream, username: 'Peer' }]);
                        }
                    });
                });

                // Listen for new users connecting to the room
                socketRef.current.on('user-connected', (peerId) => {
                    console.log(`User connected: ${peerId}`);
                    // Call the new user
                    const call = peer.call(peerId, streamRef.current);
                    
                    call.on('stream', remoteStream => {
                        if (!peersRef.current[call.peer]) {
                            peersRef.current[call.peer] = call;
                            setPeers(prev => [...prev, { peerId: call.peer, stream: remoteStream, username: 'Peer' }]);
                        }
                    });
                });

                // Listen for users disconnecting
                socketRef.current.on('user-disconnected', peerId => {
                    if (peersRef.current[peerId]) {
                        peersRef.current[peerId].close();
                        delete peersRef.current[peerId];
                    }
                    setPeers(prev => prev.filter(p => p.peerId !== peerId));
                });
                
                // Chat listener remains the same
                socketRef.current.on('new-chat-message', (message) => {
                    setMessages(prevMessages => [...prevMessages, message]);
                });
            })
            .catch(err => console.error('Failed to get local stream', err));
        
        return () => {
            if (peerRef.current) peerRef.current.destroy();
            if (socketRef.current) socketRef.current.disconnect();
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };
    }, [roomId, token]);

    useEffect(() => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }, [messages]);
    
    // Chat logic remains the same (uses Socket.IO)
    const handleSendMessage = (e) => { e.preventDefault(); if (newMessage.trim() && socketRef.current) { socketRef.current.emit('chat-message', newMessage); setNewMessage(""); } };
    
    // Media controls logic remains the same
    const toggleAudio = () => { if (streamRef.current) { const audioTrack = streamRef.current.getAudioTracks()[0]; if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsAudioMuted(!audioTrack.enabled); } } };
    const toggleVideo = () => { if (streamRef.current) { const videoTrack = streamRef.current.getVideoTracks()[0]; if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; setIsVideoOff(!videoTrack.enabled); } } };
    
    // Screen share logic needs to be adapted for PeerJS - for now, this is a placeholder
    const handleScreenShare = () => {
        alert("Screen sharing with PeerJS is a more advanced topic and needs a dedicated implementation.");
    };

    const handleEndCall = () => { navigate('/'); };
    const handleCopyRoomId = () => { navigator.clipboard.writeText(roomId).then(() => setOpenSnackbar(true)); };
    const handleCloseSnackbar = () => { setOpenSnackbar(false); };
    
    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', flexDirection: 'column' }}>
            {/* Header and UI layout remains the same */}
            <Paper elevation={2} sx={{ p: 1, m: 2, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h6">Room ID:</Typography>
                <Typography sx={{ fontFamily: 'monospace', bgcolor: 'grey.800', p: 0.5, borderRadius: 1 }}>{roomId}</Typography>
                <IconButton onClick={handleCopyRoomId} size="small" aria-label="copy room id"><ContentCopyIcon fontSize="small" /></IconButton>
            </Paper>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Grid container spacing={2} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper elevation={3} sx={{ position: 'relative', overflow: 'hidden', border: '2px solid', borderColor: 'primary.main', height: '100%' }}>
                                <video muted ref={userVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1, py: 0.5, borderRadius: 1 }}>
                                    {user?.username} (You)
                                </Typography>
                            </Paper>
                        </Grid>
                        {peers.map((p) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.peerId}>
                                <PeerVideo stream={p.stream} username={p.username} />
                            </Grid>
                        ))}
                    </Grid>
                    <Paper elevation={3} sx={{ p: 2, mt: 2, flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                             <IconButton onClick={toggleAudio} color={isAudioMuted ? 'secondary' : 'default'}><MicOffIcon /></IconButton>
                             <IconButton onClick={toggleVideo} color={isVideoOff ? 'secondary' : 'default'}><VideocamOffIcon /></IconButton>
                             <IconButton onClick={handleScreenShare}><ScreenShareIcon/></IconButton>
                             <Button variant="contained" color="error" startIcon={<CallEndIcon />} onClick={handleEndCall} sx={{ ml: 4 }}>End Call</Button>
                        </Box>
                    </Paper>
                </Box>
                <Paper elevation={3} sx={{ width: 350, m: 2, ml: 0, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Chat</Typography>
                    <Box ref={chatContainerRef} sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
                        {messages.map((message, index) => (
                            <Box key={index} sx={{ mb: 1.5 }}>
                                <Typography variant="caption" color="text.secondary">{message.senderUsername}</Typography>
                                <Paper sx={{ p: 1.5, bgcolor: 'grey.800' }}><Typography variant="body2">{message.content}</Typography></Paper>
                            </Box>
                        ))}
                    </Box>
                    <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                        <TextField size="small" fullWidth placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                        <IconButton type="submit" color="primary"><SendIcon /></IconButton>
                    </Box>
                </Paper>
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Room ID copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RoomPage;
