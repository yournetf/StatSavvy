import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MatchupScreen from '../screens/Matchup.js';
import PlayerFinderScreen from '../screens/PlayerFinder.js';

const screens = {
    Matchup: {
        screen: MatchupScreen
    },
    PlayerFinder: {
        screen: PlayerFinderScreen
    }   
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);