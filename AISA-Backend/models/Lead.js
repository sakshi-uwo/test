import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    budget: {
        type: String
    },
    projectInterest: {
        type: String
    },
    status: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold'],
        default: 'Warm'
    },
    aiScore: {
        type: Number,
        default: 0
    },
    lastInteraction: {
        type: Date,
        default: Date.now
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [String]
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
