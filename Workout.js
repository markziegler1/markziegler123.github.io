import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, CheckBox } from 'react-native';

export default function App() {
  // Define initial state variables
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedDays, setSelectedDays] = useState([]);

  // Define a list of days for the workout
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Toggle a day's selection
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Render the "Workout" screen
  const renderWorkoutScreen = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Screen</Text>
      <Text style={styles.subtitle}>Select Workout Days:</Text>
      <ScrollView>
        {daysList.map((day) => (
          <View key={day} style={styles.dayItem}>
            <Text style={styles.dayText}>{day}</Text>
            <CheckBox
              value={selectedDays.includes(day)}
              onValueChange={() => toggleDay(day)}
            />
          </View>
        ))}
      </ScrollView>
      <Button title="Back to Home" onPress={() => setCurrentScreen('Home')} />
    </View>
  );

  // Render different screens based on the currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <View style={styles.container}>
            {/* ... (previous code) */}
          </View>
        );

      case 'Workout':
        return renderWorkoutScreen();

      // ... (other cases for additional screens)

      default:
        return null;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
  },
});
