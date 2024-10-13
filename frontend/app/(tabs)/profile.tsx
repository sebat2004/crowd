<<<<<<< Updated upstream
import { useState } from "react";
import { View, Text } from "react-native";
=======
import React, { useState } from "react";
import { View, Text, Modal, Pressable, TouchableWithoutFeedback } from "react-native";
>>>>>>> Stashed changes
import { LoginButton, LogoutButton } from "@/components/auth";
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";

export default function ProfileScreen() {
  const { user, error } = useAuth0();
<<<<<<< Updated upstream
  const [isAttendingView, setIsAttendingView] = useState(true);
=======
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
>>>>>>> Stashed changes

  return (
    <View className="w-full h-[85%] flex items-center justify-between mt-24 p-3">
      {user ? (
        <>
          <View className="flex gap-10">
            {user && (
              <View className="w-[85%] flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl line-clamp-2">Welcome back,</Text>
                  <Text className="text-2xl font-bold line-clamp-2">
                    {user.name?.split(" ")[0]}!
                  </Text>
                </View>
                <Pressable onPress={toggleModal}>
                  <ProfilePicture />
                </Pressable>
              </View>
            )}
            <Text className="text-2xl font-semibold text-left">Past Events</Text>
            <View className="flex items-start rounded-lg p-5 bg-gray-200 gap-y-1">
              <View className="w-52 h-40 rounded-lg bg-white"></View>
            </View>
          </View>
<<<<<<< Updated upstream
        )}

        <Text className="text-2xl font-semibold text-left">Past Events</Text>
        <View className="flex items-start rounded-lg p-5 bg-gray-200 gap-y-1">
          <View className="w-52 h-40 rounded-lg bg-white"></View>
        </View>
      </View>
=======
>>>>>>> Stashed changes

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
          >
            <TouchableWithoutFeedback onPress={toggleModal}>
              <View className="flex-1 justify-start items-end">
                <View className="mt-20 mr-4 bg-white rounded-lg shadow-md">
                  <LogoutButton />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      ):(
        <>
          <Text>Not logged in</Text>
          <LoginButton></LoginButton>
        </>
      )}
    </View>
  );
}
