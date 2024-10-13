import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { LoginButton, LogoutButton } from "@/components/auth";
import Camera from "@/components/profile/Camera";
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";

export default function ProfileScreen() {
  const { user } = useAuth0();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleLogoutModal = () => {
    setLogoutModalVisible(!logoutModalVisible);
  };

  return (
    <View className="w-full h-[85%] flex items-center justify-center mt-24 p-3">
      {user ? (
        <>
          <View className="flex h-[90%] w-[90%] items-center">
            {user && (
              <>
                <View className="absolute bottom-1/2 right-2">
                  <Pressable onPress={toggleCamera}>
                    <Ionicons name="camera-outline" size={32} color="black" />
                  </Pressable>
                </View>
                <View className="w-full flex-row justify-start items-center">
                  <Pressable onPress={toggleModal}>
                    <ProfilePicture />
                  </Pressable>
                  <View>
                    <Text className="ml-4 text-2xl line-clamp-2">
                      Welcome back,
                    </Text>
                    <Text className="ml-4 text-2xl font-bold line-clamp-2">
                      {user.name?.split(" ")[0]}!
                    </Text>
                  </View>
                  <View className="absolute right-2">
                    <Pressable onPress={toggleLogoutModal}>
                      <Ionicons name="exit-outline" size={32} color="black" />
                    </Pressable>
                  </View>
                </View>
              </>
            )}
            <View className="flex">
              <EventList />
            </View>
          </View>
          <Modal
            transparent={true}
            visible={cameraVisible}
            onRequestClose={toggleCamera}
          >
            <TouchableWithoutFeedback onPress={toggleCamera}>
              <View className="flex-1 items-center justify-center">
                <View className="rounded-md">
                  <Camera />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={toggleLogoutModal}
          >
            <TouchableWithoutFeedback onPress={toggleLogoutModal}>
              <View className="flex-1 justify-center items-center">
                <View className="bg-white p-5 rounded-xl flex justify-center items-center">
                  <Text className="text-lg mb-4">
                    Are you sure you want to logout?
                  </Text>
                  <LogoutButton />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      ) : (
        <LoginButton />
      )}
    </View>
  );
}

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth0();

  useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `http://localhost:3000/${user!.sub}/events`
        ).then((res) => res.json());
        console.log(res);
        console.log(user.sub);
        setEvents(res);
      } catch (err) {
        console.error("Error fetching events: ", err);
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
          <Image
            source={{ uri: item.image }}
            className="w-full h-full rounded-lg"
          />
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
    <SafeAreaView className="flex-1 bg-transparent pt-1">
      <View className="flex-1 items-center">
        {events?.length > 0 ? (
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
