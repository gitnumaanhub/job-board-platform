import React from "react";
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    if (!job) return null;

    return (
        <div className="job-card">
            <div className="job-header">
                <h3>{job.title || 'Untitled Job'}</h3>
                <span className="job-type">{job.type || 'Unknown'}</span>
            </div>
            <div className="company-info">
                <strong>{job.company.profile?.company || job.company.name || 'Unknown Company'}</strong>
                <span>{job.location || 'Location not specified'}</span>
            </div>
            <p className="job-description">
                {job.description ? `${job.description.substring(0, 150)}...` : 'No description available.'}
            </p>
            <div className="job-footer">
                <div className="skills">
                    {job.requirements && job.requirements.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-badge">{skill}</span>
                    ))}
        </div>
                <Link to={`/jobs/${job._id}`} className="view-job-btn">View Job</Link>
            </div>
        </div>
    );
};

export default JobCard;