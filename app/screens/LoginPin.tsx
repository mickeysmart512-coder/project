import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const LoginPin = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch the user data when the component mounts
    const fetchUserData = async () => {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data()); // Set the user data, including username
        }
      }
    };

    fetchUserData();
  }, []);

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
      <Text style={styles.title}>Welcome Back</Text>
      {/* Display the username if it's available */}
      {userData && <Text style={styles.name}>{userData.username}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit Password"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={()=> navigation.navigate('ForgotPassword')}>
      <Text style={styles.forgot}>Forgot Password?</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePinSubmit} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>

      {/* navigation.navigate('InsideLayout', { screen: 'Settings' }); */}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
  <Text style={styles.switch}>Switch Account</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 80,
    top:-10,
  },
  name: {
    fontSize: 20,
    top: -80,
  },
  forgot:{
    color: '#3B82F6',
    top: -15,
    left: 100,
    marginBottom: 15,
 },
 switch:{
  color: '#3B82F6',
textAlign: 'justify',
  top: 60,
  left: -100,
 },
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
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginPin;
