import apiClient from './api';

export const driverService = {
  // Auth
  login: (email, password) => apiClient.post('auth/login', { email, password }),
  
  // Home Dashboard
  getHomeData: () => apiClient.get('DriverApp/home'),
  
  // Live / Active Rides
  getLiveRides: () => apiClient.get('DriverApp/live'),
  
  // Trip Actions (Using DriverPortal API for web compatibility)
  startTrip: (token, odometer) => apiClient.post(`DriverPortal/${token}/start`, { odometer }),
  endTrip: (token, odometer) => apiClient.post(`DriverPortal/${token}/complete`, { odometer }),
  
  // Location Tracking
  updateLocation: (lat, lng) => apiClient.post('DriverApp/location', { lat, lng }),
  
  // History
  getHistory: () => apiClient.get('DriverApp/history'),
  
  // Attendance
  punchAttendance: () => apiClient.post('DriverApp/attendance/punch'),
  getAttendanceHistory: () => apiClient.get('DriverApp/attendance/history'),
  
  // Profile
  getProfile: () => apiClient.get('DriverApp/profile'),
  updateProfile: (profileData) => apiClient.put('DriverApp/profile', profileData),
};
