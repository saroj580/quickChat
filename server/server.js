import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';

//importing the file
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.route.js';

// Create express app and HTTP server
const app = express();
const PORT = process.env.PORT || 5000;

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


const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
