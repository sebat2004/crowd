import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';

export default function EventList({ setMapRegion, toggleModal }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`http://localhost:3000/events`);
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events: ', err);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [text]);

  const travelToLocation = (location) => {
    setMapRegion({
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    toggleModal();
  }

  const renderEvent = ({ item }) => (
    <TouchableOpacity onPress={() => travelToLocation(item.location)}>
      <View className="p-4 border-b border-gray-200">
        <View className="flex-row justify-between h-24">
          <View className="w-1/2">
            <View className="flex-col p-2">
              <Text className="text-lg font-semibold">{item.name}</Text>
            </View>
            <View className="flex-row items-center p-1">
              <Ionicons name="location-outline" size={24} color="black" />
              <Text className="text-md font-light">{item.address}</Text>
            </View>
          </View>
          <View className="w-1/2 p-2">
            <View className="bg-gray-200 rounded-lg w-full h-full">

            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-1">
      <View className="flex-1 bg-white items-center">
        <View className="flex-row w-full p-4">
        <TouchableOpacity onPress={toggleModal} >
          <Entypo name="chevron-down" size={24} color="black" />
        </TouchableOpacity>
        </View>
        <View className="relative w-10/12 flex-row h-[40px] justify-start items-center bg-white rounded-full border-[#D9D9D9] border-2 drop-shadow-md p-2.5">
          <Ionicons name="search" size={18} color="black" />
          <TextInput className="ml-1 text-gray-400"
            onChangeText={text => setText(text)}
            value={text}
            placeholder="Search"
          />
        </View>
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text>No events found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}