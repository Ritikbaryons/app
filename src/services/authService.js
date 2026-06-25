import apiClient from './api';

export const login = async (email, password) => {
  try {
    // Dummy API simulation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'driver@gmail.com' && password === 'Qwerty@123') {
          resolve({
            data: {
              token: 'dummy-jwt-token-12345',
              user: {
                id: 'DRV-8492',
                email: email,
                name: 'John Doe',
                role: 'driver'
              }
            }
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });

    // For real integration, use:
    // const response = await apiClient.post('/auth/login', { email, password });
    // return response;
  } catch (error) {
    throw error;
  }
};
