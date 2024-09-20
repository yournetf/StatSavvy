import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import MatchupScreen from '../screens/Matchup.js';

const screens = {
    Matchup: {
        screen: MatchupScreen
    },
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);