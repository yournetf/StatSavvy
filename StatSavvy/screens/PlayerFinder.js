import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Platform, Image, TouchableOpacity, Keyboard } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';
import { SQLiteDBContext } from '../App';
import { teamData } from '../assets/TeamThemes';
import headshots from '../assets/2024Headshots';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function PlayerFinder({
  playerChanged,
  setPlayer1Function,
  setPlayer2Function,
  setPlayer1Name,
  setPlayer2Name,
  color1,
  color2,
  color3,
  color4,
}) {

  const SQLiteDB = useContext(SQLiteDBContext);

  const [playerIDToTeamMap, setPlayerIDToTeamMap] = useState(new Map());
  const [playerIDToNumberMap, setPlayerIDToNumberMap] = useState(new Map());
  const [playerIDToPositionMap, setPlayerIDToPositionMap] = useState(new Map());
  const teamToColorMap1 = new Map(teamData.data.map(team => [team.teamName, team.color1]));
  const teamToColorMap2 = new Map(teamData.data.map(team => [team.teamName, team.color2]));

  const [positions, setPositions] = useState([
    { title: '⭐', data: [] },
    { title: 'ALL', data: [] },
    { title: 'QB', data: [] },
    { title: 'WR', data: [] },
    { title: 'TE', data: [] },
  ]);

  const [selectedSection, setSelectedSection] = useState(positions[0]); // Default to first section
  const [searchQuery, setSearchQuery] = useState('');

  const [favorites, setFavorites] = useState([]);
  const [favoritesMap, setfavoritesMap] = useState(new Map());
  const [favoritesAry, setFavoritesAry] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try{
        await SQLiteDB.execAsync(`
          PRAGMA journal_mode = WAL;

          CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER NOT NULL,
            name TEXT
          );
          
        `);

      } catch (error) {
        console.log(error);
      } 
    }

    const loadPlayers = async () => {
      try {

        const allPlayers = await SQLiteDB.getAllAsync('SELECT * FROM players');
        const playerNames = allPlayers.map(player => [player.name, player.playerID]);

        const newMap = new Map(allPlayers.map(player => [player.playerID, player.team]));
        setPlayerIDToTeamMap(newMap);
        const newMap2 = new Map(allPlayers.map(player => [player.playerID, player.number]));
        setPlayerIDToNumberMap(newMap2);
        const newMap3 = new Map(allPlayers.map(player => [player.playerID, player.position]));
        setPlayerIDToPositionMap(newMap3);

        const allQBs = await SQLiteDB.getAllAsync('SELECT * FROM qbs');
        const qbNames = allQBs.map(qb => [qb.name, qb.id]);

        const allWRs = await SQLiteDB.getAllAsync('SELECT * FROM wrs');
        const wrNames = allWRs.map(wr => [wr.name, wr.id]);

        const allRBs = await SQLiteDB.getAllAsync('SELECT * FROM rbs');
        const rbNames = allRBs.map(rb => [rb.name, rb.id]);

        const allTEs = await SQLiteDB.getAllAsync('SELECT * FROM tes');
        const teNames = allTEs.map(te => [te.name, te.id]);

        setFavorites(await SQLiteDB.getAllAsync('SELECT * FROM favorites'));
        

        setPositions([
          { title: '⭐', data: favoritesAry },
          { title: 'ALL', data: playerNames },
          { title: 'QB', data: qbNames },
          { title: 'WR', data: wrNames },
          { title: 'RB', data: rbNames },
          { title: 'TE', data: teNames },
        ]);
      } catch (error) {
        console.log('Error loading all players: ', error);
      }
    };
    loadPlayers();
    loadFavorites();
  }, []);

  useEffect(()=>{
    setfavoritesMap(new Map(favorites.map(fav => [fav.id, fav.name])));
    setFavoritesAry(favorites.map(fav => [fav.name, fav.id]));
    setPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[0] = { title: '⭐', data: favoritesAry }; // Update the "⭐" tab
      return updatedPositions;
    });
  }, [favorites]);

  useEffect(() => {
    const favoritesArray = Array.from(favoritesMap).map(([id, name]) => [name, id]);
    setPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[0] = { title: '⭐', data: favoritesArray }; // Update the "⭐" tab
      return updatedPositions;
    });
  }, [favoritesMap]); // Run whenever `favoritesMap` change

  const setPlayer1 = (img, name) => {
    setPlayer1Function(img);
    setPlayer1Name(name);
  };

  const setPlayer2 = (img, name) => {
    setPlayer2Function(img);
    setPlayer2Name(name);
  };

  const handlePlayerSelect = (img, name) => {
    if(playerChanged === 0) {
      setPlayer1(img, name);
    }
    else if(playerChanged === 1) {
      setPlayer2(img, name);
    }
  }

  const handleFavorited = (playerID, playerName) => {
    setfavoritesMap((prevMap) => {
      const newMap = new Map(prevMap);
      if (newMap.has(playerID)) {
        newMap.delete(playerID);
        deleteFromFavsSQLite(playerID);
      } else {
        newMap.set(playerID, playerName);
        addToFavsSQLite(playerID, playerName);
      }
      return newMap;
    });
  };

  const deleteFromFavsSQLite = async(playerID) => {
    await SQLiteDB.runAsync(
      `DELETE FROM favorites WHERE id = ?`,
      [playerID]
    );
    const allRowsPlayers = await SQLiteDB.getAllAsync('SELECT * FROM favorites');
        for(const row of allRowsPlayers) {
          console.log(row.id, "\t" , row.name, "\t");
        }
  }

  const addToFavsSQLite= async(playerID, playerName) => {
    await SQLiteDB.runAsync(
      `INSERT INTO favorites (id, name) VALUES (?, ?)`,
      [playerID, playerName]
    );
    const allRowsPlayers = await SQLiteDB.getAllAsync('SELECT * FROM favorites');
        for(const row of allRowsPlayers) {
          console.log(row.id, "\t" , row.name, "\t");
        }
  }
  

  // Filter data based on active tab and search query
  const filteredData = selectedSection.data.filter(item =>
    item[0].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.sheetView, { backgroundColor: color1 }]}>
      {/* Horizontal list of sections */}
      <BottomSheetFlatList
        style={[{ marginTop: 10 }]}
        data={positions}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedSection(item)}
            style={[{ maxHeight: 60 }]}
          >
            <View
              style={[
                styles.section,
                item.title === selectedSection.title && { backgroundColor: color2 },
              ]}
            >
              <Text
                style={[
                  styles.sectionHeader,
                  item.title === selectedSection.title && { color: color3 },
                ]}
              >
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
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search players..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          autoCorrect={false}
          inputMode='text'
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>


      {/* Vertical list of players for the selected section */}
      <BottomSheetFlatList
        style={[{ top: -160 }]}
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              {
                backgroundColor: teamToColorMap1.get(playerIDToTeamMap.get(item[1])) || '#DBE2EF',
              },
            ]}
            onPress={() => handlePlayerSelect(headshots[parseInt(item[1])], item[0])}
          >
            <Image
              source={headshots[parseInt(item[1])] || require(`../assets/10.png`)}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Text
              style={[styles.itemText, { color: teamToColorMap2.get(playerIDToTeamMap.get(item[1])) }]}
            >
              {item[0]}
            </Text>
            <Text
              style={[
                styles.itemNumber,
                { color: teamToColorMap2.get(playerIDToTeamMap.get(item[1])) },
              ]}
            >
              {playerIDToNumberMap.get(item[1])}
            </Text>
            <Text
              style={[
                styles.itemPosition,
                { color: teamToColorMap2.get(playerIDToTeamMap.get(item[1])) },
              ]}
            >
              {playerIDToPositionMap.get(item[1])
                ? playerIDToPositionMap.get(item[1]).toUpperCase()
                : ''}
            </Text>

        
              <TouchableOpacity style={styles.itemStar} onPress={()=>{handleFavorited(item[1], item[0])}}>
                {favoritesMap.has(item[1]) ? 
                (<FontAwesome5 name="star" size={24} color="gold" solid/>)
                :
                (<FontAwesome5 name="star" size={24} color="gold" />)  
              }
              </TouchableOpacity>
              
  

          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.verticalList}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No players available</Text>}
        onScrollBeginDrag={()=>{Keyboard.dismiss()}}
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
    borderRadius: 50,
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
    borderColor: '#DBE2EF',
    borderRadius: 5,
    borderWidth: 1,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    
  },
  itemNumber: {
    position: 'absolute',
    right:'25%',
    borderRightColor: 'grey',
    borderRightWidth: 2,
    paddingRight: '3%'
  },
  itemPosition: {
    position: 'absolute',
    right: '15%',
  },
  itemStar: {
    position: 'absolute',
    right: '5%',
    paddingBottom: 5,
  },
  horizontalList: {
    top: 35,
    height: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
    maxHeight: 50,
  },
  verticalList: {
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray'
  },
  searchBarContainer: {
    top: '-30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 2, // For a subtle shadow
  },
  searchBar: {
    flex: 1, // Take up the available space
    fontSize: 16,
    paddingLeft: 5,
  },
  clearButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: 'gray',
  },  
});
