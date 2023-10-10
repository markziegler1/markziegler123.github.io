import React, { useContext, useState } from 'react';
import { WorkoutContext } from './WorkoutContext';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Button
} from 'react-native';

const workouts = [
  { day: 'Monday', routine: 'Chest and Bicep' },
  { day: 'Tuesday', routine: 'Back and Tricep' },
  { day: 'Wednesday', routine: 'Legs' },
  { day: 'Thursday', routine: 'Rest' },
  { day: 'Friday', routine: 'Shoulders & abs' },
  { day: 'Saturday', routine: 'Legs' },
  { day: 'Sunday', routine: 'Rest' }
];

export default function WorkoutScreen() {
  const { workoutLogs, setWorkoutLogs } = useContext(WorkoutContext);
  const [duration, setDuration] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handlePress = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const currentTime = `${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
        setWorkoutLogs(prevLogs => [...prevLogs, {
      ...selectedWorkout,
      time: currentTime,
      duration: parseInt(duration),
    }]);
    setDuration('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout Days</Text>
      <Text style={styles.subHeader}>Tap a workout when you finish training!</Text>

      {workouts.map(workout => (
        <TouchableOpacity key={workout.day} style={styles.workoutItem} onPress={() => handlePress(workout)}>
          <Text style={styles.day}>{workout.day}</Text>
          <Text style={styles.routine}>{workout.routine}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>How long did you train?</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={text => setDuration(text)}
              keyboardType="numeric"
              placeholder="Duration in minutes"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f8',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  workoutItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  day: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  routine: {
    fontSize: 16,
    color: '#888',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});