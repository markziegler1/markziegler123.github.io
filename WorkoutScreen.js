import React, { useContext, useState } from "react";
import { WorkoutContext } from "./WorkoutContext";
import { addDoc, collection } from "firebase/firestore";
import { database } from "./firebase";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Button,
} from "react-native";

const daysOfWeek = [
  "Mondayyy",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const muscleGroups = [
  "Bicep",
  "Tricep",
  "Legs",
  "Back",
  "Chest",
  "Shoulders",
  "Abs",
];

const WorkoutScreen = () => {
  const { workoutLogs, setWorkoutLogs } = useContext(WorkoutContext);
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [addWorkoutModalVisible, setAddWorkoutModalVisible] = useState(false);
  const [logWorkoutModalVisible, setLogWorkoutModalVisible] = useState(false);
  const [selectDayModalVisible, setSelectDayModalVisible] = useState(false);
  const [selectRoutineModalVisible, setSelectRoutineModalVisible] =
    useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutDay, setWorkoutDay] = useState("Monday");
  const [workoutRoutine, setWorkoutRoutine] = useState("Bicep");
  const [duration, setDuration] = useState("");

  const handlePress = (workout) => {
    setSelectedWorkout(workout);
    setLogWorkoutModalVisible(true);
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const currentTime = `${currentDate.getHours()}:${String(
      currentDate.getMinutes()
    ).padStart(2, "0")}`;

    const newLog = {
      ...selectedWorkout,
      time: currentTime,
      duration: parseInt(duration),
    };

    try {
      await addDoc(collection(database, "workouts"), newLog);
      setWorkoutLogs((prevLogs) => [...prevLogs, newLog]);
      setDuration("");
      setLogWorkoutModalVisible(false);
    } catch (err) {
      console.error("Error adding document to Firestore: ", err);
    }
  };

  const handleAddCustomWorkout = () => {
    setCustomWorkouts((prevWorkouts) => [
      ...prevWorkouts,
      { day: workoutDay, routine: workoutRoutine },
    ]);
    setWorkoutDay("Monday");
    setWorkoutRoutine("Bicep");
    setAddWorkoutModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout Days</Text>
      <Text style={styles.subHeader}>
        Tap a workout when you finish training!
      </Text>

      {customWorkouts.map((workout) => (
        <TouchableOpacity
          key={workout.day}
          style={styles.workoutItem}
          onPress={() => handlePress(workout)}
        >
          <Text style={styles.day}>{workout.day}</Text>
          <Text style={styles.routine}>{workout.routine}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title="Add Custom Workout"
        onPress={() => setAddWorkoutModalVisible(true)}
      />

      {/* Modal for Adding Custom Workout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addWorkoutModalVisible}
        onRequestClose={() => setAddWorkoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Custom Workout</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setSelectDayModalVisible(true)}
            >
              <Text>{workoutDay}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setSelectRoutineModalVisible(true)}
            >
              <Text>{workoutRoutine}</Text>
            </TouchableOpacity>
            <Button title="Add" onPress={handleAddCustomWorkout} />
            <Button
              title="Close"
              onPress={() => setAddWorkoutModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Modal for Selecting Day */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectDayModalVisible}
        onRequestClose={() => setSelectDayModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Day</Text>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={styles.dayItem}
                onPress={() => {
                  setWorkoutDay(day);
                  setSelectDayModalVisible(false);
                }}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal for Selecting Routine */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectRoutineModalVisible}
        onRequestClose={() => setSelectRoutineModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Routine</Text>
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={styles.dayItem}
                onPress={() => {
                  setWorkoutRoutine(group);
                  setSelectRoutineModalVisible(false);
                }}
              >
                <Text style={styles.dayText}>{group}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal for Logging Workout Duration */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logWorkoutModalVisible}
        onRequestClose={() => setLogWorkoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>How long did you train?</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={(text) => setDuration(text)}
              keyboardType="numeric"
              placeholder="Duration in minutes"
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Button
              title="Cancel"
              onPress={() => setLogWorkoutModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f4f4f8",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  workoutItem: {
    padding: 15,
    backgroundColor: "#fff",
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
    fontWeight: "bold",
    color: "#333",
  },
  routine: {
    fontSize: 16,
    color: "#888",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
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
    width: "100%",
    padding: 10,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  dayItem: {
    padding: 10,
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  dayText: {
    fontSize: 18,
    color: "#333",
  },
});

export default WorkoutScreen;
