import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "@/components/form/InputField";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";


//TODO: 
//1. Add image upload 
//2. CheckBox thing (check this -> https://dribbble.com/shots/5042108-Car-Insurance-Quote) (look at top right, trying to get a nice little animation)
//3. make submit button look cool 
//4. nitpicky thing but get the datepicker in the right position. 

const AnimatedView = Animated.createAnimatedComponent(View);

//main transition for the renders 
const StepContent = ({ children, step }) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Reset animation values when step changes
    translateY.value = 50;
    opacity.value = 0;

    // Start new animations
    translateY.value = withSpring(0);
    opacity.value = withTiming(1, { duration: 300 });
  }, [step]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={[{ width: "100%" }, animatedStyle]}>
      {children}
    </AnimatedView>
  );
};

export default function FormScreen() {
  const [step, setStep] = useState<number>(1);

  //for datepicker component
  const [mode, setMode] = useState<string>("date");
  const [show, setShow] = useState<boolean>(false);

  //all for the backend
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Array<BigInt>>([0, 0]);
  const [cost, setCost] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventTime, setEventTime] = useState<Date>(new Date());
  //somewhere here add the file thingy 
  

  const onChangeEventDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || eventDate;
    setEventDate(currentDate);
  };

  const onChangeEventTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || eventTime;
    setEventTime(currentTime);
  };

  //missing file handler 
  const handleSubmit = () => {
    const formData = {
      name,
      event_date: eventDate,
      address,
      description,
      capacity: parseInt(capacity, 10),
      coordinates,
      cost: parseInt(cost, 10),
    };

    console.log("Submitting form data:", formData);

    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContent step={step}>
            <InputField
              label="Event Name?"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </StepContent>
        );
      case 2:
        return (
          <StepContent step={step}>
            <InputField
              label="Capacity"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
              style={styles.input}
            />
          </StepContent>
        );
      case 3:
        return (
          <StepContent step={step}> 
          <View style={styles.containerDate}>
              <Text className="text-xl mb-2">Date and Time</Text>
              <View style={styles.dateTimeContainer}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={eventDate}
                  mode={"date"}
                  display="default"
                  onChange={onChangeEventDate}
                />
                <DateTimePicker
                  testID="timePicker"
                  value={eventTime}
                  mode={"time"}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeEventTime}
                />
              </View>
            </View>
          </StepContent>
        );
      case 4:
        return (
          <StepContent step={step}>
            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </StepContent>
        );
      case 5:
        return (
          <StepContent step={step}>
            <InputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              style={styles.multilineInput}
            />
          </StepContent>
        );
      case 6:
        return (
          <StepContent step={step}>
            <InputField
              label="Cost"
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
              style={styles.input}
            />
          </StepContent>
        );
      case 7:
        return (
          <StepContent step={step}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} title="Submit" onPress={handleSubmit} >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </StepContent>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex p-20 h-full justify-center items-center w-full">
      <View className="flex justify-center w-full h-80 items-center">
        <View className="flex justify-center w-full items-center mb-10 bg-transparent">
          <Text className="text-2xl">Welcome! Create your event here!</Text>
        </View>
        <View className="flex items-center justify-center h-40">
          {renderCurrentStep()}
        </View>
        <View className="flex-row justify-center items-center w-1/2">
          {step > 1 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}
          {step < 7 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setStep(step + 1)}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

//so cursed but the native wind shit has not been working. 
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  containerDate: {
    marginBottom: 16,
    width: '100%',
    minWidth:'70%', 
    paddingRight:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minWidth: '70%',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    borderBottomWidth:1,
    minWidth:'70%',
    paddingTop:8,
    paddingBottom:8, 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#172554',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});