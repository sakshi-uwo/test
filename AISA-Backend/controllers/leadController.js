import Lead from '../models/Lead.js';
import logger from '../utils/logger.js';
import { getIO } from '../utils/socket.js';


// @desc    Create a new lead
// @route   POST /api/leads
export const createLead = async (req, res) => {
    try {
        const lead = await Lead.create(req.body);

        const io = getIO();

        // Emit lead-added event
        io.emit('lead-added', lead);

        // Fetch new stats for dashboard-update
        const totalLeads = await Lead.countDocuments();
        const hotLeads = await Lead.countDocuments({ status: 'Hot' });
        const warmLeads = await Lead.countDocuments({ status: 'Warm' });
        const coldLeads = await Lead.countDocuments({ status: 'Cold' });

        const stats = {
            totalLeads,
            distribution: { Hot: hotLeads, Warm: warmLeads, Cold: coldLeads },
            activeProjects: 12,
            siteVisits: 48,
            projectedRevenue: '$4.2M'
        };

        // Emit dashboard-update
        io.emit('dashboard-update', stats);

        // Emit notification-push
        io.emit('notification-push', {
            title: "🔥 New High-Score Lead",
            message: `${lead.name} just inquired about ${lead.projectInterest}.`,
            type: lead.status
        });

        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        logger.error(`Create Lead Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to create lead' });
    }
};


// @desc    Get all leads
// @route   GET /api/leads
export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: leads });
    } catch (error) {
        logger.error(`Get Leads Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch leads' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const hotLeads = await Lead.countDocuments({ status: 'Hot' });
        const warmLeads = await Lead.countDocuments({ status: 'Warm' });
        const coldLeads = await Lead.countDocuments({ status: 'Cold' });

        res.status(200).json({
            success: true,
            data: {
                totalLeads,
                distribution: {
                    Hot: hotLeads,
                    Warm: warmLeads,
                    Cold: coldLeads
                },
                activeProjects: 12, // Placeholder for now
                siteVisits: 48, // Placeholder
                projectedRevenue: '$4.2M' // Placeholder
            }
        });
    } catch (error) {
        logger.error(`Dashboard Stats Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

// @desc    Seed sample data (for dev/demo)
export const seedSampleData = async (req, res) => {
    try {
        const count = await Lead.countDocuments();
        if (count > 0) {
            return res.status(200).json({ message: 'Data already exists' });
        }

        const sampleLeads = [
            { name: 'Johnathan Smith', budget: '$450k - $600k', status: 'Hot', projectInterest: 'Skyline Towers', aiScore: 85 },
            { name: 'Elena Rodriguez', budget: '$1.2M - $1.5M', status: 'Warm', projectInterest: 'Oceanview', aiScore: 45 },
            { name: 'David Wilson', budget: '$300k - $400k', status: 'Cold', projectInterest: 'Oak Ridge', aiScore: 12 },
            { name: 'Sarah Ahmed', budget: '$800k - $1M', status: 'Hot', projectInterest: 'Green Valley', aiScore: 92 },
            { name: 'Michael Chen', budget: '$500k', status: 'Warm', projectInterest: 'Central Park', aiScore: 50 }
        ];

        await Lead.insertMany(sampleLeads);
        res.status(201).json({ success: true, message: 'Sample leads seeded' });
    } catch (error) {
        logger.error(`Seeding Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to seed sample data' });
    }
};
