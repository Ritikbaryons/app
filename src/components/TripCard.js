import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Navigation, Calendar, DollarSign } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

const TripCard = ({ pickup, drop, distance, fare, status, date }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar color={COLORS.gray} size={16} />
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status === 'Completed' ? COLORS.success : COLORS.danger }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <MapPin color={COLORS.primary} size={20} />
          <Text style={styles.locationText} numberOfLines={2}>{pickup}</Text>
        </View>
        
        <View style={styles.lineIndicator} />
        
        <View style={styles.locationRow}>
          <Navigation color={COLORS.secondary} size={20} />
          <Text style={styles.locationText} numberOfLines={2}>{drop}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Distance</Text>
          <Text style={styles.footerValue}>{distance}</Text>
        </View>
        <View style={styles.footerItemRight}>
          <Text style={styles.footerLabel}>Fare</Text>
          <View style={styles.fareContainer}>
            <Text style={styles.fareValue}>₹{fare}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: SIZES.base,
    color: COLORS.darkGray,
    fontSize: SIZES.font,
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
  locationContainer: {
    marginVertical: SIZES.base,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.black,
    flex: 1,
  },
  lineIndicator: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.lightGray,
    marginLeft: 9,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.padding,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flex: 1,
  },
  footerItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footerLabel: {
    color: COLORS.gray,
    fontSize: SIZES.small,
    marginBottom: 4,
  },
  footerValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  fareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.success,
  }
});

export default TripCard;
