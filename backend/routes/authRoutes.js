import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const ROLE_MAP = {
    'Admin': 'admin',
    'Builder': 'builder',
    'Civil Engineer': 'civil_engineer',
    'Site Manager': 'project_site',
    'Client': 'client'
};

// @route   POST /api/auth/login
// @desc    Login user (DB lookup with role verification)
router.post('/login', async (req, res) => {
    try {
        const { email, password, role: requestedRole } = req.body;

        console.log(`🔑 Login attempt: ${email} for role: ${requestedRole}`);

        // 1. Check Database Users
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 2. Verify Password
        // Note: For existing mock users without passwords, this might fail unless we seed them
        // For new users, it will use bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Fallback for hardcoded mock passwords if they haven't been hashed (development only)
            const MOCK_PASSWORDS = {
                'admin@ai-auto.com': 'admin123',
                'builder@ai-auto.com': 'builder123',
                'engineer@ai-auto.com': 'engineer123',
                'manager@ai-auto.com': 'manager123',
                'client@ai-auto.com': 'client123'
            };
            if (MOCK_PASSWORDS[email] !== password) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
        }

        // 3. Verify Status (Admin Approval Rule)
        if (user.status === 'Pending' && user.role !== 'Admin') {
            return res.status(403).json({ error: 'Your account is pending admin approval.' });
        }
        if (user.status === 'Inactive') {
            return res.status(403).json({ error: 'Your account has been deactivated.' });
        }

        // 4. Verify Role Matching (Prevent user from logging into wrong dashboard)
        const mappedRole = ROLE_MAP[user.role] || user.role.toLowerCase();

        // If requestedRole is provided, verify it matches the user's assigned role
        if (requestedRole && requestedRole !== mappedRole) {
            return res.status(403).json({ error: `Access denied. Your account is registered as ${user.role}.` });
        }

        return res.json({
            token: 'jwt-token-' + user._id + '-' + Date.now(),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: mappedRole,
                status: user.status
            }
        });

    } catch (err) {
        console.error('❌ Login Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
