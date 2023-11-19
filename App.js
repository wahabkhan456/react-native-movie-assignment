import React from 'react';
import Root from './src/index';
import configureStore from './src/store/index';
import 'react-native-gesture-handler';
const { persistor, store } = configureStore();

export default function App() {
  return <Root store={store} persistor={persistor} />;
}
