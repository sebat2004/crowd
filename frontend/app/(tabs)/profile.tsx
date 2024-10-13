import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { LoginButton, LogoutButton } from "@/components/auth";
import Camera from "@/components/profile/Camera"
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const { user } = useAuth0();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible);
  }

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
                    <Ionicons name="camera-outline" size={32} color="black"/>
                  </Pressable>
                </View>
                <View className="w-full flex-row justify-start items-center">
                  <Pressable onPress={toggleModal}>
                    <ProfilePicture />
                  </Pressable>
                  <View>
                    <Text className="ml-4 text-2xl line-clamp-2">Welcome back,</Text>
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
              <Text>Upcoming Events</Text>
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
                  <Text className="text-lg mb-4">Are you sure you want to logout?</Text>
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
