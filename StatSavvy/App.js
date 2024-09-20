import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Navigator from './routes/homeStack';
import { useState } from 'react';
import StartSitPopup from './screens/StartSitPopup';
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
import { addDoc, collection } from "firebase/firestore"; 


export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyADYP6xGR96zzLNIWMcpcWatm02Ywt0xWE",
    authDomain: "statsavvy-bd25e.firebaseapp.com",
    projectId: "statsavvy-bd25e",
    storageBucket: "statsavvy-bd25e.appspot.com",
    messagingSenderId: "196452320353",
    appId: "1:196452320353:web:e8e8c4cc4da2964b909620",
    measurementId: "G-QEJJYMVQZ2"
  };

  // //Initialize Firebase.
  // const app = initializeApp(firebaseConfig);

  // //Initialize Cloud Firestore.
  // const db = getFirestore(app);



  const [isFirstLoad, setIsFirstLoad] = useState(true); // Default to true on app start

  const handleDismissPopup = () => {
    setIsFirstLoad(false);
  };

  return (
    <>
      {isFirstLoad ? (
        <StartSitPopup onDismiss={handleDismissPopup} />
      ) : (
        <Navigator />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8DA0BD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? 100 : 0,
  },
});
