const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

//get all jobs (with filters)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, type, category } = req.query;

        let query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (location) query.location = { $regex: location, $options: 'i' };
        if (type) query.type = type;
        if (category) query.category = { $regex: category, $options: 'i' };

        const jobs = await Job.find(query)
        .populate('company', 'name profile.company profile.website')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

        const total = await Job.countDocuments(query);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

//get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        .populate('company', 'name profile.company profile.website')
        .populate('applications.user', 'name email profile.title');


if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);  
} catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});
//create a job (employer only)
router.post('/', auth, async (req, res) => {
    try {
    if (req.user.userType !== 'employer') {
        return res.status(403).json({ message: 'Access denied' });
    }
    const job = new Job({
        ...req.body,
        company: req.user._id
    });
    
    await job.save();
    await job.populate('company', 'name profile.company');

    res.status(201).json(job);
} catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
}   
});

//update a job (employer only)
router.put('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('company', 'name profile.company');

        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }   
});

//apply to a job (job seeker only)
router.post('/:id/apply', auth, async (req, res) => {
    try {
        if (req.user.userType !== 'job_seeker') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const alreadyApplied = job.applications.some(
            app => app.user.toString() === req.user._id.toString());
        if (alreadyApplied) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }
        job.applications.push({
            user: req.user._id,
            resume: req.body.resume,
            coverLetter: req.body.coverLetter,
        });
        await job.save();
        res.json({ message: 'Application submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;