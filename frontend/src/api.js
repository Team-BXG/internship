import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token endpoint
        const res = await axios.post('http://localhost:8000/api/auth/refresh', {
          refresh_token: refreshToken
        });

        if (res.status === 200) {
          const { access_token } = res.data;
          
          // Save the new access token
          localStorage.setItem('access_token', access_token);
          
          // Update the authorization header for the original request
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          
          // Retry the original request with the new token
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is expired or invalid. Force logout.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
