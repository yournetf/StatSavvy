import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';

export default function PlayerFinder({ color1, color2, color3, color4 }) {
  
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
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={[styles.sheetView, { backgroundColor: color1 }]}>
      {/* Horizontal list of sections */}
      <BottomSheetFlatList
        style={[{ top: 0 }]}
        data={positions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedSection(item)} style={[{ maxHeight: 60 }]}>
            <View 
              style={[
                styles.section, 
                item.title === selectedSection.title && { backgroundColor: color2 }
              ]}
            >
              {/* Conditional text style change */}
              <Text style={[
                styles.sectionHeader, 
                item.title === selectedSection.title && { color: color3 }
              ]}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search players..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      {/* Vertical list of players for the selected section */}
      <BottomSheetFlatList
        style={[{ top: -20 }]}
        data={selectedSection.data}
        renderItem={({ item }) =>(
          <TouchableOpacity>
            <Text style={styles.item}>{item}</Text>
          </TouchableOpacity>
        )}
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
  sheetView: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  section: {
    marginHorizontal: 5,
    width: 75, 
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#112D4E',
    borderRadius: 100,
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
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray'
  },
  searchBar:{
    top: -50,
    left: '5%',
    height: 50,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
  }
});
