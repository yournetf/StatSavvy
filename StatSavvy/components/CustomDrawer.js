import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomDrawer = ({ closeDrawer }) => {
  const navigation = useNavigation();

  const handleNavigate = (screen) => {
    closeDrawer(); // Close the drawer
    navigation.navigate(screen); // Navigate to the selected screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Custom Drawer</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Matchup')}>
        <Text style={styles.buttonText}>Matchup</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Start/Sit')}>
        <Text style={styles.buttonText}>Start/Sit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      {/* Add more buttons as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#112D4E',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#70d4e1',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomDrawer;
