import axios from 'axios';

// const BASE_URL = 'http://10.4.4.147:3000'
// const BASE_URL = import.meta.env.BASE_URL
// const BASE_URL = 'http://localhost:3000'
console.log(import.meta.env.VITE_BASE_URL,import.meta.env.VITE_GOOGLE_AUTH_PASSWORD);
export const api = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL
    // baseURL:BASE_URL
})


api.interceptors.request.use(
    (config) => {
        const Token = localStorage.getItem('user');

        if (Token) {
            config.headers['accessToken'] = Token;
        }
        
        return config;
    },
    (error) => {
        console.log(error ,'ererererereere');
        
        return Promise.reject(error);
    }
);

