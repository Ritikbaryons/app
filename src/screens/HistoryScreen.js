import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { Search, Filter } from 'lucide-react-native';

import TripCard from '../components/TripCard';
import { COLORS, SIZES } from '../constants/theme';

const dummyTrips = [
  {
    id: '1',
    pickup: 'Kempegowda International Airport, Bengaluru',
    drop: 'Electronic City Phase 1, Bengaluru',
    distance: '52 km',
    fare: '1,250',
    status: 'Completed',
    date: '15 Oct, 2023 - 10:30 AM',
  },
  {
    id: '2',
    pickup: 'MG Road Metro Station',
    drop: 'Koramangala 5th Block',
    distance: '8.5 km',
    fare: '250',
    status: 'Completed',
    date: '14 Oct, 2023 - 05:45 PM',
  },
  {
    id: '3',
    pickup: 'Whitefield Tech Park',
    drop: 'Indiranagar',
    distance: '15 km',
    fare: '450',
    status: 'Cancelled',
    date: '14 Oct, 2023 - 09:15 AM',
  },
  {
    id: '4',
    pickup: 'Majestic Bus Stand',
    drop: 'Jayanagar 4th Block',
    distance: '7 km',
    fare: '200',
    status: 'Completed',
    date: '13 Oct, 2023 - 02:20 PM',
  },
];

const HistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderTrip = ({ item }) => (
    <TripCard 
      pickup={item.pickup}
      drop={item.drop}
      distance={item.distance}
      fare={item.fare}
      status={item.status}
      date={item.date}
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

      <FlatList
        data={dummyTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
