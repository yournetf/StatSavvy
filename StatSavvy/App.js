import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from 'expo-sqlite';
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
import RecapScreen from "./screens/Recap";
import AdminMainScreen from "./screens/Admin/AdminMain";

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

export const SQLiteDBContext = createContext();
let SQLiteDB;


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // State for storing the profile picture URL


  

  useEffect(() => {
    console.log("in use effect");
  
    async function createSQLiteDB() {
      try {
        SQLiteDB = await SQLite.openDatabaseAsync("localDatabase.db");
        console.log("Database opened");
  
        await SQLiteDB.execAsync(`
          PRAGMA journal_mode = WAL;

          CREATE TABLE IF NOT EXISTS test (
            id INTEGER PRIMARY KEY NOT NULL, 
            value TEXT NOT NULL, 
            intValue INTEGER
          );
          CREATE TABLE IF NOT EXISTS players (
            playerID INTEGER PRIMARY KEY NOT NULL, 
            name TEXT, 
            team TEXT,
            number INTEGER,
            age INTEGER,
            position TEXT
          );
        `);
        console.log("Database setup complete");

        // try {
        //   // Reference to your Firestore collection
        //   const querySnapshot = await getDocs(collection(db, "players"));
        //   const players = querySnapshot.docs.map(doc => doc.data());
        //   for (const player of players) {
        //     const name = player.name || "Unknown Player"; // Provide a default if missing
        //     const team = player.team || "N/A";
        //     const number = isNaN(parseInt(player.player_jersey_number)) ? 1 : parseInt(player.player_jersey_number);
        //     const age = isNaN(parseInt(player.age)) ? 1 : parseInt(player.age);
        //     const position = player.position || "N/A";
          
        //     // console.log(`Inserting: ${typeof name}, ${typeof team}, ${typeof number}, ${typeof age}, ${typeof position}`); // Log each row being inserted
          
        //     try {
        //       await SQLiteDB.runAsync(
        //         `INSERT INTO players (name, team, number, age, position) VALUES (?, ?, ?, ?, ?)`,
        //         [name, team, number, age, position]
        //       );
        //     } catch (error) {
        //       console.error("Error executing insert:", error);
        //     }

        //   };
        // } catch (error) {
        //   console.log("Error getting documents: ", error);
        // }

        const allRowsTest = await SQLiteDB.getAllAsync('SELECT * FROM test');
        for (const row of allRowsTest) {
          console.log(row.id, row.value, row.intValue);
        }

        const allRowsPlayers = await SQLiteDB.getAllAsync('SELECT * FROM players');
        for(const row of allRowsPlayers) {
          console.log(row.playerID, "\t" , row.name, "\t", row.team, "\t", row.number, "\t", row.age, "\t", row.position);
        }

      } catch (error) {
        console.error("Error initializing database:", error);
      }
    }
    createSQLiteDB();
  }, []);
  

  
  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // Making the function async
      setIsAuthenticated(!!user);
      setCurrentUser(user);
  
      if (user) {
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, "UserInfo", user.email); 
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

  useEffect(() => {
    const fetchProfilePicture = async () => {
        if (currentUser) { // Ensure currentUser is defined
            const docRef = doc(db, 'UserInfo', currentUser.email); // Use currentUser.email
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setProfilePictureUrl(data.profilePicture); // Set the profile picture URL
            } else {
                console.log("No such document!");
            }
        }
    };
    fetchProfilePicture();
  }, [currentUser]); // Add currentUser as a dependency
  
  const handleDismissPopup = () => {
    setIsFirstLoad(false);
    // console.log(currentUser.email);
    // console.log(currentUserData);
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
                backgroundColor: currentUserData.theme[0],
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <TouchableOpacity>
                  <Image
                      source={{ uri: profilePictureUrl || 'https://picsum.photos/144/144' }} // Fallback image
                      style={{width: 144, height: 144, borderRadius: 300}}
                  />
                </TouchableOpacity>
                <Text style={{color: currentUserData.theme[2], top: 20, bottom: 25, fontWeight: '700'}}>{currentUser && currentUser.email ? currentUser.email : 'Loading...'}</Text>
              </View>
              <DrawerItemList {...props}/>
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                setIsModalVisible(true);
              }}>
                <Text style={{color: currentUserData.theme[2]}}>Sign Out</Text>
              </TouchableOpacity>
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
          backgroundColor: currentUserData.theme[0],
          width: 240,
        },
        drawerActiveTintColor: currentUserData.theme[2],
        drawerInactiveTintColor: currentUserData.theme[1],
        headerShown: Platform.OS === 'android' ? true : false,
        keyboardDismissMode: 'on-drag',
      }}
    >
      <Drawer.Screen name="Matchup" component={MatchupScreen} />
      <Drawer.Screen name="Start/Sit" component={StartSitInfiniteScreen}/>
      <Drawer.Screen name="Recap" component={RecapScreen}/>
      {currentUserData.Admin ? (<Drawer.Screen name="Admin" component={AdminMainScreen}/>) : <></>}
      <Drawer.Screen name="Settings" component={SettingScreen}/>
    </Drawer.Navigator>
  );

  return (
    <UserContext.Provider value={[currentUser, currentUserData, auth]}>
      <DBContext.Provider value={db}>
        <SQLiteDBContext.Provider value={SQLiteDB}>
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
                  <Stack.Navigator>
                    <Stack.Screen 
                      name="SignIn" 
                      component={SignInScreen} 
                      options={{ headerShown: false }}  
                    />
                    <Stack.Screen 
                      name="SignUp" 
                      component={SignUpScreen} 
                      options={{ headerShown: false }}  
                    />
                  </Stack.Navigator>              )}
              </NavigationContainer>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SQLiteDBContext.Provider>
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
