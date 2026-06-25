import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Clock, CalendarCheck } from 'lucide-react-native';

import AttendanceCard from '../components/AttendanceCard';
import { COLORS, SIZES } from '../constants/theme';

const dummyAttendance = [
  { id: '1', date: '15 Oct 2023', status: 'Present', checkIn: '08:00 AM', checkOut: '06:00 PM', workingHours: '10h 0m' },
  { id: '2', date: '14 Oct 2023', status: 'Present', checkIn: '08:15 AM', checkOut: '05:45 PM', workingHours: '9h 30m' },
  { id: '3', date: '13 Oct 2023', status: 'Absent' },
  { id: '4', date: '12 Oct 2023', status: 'Present', checkIn: '08:00 AM', checkOut: '06:30 PM', workingHours: '10h 30m' },
  { id: '5', date: '11 Oct 2023', status: 'Present', checkIn: '07:50 AM', checkOut: '06:00 PM', workingHours: '10h 10m' },
];

const AttendanceScreen = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckInTime, setCurrentCheckInTime] = useState(null);

  const handleCheckInOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCurrentCheckInTime(timeString);
      Alert.alert('Checked In Successfully', `Time: ${timeString}`);
    } else {
      setIsCheckedIn(false);
      setCurrentCheckInTime(null);
      Alert.alert('Checked Out Successfully', `Time: ${timeString}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>Today's Attendance</Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, isCheckedIn ? styles.btnDanger : styles.btnSuccess]} 
            onPress={handleCheckInOut}
          >
            <Clock color={COLORS.white} size={24} style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>
              {isCheckedIn ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>
        </View>

        {isCheckedIn && currentCheckInTime && (
          <View style={styles.checkedInInfo}>
            <Text style={styles.checkedInText}>Checked in since {currentCheckInTime}</Text>
          </View>
        )}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryValue}>22</Text>
          <Text style={styles.summaryLabel}>Present Days</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: COLORS.danger }]}>2</Text>
          <Text style={styles.summaryLabel}>Absent Days</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: COLORS.warning }]}>185</Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {dummyAttendance.map((item) => (
          <AttendanceCard 
            key={item.id}
            date={item.date}
            status={item.status}
            checkIn={item.checkIn}
            checkOut={item.checkOut}
            workingHours={item.workingHours}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderBottomLeftRadius: SIZES.base * 3,
    borderBottomRightRadius: SIZES.base * 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: SIZES.padding,
  },
  todayHeader: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  todayTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  dateText: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  actionContainer: {
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.base * 3,
    width: '80%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  checkedInInfo: {
    marginTop: SIZES.padding,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: SIZES.small,
    borderRadius: SIZES.base,
  },
  checkedInText: {
    color: COLORS.darkGray,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  summaryBox: {
    backgroundColor: COLORS.white,
    flex: 1,
    marginHorizontal: SIZES.base / 2,
    padding: SIZES.padding,
    borderRadius: SIZES.base * 2,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryValue: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  summaryLabel: {
    fontSize: SIZES.small,
    color: COLORS.darkGray,
    marginTop: SIZES.base / 2,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.padding,
  }
});

export default AttendanceScreen;
