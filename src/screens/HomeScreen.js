import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Play, Square, MapPin, CalendarCheck, DollarSign, Activity } from 'lucide-react-native';

import DriverCard from '../components/DriverCard';
import { COLORS, SIZES } from '../constants/theme';
import { driverService } from '../services/driverService';

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [driverData, setDriverData] = useState(null);
  
  // Modal states for Start Trip
  const [selectedRide, setSelectedRide] = useState(null);
  const [odometer, setOdometer] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await driverService.getHomeData();
      setDriverData(response.data);
    } catch (error) {
      console.error("Error fetching home data", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const toggleDutyStatus = () => {
    // Need an API for this later, for now just update locally
    if (driverData) {
      setDriverData({
        ...driverData,
        status: driverData.status === 'On Duty' ? 'Off Duty' : 'On Duty'
      });
    }
  };

  const handleStartTrip = async () => {
    if (!odometer) {
      Alert.alert("Error", "Please enter starting odometer reading.");
      return;
    }
    
    try {
      setStarting(true);
      await driverService.startTrip(selectedRide.magicToken, parseInt(odometer, 10));
      setStarting(false);
      setSelectedRide(null);
      setOdometer('');
      Alert.alert("Success", "Trip started successfully.");
      navigation.navigate('Live');
    } catch (e) {
      setStarting(false);
      Alert.alert("Error", "Failed to start trip.");
    }
  };

  if (!driverData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      <View style={styles.padding}>
        <DriverCard 
          name={driverData.driverName}
          driverId={driverData.driverId}
          vehicleNumber={driverData.vehicleNumber}
          status={driverData.status}
        />

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Activity color={COLORS.primary} size={24} />
            <Text style={styles.statValue}>{driverData.todayTrips}</Text>
            <Text style={styles.statLabel}>Today's Trips</Text>
          </View>
          <View style={styles.statBox}>
            <DollarSign color={COLORS.success} size={24} />
            <Text style={styles.statValue}>₹{driverData.todayEarnings}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionButton, driverData.status === 'On Duty' ? styles.btnDanger : styles.btnSuccess]} 
            onPress={toggleDutyStatus}
          >
            {driverData.status === 'On Duty' ? (
              <Square color={COLORS.white} size={24} />
            ) : (
              <Play color={COLORS.white} size={24} />
            )}
            <Text style={styles.actionText}>
              {driverData.status === 'On Duty' ? 'End Duty' : 'Start Duty'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.btnPrimary]}
            onPress={() => navigation.navigate('Live')}
          >
            <MapPin color={COLORS.white} size={24} />
            <Text style={styles.actionText}>Go Live</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.btnSecondary]}
            onPress={() => navigation.navigate('Attendance')}
          >
            <CalendarCheck color={COLORS.white} size={24} />
            <Text style={styles.actionText}>Attendance</Text>
          </TouchableOpacity>
        </View>
        
        {/* Upcoming Rides Section */}
        <Text style={[styles.sectionTitle, { marginTop: SIZES.padding }]}>Upcoming Rides</Text>
        {driverData.upcomingRides && driverData.upcomingRides.length > 0 ? (
          driverData.upcomingRides.map((ride, index) => (
            <View key={index} style={styles.upcomingRideCard}>
              <View style={styles.upcomingRideHeader}>
                <View style={styles.badgeAssigned}>
                  <Text style={styles.badgeText}>Assigned</Text>
                </View>
                <Text style={styles.timeText}>{new Date(ride.scheduledStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </View>
              
              <Text style={styles.customerName}>{ride.customerName}</Text>
              
              <View style={styles.addressRow}>
                <MapPin color={COLORS.primary} size={16} />
                <Text style={styles.addressText}>{ride.pickup}</Text>
              </View>
              
              <View style={styles.addressRow}>
                <MapPin color={COLORS.danger} size={16} />
                <Text style={styles.addressText}>{ride.drop}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => setSelectedRide(ride)}
              >
                <Text style={styles.manageBtnText}>Manage Ride</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: COLORS.gray, marginVertical: SIZES.padding }}>No upcoming rides assigned.</Text>
        )}
      </View>

      {/* Start Trip Modal */}
      {selectedRide && (
        <Modal transparent animationType="slide" visible={!!selectedRide}>
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Start Trip</Text>
              <Text style={styles.modalSub}>Customer: {selectedRide.customerName}</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Starting Odometer</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter Odometer (e.g. 15000)"
                  value={odometer}
                  onChangeText={setOdometer}
                />
              </View>
              
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setSelectedRide(null)}>
                  <Text style={{ color: COLORS.darkGray, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalConfirm, starting && { opacity: 0.7 }]} 
                  onPress={handleStartTrip}
                  disabled={starting}
                >
                  <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                    {starting ? 'Starting...' : 'Start Trip'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  padding: {
    padding: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.padding,
  },
  statBox: {
    backgroundColor: COLORS.white,
    flex: 1,
    marginHorizontal: SIZES.base / 2,
    padding: SIZES.padding,
    borderRadius: SIZES.base * 2,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: SIZES.base,
  },
  statLabel: {
    fontSize: SIZES.font,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: SIZES.padding,
    borderRadius: SIZES.base * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
  },
  btnSecondary: {
    backgroundColor: COLORS.warning,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginTop: SIZES.base,
    fontSize: SIZES.medium,
  },
  upcomingRideCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base * 2,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  upcomingRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  badgeAssigned: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: SIZES.small,
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    marginLeft: 6,
    flex: 1,
  },
  manageBtn: {
    marginTop: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.base * 2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  manageBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: COLORS.white, borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSub: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: COLORS.darkGray, marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  modalActionRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 },
  modalCancel: { padding: 15, flex: 1, alignItems: 'center' },
  modalConfirm: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, flex: 1, alignItems: 'center' },
});

export default HomeScreen;
