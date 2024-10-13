import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, TouchableOpacity } from 'react-native';
import Popup from '@/components/event/Popup';

import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function HomeScreen() {

  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [mapRegion, setMapRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  

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

  const markersTest = [
    {
      latlng: { latitude: 47.655334, longitude: -122.303520 },
      title: "Example Party",
      description: "Best party on the block",
      address: "123 N st",
      time: "22:00"
    }
  ]

  const handleSearchPress = () => {
    router.push('/search');
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
      <MapView className="w-full h-full justify-center items-center"
        region={mapRegion}
      >
        {markersTest.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            onPress={() => openPopup(marker)}
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
