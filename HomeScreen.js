import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { WorkoutContext } from './WorkoutContext';

export default function HomeScreen() {
  const { workoutLogs } = useContext(WorkoutContext);

  const totalWorkouts = workoutLogs.length;
  const averageDuration = totalWorkouts === 0 ? 0 : workoutLogs.reduce((acc, log) => acc + (log.duration || 0), 0) / totalWorkouts;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Workout Logs</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Workouts</Text>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Average Duration</Text>
          <Text style={styles.statValue}>{averageDuration.toFixed(2)} minutes</Text>
        </View>
      </View>

      <FlatList
        data={workoutLogs}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.logDay}>{item.day}</Text>
            <Text style={styles.logRoutine}>{item.routine}</Text>
            <Text style={styles.logDuration}>{item.duration} min</Text>
            <Text style={styles.logTime}>Logged on: {item.time}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginHorizontal: 15,
  },
  statCard: {
    flex: 0.48,  // to allow two cards side by side with a bit of spacing
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  statTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  logDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logRoutine: {
    fontSize: 18,
    marginTop: 5,
    color: '#666',
  },
  logDuration: {
    fontSize: 16,
    marginTop: 10,
    color: '#888',
  },
  logTime: {
    fontSize: 14,
    marginTop: 5,
    color: '#aaa',
  },
});
