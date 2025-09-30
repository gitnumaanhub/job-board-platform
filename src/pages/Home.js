import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    return (
        <div className="home">
            <div className="container">
                <h1>Welcome to JobBoard</h1>
                <p>Find your dream job or the perfect candidate</p>
                {isAuthenticated ? (
                    <div>
                    <h2>Hello, {user.name}!</h2>
                    <p> You are logged in as a {user.userType} </p>
                    </div>
                ) : (
                    <div>
                        <p>Please login or register to continue</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;