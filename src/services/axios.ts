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
    console.log(error, 'Request error');

    const errorWithResponse = error as { response?: { data?: { error?: string } } };
    if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
      console.log('Invalid token.');
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      console.log('Before reloading');
      location.reload();
      console.log('After reloading');

    }
    // return Promise.reject(error);
    return Promise?.reject(error);
  }
);

try {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error, 'ResPonse error');

      const errorWithResponse = error as { response?: { data?: { error?: string } } };
      if (errorWithResponse?.response?.data?.error === 'Invalid token.') {
        console.log('Invalid token.');
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        console.log('Before reloading');
        location.reload();
        console.log('After reloading');

      }
      return Promise.reject(error);
    }
  );
} catch (error) {
  console.log(error, 'error');
}




