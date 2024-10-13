import { useAuth0 } from 'react-native-auth0';
import { Button } from 'react-native';

export const LogoutButton = () => {
    const {clearSession} = useAuth0();

    const onPress = async () => {
        try {
            await clearSession();
        } catch (err) {
            console.log(err);
        }
    };

    return <Button onPress={onPress} title="Log out" />
}