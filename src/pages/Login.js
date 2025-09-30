import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authApi";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const response = await login(formData);
            dispatch(loginSuccess(response.data));
            navigate("/");
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || "Login failed"));
        }
    };

    return (
        <div className="auth-container">
            <div  className="auth-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />  
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>   
                </form>
            </div>
        </div>
    );
};

export default Login;
