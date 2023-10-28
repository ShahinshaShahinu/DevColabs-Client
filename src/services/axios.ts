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
        if (adminToken) config.headers['adminaccessToken'] = adminToken

        return config;
    },
    (error) => {

        return Promise?.reject(error);
    }
);

try {
    api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error, 'sha er shahsina');
      const errorWithResponse = error as { response?: { data?: { error?: string } } };
      if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
         
        // window.location.href = '/login';
        
      }
      return Promise.reject(error);
    }
  );
} catch (error) {
    console.log(error ,'eroro ');
       
}




