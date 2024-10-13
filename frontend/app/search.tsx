import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function SearchPage() {
  const [text, setText] = useState('');

  return (
    <View className="flex-1 flex-col bg-white">
      <Stack.Screen options={{ title: 'Search' }} />
      <View className="flex-row mt-4 mx-4 h-[40px] justify-start items-center bg-white rounded-full border-[#D9D9D9] border-2 drop-shadow-md p-2.5">
        <Ionicons name="search" size={18} color="black" />
        <TextInput 
          className="ml-1 flex-1"
          onChangeText={text => setText(text)}
          value={text}
          placeholder="Search"
          autoFocus
        />
      </View>
    </View>
  );
}