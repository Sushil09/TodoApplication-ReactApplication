"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const todo_1 = __importDefault(require("./routes/todo"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};
app.use((0, cors_1.default)(corsOptions));
//Common path for admin & user routes
app.use("/auth", auth_1.default);
app.use("/todo", todo_1.default);
mongoose_1.default.connect('mongodb+srv://sushilofficial:Hakuna%40123@cluster0.u91nm26.mongodb.net/todos');
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
