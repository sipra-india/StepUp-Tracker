import { Alert, Text, View } from "react-native";
import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';

const StepTracker = () => {
  const [isAvailable, setIsAvailable] = useState('checking');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const subscribeToStepCount = async () => {
      try {
        const { granted } = await Pedometer.getPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission not granted", "Please grant permission to track steps.");
          return;
        }

        const isAvailable = await Pedometer.isAvailableAsync();
        setIsAvailable(String(isAvailable));

        if (isAvailable) {
          const start = new Date();
          start.setHours(0, 0, 0, 0)

          const subscription = Pedometer.watchStepCount(result => {
            setCurrentStep(result.steps);
          });

          return () => {
            // Clean up subscription
            subscription.remove();
          };
        }
      } catch (error: any) {
        Alert.alert("Error fetching step count:", error.message);
      }
    };

    subscribeToStepCount();
  }, []);

  return (
    <View>
      <Text>Current Step Count: {currentStep}</Text>
      <Text>Is Pedometer Available: {isAvailable}</Text>
    </View>
  );
}

export default StepTracker;
