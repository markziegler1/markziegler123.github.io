import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './firebase';
import HomeScreen from './HomeScreen';
import WorkoutScreen from './WorkoutScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WorkoutProvider } from './WorkoutContext';
import LoginScreen from './LoginScreen'; // Imported from a separate file


const Tab = createBottomTabNavigator();
const auth = getAuth(app);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };


  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Tab.Navigator>
          {currentUser ? (
            <>
              <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Workout"
                component={WorkoutScreen}
                options={{
                  tabBarLabel: 'Workout',
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="heartbeat" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Profile"
                children={() => <ProfileScreen onSignOut={handleSignOut} />} // Pass handleSignOut as onSignOut
                options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="user" color={color} size={size} />
                  ),
                }}
              />
            </>
          ) : (
            <Tab.Screen
              name="Login"
              component={LoginScreen}
              options={{
                tabBarLabel: 'Login',
                tabBarIcon: ({ color, size }) => (
                  <Icon name="sign-in" color={color} size={size} />
                ),
              }}
            />
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
            }
          


export default App;
