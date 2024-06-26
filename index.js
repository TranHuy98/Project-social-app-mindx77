import express from 'express';
import postRouter from './routes/postRoute.js';
import userRouter from './routes/userRoute.js';
import commentRouter from './routes/commentRoute.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from'cors';

dotenv.config();

const database_url = process.env.DATABASE_URL;
const port = process.env.PORT;

console.log(port);
mongoose.connect(database_url);

const app = express();

app.use(express.json());
app.use(cors());

app.use('/posts/commentsOnPost', commentRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);



app.get('', (req, res) => {
    res.send('Project Social');
});

const server = app.listen(port || 8080, '0.0.0.0', () => {
    console.log('Server is running on port ' + port);
});


server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;