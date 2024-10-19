// SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, ImageBackground, Text, TouchableOpacity} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import auth methods
import { doc, setDoc, collection } from "firebase/firestore";
import { useContext } from 'react';
import { UserContext } from '../../App';
import { DBContext } from '../../App';
import FootballLoading from '../Loading/FootballLoading';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const user = useContext(UserContext);
  const auth = user[2];

  const db = useContext(DBContext);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Signed up:', userCredential.user);
        const docRef = setDoc(doc(db, 'UserInfo', email), {
          theme: ["#101c2e", "#112D4E", "#70d4e1", "#FFFFFF"]
        })

      })
      .catch((error) => {
        console.error('Sign up error:', error);
      });
  };

  const [loadingPicture, setLoadingPicture] = useState(true);

  return (
    <ImageBackground
      source={require("../../assets/FuturisticStadium.png")}
      resizeMode='cover'
      style={styles.backgroundImage}
      onLoad={ ()=>{setLoadingPicture(false)} }
    >
      {loadingPicture ? 
        <FootballLoading/> 
        : 
        <View style={styles.container}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={"#70d4e1"}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={"#70d4e1"}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor={"#70d4e1"}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={{color: '#101c2e', fontWeight: '600'}}>SIGN UP</Text>
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
    backgroundColor: 'black',
    opacity: 0.8,
    paddingTop: Platform.OS === 'android' ? 100 : 0,
  },
  signUpText: {
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
  signUpButton: {
    height: 40,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#70d4e1',
    borderRadius: 20,
  },
  
});
