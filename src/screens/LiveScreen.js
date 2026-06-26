import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { MapPin, Navigation, Phone, MessageCircle, Navigation2, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { driverService } from '../services/driverService';

const LiveScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [tripState, setTripState] = useState('STARTED'); // STARTED, COMPLETED
  const [mapRegion, setMapRegion] = useState(null);
  
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // End Trip Modal
  const [showEndModal, setShowEndModal] = useState(false);
  const [endOdometer, setEndOdometer] = useState('');
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    fetchActiveRide();
  }, []);

  const fetchActiveRide = async () => {
    try {
      const response = await driverService.getLiveRides();
      if (response.data && response.data.length > 0) {
        const ride = response.data[0];
        setTripDetails({
          bookingId: ride.bookingId,
          magicToken: ride.magicToken,
          customerName: ride.customerName,
          phone: ride.phone,
          pickup: { 
            lat: parseFloat(ride.pickupLat) || 28.6139, 
            lng: parseFloat(ride.pickupLng) || 77.2090, 
            address: ride.pickupAddress 
          },
          drop: { 
            lat: parseFloat(ride.dropLat) || 28.5355, 
            lng: parseFloat(ride.dropLng) || 77.2410, 
            address: ride.dropAddress 
          },
          amount: `₹${ride.fare || 0}`, // Fallback amount if missing
          status: ride.assignmentStatus
        });
        setTripState('STARTED');
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Center map
        setMapRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (e) {
      console.log('Error fetching live ride', e);
    } finally {
      setLoading(false);
    }
  };

  // Live Location Sync Effect
  useEffect(() => {
    let locationInterval;
    if (tripState === 'STARTED') {
      locationInterval = setInterval(async () => {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Sync with API using the new service
        try {
           // Uncomment in real usage:
           // await driverService.updateLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
           console.log("Live Sync:", currentLocation.coords);
        } catch(e) { console.log(e); }
      }, 10000); 
    }
    return () => clearInterval(locationInterval);
  }, [tripState]);

  const handleEndTrip = async () => {
    if (!endOdometer) {
      Alert.alert("Error", "Please enter ending odometer reading.");
      return;
    }
    
    try {
      setEnding(true);
      await driverService.endTrip(tripDetails.magicToken, parseInt(endOdometer, 10));
      setEnding(false);
      setShowEndModal(false);
      setTripState('COMPLETED');
      Alert.alert('Trip Completed', 'Amount to collect: ' + tripDetails.amount);
    } catch (e) {
      setEnding(false);
      Alert.alert('Error', 'Failed to end trip.');
    }
  };

  if (tripState === 'COMPLETED') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <CheckCircle2 color={COLORS.success} size={80} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Trip Completed!</Text>
        <Text style={{ fontSize: 16, color: COLORS.gray, marginTop: 10 }}>Great job! Wait for your next assignment.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Checking active assignments...</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <CheckCircle2 color={COLORS.success} size={60} style={{ opacity: 0.5 }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10, color: COLORS.darkGray }}>No Active Rides</Text>
        <Text style={{ color: COLORS.gray, marginTop: 5 }}>You will be notified when a ride is assigned.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mapRegion ? (
        <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
          {/* Pickup Marker */}
          <Marker coordinate={{ latitude: tripDetails.pickup.lat, longitude: tripDetails.pickup.lng }} title="Pickup">
             <View style={styles.pickupMarker}><View style={styles.dotInside} /></View>
          </Marker>
          
          {/* Drop Marker */}
          <Marker coordinate={{ latitude: tripDetails.drop.lat, longitude: tripDetails.drop.lng }} title="Drop">
            <View style={styles.dropMarker}><View style={styles.dotInside} /></View>
          </Marker>

          {/* Simple Polyline for visualization (In prod, use react-native-maps-directions) */}
          <Polyline 
            coordinates={[
              { latitude: tripDetails.pickup.lat, longitude: tripDetails.pickup.lng },
              { latitude: tripDetails.drop.lat, longitude: tripDetails.drop.lng }
            ]}
            strokeColor={COLORS.primary}
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Locating GPS...</Text>
        </View>
      )}

      {/* Floating Header info */}
      <View style={styles.floatingHeader}>
        <Text style={styles.floatingTitle}>Heading to Destination</Text>
      </View>

      {/* Bottom Action Card */}
      <View style={styles.bottomCard}>
        {/* Customer Info */}
        <View style={styles.customerHeader}>
          <View>
            <Text style={styles.customerName}>{tripDetails.customerName}</Text>
            <Text style={styles.fareText}>Est. Fare: {tripDetails.amount}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconBtn}><MessageCircle color={COLORS.primary} size={24}/></TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: COLORS.success }]}><Phone color={COLORS.white} size={24}/></TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.divider} />

        {/* Address Details */}
        <View style={styles.addressRow}>
          <MapPin color={COLORS.primary} size={20} />
          <View style={styles.addressTextContainer}>
             <Text style={styles.addressLabel}>Pickup</Text>
             <Text style={styles.addressText}>{tripDetails.pickup.address}</Text>
          </View>
        </View>
        <View style={styles.addressRow}>
          <Navigation2 color={COLORS.danger} size={20} />
          <View style={styles.addressTextContainer}>
             <Text style={styles.addressLabel}>Drop-off</Text>
             <Text style={styles.addressText}>{tripDetails.drop.address}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.endBtn} onPress={() => setShowEndModal(true)}>
           <Text style={styles.btnText}>End Trip & Collect Cash</Text>
        </TouchableOpacity>
      </View>

      {/* End Trip Modal */}
      {showEndModal && (
        <Modal transparent animationType="slide" visible={showEndModal}>
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>End Trip</Text>
              <Text style={styles.modalSub}>Finalize trip and calculate fare.</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ending Odometer</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Enter Odometer (e.g. 15050)"
                  value={endOdometer}
                  onChangeText={setEndOdometer}
                />
              </View>
              
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEndModal(false)}>
                  <Text style={{ color: COLORS.darkGray, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalConfirm, ending && { opacity: 0.7 }]} 
                  onPress={handleEndTrip}
                  disabled={ending}
                >
                  <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                    {ending ? 'Ending...' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: COLORS.darkGray, fontSize: SIZES.medium },
  pickupMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 122, 255, 0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  dropMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 59, 48, 0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.danger },
  dotInside: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.black },
  floatingHeader: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: COLORS.white, padding: 15, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignItems: 'center' },
  floatingTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  bottomCard: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, elevation: 20 },
  customerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { fontSize: 20, fontWeight: 'bold' },
  fareText: { fontSize: 16, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 15 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  addressTextContainer: { marginLeft: 15, flex: 1 },
  addressLabel: { fontSize: 12, color: COLORS.gray, textTransform: 'uppercase', fontWeight: 'bold' },
  addressText: { fontSize: 15, color: COLORS.black, marginTop: 4 },
  startBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  endBtn: { backgroundColor: COLORS.danger, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  btnText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: COLORS.white, borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalSub: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 20 },
  inputContainer: { width: '100%', marginBottom: 20 },
  inputLabel: { fontSize: 14, color: COLORS.darkGray, marginBottom: 8, fontWeight: '600' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, backgroundColor: COLORS.lightGray },
  otpInput: { width: '100%', borderBottomWidth: 2, borderBottomColor: COLORS.primary, fontSize: 32, textAlign: 'center', letterSpacing: 10, paddingVertical: 10, marginBottom: 30 },
  modalActionRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalCancel: { padding: 15, flex: 1, alignItems: 'center' },
  modalConfirm: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, flex: 1, alignItems: 'center' },
});

export default LiveScreen;
