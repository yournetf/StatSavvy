// SignInScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignIn({ auth, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in:', userCredential.user);
        // Optionally, navigate to the main app screen after successful sign in
        navigation.navigate('Drawer'); // Navigate to your main app screen here
      })
      .catch((error) => {
        console.error('Sign in error:', error);
        Alert.alert('Sign In Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Text style={styles.signupText}>Don't Have an Account?</Text>
      {/* Navigate to SignUpScreen on button press */}
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8DA0BD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 100 : 0,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
  signupText: {
    marginVertical: 10,
    color: 'white',
  },
});
