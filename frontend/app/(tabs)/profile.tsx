import { View } from "react-native";
import { Profile, LoginButton, LogoutButton } from "@/components/auth";

export default function ProfileScreen() {
  return (
    <View className="w-full h-full flex items-center justify-center">
      <Profile></Profile>
      <LoginButton></LoginButton>
      <LogoutButton></LogoutButton>
    </View>
  );
}
