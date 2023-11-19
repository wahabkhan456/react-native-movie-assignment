import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MoviesList, MovieSingle, FavouriteList } from '../containers/index';

export default function Navigation(props) {
  return (
    <RootStack {...props} />
  );
}

const Stack = createStackNavigator();

function RootStack(props) {
  return (
    <Stack.Navigator {...props}>
      <Stack.Screen name="Home" component={MyTabs} />
      <Stack.Screen name="MovieDetails" component={MovieSingle} />
    </Stack.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();

const MyTabs = (props) => {
  return (
    <Tab.Navigator {...props}>
      <Tab.Screen name="Movies" component={MoviesList} {...props} />
      <Tab.Screen name="Favourites" component={FavouriteList} {...props} />
    </Tab.Navigator>
  );
}
