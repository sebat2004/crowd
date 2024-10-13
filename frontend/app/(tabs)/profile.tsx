import { useState } from "react";
import { View, Text } from "react-native";
import { LoginButton, LogoutButton } from "@/components/auth";
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";

export default function ProfileScreen() {
  const { user, error } = useAuth0();
  const [isAttendingView, setIsAttendingView] = useState(true);

  return (
    <View className="w-full h-[85%] flex items-center justify-between mt-24">
      <View className="flex gap-10">
        {user && (
          <View className="w-[85%] flex-row justify-between items-center">
            <View>
              <Text className="text-2xl line-clamp-2">Welcome back,</Text>
              <Text className="text-2xl font-bold line-clamp-2">
                {user.name}!
              </Text>
            </View>
            <ProfilePicture />
          </View>
        )}

        <Text className="text-2xl font-semibold text-left">Past Events</Text>
        <View className="flex items-start rounded-lg p-5 bg-gray-200 gap-y-1">
          <View className="w-52 h-40 rounded-lg bg-white"></View>
        </View>
      </View>

      {!user && <Text>Not logged in</Text>}
      {error && <Text>{error.message}</Text>}

      {user ? <LogoutButton></LogoutButton> : <LoginButton></LoginButton>}
    </View>
  );
}
