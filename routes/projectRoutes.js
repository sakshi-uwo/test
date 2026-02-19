import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('assignedTo', 'name email role');
        res.json(projects);
    } catch (err) {
        console.error('❌ Error fetching projects:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects
// @desc    Create a new project and emit socket event
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedTo, status, totalUnits, soldUnits, budget, spent, progress } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide project title' });
        }

        const newProject = new Project({
            title,
            description,
            assignedTo,
            status: status || 'In Progress',
            totalUnits: totalUnits || 0,
            soldUnits: soldUnits || 0,
            budget: budget || '$0',
            spent: spent || '$0',
            progress: progress || 0
        });

        const savedProject = await newProject.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('newProject', savedProject);
            console.log('📢 Real-time event emitted: newProject', savedProject._id);
        }

        res.status(201).json(savedProject);
    } catch (err) {
        console.error('❌ Error saving project:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
