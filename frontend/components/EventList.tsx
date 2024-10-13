import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import axios from 'axios';

export default function EventList({ text }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const renderEvent = ({ item }) => (
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
    <View className="flex-1 bg-white">
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
  );
}