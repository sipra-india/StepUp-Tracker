import React, { useEffect, useState } from "react";
import { Alert, Text, View, StyleSheet, Pressable } from "react-native";
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StepTracker = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isCounting, setIsCounting] = useState(false);
  const [done, setDone] = useState(false);

  const StoreLocation = async (key: string,value: object) => {
    try{
      const val = JSON.stringify(value);
      await AsyncStorage.setItem(key,val)
    }catch(e: any){
      Alert.alert(e.message)
    }
    
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    if (location ) {
      const send = setInterval(() => {
        StoreLocation('polyline', location);
      }, 10000);
    }
  }, []);

  useEffect(() => {
    const subscribeToStepCount = async () => {
      try {
        const { granted } = await Pedometer.getPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission not granted", "Please grant permission to track steps.");
          return;
        }

        const isAvailable = await Pedometer.isAvailableAsync();
        setIsAvailable(isAvailable);

        if (isAvailable) {
          const start = new Date();
          start.setHours(0, 0, 0, 0)

          const subscription = Pedometer.watchStepCount(result => {
            if (isCounting) {
              setCurrentStep(result.steps);
            }
          });

          return () => {
            subscription.remove();
          };
        }
      } catch (error: any) {
        Alert.alert("Error fetching step count:", error.message);
      }
    };

    subscribeToStepCount();
  }, [isCounting]);

  const startCounting = () => {
    if (isAvailable == true){
      setIsCounting(true);
    }else{
      Alert.alert('Pedometer is not available!')
    }
  };

  const stopCounting = () => {
    setIsCounting(false);
    setDone(true);
  };

  const resetCount = () => {
    setCurrentStep(0);
    setDone(false);
  };

  return (
    <View>
      <Text style={styles.steps}>Current Step Count: {currentStep}</Text>
      <View style={styles.btncontainer}>
        {isCounting? 
        ( done ? 
        <Pressable style={styles.stepbtn} onPress={resetCount}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable> : 
        <Pressable style={styles.stepbtn} onPress={stopCounting}>
          <Text style={styles.buttonText}>Stop</Text>
        </Pressable> ) : 
        <Pressable style={styles.stepbtn} onPress={startCounting}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
        }
        
      </View>
      <Text style={styles.availability}>Is Pedometer Available: {isAvailable}</Text>
      <Text style={styles.location}>Location: {JSON.stringify(location)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  btncontainer: {
    flexDirection: 'row',
  },
  stepbtn:{
    flex: 1,
    justifyContent: 'center',
    padding: 5,
    margin: 5,
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  steps:{
    fontSize: 37,
    textAlign: 'center',
  },
  availability: {
    fontSize: 21,
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    marginTop: 0,
    backgroundColor: 'grey',
    borderRadius: 15,
  },
  location: {
    fontSize: 21,
    justifyContent: 'center',
    padding: 15,
    margin: 15,
    marginTop: 0,
    backgroundColor: 'black',
    borderRadius: 15,
    color: 'white',
  },
});

export default StepTracker;
