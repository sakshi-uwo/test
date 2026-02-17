import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['Blocker', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    location: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },
    attachments: [{
        type: String
    }]
}, { timestamps: true });

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
