import { View, Text } from "react-native";
import { LoginButton, LogoutButton } from "@/components/auth";
import { useAuth0 } from "react-native-auth0";
import { ProfilePicture } from "@/components/auth/ProfilePicture";

export default function ProfileScreen() {
  const { user, error } = useAuth0();
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
        <View className="flex-row flex-wrap justify-evenly">
          <View className="flex rounded-lg p-3 bg-gray-200 gap-y-1">
            <Text className="text-lg text-center">Events Attended</Text>
            <Text className="text-2xl font-bold text-left">0</Text>
          </View>
          <View className="flex rounded-lg p-3 bg-gray-200 gap-y-1">
            <Text className="text-lg text-center">Events Hosted</Text>
            <Text className="text-2xl font-bold text-left">0</Text>
          </View>
        </View>
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
