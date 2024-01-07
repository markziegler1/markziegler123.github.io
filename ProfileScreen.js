import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Button, ScrollView, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { saveUserProfileData, loadUserProfileData } from './FirebaseFunctions';
import { database } from './firebase';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

const ProfileScreen = ({route, navigation, onSignOut}) => {
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

    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            getDoc(userDocRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setCurrentWeight(userData.currentWeight);
                    setGoalWeight(userData.goalWeight);
                    // Set other state variables based on userData
                } else {
                    console.log("No such document!");
                }
            }).catch(error => {
                console.error("Error fetching user data: ", error);
            });
        }
    }, [currentUser]);

  // Safe check for route and params
  const userId = route?.params?.userId; 
  const userEmail = route?.params?.email;

    useEffect(() => {
        // Fetch user data when the screen is loaded
        const fetchData = async () => {
            const userData = await loadUserProfileData(userId);
            if (userData) {
                setCurrentWeight(userData.currentWeight);
                setGoalWeight(userData.goalWeight);
                // Similar settings for other state variables
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId]);

    // Example function to save user data
const saveUserData = async (userId, data) => {
    const userDocRef = doc(database, 'users', userId);
    await setDoc(userDocRef, data);
};

// Example function to load user data
const loadUserData = async (userId) => {
    const userDocRef = doc(database, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
        return null;
    }
};

    
const handleLogoutPrompt = () => {
    Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            { 
                text: "OK", 
                onPress: onSignOut
            }
        ]
    );
};
    useEffect(() => {
        // Fetch user data when the screen is loaded
        const fetchData = async () => {
            const userData = await loadUserProfileData(userId);
            if (userData) {
                setCurrentWeight(userData.currentWeight);
                setGoalWeight(userData.goalWeight);
            }
        };

        fetchData();
    }, [userId]);

    const handleSave = async () => {
        if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userData = {
                currentWeight,
                goalWeight,
                // Include other user data fields here
            };
            try {
                await setDoc(userDocRef, userData);
                Alert.alert('Profile Updated', 'Your profile data has been saved.');
            } catch (error) {
                console.error("Error updating user data: ", error);
            }
        }
    };

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

const handleSignOut = () => {
    signOut(auth).then(() => {
        navigation.navigate('Login');
    }).catch((error) => {
        console.error('Sign Out Error', error);
    });
};

return (
  <ScrollView style={styles.container}> 
  {/* Display user's email */}
  {userEmail && 
  <TouchableOpacity onPress={handleLogoutPrompt}>
  <Text style={styles.userEmail}>Welcome, {userEmail}</Text>
</TouchableOpacity>
    }
     <Button title="Save Profile" onPress={handleSave} />

    {/* Rest of your component */}
    <Button title="Sign Out" onPress={handleLogoutPrompt} />

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
    },
    userEmail: {
        color: 'blue',
        textDecorationLine: 'underline',
    }
});

export default ProfileScreen;
