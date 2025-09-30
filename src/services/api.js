import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://your-backend-app.onrender.com/api'
 : 'http://localhost:5000/';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);

//handle response errors globally
api.interceptors.response.use(response => response,
error => {
    if (error.response?.status === 401) {
        //logout user if 401 response returned from api
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
}
);

export default api;