
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// This map will store the association between a user's socket ID and their PeerJS ID.
const socketToPeerMap = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: { 
            origin: "https://huddle-up-lilac.vercel.app/", // Or your specific frontend URL like "http://localhost:5173"
            methods: ["GET", "POST"] 
        }
    });

    // Your existing JWT Authentication Middleware - no changes needed here.
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: No token provided."));
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(new Error("Authentication error: Invalid token."));
            }
            // Attach user details to the socket instance for use in event handlers.
            socket.user = { 
                id: decoded.id, 
                username: decoded.username 
            };
            next();
        });
    });

    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}, Username: ${socket.user.username}`);

        // --- NEW: Event handler for when a user joins a room with their PeerJS ID ---
        socket.on("join-room", (roomId, peerId) => {
            // Map the socket's unique ID to its PeerJS ID for future reference.
            socketToPeerMap[socket.id] = peerId;
            socket.join(roomId);

            // Announce the new user's PeerJS ID to everyone else already in the room.
            socket.to(roomId).emit('user-connected', peerId);
            console.log(`User ${socket.user.username} with peerId ${peerId} joined room ${roomId}.`);
        });

        // The chat functionality remains the same.
        socket.on("chat-message", (data) => {
            // Find the room the user is in. The first room is the socket's own ID.
            const roomName = Array.from(socket.rooms)[1];

            if (roomName) {
                const messagePayload = {
                    senderUsername: socket.user.username,
                    content: data,
                };
                // Broadcast the message to everyone in the room.
                io.to(roomName).emit("new-chat-message", messagePayload);
            }
        });

        // --- REMOVED: The old "signal" event handler for simple-peer is no longer needed. ---

        // --- UPDATED: Event handler for when a user disconnects ---
        socket.on("disconnect", () => {
            console.log(`User disconnecting: ${socket.id}, Username: ${socket.user.username}`);
            const peerId = socketToPeerMap[socket.id];
            
            if (peerId) {
                // Find the room the user was in to notify others.
                const roomName = Array.from(socket.rooms)[1];
                if (roomName) {
                    // Announce that this peer has left so clients can remove their video.
                    socket.to(roomName).emit('user-disconnected', peerId);
                }
                // Clean up the map to prevent memory leaks.
                delete socketToPeerMap[socket.id];
            }
        });
    });

    return io;
};
