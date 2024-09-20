import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
export default function StartSitPopup({ onDismiss }) {
  return (
    <View style={styles.popUpView}>
        <TouchableOpacity onPress={onDismiss} style={styles.xButton}>
            <Text style={styles.xButtonText}>X</Text>
        </TouchableOpacity>
        
        <View style={styles.playerComparisonView}>
          <TouchableOpacity style={styles.player1StatsTouchable}>
            <View style={styles.player1Icon}>

            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.player2StatsTouchable}></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={onDismiss}>
            <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
    </View>
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
    borderRadius: 10
  },
  player1StatsTouchable: {
    width: '50%',
    backgroundColor: '#8DA0BD'
  },
  player2StatsTouchable: {
    width: '50%',
    backgroundColor: '#8DA0BD'
  }
});
