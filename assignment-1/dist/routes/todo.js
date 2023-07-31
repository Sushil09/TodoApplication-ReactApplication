"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const router = express_1.default.Router();
const zod_1 = require("zod");
const todoInput = zod_1.z.object({
    title: zod_1.z.string().min(5),
    description: zod_1.z.string().min(10)
});
router.post('/todos', middleware_1.authenticateJwt, (req, res) => {
    const parsedInput = todoInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({ msg: parsedInput.error });
    }
    let title = parsedInput.data.title;
    const description = parsedInput.data.description;
    const done = false;
    const userId = req.header('user-id');
    const newTodo = new db_1.Todo({ title, description, done, userId });
    newTodo.save()
        .then((savedTodo) => {
        res.status(201).json(savedTodo);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to create a new todo' });
    });
});
router.get('/todos', middleware_1.authenticateJwt, (req, res) => {
    const userId = req.header('user-id');
    db_1.Todo.find({ userId })
        .then((todos) => {
        res.json(todos);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});
router.patch('/todos/:todoId/done', middleware_1.authenticateJwt, (req, res) => {
    const { todoId } = req.params;
    const userId = req.header('user-id');
    db_1.Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
        .then((updatedTodo) => {
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    })
        .catch((err) => {
        res.status(500).json({ error: 'Failed to update todo' });
    });
});
exports.default = router;
