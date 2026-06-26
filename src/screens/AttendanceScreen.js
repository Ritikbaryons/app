import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Clock, CalendarCheck } from 'lucide-react-native';

import AttendanceCard from '../components/AttendanceCard';
import { COLORS, SIZES } from '../constants/theme';
import { driverService } from '../services/driverService';

// Removed dummyAttendance array

const AttendanceScreen = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentCheckInTime, setCurrentCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ presentDays: 0, absentDays: 0, totalHours: 0 });
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const homeRes = await driverService.getHomeData();
      setIsCheckedIn(homeRes.data.isCheckedIn && !homeRes.data.isCheckedOut);
      if (homeRes.data.isCheckedIn) {
        setCurrentCheckInTime(homeRes.data.isCheckedOut ? "Checked out for today" : "Active Session");
      }

      const historyRes = await driverService.getAttendanceHistory();
      setSummary({
        presentDays: historyRes.data.presentDays,
        absentDays: historyRes.data.absentDays,
        totalHours: historyRes.data.totalHours
      });
      setHistory(historyRes.data.records);
    } catch (e) {
      console.log('Error fetching attendance status', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInOut = async () => {
    try {
      const response = await driverService.punchAttendance();
      if (response.data.message.includes('Punched In')) {
        setIsCheckedIn(true);
        setCurrentCheckInTime(response.data.time);
        Alert.alert('Success', 'Checked in successfully.');
        fetchStatus(); // Refresh history
      } else if (response.data.message.includes('Punched Out')) {
        setIsCheckedIn(false);
        setCurrentCheckInTime(null);
        Alert.alert('Success', 'Checked out successfully.');
        fetchStatus(); // Refresh history
      } else {
        Alert.alert('Info', response.data.message);
      }
    } catch (e) {
      Alert.alert('Error', e.response?.data || 'Failed to punch attendance');
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
          <Text style={styles.summaryValue}>{summary.presentDays}</Text>
          <Text style={styles.summaryLabel}>Present Days</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{summary.absentDays}</Text>
          <Text style={styles.summaryLabel}>Absent Days</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={[styles.summaryValue, { color: COLORS.warning }]}>{summary.totalHours}</Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Recent Attendance</Text>
        {history.length > 0 ? (
          history.map((item) => (
            <AttendanceCard 
              key={item.id.toString()}
              date={new Date(item.date).toDateString()}
              status={item.status}
              checkIn={item.checkInTime || '-'}
              checkOut={item.checkOutTime || '-'}
              workingHours={item.workingHours}
            />
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: COLORS.gray, marginTop: 10 }}>No recent attendance records found.</Text>
        )}
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
