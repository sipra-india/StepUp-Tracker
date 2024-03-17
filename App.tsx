import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import StepTracker from './StepTracker';


function App(){
  return (
    <View>
      <StepTracker/>
    </View>
  );
}

export default App;
