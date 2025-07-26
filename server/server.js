import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';

import { Server } from 'socket.io';

//importing the file
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.route.js';
import messageRouter from './routes/message.route.js';

// Create express app and HTTP server
const app = express();
const PORT = process.env.PORT || 5000;

//  Initialize socket.io server
export const io = new Server(server, {
    cors: {
        origin : "*"
    }
})

// Store online users
export const userSocketMap = { }  // {userId : socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected', userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Emits online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
})



// Connect to Database
await connectDB();

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use('/api/v1', (req, res) => {
    res.send("Server is live");
})
//Route setup
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter);

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
