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
import LoginScreen from './LoginScreen'; 

// Opret en ny tab navigator
const Tab = createBottomTabNavigator();

// Initialize Firebase-godkendelse
const auth = getAuth(app);

const App = () => {
  // State til at gemme den aktuelle bruger
  const [currentUser, setCurrentUser] = useState(null);

  // Effekt-hook til at håndtere Firebase-godkendelse
  useEffect(() => {
    // Ændringer i godkendelsesstatus
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user); // Sæt brugeren den aktuelle bruger
    });

    return unsubscribe;  // Opryd abonnement ved unmount
  }, []);


  // Funktion til at håndtere logud
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Forsøg at logge ud
    } catch (error) {
      console.error('Error signing out: ', error); // Log eventueele fejl
    }
  };


  return (
  // Omslutter hele appen med WorkoutProvider for at give kontekst til alle underkomponenter
  //   <WorkoutProvider> Omslutter navigationsstrukturen i appen
  //   <NavigationContainer> Opretter en bundnavigationslinje
  //   <Tab.Navigator> Viser forskellige skærme baseret på om brugeren er logget ind
  //   {currentUser ? Hvis brugeren er logget ind, vis disse skærme
  //   Hvis ingen bruger er logget ind, vis LoginScreen
 
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
