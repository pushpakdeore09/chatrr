import express from 'express';
import 'dotenv/config';
import {connect} from './db/db.js'
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import messageRoutes from './routes/message.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

connect();

const PORT = process.env.PORT || 3000;

app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
})