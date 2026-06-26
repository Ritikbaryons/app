import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search, Filter } from 'lucide-react-native';

import TripCard from '../components/TripCard';
import { COLORS, SIZES } from '../constants/theme';

import { driverService } from '../services/driverService';

const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await driverService.getHistory();
      setTrips(response.data);
    } catch (error) {
      console.error("Error loading history", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }) => (
    <TripCard 
      pickup={item.pickup || 'Unknown Location'}
      drop={item.drop || 'Unknown Location'}
      distance={`N/A`} // Distance is not provided by the DTO currently
      fare={item.fare?.toString() || '0'}
      status={item.status}
      date={new Date(item.date).toLocaleString()}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color={COLORS.gray} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trips..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading history...</Text>
      ) : (
        <FlatList
          data={trips.filter(t => (t.pickup || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.drop || '').toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={(item) => item.bookingId.toString()}
          renderItem={renderTrip}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.gray }}>No history found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    paddingHorizontal: SIZES.small,
    marginRight: SIZES.small,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: SIZES.small,
    color: COLORS.black,
  },
  filterButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SIZES.padding,
  },
});

export default HistoryScreen;
