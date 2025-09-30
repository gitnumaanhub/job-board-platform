const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    requirements: [String],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'contract'], required: true },
    category: { type: String, required: true },
    salary: {
        min: Number, 
        max: Number,
        currency: { type: String, default: 'USD' },
    },
    applicationDeadline: Date,
    applications: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['pending, reviewed, accepted, rejected'],
            default: 'pending',
        },
        resume: String,
        coverLetter: String,
    }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
        