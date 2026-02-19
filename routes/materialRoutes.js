import express from 'express';
import Material from '../models/Material.js';

const router = express.Router();

// @route   GET /api/materials
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find().sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        console.error('❌ Error fetching materials:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/materials
router.post('/', async (req, res) => {
    try {
        const newMaterial = new Material(req.body);
        const saved = await newMaterial.save();

        const io = req.app.get('io');
        if (io) io.emit('material-added', saved);

        res.status(201).json(saved);
    } catch (err) {
        console.error('❌ Error saving material:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
