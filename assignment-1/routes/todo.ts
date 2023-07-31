import express from 'express';
import {authenticateJwt} from "../middleware";
import {Todo} from "../db";
const router = express.Router();
import {z} from 'zod';

const todoInput = z.object({
    title: z.string().min(5),
    description: z.string().min(10)
})

router.post('/todos', authenticateJwt, (req, res) => {
    const parsedInput = todoInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({msg: parsedInput.error});
    }

  let title = parsedInput.data.title;
  const description = parsedInput.data.description;
  const done = false;
    const userId = req.header('user-id');

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo) => {
      res.status(201).json(savedTodo);
    })
    .catch(( err) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req, res) => {
    const userId = req.header('user-id');

  Todo.find({ userId })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
  const { todoId } = req.params;
  const userId = req.header('user-id');

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
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

export default router;