import { useState } from "react";
import { View, Text, Modal, Pressable, TouchableWithoutFeedback } from "react-native";
import { LoginButton, LogoutButton } from "@/components/auth";
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";

export default function ProfileScreen() {
  const { user  } = useAuth0();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View className="w-full h-[85%] flex items-center justify-center mt-24 p-3">
      {user ? (
        <>
          <View className="absolute right-8 top-px">
            <LogoutButton />
          </View>
          
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
        </>
      ):(
        <>
          <LoginButton></LoginButton>
        </>
      )}
    </View>
  );
}
