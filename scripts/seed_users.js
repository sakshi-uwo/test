import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const MOCK_USERS = [
    { name: 'System Admin', email: 'admin@ai-auto.com', password: 'admin123', role: 'Admin', status: 'Active' },
    { name: 'Project Builder', email: 'builder@ai-auto.com', password: 'builder123', role: 'Builder', status: 'Active' },
    { name: 'Civil Engineer', email: 'engineer@ai-auto.com', password: 'engineer123', role: 'Civil Engineer', status: 'Active' },
    { name: 'Site Manager', email: 'manager@ai-auto.com', password: 'manager123', role: 'Site Manager', status: 'Active' },
    { name: 'Premium Client', email: 'client@ai-auto.com', password: 'client123', role: 'Client', status: 'Active' }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        console.log('📡 Connected to MongoDB for seeding...');

        for (const userData of MOCK_USERS) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                const user = new User({
                    ...userData,
                    password: hashedPassword
                });
                await user.save();
                console.log(`✅ Seeded user: ${userData.email}`);
            } else {
                console.log(`ℹ️ User already exists: ${userData.email}`);
            }
        }

        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedUsers();
