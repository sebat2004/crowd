// InputField.tsx
import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void; // Optional prop
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  onSubmitEditing,
  keyboardType = 'default',
}) => {
  return (
    <View className="mb-4">
      <Text className="text-2xl">{label}</Text>
      <TextInput
        className="border-b border-gray-300 text-md"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default InputField;

