import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";

import { View, Text, TouchableOpacity, Modal, Button } from "react-native";
import Popup from "@/components/event/Popup";

import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import EventList from "../EventList";
import Entypo from "@expo/vector-icons/Entypo";
import FormScreen from "../form";

import axios from "axios";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateEventModalVisible, setIsCreateEventModalVisible] =
    useState(false);

  const [events, setEvents] = useState([]);

  function measure(lat1, lon1, lat2, lon2) {
    // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
    var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
  }

  const handleRegionChange = async (region, gesture) => {
    const test = await mapRef.getMapBoundaries();
    const maxDistance = Math.min(
      measure(
        test.southWest.latitude,
        test.southWest.longitude,
        test.northEast.latitude,
        test.northEast.longitude
      ),
      6000
    );
    console.log(maxDistance);
    const url = `http://localhost:3000/events?latitude=${region.latitude}&longitude=${region.longitude}&maxDistance=${maxDistance}`;
    try {
      const res = await axios.get(url);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events: ", err);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events: ", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
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
  // console.log(location);
  const markersTest = [
    {
      latlng: { latitude: 47.655334, longitude: -122.30352 },
      title: "Example Party",
      description: "Best party on the block",
      address: "123 N st",
      time: "22:00",
    },
  ];

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

  const toggleCreateEventModal = () => {
    setIsCreateEventModalVisible(!isCreateEventModalVisible);
  };

  return (
    <View className="flex-1">
      <MapView
        ref={(ref) => setMapRef(ref)}
        className="w-full h-full justify-center items-center"
        region={mapRegion}
        onRegionChangeComplete={handleRegionChange}
      >
        {events.map((event, index) => (
          <Marker
            key={index}
            title={
              event.name.length > 20
                ? `${event.name.substring(0, 20)}...`
                : event.name
            }
            description={
              event.description.length > 30
                ? `${event.description.substring(0, 30)}...`
                : event.description
            }
            coordinate={{
              latitude: event.location.coordinates[1],
              longitude: event.location.coordinates[0],
            }}
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

      <TouchableOpacity
        className="absolute bottom-4 right-5 w-14 h-14 bg-blue-900 rounded-full justify-center items-center"
        onPress={toggleCreateEventModal}
        activeOpacity={1}
      >
        <Entypo name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={isCreateEventModalVisible}
        animationType="slide"
        onRequestClose={toggleCreateEventModal}
        transparent={false}
      >
        <FormScreen toggleCreateEventModal={toggleCreateEventModal} />
      </Modal>

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
