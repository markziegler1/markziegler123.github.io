import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [newWorkout, setNewWorkout] = useState('');
  const [timers, setTimers] = useState({});
  

  // Add a new workout item to the list
  const addWorkout = () => {
    if (newWorkout) {
      setWorkoutCategories([...workoutCategories, newWorkout]);
      setTimers({ ...timers, [newWorkout]: 0 });
      setNewWorkout('');
    }
  };

  // Update timers every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedTimers = {};
      for (const key in timers) {
        updatedTimers[key] = timers[key] + 1;
      }
      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timers]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout Logbook</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter a workout"
          style={styles.input}
          value={newWorkout}
          onChangeText={(text) => setNewWorkout(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={workoutCategories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutText}>{item}</Text>
            <Text style={styles.timerText}>{timers[item]}s</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: 'white',
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  workoutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 16,
  },
});
