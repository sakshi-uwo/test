import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URI);
        console.log('📡 Connected to MongoDB...');
        const users = await User.find({}, 'name email role status');
        console.log('Current Users:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error fetching users:', err);
        process.exit(1);
    }
};

checkUsers();
