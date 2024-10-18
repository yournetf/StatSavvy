import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, StyleSheet, Platform, Button, Modal, Text, Image, TouchableOpacity } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartSitPopup from './screens/StartSitPopup';
import StartSitInfiniteScreen from "./screens/StartSitInfinite";
import MatchupScreen from './screens/Matchup'; 
import SettingScreen from './screens/Settings';
import AccountSettingsScreen from './screens/Settings/AccountSettings'; 
import ThemeSettings from './screens/Settings/ThemeSettings';
import SignInScreen from "./screens/Auth/SignIn";
import SignUpScreen from "./screens/Auth/SignUp";

// Firebase configuration
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env';
import { SafeAreaView } from "react-navigation";

// Initialize the drawer and stack navigators
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Firebase config
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const DBContext = createContext();
//Initialize Firestore
const db = getFirestore(app);

export const UserContext = createContext();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}); 


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // Making the function async
      setIsAuthenticated(!!user);
      setCurrentUser(user);
  
      if (user) {
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, "UserInfo", user.email); // Assuming "users" is your collection
          const userDocSnap = await getDoc(userDocRef); // Use await here inside the async function
  
          if (userDocSnap.exists()) {
            setCurrentUserData(userDocSnap.data()); // Set the fetched data
          } else {
            console.log("No such document, initializing default theme");
            setCurrentUserData({
              theme: ["#101c2e", "#112D4E", "#FFFFFF"], // Default theme
            });          }
        } catch (error) {
          console.log("Error fetching document:", error);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const handleDismissPopup = () => {
    setIsFirstLoad(false);
    console.log(currentUser.email);
    console.log(currentUserData);
  };

  const MainStack = () => (
    <Stack.Navigator>
      <Stack.Screen 
        name="Drawer"
        component={DrawerScreens}
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="SignIn" component={SignInScreen} initialParams={{ auth }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} initialParams={{ auth }} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{headerShown: false}} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} options={{headerShown: false}}/>
    </Stack.Navigator>
  );

  const DrawerScreens = () => (
    <Drawer.Navigator 
      initialRouteName="Matchup"
      drawerContent={
        (props) => {
          return (
            <SafeAreaView>
              <View style={{
                height: 240,
                width: 240,
                backgroundColor: '#112D4E',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <TouchableOpacity>
                  <Image
                    source={{ uri: 'https://picsum.photos/144/144' }}
                    style={{width: 144, height: 144, borderRadius: 300}}
                  />
                </TouchableOpacity>
                <Text style={{color: '#70d4e1', top: 20, bottom: 25, fontWeight: '700'}}>{currentUser && currentUser.email ? currentUser.email : 'Loading...'}</Text>
              </View>
              <DrawerItemList {...props}/>
              <Button title="Sign Out" 
              onPress={() => {
                setIsModalVisible(true);
              }}/>
              <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={[{height: 100, width: 300, backgroundColor: '#112D4E', justifyContent: 'center', alignItems: 'center', borderRadius: 20}]}>
                    <Text style={{color: '#70d4e1', marginTop: 10}}>Are you sure you would like to sign out?</Text>
                    <View style={{width: '100%', flexDirection: 'row', padding: 20, justifyContent: 'center', alignItems: 'center'}}>
                      <Button title="yes"
                        style={{width: '42.5%', marginLeft: '5%', borderRadius: '2.83%'}}
                        onPress={async () => {
                          try {
                            setIsModalVisible(false);
                            await signOut(auth); // Sign out the user
                          } catch (error) {
                            console.error("Sign out error:", error);
                            setIsModalVisible(false);
                          }}
                        }
                      />
                      <Button title="no"
                      style={{width: '42.5%', marginLeft: '5%', borderRadius: '2.83%'}}
                        onPress={() => {
                          setIsModalVisible(false);
                        }
                      }/>
                    </View>
                  </View>
                </View>
              </Modal>
            </SafeAreaView>
          )
        }
      }
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#112D4E',
          width: 240,
        },
        drawerActiveTintColor: '#70d4e1',
        drawerInactiveTintColor: 'white',
        headerShown: Platform.OS === 'android' ? true : false,
        keyboardDismissMode: 'on-drag',
      }}
    >
      <Drawer.Screen name="Matchup" component={MatchupScreen} />
      <Drawer.Screen name="Start/Sit" component={StartSitInfiniteScreen}/>
      <Drawer.Screen name="Settings" component={SettingScreen}/>
    </Drawer.Navigator>
  );

  return (
    <UserContext.Provider value={[currentUser, currentUserData]}>
      <DBContext.Provider value={db}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
              {isAuthenticated ? (
                isFirstLoad ? (
                  <StartSitPopup onDismiss={handleDismissPopup} />
                ) : (
                  <MainStack />
                )
              ) : (
                <SignInScreen auth={auth} />
              )}
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </DBContext.Provider>
    </UserContext.Provider>
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
