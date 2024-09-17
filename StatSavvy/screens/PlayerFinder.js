import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function PlayerFinder() {

  const positions = [
    { title: 'FAV', data: ['Player 1', 'Player 2', 
      'Player 1', 'Player 2','Player 1', 'Player 2','Player 1', 'Player 2',
      'Player 1', 'Player 2','Player 1', 'Player 2','Player 1', 'Player 2',
      'Player 1', 'Player 2','Player 1', 'Player 2','Player 1', 'Player 2',
      'Player 1', 'Player 2',
    ] },
    { title: 'ALL', data: ['Player 3', 'Player 4'] },
    { title: 'QB', data: ['Player 5'] },
    { title: 'RB', data: ['Player 6', 'Player 7', 'Player 8'] },
    { title: 'WR', data: [] }, // Empty data example
    { title: 'TE', data: ['Player 9'] },
    { title: 'K', data: ['Player 10'] },
    { title: 'DEF', data: ['Player 11'] }
  ];

  const [selectedSection, setSelectedSection] = useState(positions[0]); // Default to first section

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal list of sections */}
      <FlatList
        data={positions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedSection(item)}>
            <View style={[styles.section, item.title === selectedSection.title && styles.selectedSection]}>
              <Text style={styles.sectionHeader}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      {/* Vertical list of players for the selected section */}
      <FlatList
        data={selectedSection.data}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalList}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No players available</Text>}
      />
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? 50 : 0,
    backgroundColor: '#8DA0BD'
  },
  section: {
    marginHorizontal: 5,
    width: 75, 
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#112D4E',
    borderRadius: 100,
  },
  selectedSection: {
    backgroundColor: '#376499', 
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white'
  },
  item: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#DBE2EF',
    borderRadius: 5,
    textAlign: 'center'
  },
  horizontalList: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  verticalList: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray'
  }
});
