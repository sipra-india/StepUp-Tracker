import React, { useState } from 'react';
import {
  Pressable,
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
  const [show, Setshow] = useState(false);
  return (
    <View>
      {show? <StepTracker/> : 
      <View>
        <Pressable onPress={() =>  Setshow(true)}>
          <Text>Step</Text>
          <Text>Tracker</Text>
          <Text>Click to continue...</Text>
        </Pressable>
      </View>
      }
    </View>
  );
}

export default App;
