import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";

import { View, Text, TouchableOpacity, Modal, Button } from "react-native";
import Popup from "@/components/event/Popup";

import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import EventList from "@/components/search/EventList";

import axios from 'axios';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`http://localhost:3000/events`);
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events: ', err);
      }
    })();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openPopup = (marker) => {
    setSelectedMarker(marker);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <View className="flex-1">
      <MapView
        className="w-full h-full justify-center items-center"
        region={mapRegion}
      >
        {events.map((event, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: event.location.coordinates[1], longitude: event.location.coordinates[0] }}
            onPress={() => openPopup(event)}
          />
        ))}
      </MapView>

      <Popup
        visible={isPopupVisible}
        onClose={closePopup}
        marker={selectedMarker}
      />
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
