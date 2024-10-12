import axios from 'axios';

import React, { useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';

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
    latlng: {latitude: 47.655334, longitude: -122.303520 },
    title: "example party",
    description: "the best party on the block"
  }
]

export default function HomeScreen() {

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
    </View>
  );
}
