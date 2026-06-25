import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

const AttendanceCard = ({ date, checkIn, checkOut, status, workingHours }) => {
  const isPresent = status === 'Present';

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <CalendarIcon color={COLORS.primary} size={18} />
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.statusContainer}>
          {isPresent ? (
            <CheckCircle color={COLORS.success} size={16} />
          ) : (
            <XCircle color={COLORS.danger} size={16} />
          )}
          <Text style={[styles.statusText, { color: isPresent ? COLORS.success : COLORS.danger }]}>
            {status}
          </Text>
        </View>
      </View>
      
      {isPresent && (
        <>
          <View style={styles.divider} />
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Check In</Text>
              <Text style={styles.value}>{checkIn}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Check Out</Text>
              <Text style={styles.value}>{checkOut || '--:--'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Hours</Text>
              <View style={styles.hoursContainer}>
                <Clock color={COLORS.warning} size={14} />
                <Text style={styles.hoursValue}>{workingHours}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base * 1.5,
    padding: SIZES.padding,
    marginBottom: SIZES.small,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 4,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.small,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  value: {
    fontSize: SIZES.font,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursValue: {
    marginLeft: 4,
    fontSize: SIZES.font,
    color: COLORS.black,
    fontWeight: 'bold',
  }
});

export default AttendanceCard;
