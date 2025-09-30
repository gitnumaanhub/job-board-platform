import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authApi";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'job_seeker',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error("All fields are required");
            }

            if (formData.password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            const response = await register(formData);
            dispatch(loginSuccess(response));
            navigate("/");
        }
        catch (err) {
            console.error("Registration error:", err);
            dispatch(loginFailure(err.response?.data?.message || error.message || 'Registration failed. Please try again.'));
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                {error && (
                    <div className="error-message">
                    {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
                    </div>
                    )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                        />  
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your mail"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password(min 6 characters)"
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>User Type</label>
                        <select name="userType" value={formData.userType} onChange={handleChange}>
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p style={{ marginTop: '15px', textAlign: 'center' }}>
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;