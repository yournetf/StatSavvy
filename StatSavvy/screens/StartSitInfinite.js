import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'; 
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useContext } from 'react';
import { UserContext } from '../App';
import FootballLoading from './Loading/FootballLoading';

export default function StartSitInfinite({ onDismiss }) {

  const user = useContext(UserContext);

  if (!user || !user[1] || !user[1].theme) {
    return <FootballLoading/>;
  }

  const color1 = user[1].theme[0];
  const color2 = user[1].theme[1];
  const color3 = user[1].theme[2];
  const color4 = user[1].theme[3];

  const player1 = [{
    name: "Tyreek Hill",
    data: [ 
      { key: 'Targets🎯', value: "8.3" },
      { key: 'Yards💨', value: "81.3" }, 
      { key: 'Touchdowns🏈', value: "0.8" },
      { key: 'aDOT🕳', value: "15.8" },
      { key: 'YPRR📬', value: "2.18" }, 
      { key: 'Fantasy PPG🚀', value: "18.4"}
    ]
  }];

  const player2 = [{
    name: "Cooper Kupp",
    data: [
      { key: 'Targets🎯', value: "7.5" },
      { key: 'Yards💨', value: "94.5" },
      { key: 'Touchdowns🏈', value: "0.6" },
      { key: 'aDOT🕳', value: "12.6" },
      { key: 'YPRR📬', value: "2.48" },
      { key: 'Fantasy PPG🚀', value: "25.4"}
    ]
  }];

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const rotation = useSharedValue(0);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);
  const opacity = useSharedValue(1);
  const chooseLeft = useAnimatedStyle(() => {
    return{
      transform: [
                  { rotate: `${rotation.value}deg` }, 
                  { translateX: xPosition.value},
                  { translateY: yPosition.value},
                 ],
      opacity: opacity.value
    };
  }, [])
  
  const handleSwipeLeft = () => {
    setSelectedPlayer(1);

    setTimeout(() => {
      rotation.value = withTiming(rotation.value - 180, {duration: 2000});
      xPosition.value = withTiming(-700, {duration: 1000});
      yPosition.value = withTiming(0, {duration: 2000});
      opacity.value = withTiming(0, {duration: 1000});
    }, 500)

    setTimeout(() => {
      rotation.value = withTiming(0, { duration: 1000 });
      xPosition.value = withTiming(0, { duration: 1000 });
      yPosition.value = withTiming(1, {duration: 1000});
      opacity.value = withTiming(1, {duration: 1000});
    }, 3000);
  }

  const handleSwipeRight = () => {
    setSelectedPlayer(2);

    setTimeout(() => {
      rotation.value = withTiming(rotation.value + 180, {duration: 2000});
      xPosition.value = withTiming(700, {duration: 1000});
      yPosition.value = withTiming(0, {duration: 2000});
      opacity.value = withTiming(0, {duration: 1000});
    }, 500)

    setTimeout(() => {
      rotation.value = withTiming(0, { duration: 1000 });
      xPosition.value = withTiming(0, { duration: 1000 });
      yPosition.value = withTiming(1, {duration: 1000});
      opacity.value = withTiming(1, {duration: 1000});
    }, 3000);

  }

  const handleSwipeUp = () => {
    setSelectedPlayer(0);

    setTimeout(() => {
      yPosition.value = withTiming(-500, {duration: 1000});
      opacity.value = withTiming(0, {duration: 500});
    }, 250)

    setTimeout(() => {
      yPosition.value = withTiming(1, {duration: 1000});
      opacity.value = withTiming(1, {duration: 1000});
    }, 2000);

  }


  return (
    
    <GestureHandlerRootView style={[styles.popUpView, {backgroundColor: color1}]}>
      
        <Modal
            isVisible={true}
            backdropColor='transparent'
            hasBackdrop={false}
            coverScreen={false}
            swipeDirection={['left', 'right', 'up']}
            swipeThreshold={50}        
            onLayout={(event) => {
              const { width, height, x, y } = event.nativeEvent.layout;
              if(x<0){
                handleSwipeLeft();
              } else if(x>40){
                handleSwipeRight();
              } else if(y<-20){
                handleSwipeUp();
              }                         
            }}
        >
            <Animated.View style={[styles.playerComparisonView, chooseLeft, {borderColor: color3}]}>
                <TouchableOpacity 
                  onPress={() => setSelectedPlayer(1)} 
                  style={[ {backgroundColor: color2, borderColor: color3}, styles.player1StatsTouchable, selectedPlayer === 1 ? styles.playerSelected && {backgroundColor: color3} : styles.playerUnselected]}
                >
                <View style={styles.playerIcon}>
                    <Image 
                    source={{ uri: 'https://picsum.photos/50/50' }} 
                    style={styles.iconImage} 
                    />
                </View>
                <Text style={styles.playerName}>{player1[0].name}</Text>
                <FlatList
                    style={styles.playerInfo}
                    data={player1[0].data}
                    renderItem={({ item }) => (
                    <View style={styles.statItem}>
                        <Text style={styles.statKey}>{item.key}: </Text>
                        <Text style={styles.statValue}>{item.value}</Text>
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => setSelectedPlayer(2)} 
                style={[{backgroundColor: color2, borderColor: color3}, styles.player2StatsTouchable, selectedPlayer === 2 ? styles.playerSelected && {backgroundColor: color3} : styles.playerUnselected]}
                >
                <View style={styles.playerIcon}>
                    <Image 
                    source={{ uri: 'https://picsum.photos/50/50' }} 
                    style={styles.iconImage} 
                    />
                </View>
                <Text style={styles.playerName}>{player2[0].name}</Text>
                <FlatList
                    style={styles.playerInfo}
                    data={player2[0].data}
                    renderItem={({ item }) => (
                    <View style={styles.statItem}>
                        <Text style={styles.statKey}>{item.key}: </Text>
                        <Text style={styles.statValue}>{item.value}</Text>
                    </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                </TouchableOpacity>
            </Animated.View>
        </Modal>

      <TouchableOpacity style={styles.informationButton} onPress={onDismiss}>
        <FontAwesome5 name="info-circle" color="cyan" size={24}/>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  popUpView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    margin: 0
  },
  informationButton: {
    position: 'absolute',
    bottom: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '10%',
    height: '4%',
    backgroundColor: '#112D4E',
    borderColor: '#70d4e1',
    borderWidth: 2,
    borderRadius: '100%',
  },
  playerComparisonView: {
    position: 'absolute',
    top: '7.5%',
    left: '5%',
    height: '80%',
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 3,
  },
  player1StatsTouchable: {
    alignItems: 'center',
    width: '50%',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderRightWidth: 1,
  },
  player2StatsTouchable: {
    alignItems: 'center',
    width: '50%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  playerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '8%',
    width: 100,
    height: 100,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  iconImage: {
    width: 90,
    height: 90,
    borderRadius: 45
  },
  playerSelected: {
    opacity: '40%',
  },
  statItem: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  statKey: {
    fontWeight: 'bold',
    color: 'black',
  },
  statValue: {
    color: 'black',
  },
  playerName: {
    top: 50,
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
  playerInfo: {
    height: '100%',
    top: 50
  },
  statItem: {
    marginTop: 20,
  }
});
