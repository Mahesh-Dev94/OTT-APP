import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomActionSheet = ({ visible, onClose,onSelect }) => {
  const handleOptionPress = (option) => {
    // Handle option press
    onSelect(option);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress(1)}>
          <Text>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress(2)}>
          <Text>Choose from Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  option: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CustomActionSheet;
