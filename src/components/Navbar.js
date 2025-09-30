import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <nav className="navbar">
            <div className="container">
                <Link to='/' className="navbar-brand">
                JobBoard
                </Link>
                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <div className="navbar-items">
                            <span> Welcome, {user?.name}</span>
                            <Link to='/jobs' className="navbar-item">Jobs</Link>
                            <button onClick={handleLogout} className='logout-btn'>Logout</button>
                        </div>
                    ) : (
                        <div className='navbar-items'>
                            <Link to="/jobs" className="navbar-item">BrowseJobs</Link>
                            <Link to='/login' className="navbar-item">Login</Link>
                            <Link to='/register' className="navbar-item">Register</Link>
                        </div>
                    )}  
                </div>
            </div>
        </nav>
    );
};
export default Navbar;