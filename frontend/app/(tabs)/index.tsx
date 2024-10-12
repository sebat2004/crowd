import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
        initialRegion={{
          latitude: 47.655334,
          longitude: -122.303520,
          latitudeDelta: 0.2,
          longitudeDelta: 0.02,
        }}
        >
          <View style={styles.overlay}>
            <Ionicons name="search" size={24} color="black" />
            <TextInput 
              style={styles.input}
              onChangeText={text => setText(text)}
              value={text}
              placeholder="Search"
            />
          </View>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '10%',
    width: '80%',
    height: '5%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    marginLeft: 5,
  }
});