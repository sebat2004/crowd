import { useAuth0 } from 'react-native-auth0';
import { Button } from 'react-native';

export const LoginButton = () => {
    const {authorize} = useAuth0();

    const onPress = async () => {
        try {
            await authorize();
        } catch (err) {
            console.log(err);
        }
    };

    return <Button onPress={onPress} title="Log in" />
}