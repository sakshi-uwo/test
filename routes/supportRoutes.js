import express from 'express';

const router = express.Router();

// @route   POST /api/support
// @desc    Submit a support ticket
router.post('/', async (req, res) => {
    try {
        const { email, issueType, message, userId } = req.body;
        console.log(`📩 Support Ticket Received: [${issueType}] from ${email}`);
        console.log(`📝 Message: ${message}`);

        // In a real app, you'd save this to a Support model or send an email
        res.status(201).json({ message: 'Ticket received successfully' });
    } catch (err) {
        console.error('❌ Error handling support ticket:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
