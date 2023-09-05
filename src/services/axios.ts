import axios from 'axios';

// const BASE_URL = 'http://192.168.43.228:3000'
// const BASE_URL = import.meta.env.BASE_URL
// const BASE_URL = 'http://localhost:3000'
// baseURL: 'http://localhost:3000'
// baseURL: import.meta.env?.VITE_BASE_URL

export const api = axios.create({
    baseURL: import.meta.env?.VITE_BASE_URL

})

api.interceptors.request.use(
    (config) => {
        const Token = localStorage?.getItem('user');

        if (Token) {
            config.headers['accessToken'] = Token;
        }
        
        return config;
    },
    (error) => {
        return Promise?.reject(error);
    }
);

