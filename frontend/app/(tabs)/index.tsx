import axios from 'axios';

import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_URL = 'http://localhost:3000';

const fetchMarkers = async() => {
  try {
    const res = await axios.get(`${API_URL}/api/markers`)
    return res.data;
  } catch (err) {
    console.error('Error fetching markers: ', err);
    throw err;
  }
}
const markers = [
  {
    latlng: { latitude: 47.655334, longitude: -122.303520 },
    title: "Example Party",
    description: "Best party on the block"
  }
]

export default function HomeScreen() {

  const [text, setText] = useState('');
  useEffect(() => {

  })
  return (
    <View className="flex-1">
      <MapView className="w-full h-full"
        initialRegion={{
          latitude: 47.655334,
          longitude: -122.303520,
          latitudeDelta: 0.2,
          longitudeDelta: 0.02,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <View style={styles.overlay}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput 
          style={styles.input}
          onChangeText={text => setText(text)}
          value={text}
          placeholder="Search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '10%',
    width: '80%',
    height: '5%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    marginLeft: 5,
  }
});