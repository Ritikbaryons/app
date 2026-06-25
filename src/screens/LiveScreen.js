import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MapPin, Navigation } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

const LiveScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    let locationInterval;
    
    if (isSharing) {
      locationInterval = setInterval(async () => {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // In a real app, you would send this to the backend
        // await apiClient.post('/driver/location', { lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude });
        
        console.log("Location updated:", currentLocation.coords);
      }, 10000); // Auto-refresh every 10 seconds
    } else {
      clearInterval(locationInterval);
    }

    return () => clearInterval(locationInterval);
  }, [isSharing]);

  const toggleLocationSharing = () => {
    if (!location) {
      Alert.alert('Error', 'Wait for location to load before sharing.');
      return;
    }
    setIsSharing(!isSharing);
  };

  return (
    <View style={styles.container}>
      {mapRegion ? (
        <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
          {location && (
            <Marker 
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              }}
              title="You are here"
              description="Current Location"
            >
              <View style={styles.markerContainer}>
                <Navigation color={COLORS.primary} size={24} />
              </View>
            </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching Location...</Text>
        </View>
      )}

      <View style={styles.bottomCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicatorContainer}>
            <View style={[styles.statusDot, { backgroundColor: isSharing ? COLORS.success : COLORS.gray }]} />
            <Text style={styles.statusText}>{isSharing ? 'Online - Sharing' : 'Offline - Not Sharing'}</Text>
          </View>
        </View>

        {location && (
          <View style={styles.coordinatesContainer}>
            <MapPin color={COLORS.darkGray} size={16} />
            <Text style={styles.coordinatesText}>
              Lat: {location.coords.latitude.toFixed(5)}, Lng: {location.coords.longitude.toFixed(5)}
            </Text>
          </View>
        )}
        
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        <TouchableOpacity 
          style={[styles.toggleButton, isSharing ? styles.btnDanger : styles.btnSuccess]} 
          onPress={toggleLocationSharing}
        >
          <Text style={styles.toggleButtonText}>
            {isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.base,
    color: COLORS.darkGray,
    fontSize: SIZES.medium,
  },
  markerContainer: {
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  bottomCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopLeftRadius: SIZES.base * 3,
    borderTopRightRadius: SIZES.base * 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.small,
    borderRadius: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SIZES.small,
  },
  statusText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.lightGray,
    padding: SIZES.small,
    borderRadius: SIZES.base,
  },
  coordinatesText: {
    marginLeft: SIZES.base,
    color: COLORS.darkGray,
    fontSize: SIZES.font,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  toggleButton: {
    padding: SIZES.padding,
    borderRadius: SIZES.base * 2,
    alignItems: 'center',
  },
  btnSuccess: {
    backgroundColor: COLORS.success,
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  toggleButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
});

export default LiveScreen;
