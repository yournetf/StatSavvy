// SignInScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from '../../App';
import FootballLoading from '../Loading/FootballLoading';



export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useContext(UserContext);
  const auth = user[2];

  const [loadingPicture, setLoadingPicture] = useState(true);


  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed in:', userCredential.user);
        // Optionally, navigate to the main app screen after successful sign in
        navigation.reset({
          index: 0,
          routes: [{name: 'Drawer'}],
        });
      })
      .catch((error) => {
        console.error('Sign in error:', error);
        Alert.alert('Incorrect Email or Password');
      });
  };

  return (
    <ImageBackground
      source={require("../../assets/FuturisticStadium.png")}
      resizeMode='cover'
      style={styles.backgroundImage}
      onLoad={() => {setLoadingPicture(false)}}
    >
      {loadingPicture ? 
        <FootballLoading/>
        :
        <View style={styles.container}>
          <Text style={styles.loginText}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#70d4e1"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#70d4e1"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={{color: '#101c2e', fontWeight: '600'}}>LOGIN</Text>
          </TouchableOpacity>
          <Text style={styles.signupText}>Don't Have an Account?</Text>
          {/* Navigate to SignUpScreen on button press */}
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{color: '#70d4e1', fontWeight: '600'}}>SIGN UP</Text>
          </TouchableOpacity>
        </View>  
      }
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    opacity: 0.8
  },  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 100 : 0,
    backgroundColor: 'black',
    opacity: 0.8,
  },
  loginText: {
    color: '#70d4e1',
    fontSize: 48,
    fontWeight: '700',
    marginTop: -25,
    paddingBottom: 25
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '80%',
    backgroundColor: '#112D4E',
    borderRadius: 20,
    color: '#70d4e1'
  },
  signInButton: {
    height: 40,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70d4e1',
    borderRadius: 20,
  },
  signupText: {
    marginVertical: 10,
    color: 'white',
  },
});
