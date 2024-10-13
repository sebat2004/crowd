import { Link } from "expo-router";
import { View, Text, Modal, TouchableOpacity } from 'react-native';

export default Popup = ({ visible, onClose, marker }) => {
	if (!marker) {
		return null
	}

  return (
    <Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
    >
			<View className="flex-1 justify-end">
				<View
					className="bottom-[77px] h-1/3 bg-white p-5"
				>
					<Text>{marker.title}</Text>
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
					<TouchableOpacity
						onPress={onClose}
					>
						<Text>Close</Text>
					</TouchableOpacity>
				</View>
				
			</View>
    </Modal>
  )
}