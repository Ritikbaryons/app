import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Truck, FileText, Key, LogOut, ChevronRight, CheckCircle, Edit2, X, Save } from 'lucide-react-native';

import { COLORS, SIZES } from '../constants/theme';
import { driverService } from '../services/driverService';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  
  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await driverService.getProfile();
      setUserInfo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile', error);
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      phone: userInfo.phone
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await driverService.updateProfile(editForm);
      
      // Update local state for immediate feedback
      setUserInfo({
        ...userInfo,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone
      });
      
      setSaving(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error('Error saving profile', error);
      setSaving(false);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

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
              navigation.replace('Login');
            } catch (error) {}
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

  if (loading || !userInfo) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <User color={COLORS.white} size={50} />
          </View>
          <Text style={styles.profileName}>{userInfo.firstName} {userInfo.lastName}</Text>
          <Text style={styles.profileId}>ID: DRV-{userInfo.id}</Text>
          <View style={styles.verifiedBadge}>
            <CheckCircle color={COLORS.success} size={14} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity onPress={handleEditClick} style={styles.editBtn}>
              <Edit2 color={COLORS.primary} size={16} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <InfoItem icon={User} title="Full Name" value={`${userInfo.firstName} ${userInfo.lastName}`} />
            <View style={styles.divider} />
            <InfoItem icon={FileText} title="Email Address" value={userInfo.email} />
            <View style={styles.divider} />
            <InfoItem icon={User} title="Phone Number" value={userInfo.phone} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Assigned</Text>
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
            <InfoItem icon={FileText} title="Expiry Date" value={new Date(userInfo.licenseExpiry).toLocaleDateString()} />
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

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <X color={COLORS.darkGray} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput 
                style={styles.input} 
                value={editForm.firstName}
                onChangeText={(t) => setEditForm({...editForm, firstName: t})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={styles.input} 
                value={editForm.lastName}
                onChangeText={(t) => setEditForm({...editForm, lastName: t})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={editForm.phone}
                keyboardType="phone-pad"
                onChangeText={(t) => setEditForm({...editForm, phone: t})}
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, saving && {opacity: 0.7}]} 
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color={COLORS.white} /> : (
                <>
                  <Save color={COLORS.white} size={20} style={{marginRight: 8}}/>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingVertical: SIZES.padding * 2, alignItems: 'center', borderBottomLeftRadius: SIZES.base * 4, borderBottomRightRadius: SIZES.base * 4, marginBottom: SIZES.padding },
  profileImageContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.base, borderWidth: 2, borderColor: COLORS.white },
  profileName: { fontSize: SIZES.extraLarge, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 },
  profileId: { fontSize: SIZES.medium, color: 'rgba(255,255,255,0.8)', marginBottom: SIZES.base },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: SIZES.small, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { marginLeft: 4, color: COLORS.success, fontSize: SIZES.small, fontWeight: 'bold' },
  section: { paddingHorizontal: SIZES.padding, marginBottom: SIZES.padding },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.small, paddingHorizontal: SIZES.base },
  sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.black },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  editBtnText: { marginLeft: 4, color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.base * 2, padding: SIZES.padding, shadowColor: COLORS.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  infoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.base },
  infoIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginRight: SIZES.small },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: SIZES.small, color: COLORS.gray, marginBottom: 2 },
  infoValue: { fontSize: SIZES.medium, fontWeight: '500', color: COLORS.black },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: SIZES.base },
  settingsItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SIZES.base },
  settingsItemLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsItemText: { marginLeft: SIZES.small, fontSize: SIZES.medium, color: COLORS.black, fontWeight: '500' },
  footerSpacer: { height: 40 },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: SIZES.padding * 2, minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.black },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: COLORS.darkGray, marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  saveButton: { backgroundColor: COLORS.primary, flexDirection: 'row', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;
