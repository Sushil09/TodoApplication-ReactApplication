// const express = require('express');
import express from 'express';
import authRouter from './routes/auth';
import todosRouter from './routes/todo';
import mongoose from 'mongoose'
import cors from 'cors'


const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*', // Allow requests from a all origin
    methods: ['GET', 'POST', 'PATCH','DELETE'], // Allow only specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));

//Common path for admin & user routes
app.use("/auth",authRouter);
app.use("/todo",todosRouter);

mongoose.connect('mongodb+srv://sushilofficial:*****@cluster0.u91nm26.mongodb.net/todos');

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
