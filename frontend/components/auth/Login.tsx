import { useAuth0 } from "react-native-auth0";
import { Button, View } from "react-native";

export const LoginButton = () => {
  const { authorize } = useAuth0();

  const onPress = async () => {
    try {
      await authorize();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="w-40 bg-blue-950 rounded-md">
      <Button color="white" onPress={onPress} title="Login" />
    </View>
  );
};
