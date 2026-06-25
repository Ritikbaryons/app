import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Truck, FileText, Key, LogOut, ChevronRight, CheckCircle } from 'lucide-react-native';

import { COLORS, SIZES } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    driverId: 'DRV-8492',
    phone: '+91 9876543210',
    vehicleNumber: 'KA-01-HK-9999',
    vehicleModel: 'Maruti Suzuki Dzire',
    licenseNumber: 'KA01 20110004455',
    licenseExpiry: '15-Aug-2028'
  });

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserInfo(prev => ({ ...prev, name: parsedUser.name, driverId: parsedUser.id }));
        }
      } catch (error) {
        console.error('Error loading user info', error);
      }
    };
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userInfo');
              // This should trigger the AppNavigator to switch back to Login
              navigation.replace('Login'); // Or use your auth context logic
            } catch (error) {
              console.error('Error during logout', error);
            }
          } 
        }
      ]
    );
  };

  const InfoItem = ({ icon: Icon, title, value }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Icon color={COLORS.primary} size={20} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <User color={COLORS.white} size={50} />
        </View>
        <Text style={styles.profileName}>{userInfo.name}</Text>
        <Text style={styles.profileId}>ID: {userInfo.driverId}</Text>
        <View style={styles.verifiedBadge}>
          <CheckCircle color={COLORS.success} size={14} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.card}>
          <InfoItem icon={User} title="Full Name" value={userInfo.name} />
          <View style={styles.divider} />
          <InfoItem icon={User} title="Driver ID" value={userInfo.driverId} />
          <View style={styles.divider} />
          <InfoItem icon={User} title="Phone Number" value={userInfo.phone} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.card}>
          <InfoItem icon={Truck} title="Vehicle Number" value={userInfo.vehicleNumber} />
          <View style={styles.divider} />
          <InfoItem icon={Truck} title="Vehicle Model" value={userInfo.vehicleModel} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>License Information</Text>
        <View style={styles.card}>
          <InfoItem icon={FileText} title="License Number" value={userInfo.licenseNumber} />
          <View style={styles.divider} />
          <InfoItem icon={FileText} title="Expiry Date" value={userInfo.licenseExpiry} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Key color={COLORS.darkGray} size={20} />
              <Text style={styles.settingsItemText}>Change Password</Text>
            </View>
            <ChevronRight color={COLORS.gray} size={20} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.settingsItem} onPress={handleLogout}>
            <View style={styles.settingsItemLeft}>
              <LogOut color={COLORS.danger} size={20} />
              <Text style={[styles.settingsItemText, { color: COLORS.danger }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footerSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding * 2,
    alignItems: 'center',
    borderBottomLeftRadius: SIZES.base * 4,
    borderBottomRightRadius: SIZES.base * 4,
    marginBottom: SIZES.padding,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  profileId: {
    fontSize: SIZES.medium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SIZES.base,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    marginLeft: 4,
    color: COLORS.success,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.small,
    marginLeft: SIZES.base,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base * 2,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.small,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.base,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    marginLeft: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  footerSpacer: {
    height: 40,
  }
});

export default ProfileScreen;
