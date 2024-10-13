import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const ProfilePicture = () => {
  const { user } = useAuth0();
  if (!user) return <></>;

  return (
    <View className="w-14 h-14">
      <Image
        style={styles.image}
        source={user.picture}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#0553",
  },
});
