import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// @route   GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error('❌ Error fetching tasks:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/tasks
router.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const saved = await newTask.save();

        const io = req.app.get('io');
        if (io) io.emit('task-added', saved);

        res.status(201).json(saved);
    } catch (err) {
        console.error('❌ Error saving task:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
