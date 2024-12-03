import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, Button, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRef } from 'react';
import PlayerFinder from './PlayerFinder';
import { UserContext } from '../App';
import FootballLoading from './Loading/FootballLoading';

export default function Matchup({ navigation }) {


  const user = useContext(UserContext);

  if (!user || !user[1] || !user[1].theme) {
    return <FootballLoading/>;
  }

  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  const fontSize = screenWidth ? screenWidth * 0.03 : 14;

  const [matchupPercent1, setMatchupPercent1] = useState(75);
  const [matchupPercent2, setMatchupPercent2] = useState(25);
  
  const bottomSheetModalRef = useRef(null);
  const [snapPoints, setSnapPoints] = useState(["10%","70%"]);
  const [currentSnapPoint, setCurrentSnapPoint] = useState("5");

  const [player1Image, setPlayer1Image] = useState(require('../assets/2024_NFL_HeadShots/headshot_11.png'));
  const [player2Image, setPlayer2Image] = useState(require('../assets/2024_NFL_HeadShots/headshot_11.png'));
  const [player1Name, setPlayer1Name] = useState("Player#1 Name");
  const [player2Name, setPlayer2Name] = useState("Player#2 Name");

  const [player1Loading, setPlayer1Loading] = useState(true);
  const [player2Loading, setPlayer2Loading] = useState(true);

  useEffect(() =>{
    bottomSheetModalRef.current?.present();
  },[])

  function handlePanUp(){
    if(currentSnapPoint === "5"){
      bottomSheetModalRef.current?.snapToIndex(1);
    }
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: user[1].theme[0]}]}>
      <BottomSheetModalProvider>
        <View style={[styles.header, {backgroundColor: user[1].theme[1]}]}>
          
          <TouchableOpacity style = {[styles.headerIcon, {backgroundColor: user[1].theme[2]}]} onPress={handlePanUp}>
            <Image 
              source  = { player1Image }
              style   = {styles.iconImage}
            />
          </TouchableOpacity>
          
          <Text numberOfLines={1} style = {[styles.playerName, {fontSize: fontSize}]}>{player1Name}</Text>
          
          <TouchableOpacity style = {styles.vsSquare}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>VS</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {[styles.headerIcon, styles.headerIconRight, {backgroundColor: user[1].theme[2]}]} onPress={handlePanUp}>
            <Image 
            source  = { player2Image }
            style   = {styles.iconImage}
            />
          </TouchableOpacity>

          <View style={[styles.headerBottom, {backgroundColor: user[1].theme[2]}]}>
          </View>

          <Text numberOfLines={1} style = {[styles.playerName, {left: '55%', fontSize: fontSize}]}>{player2Name}</Text>
        
          <View style={styles.percentageBar}>
            <View style={[styles.percentageBarStatus, {width: `${matchupPercent1}%`}]}>

            </View>
          </View>

          <View style={[styles.percentageBar, styles.percentageBarRight]}>
            <View style={[styles.percentageBarStatusRight, {width: `${matchupPercent2}%`}]}>

            </View>
          </View>

        </View>

        <View style={[styles.bodyCard, {backgroundColor: user[1].theme[1]}]}>
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
          onChange={Keyboard.dismiss}
        >
          <PlayerFinder 
            setPlayer1Function={setPlayer1Image}
            setPlayer2Function={setPlayer2Image} 
            setPlayer1Name={setPlayer1Name}
            setPlayer2Name={setPlayer2Name}
            color1={user[1].theme[0]} 
            color2={user[1].theme[1]} 
            color3={user[1].theme[2]} 
            color4={user[1].theme[3]}>  
          </PlayerFinder>
        </BottomSheetModal>
      
      
      </BottomSheetModalProvider>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101c2e',
    paddingTop: Platform.OS === "android" ? 50 : 0
  },
  header: {
    position: 'relative',
    width: '90%',
    height: '20%',
    left: '5%',
    borderRadius: 10,
    padding: 0,
    borderColor: 'black',
    borderWidth: 1,
  },
  headerIcon: {
    position: 'absolute',
    width: '15%',
    height: '35%',
    left: '1.25%',
    top: '7%',
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: '100%',
  },
  playerName: {
    position: 'absolute',
    left: '17%',
    top: '20%',
    color: 'white',
    fontWeight: '500'
  },
  vsSquare: {
    position: 'absolute',
    width: '9%',
    height: '18%',
    left: '45%',
    top: '30%',
    backgroundColor: '#376499',
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
    left: '83.75%'
  },
  percentageBar: {
    position: 'absolute',
    width: '28%',
    height: '4%',
    left: '16%',
    top: '35%',
    backgroundColor: '#E1D7B7',
    opacity: 0.45,
    borderRadius: 100
  },
  percentageBarRight: {
    left: '56%',
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
