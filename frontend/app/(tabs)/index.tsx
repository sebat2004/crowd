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
      <MapView className="w-full h-full justify-center items-center"
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
        <View className="flex-row absolute top-[10%] w-4/5 h-[5%] justify-start items-center bg-white rounded-full border-[#D9D9D9] border-2 drop-shadow-md p-2.5">
          <Ionicons name="search" size={18} color="black" />
          <TextInput 
            className="ml-1"
            onChangeText={text => setText(text)}
            value={text}
            placeholder="Search"
          />
        </View>
      </MapView>
      
    </View>
  );
}
