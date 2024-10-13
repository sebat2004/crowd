import { Link } from "expo-router";
import { View, Text, Modal, TouchableOpacity, Button } from 'react-native';
import { BlurView } from 'expo-blur';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';

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
			<BlurView className="flex-1 w-full justify-center items-center" intensity={10} >
				<View className="flex-1 justify-center items-center w-10/12 h-full">
					<View
						className="bg-gray-100 p-5 w-full h-3/5 rounded-3xl shadow-lg flex flex-col justify-start"
					>
						<View className="flex w-full flex-row justify-end pb-3">
							<TouchableOpacity
								onPress={onClose}
							>
								<AntDesign name="close" size={24} color="black" />
							</TouchableOpacity>
						</View>
						<View className="flex-auto w-full h-1/3 mb-5">
							<View className="w-full h-full bg-slate-400 rounded-xl">

							</View>
						</View>
						<View className="flex-auto w-full justify-between">
							<View className="flex">
								<Text className="text-3xl font-semibold mb-0.5">{marker.name}</Text>
								<Text className="text-md font-light italic mb-2">{marker.address}</Text>
								<Text className="text-lg font-normal leading-5">{marker.description}</Text>
							</View>
							<View className="flex">
								<Link href={{
									pathname: "/checkout",
									params: { eventId: marker.id }
								}} asChild>
									<TouchableOpacity onPress={onClose} className="bg-blue-950 p-3 rounded-lg flex flex-row justify-center items-center">
										<Foundation name="clipboard-pencil" size={24} color="white" className="p-0 m-0"/>
										<Text className="text-white text-center pl-2 text-lg">Register Now</Text>
									</TouchableOpacity>
								</Link>
							</View>
						</View>
					</View>
				</View>
			</BlurView>
    </Modal>
  )
}