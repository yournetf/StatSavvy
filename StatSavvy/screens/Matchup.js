import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import PlayerFinder from './PlayerFinder';

export default function Matchup({ navigation }) {

  const {screenWidth, screenHeight} = Dimensions.get('screen');
  const [matchupPercent1, setMatchupPercent1] = useState(75);
  const [matchupPercent2, setMatchupPercent2] = useState(25);
  
  const bottomSheetModalRef = useRef(null);
  const [snapPoints, setSnapPoints] = useState(["5%","50%"]);
  const [currentSnapPoint, setCurrentSnapPoint] = useState("5");

  useEffect(() =>{
    bottomSheetModalRef.current?.present();
  },[])

  function handlePanUp(){
    if(currentSnapPoint === "5"){
      bottomSheetModalRef.current?.snapToIndex(1);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheetModalProvider>
        <View style={styles.header}>
          
          <TouchableOpacity style = {styles.headerIcon} onPress={handlePanUp}>
            <Image 
            source  = { {uri: 'https://picsum.photos/50/50'} }
            style   = {styles.iconImage}
            />
          </TouchableOpacity>
          
          <Text numberOfLines={1} style = {styles.playerName}>Player#1 Name</Text>
          
          <TouchableOpacity style = {styles.vsSquare}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>VS</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {[styles.headerIcon, styles.headerIconRight]} onPress={handlePanUp}>
            <Image 
            source  = { {uri: 'https://picsum.photos/50/50'} }
            style   = {styles.iconImage}
            />
          </TouchableOpacity>

          <View style={styles.headerBottom}>
          </View>

          <Text numberOfLines={1} style = {[styles.playerName, {left: 203}]}>Player#2 Name</Text>
        
          <View style={styles.percentageBar}>
            <View style={[styles.percentageBarStatus, {width: `${matchupPercent1}%`}]}>

            </View>
          </View>

          <View style={[styles.percentageBar, styles.percentageBarRight]}>
            <View style={[styles.percentageBarStatusRight, {width: `${matchupPercent2}%`}]}>

            </View>
          </View>

        </View>

        <View style={styles.bodyCard}>
          <View style={styles.bodyCardSection}></View>
          <View style={styles.bodyCardSection}></View>
          <View style={styles.bodyCardSection}></View>
          <View></View>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
        >
          <PlayerFinder></PlayerFinder>
        </BottomSheetModal>
      
      
      </BottomSheetModalProvider>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8DA0BD',
    paddingTop: Platform.OS === "android" ? 50 : 0
  },
  header: {
    position: 'relative',
    width: '90%',
    height: '20%',
    left: '5%',
    borderRadius: 10,
    backgroundColor: '#DBE2EF',
    padding: 0,
    borderColor: 'black',
    borderWidth: 1,

  },
  headerIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 5,
    top: 10,
    backgroundColor: 'black',
    borderRadius: 100,
  },
  iconImage: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 100,
    left: 2.5,
    top: 2.5
  },
  playerName: {
    position: 'absolute',
    left: 60,
    top: 25,
    fontSize: 16,
    fontWeight: '500'
  },
  vsSquare: {
    position: 'absolute',
    width: 25,
    height: 25,
    left: 175,
    top: 35,
    backgroundColor: '#112D4E',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBottom: {
    position: 'absolute',
    height: '43%',
    width: '99%',
    left: '0.5%',
    top: '55%',
    backgroundColor: '#376499',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  headerIconRight: {
    left: '86%'
  },
  percentageBar: {
    position: 'absolute',
    width: 100,
    height: 5,
    left: 60,
    top: 50,
    backgroundColor: '#E1D7B7',
    opacity: 0.45,
    borderRadius: 100
  },
  percentageBarRight: {
    left: 210,
  },
  percentageBarStatus: {
    width: '75%',
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 10
  },
  percentageBarStatusRight: {
    position: 'absolute',
    height: '100%',
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10
  },
  bodyCard: {
    width: '90%',
    height: '70%',
    top: '5%',
    left: '5%',
    backgroundColor: '#DBE2EF',
    borderRadius: 10
  },
  bodyCardSection: {
    height: '24.5%',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    borderBottomEndRadius: 25,
    borderBottomLeftRadius: 25
  }
});
