import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '@/components/form/InputField';

export default function FormScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  
  const [eventDate, setEventDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false); 

  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [coordinates, setCoordinates] = useState([0, 0]);

  const onChangeEventDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setEventDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  const handleSubmit = () => {
    const formData = {
      name,
      event_date: eventDate,
      address,
      description,
      capacity: parseInt(capacity, 10),
      coordinates,
    };

    console.log('Submitting form data:', formData);

    fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <InputField
            label="Event Name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => setStep(2)}
          />
        );
      case 2:
        return (
          <View>
            <Text className="text-2xl mb-2">Capacity</Text>
            <TextInput
              className="border-b border-gray-300 text-md mb-4"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
            />
            <Button title="Next" onPress={() => setStep(3)} />
          </View>
        );
      case 3:
        return (
          <View>
            <Text className="text-2xl mb-2">Event Date and Time</Text>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Text className="mt-2">Selected: {eventDate.toLocaleString()}</Text>
           {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={eventDate}
                mode={mode}
                is24Hour={true}
                onChange={onChangeEventDate}
              />
            )}
            <Button title="Next" onPress={() => setStep(4)} />
          </View>
        );
      case 4:
        return (
          <InputField
            label="Address"
            value={address}
            onChangeText={setAddress}
            onSubmitEditing={() => setStep(5)}
          />
        );
      case 5:
        return (
          <View className="mb-4">
            <Text className="text-2xl">Description</Text>
            <TextInput
              className="border-b border-gray-300 text-md"
              value={description}
              onChangeText={setDescription}
              keyboardType={'default'}
              multiline={true}
              numberOfLines={3} // Adjust for multiline
              style={{height: 80}}
            />
            <Button title="Next" onPress={() => setStep(6)} />
        </View>
        );
      case 6:
        return <Button title="Submit" onPress={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="p-4">
          <View className="flex-row justify-between mb-4">
            <Ionicons name="arrow-back" size={24} color="black" onPress={() => setStep(Math.max(1, step - 1))} />
            <Ionicons name="checkbox-outline" size={24} color="black" />
          </View>

          <Text className="text-xl mb-4">Welcome! Create your event here!</Text>

          {renderCurrentStep()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}