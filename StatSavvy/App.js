import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Add this import
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import StartSitPopup from './screens/StartSitPopup';
import MatchupScreen from './screens/Matchup'; 
import SettingScreen from './screens/Settings';

const Drawer = createDrawerNavigator();

export default function App() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleDismissPopup = () => {
    setIsFirstLoad(false);
  };

  return (
    <GestureHandlerRootView >
      <BottomSheetModalProvider>
        <StatusBar style="auto" />
        {isFirstLoad ? (
          <StartSitPopup onDismiss={handleDismissPopup} />
        ) : (
          <NavigationContainer>
            <Drawer.Navigator 
              initialRouteName="Home"
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
