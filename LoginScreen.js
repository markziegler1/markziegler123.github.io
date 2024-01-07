import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
//import { auth } from './firebase';


const LoginScreen = ({ onLogin }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        onLogin();
      } else {
        setUserId(null);
        onLogin();
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      onLogin();
    } catch (error) {
      console.log("Error during login: ", error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      onLogin();
    } catch (error) {
      console.log("Error during signup: ", error.message);
    }
  };

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

export default LoginScreen;
