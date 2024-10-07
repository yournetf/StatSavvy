import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Correct import for Stack

import StartSitPopup from './screens/StartSitPopup';
import MatchupScreen from './screens/Matchup'; 
import SettingScreen from './screens/Settings';
import AccountSettingsScreen from './screens/Settings/AccountSettings'; // Hidden Screen
import ThemeSettings from './screens/Settings/ThemeSettings';

// Initialize the drawer and stack navigators
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator(); // Use correct native stack navigator

export default function App() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleDismissPopup = () => {
    setIsFirstLoad(false);
  };

  // Main Stack including hidden screens and drawer screens
  const MainStack = () => (
    <Stack.Navigator>
      <Stack.Screen 
        name="Drawer"
        component={DrawerScreens}
        options={{ headerShown: false }}  // Hide header for drawer screens
      />
      {/* Hidden screen that won't appear in the drawer */}
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
    </Stack.Navigator>
  );

  // Define the screens inside the drawer navigator
  const DrawerScreens = () => (
    <Drawer.Navigator 
      initialRouteName="Matchup"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#112D4E',
          width: 240,
        },
        drawerActiveTintColor: '#70d4e1',
        drawerInactiveTintColor: 'white',
      }}
    >
      <Drawer.Screen name="Matchup" component={MatchupScreen} />
      <Drawer.Screen name="Start/Sit" component={StartSitPopup}/>
      <Drawer.Screen name="Settings" component={SettingScreen}/>
    </Drawer.Navigator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="auto" />
        {isFirstLoad ? (
          <StartSitPopup onDismiss={handleDismissPopup} />
        ) : (
          <NavigationContainer>
            {/* Use MainStack which contains both drawer and hidden screens */}
            <MainStack />
          </NavigationContainer>
        )}
      </BottomSheetModalProvider>
    </GestureHandlerRootView> 
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
