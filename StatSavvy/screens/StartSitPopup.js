import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
export default function StartSitPopup({ onDismiss }) {
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

  return (
    
    <GestureHandlerRootView style={styles.popUpView}>
      <TouchableOpacity onPress={onDismiss} style={styles.xButton}>
        <Text style={styles.xButtonText}>X</Text>
      </TouchableOpacity>
      
      <View style={styles.playerComparisonView}>
        <TouchableOpacity 
          onPress={() => setSelectedPlayer(1)} 
          style={[styles.player1StatsTouchable, selectedPlayer === 1 ? styles.playerSelected : styles.playerUnselected]}
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
          style={[styles.player2StatsTouchable, selectedPlayer === 2 ? styles.playerSelected : styles.playerUnselected]}
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
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onDismiss}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  popUpView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#112D4E',
    padding: 20,
  },
  xButton: {
    position: 'absolute',
    height: 90,
    width: 90,
    right: 0,
    top: 50,
    padding: 20,
    paddingLeft: 30,
    backgroundColor: 'transparent',
  },
  xButtonText: {
    color: '#70d4e1',
    fontSize: 40,
    fontWeight: '800'
  },
  submitButton: {
    position: 'absolute',
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 50,
    backgroundColor: '#112D4E',
    borderColor: '#70d4e1',
    borderWidth: 3,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#70d4e1',
    fontSize: 24,
    fontWeight: '700'
  },
  playerComparisonView: {
    position: 'absolute',
    top: 160,
    height: '70%',
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor:'#DBE2EF',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#70d4e1'
  },
  player1StatsTouchable: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#376499',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: '#70d4e1'
  },
  player2StatsTouchable: {
    alignItems: 'center',
    width: '50%',
    backgroundColor: '#376499',
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
    backgroundColor: '#70d4e1',
    opacity: '40%',
    borderColor: 'green'
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
