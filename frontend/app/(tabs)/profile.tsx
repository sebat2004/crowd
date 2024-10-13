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
        <View className="bg-gray-200 flex-row flex-wrap justify-center gap-x-4">
          <Text className="text-lg text-center">Total Parties: 20</Text>
          <Text className="text-lg text-center">
            Username: {user?.nickname}
          </Text>
        </View>
      </View>

      {!user && <Text>Not logged in</Text>}
      {error && <Text>{error.message}</Text>}

      {user ? <LogoutButton></LogoutButton> : <LoginButton></LoginButton>}
    </View>
  );
}
