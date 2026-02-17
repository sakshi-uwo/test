import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Mock credentials matching frontend config for demo purposes
const MOCK_USERS = {
    'admin@ai-auto.com': { password: 'admin123', name: 'Super Admin', role: 'Admin' },
    'builder@ai-auto.com': { password: 'builder123', name: 'Elite Builder', role: 'Builder' },
    'engineer@ai-auto.com': { password: 'engineer123', name: 'Lead Engineer', role: 'Civil Engineer' },
    'manager@ai-auto.com': { password: 'manager123', name: 'Site Manager', role: 'Project Site' },
    'client@ai-auto.com': { password: 'client123', name: 'Valued Client', role: 'Client' }
};

// @route   POST /api/auth/login
// @desc    Login user (Mock + DB lookup)
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log(`🔑 Login attempt: ${email} for role: ${role}`);

        // 1. Check Mock Users first
        if (MOCK_USERS[email] && MOCK_USERS[email].password === password) {
            return res.json({
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    name: MOCK_USERS[email].name,
                    email: email,
                    role: role || MOCK_USERS[email].role.toLowerCase().replace(' ', '_'),
                }
            });
        }

        // 2. Check Database Users
        const user = await User.findOne({ email });
        if (user) {
            // For now, since User model doesn't have passwords, we'll allow any password for DB users
            // In a real app, you'd use bcrypt.compare(password, user.password)
            return res.json({
                token: 'db-jwt-token-' + user._id,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role.toLowerCase().replace(' ', '_'),
                }
            });
        }

        return res.status(401).json({ error: 'Invalid email or password' });
    } catch (err) {
        console.error('❌ Login Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
