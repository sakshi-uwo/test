import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
    },
    qty: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Requested', 'In Transit', 'Arrived'],
        default: 'Requested',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
