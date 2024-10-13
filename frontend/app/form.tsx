import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "@/components/form/InputField";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import AntDesign from '@expo/vector-icons/AntDesign';

const createFormData = (uri) => {
  const fileName = uri.split("/").pop();
  const fileType = fileName.split(".").pop();
  const formData = new FormData();
  formData.append("image", {
    name: fileName,
    uri,
    type: `image/${fileType}`,
  });
  return formData;
};

const postImage = async (uri) => {
  try {
    const data = createFormData(uri);
    console.log("Form data: ", data);
    const response = await fetch("http://localhost:3000/images", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    return responseData.imageUrl;
  } catch (error) {
    console.error("Error posting image:", error);
    throw error;
  }
};

const UploadImage = ({ onImageSelected }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageAsync = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        onImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={uploadPhotoStyles.image}
        />
      )}
      <TouchableOpacity
        style={uploadPhotoStyles.container}
        onPress={pickImageAsync}
      >
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

//TODO:
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

export default function FormScreen({ toggleCreateEventModal }) {
  const [step, setStep] = useState<number>(1);

  //for datepicker component
  const [mode, setMode] = useState<string>("date");
  const [show, setShow] = useState<boolean>(false);

  //all for the backend
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Array<BigInt>>([1, 1]);
  const [cost, setCost] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventTime, setEventTime] = useState<Date>(new Date());
  //somewhere here add the file thingy
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelected = (image) => {
    setSelectedImage(image);
  };

  const onChangeEventDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || eventDate;
    setEventDate(currentDate);
  };

  const onChangeEventTime = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || eventTime;
    setEventTime(currentTime);
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      if (selectedImage) {
        await postImage(selectedImage.uri).then(async (imageUrl) => {
          const formData = {
            name,
            event_date: eventDate,
            address,
            description,
            capacity: parseInt(capacity, 10),
            coordinates,
            cost: parseInt(cost, 10),
            imageUrl,
          };

          console.log("Submitting form data:", formData);

          const response = await fetch("http://localhost:3000/events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          console.log("Success:", data);
        });
      }
    } catch (error) {
      console.error("Error posting event:", error);
    }
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
            <View style={styles.container}>
              <Text style={styles.title}>Upload an image</Text>
              <UploadImage onImageSelected={handleImageSelected} />
            </View>
          </StepContent>
        );
      case 8:
        return (
          <StepContent step={step}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                title="Submit"
                onPress={handleSubmit}
              >
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
    <SafeAreaView className="flex-1">
      <View className="flex w-full pl-6">
        <TouchableOpacity onPress={toggleCreateEventModal}>
          <Entypo name="chevron-down" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex py-12 h-4/5 justify-center items-center w-full">
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
            {step < 8 && (
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
      </View>
    </SafeAreaView>
  );
}

//so cursed but the native wind shit has not been working.
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  containerDate: {
    marginBottom: 16,
    width: "100%",
    minWidth: "70%",
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  input: {
    height: 50,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    minWidth: "90%",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    borderBottomWidth: 1,
    minWidth: "70%",
    paddingTop: 8,
    paddingBottom: 8,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: "#172554",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 100,
  },
});

const uploadPhotoStyles = StyleSheet.create({
  container: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 50,
  },
});
