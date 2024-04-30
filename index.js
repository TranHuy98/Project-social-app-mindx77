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

mongoose.connect(database_url);

const app = express();

app.use(cors());

app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/comments', commentRouter);


app.get('', (req, res) => {
    res.send('Hello world!');
});

app.listen(port || 10000, '0.0.0.0', () => {
    console.log('Server is running on port ' + port);
});