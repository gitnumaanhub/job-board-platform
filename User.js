const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    userType: {
        type: String,
        require: [true, 'Please specify user type'],
        enum: {
            values: ['employer', 'job_seeker'],
            message: 'User type must be either employer or job_seeker'
        }
    },
    profile: {
        title: String,
        skills: [String],
        experience: String,
        education: String,
        resume: String, // URL to resume
        company: String,
        website: String,
        description: String,
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (err) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);