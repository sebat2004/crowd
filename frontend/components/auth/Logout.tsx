import { useAuth0 } from "react-native-auth0";
import { Button, View } from "react-native";

export const LogoutButton = () => {
  const { clearSession } = useAuth0();

  const onPress = async () => {
    try {
      await clearSession();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="w-40 bg-blue-800 rounded-md">
      <Button color="white" onPress={onPress} title="Log out" />
    </View>
  );
};
