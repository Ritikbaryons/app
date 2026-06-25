import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Play, Square, MapPin, CalendarCheck, DollarSign, Activity } from 'lucide-react-native';

import DriverCard from '../components/DriverCard';
import { COLORS, SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [driverData, setDriverData] = useState({
    name: 'John Doe',
    id: 'DRV-8492',
    vehicleNumber: 'KA-01-HK-9999',
    status: 'Off Duty',
    todayTrips: 4,
    todayEarnings: 1250,
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call to refresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleDutyStatus = () => {
    setDriverData({
      ...driverData,
      status: driverData.status === 'On Duty' ? 'Off Duty' : 'On Duty'
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      <View style={styles.padding}>
        <DriverCard 
          name={driverData.name}
          driverId={driverData.id}
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
      </View>
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
});

export default HomeScreen;
