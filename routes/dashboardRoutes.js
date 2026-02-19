import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Lead from '../models/Lead.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const [totalUsers, activeProjects, leads] = await Promise.all([
            User.countDocuments(),
            Project.countDocuments({ status: 'In Progress' }),
            Lead.find()
        ]);

        const distribution = {
            Hot: leads.filter(l => l.status === 'Hot').length,
            Warm: leads.filter(l => l.status === 'Warm').length,
            Cold: leads.filter(l => l.status === 'Cold').length
        };

        // Mock site visits and projected revenue based on leads for now
        // as there are no explicit models for them yet, or they are simplified
        const siteVisits = leads.filter(l => l.status === 'Warm').length; // simple assumption
        const projectedRevenue = distribution.Hot * 50000; // random multiplier for prototype

        res.json({
            totalUsers,
            activeProjects,
            totalLeads: leads.length,
            siteVisits,
            projectedRevenue: `$${(projectedRevenue / 1000).toFixed(1)}k`,
            distribution
        });
    } catch (err) {
        console.error('❌ Error fetching stats:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
