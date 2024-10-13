import { Link } from "expo-router";
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';

export default Popup = ({ visible, onClose, marker }) => {
	if (!marker) {
		return null
	}

  return (
    <Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
    >
			<BlurView className="flex-1 w-full h-full justify-center items-center" intensity={10} >
				<View className="flex-1 justify-center items-center w-10/12 h-full">
					<View
						className="bg-white p-5 w-full h-3/5 rounded-3xl shadow-lg flex flex-col justify-start"
					>
						<View className="flex w-full flex-row justify-end pb-2">
							<TouchableOpacity
								onPress={onClose}
							>
								<AntDesign name="close" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<View className="flex w-full h-1/3 mb-5">
							<View className="w-full h-full bg-slate-400 rounded-xl">

							</View>
						</View>
						<Text className="text-3xl font-semibold">{marker.title}</Text>
						<Text>{marker.description}</Text>
						<Text>{marker.address}</Text>
						<Text>{marker.time}</Text>
						<Link href={{
							pathname: "/checkout",
							params: { markerId: marker.id }
						}} asChild>
							<TouchableOpacity onPress={onClose}>
								<Text>Proceed to Checkout</Text>
							</TouchableOpacity>
						</Link>
					</View>
				</View>
			</BlurView>
    </Modal>
  )
}