import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurable API URL for future backend integration
const BASE_URL = 'https://dummy-api.example.com/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
