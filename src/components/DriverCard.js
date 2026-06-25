import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User, Truck } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

const DriverCard = ({ name, driverId, vehicleNumber, status }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.profileIcon}>
          <User color={COLORS.white} size={24} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.id}>ID: {driverId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status === 'On Duty' ? COLORS.success : COLORS.gray }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.vehicleInfo}>
        <Truck color={COLORS.darkGray} size={20} />
        <Text style={styles.vehicleText}>Vehicle: {vehicleNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base * 2,
    padding: SIZES.padding,
    marginVertical: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  profileIcon: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: SIZES.small,
  },
  name: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  id: {
    fontSize: SIZES.font,
    color: COLORS.darkGray,
  },
  statusBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base * 2,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.small,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
});

export default DriverCard;
