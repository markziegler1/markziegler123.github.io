import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
//import { auth } from './firebase';

const LoginScreen = ({ onLogin }) => {
  // State til at gemme indtastet email, password og bruger ID
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [userId, setUserId] = useState(null);

  // Initialiser Firebase-godkendelse
  const auth = getAuth(app);

  // Effect-hook til at overvåge ændringer i godkendelsestilstand
  useEffect(() => {
    // Ændringer i godkendelsesstatus
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Hvis en bruger er logget ind, sæt brugerens ID og kald 'onLogin'
      if (currentUser) {
        setUserId(currentUser.uid);
        onLogin();
      } else {
        // Hvis ingen bruger er logget ind, sæt brugerens ID til null og udløs onLogin
        setUserId(null);
        onLogin();
      }
    });
    // Oprydningsfunktion for at afmelde lytteren / godkendelsesstatusændringer
    return () => unsubscribe();
  }, [onLogin]);

  // Funktion til at håndtere login med email og password
  const handleLogin = async () => {
    try {
      // Forsøg at logge ind med email og password
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      onLogin();
    } catch (error) {
      // Log eventuelle fejl under login
      console.log("Error during login: ", error.message);
    }
  };
  // Funktion til at håndtere oprettelse af ny bruger med email og password
  const handleSignup = async () => {
    try {
      // Forsøg at oprette en ny bruger med email og password
      await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      onLogin();
    } catch (error) {
      // Log eventuelle fejl under tilmelding
      console.log("Error during signup: ", error.message);
    }
  };
// UI components
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEnteredEmail}
        value={enteredEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setEnteredPassword}
        value={enteredPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title='Log in' onPress={handleLogin} />
      <Text>Signup</Text>
      <Button title='Signup' onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  // Add more styling as needed
});
// Expoterer componenten for at gøre brug i andre dele af appen
export default LoginScreen;
