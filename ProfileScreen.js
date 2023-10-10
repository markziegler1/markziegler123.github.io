import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native';
import { Modal, Button } from 'react-native';


export default function ProfileScreen() {
    const [currentWeight, setCurrentWeight] = useState(76);
    const [goalWeight, setGoalWeight] = useState(85);
    const [currentMuscleMass, setCurrentMuscleMass] = useState(40);
    const [goalMuscleMass, setGoalMuscleMass] = useState(45);
    const [currentFatPercentage, setCurrentFatPercentage] = useState(10);
    const [goalFatPercentage, setGoalFatPercentage] = useState(12);

    const [weightHistory, setWeightHistory] = useState([70, 69, 72, 74, 74, 76]);
    const [muscleMassHistory, setMuscleMassHistory] = useState([32, 32.5, 32.8, 34.6, 35.7, 36.9]);
    const [fatPercentageHistory, setFatPercentageHistory] = useState([12, 10.5, 9.5, 10.3, 10.2, 11]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGraph, setSelectedGraph] = useState('');

    const [selectedMonths, setSelectedMonths] = useState([]);

    const [editingValue, setEditingValue] = useState(null);



    useEffect(() => {
      setWeightHistory(prev => [...prev, currentWeight]);
  }, [currentWeight]);
  
  useEffect(() => {
      setMuscleMassHistory(prev => [...prev, currentMuscleMass]);
  }, [currentMuscleMass]);
  
  useEffect(() => {
      setFatPercentageHistory(prev => [...prev, currentFatPercentage]);
  }, [currentFatPercentage]);

  
  const promptForValue = (title, currentValue, setter) => {
    Alert.prompt(
        `Enter ${title}`,
        null,
        (text) => setter(Number(text)),
        'plain-text',
        currentValue.toString()
    );
};

const calculateYAxisLimit = (maxValue) => {
  return maxValue;
};




return (
  <ScrollView style={styles.container}> 
      <View style={styles.boxContainer}>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Current Weight', currentWeight, setCurrentWeight)}
          >
              <Text style={styles.boxTitle}>Current Weight</Text>
              <Text style={styles.boxValue}>{currentWeight} kg</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Goal Weight', goalWeight, setGoalWeight)}
          >
              <Text style={styles.boxTitle}>Goal Weight</Text>
              <Text style={styles.boxValue}>{goalWeight} kg</Text>
          </TouchableOpacity>
      </View>
      <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
    }}>
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10}}>
            <Text>{selectedGraph}</Text>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <TouchableOpacity 
                    key={month}
                    onPress={() => {
                        // Prompt user for new value
                        Alert.prompt(
                            `Enter value for ${month}`,
                            null,
                            (text) => {
                                let newValue = Number(text);
                                switch (selectedGraph) {
                                    case 'Weight Progress':
                                        let newWeightHistory = [...weightHistory];
                                        newWeightHistory[index] = newValue;
                                        setWeightHistory(newWeightHistory);
                                        break;
                                    case 'Muscle Mass Progress':
                                        let newMuscleMassHistory = [...muscleMassHistory];
                                        newMuscleMassHistory[index] = newValue;
                                        setMuscleMassHistory(newMuscleMassHistory);
                                        break;
                                    case 'Fat% Progress':
                                        let newFatPercentageHistory = [...fatPercentageHistory];
                                        newFatPercentageHistory[index] = newValue;
                                        setFatPercentageHistory(newFatPercentageHistory);
                                        break;
                                    default:
                                        break;
                                }
                            },
                            'plain-text'
                        );
                    }}
                    style={{backgroundColor: 'grey', margin: 5, padding: 10, borderRadius: 5}}
                >
                    <Text style={{color: 'white'}}>{month}</Text>
                </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
    </View>
</Modal>




      {/* Similarly for muscle mass and fat percentage boxes */}
      <View style={styles.boxContainer}>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Current Muscle Mass', currentMuscleMass, setCurrentMuscleMass)}
          >
              <Text style={styles.boxTitle}>Current Muscle Mass</Text>
              <Text style={styles.boxValue}>{currentMuscleMass} kg</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Goal Muscle Mass', goalMuscleMass, setGoalMuscleMass)}
          >
              <Text style={styles.boxTitle}>Goal Muscle Mass</Text>
              <Text style={styles.boxValue}>{goalMuscleMass} kg</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.boxContainer}>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Current Fat%', currentFatPercentage, setCurrentFatPercentage)}
          >
              <Text style={styles.boxTitle}>Current Fat%</Text>
              <Text style={styles.boxValue}>{currentFatPercentage} %</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.box} 
              onPress={() => promptForValue('Goal Fat%', goalFatPercentage, setGoalFatPercentage)}
          >
              <Text style={styles.boxTitle}>Goal Fat%</Text>
              <Text style={styles.boxValue}>{goalFatPercentage} %</Text>
          </TouchableOpacity>
      </View>

      <Text style={styles.chartTitle}>Weight Progress</Text>
<TouchableOpacity onPress={() => { setSelectedGraph('Weight Progress'); setModalVisible(true); }}>
    <LineChart
        data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [...weightHistory, goalWeight + 5],
                    strokeWidth: 2
                },
                {
                    data: Array(weightHistory.length).fill(goalWeight).concat(goalWeight),
                    strokeWidth: 1.5,
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    isDashed: true,
                }
            ]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            yAxisLimit: calculateYAxisLimit(Math.max(...weightHistory), goalWeight, 'weight')
        }}
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
    />
</TouchableOpacity>




<Text style={styles.chartTitle}>Muscle Mass Progress</Text>
<TouchableOpacity onPress={() => { setSelectedGraph('Muscle Mass Progress'); setModalVisible(true); }}>
    <LineChart
        data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [...muscleMassHistory, goalMuscleMass + 5],
                    strokeWidth: 2
                },
                {
                    data: Array(muscleMassHistory.length).fill(goalMuscleMass).concat(goalMuscleMass),
                    strokeWidth: 1.5,
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    isDashed: true,
                }
            ]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            yAxisLimit: calculateYAxisLimit(Math.max(...muscleMassHistory), goalMuscleMass, 'muscle')
        }}
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
    />
</TouchableOpacity>

<Text style={styles.chartTitle}>Fat% Progress</Text>
<TouchableOpacity onPress={() => { setSelectedGraph('Fat% Progress'); setModalVisible(true); }}>
    <LineChart
        data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [...fatPercentageHistory, goalFatPercentage + 2],
                    strokeWidth: 2
                },
                {
                    data: Array(fatPercentageHistory.length).fill(goalFatPercentage).concat(goalFatPercentage),
                    strokeWidth: 1.5,
                    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                    isDashed: true,
                }
            ]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            yAxisLimit: calculateYAxisLimit(Math.max(...fatPercentageHistory), goalFatPercentage, 'fat')
        }}
        style={{
            marginVertical: 8,
            borderRadius: 16
        }}
    />
</TouchableOpacity>

</ScrollView>


);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
        padding: 20
    },
    boxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    box: {
        backgroundColor: '#FFF',
        padding: 15,
        flex: 0.48,
        borderRadius: 10
    },
    boxTitle: {
        fontSize: 16,
        color: '#666'
    },
    boxValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    },
    chartTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333'
    }
});
