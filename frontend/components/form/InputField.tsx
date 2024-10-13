// InputField.tsx
import React from 'react';
import { Text, TextInput, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

//im in css fucking hell somebody save me. 
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width:'70%',
    minWidth:'70%'
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
  },
  input: {
    height: 50,
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minWidth:'70%'
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

//idk why multiline needs to be included in this but sure. 
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  onSubmitEditing,
  keyboardType = 'default',
  multiline = false,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
};

export default InputField;