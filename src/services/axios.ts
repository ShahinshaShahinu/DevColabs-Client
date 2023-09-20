import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env?.VITE_BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const Token = localStorage?.getItem('user');
        const adminToken = localStorage.getItem('admin');
        if (Token) {
            config.headers['accessToken'] = Token;
        }
        if(adminToken) config.headers['adminaccessToken']=adminToken
        
        return config;
    },
    (error) => {
        return Promise?.reject(error);
    }
);

