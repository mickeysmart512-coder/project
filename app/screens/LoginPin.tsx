import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const LoginPin = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinSubmit = async () => {
    setLoading(true);
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (userId) {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.loginPin === pin) {
          navigation.navigate('Dashboard');
        } else {
          alert('Incorrect pin. Please try again.');
        }
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
      </View>
      <Text style={styles.title}>Login Pin</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your pin"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handlePinSubmit} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#FFF',
  // },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  circle: {
    marginTop: -50,
  },
  // topContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-start',
  // },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    alignItems: 'center',
  },
  blueCircle: {
    backgroundColor: '#3B82F6',
    top: 60,
    left: 250,
    width: 150,
    height: 150,
    borderRadius: 150,
    position: 'absolute',
  },
  purpleCircle: {
    backgroundColor: '#4B0082',
    top: -50,
    left: 200,
    width: 180,
    height: 200,
    borderRadius: 100,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPin;
