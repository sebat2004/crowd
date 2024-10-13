import axios from 'axios';

import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { View, Text, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

const API_URL = 'http://localhost:3000';

export default function HomeScreen() {

  const [text, setText] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const getMarkers = async() => {
      try {
        const res = await axios.get(`${API_URL}/api/markers`)
        setMarkers(res.data);
      } catch (err) {
        console.error('Error fetching markers: ', err);
        throw err;
      }
    }
    getMarkers();
  }, []);

  const markersTest = [
    {
      latlng: { latitude: 47.655334, longitude: -122.303520 },
      title: "Example Party",
      description: "Best party on the block"
    }
  ]

  const handleSearchPress = () => {
    router.push('/search');
  };

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
        {markersTest.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
        </MapView>
        <TouchableOpacity 
          className="absolute top-[10%] w-full justify-center items-center"
          onPress={handleSearchPress}
          activeOpacity={1}
        >
          <View className="relative w-4/5 flex-row h-[40px] justify-start items-center bg-white rounded-full border-[#D9D9D9] border-2 drop-shadow-md p-2.5">
            <Ionicons name="search" size={18} color="black" />
            <Text className="ml-1 text-gray-400">Search</Text>
          </View>
        </TouchableOpacity>
      
    </View>
  );
}
