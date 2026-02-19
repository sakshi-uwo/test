import express from 'express';
import Notification from '../models/Notification.js';
import NotificationSetting from '../models/NotificationSetting.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', async (req, res) => {
    try {
        // In a real app, use req.user.id from auth middleware
        // For now, we expect userId in query for testing or manual use
        const userId = req.query.userId || req.headers['x-user-id'];

        if (!userId) return res.status(400).json({ message: 'User ID required' });

        console.log(`[GET] Fetching notifications for user: ${userId}`);

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        console.log(`[GET] Found ${notifications.length} notifications for user ${userId}`);
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { status: 'read' },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/notifications/settings
// @desc    Get user notification settings
router.get('/settings', async (req, res) => {
    try {
        const userId = req.query.userId || req.headers['x-user-id'];
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        let settings = await NotificationSetting.findOne({ user: userId });

        if (!settings) {
            // Return defaults if none exist
            settings = {
                user: userId,
                preferences: Object.keys(notificationService.EVENT_ROLE_MAP).map(type => ({
                    eventType: type,
                    inApp: true,
                    email: true,
                    whatsapp: false
                }))
            };
        }

        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/notifications/settings
// @desc    Update user notification settings
router.put('/settings', async (req, res) => {
    try {
        const userId = req.body.userId || req.headers['x-user-id'];
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const settings = await NotificationSetting.findOneAndUpdate(
            { user: userId },
            { preferences: req.body.preferences },
            { upsert: true, new: true }
        );

        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/notifications/test-trigger
// @desc    Manually trigger a notification (For testing)
router.post('/test-trigger', async (req, res) => {
    try {
        const { eventType, data } = req.body;
        await notificationService.triggerNotification(eventType, data || {});
        res.status(200).json({ message: 'Notification triggered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
