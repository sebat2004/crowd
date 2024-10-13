import axios from 'axios';

import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, TouchableOpacity, Modal, Button } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import EventList from '../EventList';
import Entypo from '@expo/vector-icons/Entypo';

const API_URL = 'http://localhost:3000';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location)
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!mapRegion) {
    return <Text>Loading...</Text>;
  }

  (async() => {
    try {
      const res = await axios.get(`${API_URL}/api/markers`)
      setMarkers(res.data);
    } catch (err) {
      console.error('Error fetching markers: ', err);
      throw err;
    }
  })();

  const markersTest = [
    {
      latlng: { latitude: 47.655334, longitude: -122.303520 },
      title: "Example Party",
      description: "Best party on the block"
    }
  ]

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View className="flex-1">
      <MapView className="w-full h-full justify-center items-center"
        region={mapRegion}
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
          onPress={toggleModal}
          activeOpacity={1}
        >
          <View className="relative w-4/5 flex-row h-[40px] justify-start items-center bg-white rounded-full border-[#D9D9D9] border-2 drop-shadow-md p-2.5">
            <Ionicons name="search" size={18} color="black" />
            <Text className="ml-1 text-gray-400">Search</Text>
          </View>
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}
          transparent={false}
        >
          <View className="flex-1 bg-white">
            <Button title="" onPress={toggleModal} />
            <EventList setMapRegion={setMapRegion} toggleModal={toggleModal} />
          </View>
        </Modal>
    </View>
  );
}
