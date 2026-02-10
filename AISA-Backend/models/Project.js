import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    totalUnits: {
        type: Number,
        required: true
    },
    availableUnits: {
        type: Number,
        required: true
    },
    pricingRange: {
        type: String // e.g., "$300k - $1.5M"
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Completed'],
        default: 'Active'
    },
    description: String,
    amenities: [String],
    images: [String]
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);

