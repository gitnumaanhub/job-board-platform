import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../store/slices/jobSlice";


const JobList = () => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector((state) => state.jobs);

    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        dispatch(fetchJobs({}));
    }, [dispatch]);

    const handleSearch = () => 
        dispatch(fetchJobs({
            search,
            location,
            type
        }));

        const handleResetFilters = () => {
            setSearch('');
            setLocation('');
            setType('');
            dispatch(fetchJobs());
        };


    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="job-list">
            <h1> Available Jobs</h1>

            {/* Filter Section */}
            <div className="filters">
                <input
                    type="text"
                    name="search"
                    placeholder="Search jobs by title or description"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                />
                <select name={type} onChange={(e)=>setType(e.target.value)}>
                    <option value="">All Job Types</option>
                    <option value="full-time">Full-Time</option>
                    <option value="part-time">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                </select>
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleResetFilters}>Reset</button>
            </div>
                

            <div className="job-grid">
                {jobs && jobs.length > 0 ? (
                jobs.map(job => (
                    <div key={job._id} className="job-card">
                        <h3>{job.title}</h3>
                            <p><strong>Type:</strong> {job.jobType}</p>
                            <p><strong>Company:</strong></p>
                            <p><strong>Location</strong></p>
                            </div>
                ))) : (
                    <div className="no-jobs">
                        No jobs available at the moment.
                    </div>
                )}
            </div>  
        </div>
        );
    };

export default JobList;



