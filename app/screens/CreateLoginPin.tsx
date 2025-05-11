// CreateLoginPin.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateLoginPin = ({ navigation }) => {
  const [loginPin, setLoginPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleCreatePin = async () => {
    if (loginPin !== confirmPin) {
      Alert.alert('Error', 'Pins do not match');
      return;
    }
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        await updateDoc(userRef, { loginPin: loginPin });
        Alert.alert('Success', 'Login pin created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('InsideLayout') }
        ]);
      }
    } catch (error) {
      console.error('Error creating login pin: ', error);
      Alert.alert('Error', 'Failed to create login pin');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Login Pin</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Login Pin"
        value={loginPin}
        onChangeText={setLoginPin}
        secureTextEntry
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Login Pin"
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        keyboardType="number-pad"
      />
      <Button title="Create Pin" onPress={handleCreatePin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default CreateLoginPin;
