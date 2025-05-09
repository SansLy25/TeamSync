import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default apiClient;