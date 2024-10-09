// SignUp.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Text, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const SignUp = ({ navigation }:{ navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    if (!username || !firstName || !lastName || !email || !password || !mobileNumber) {
      alert('Please fill out all fields.');
      return false;
    }
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (isNaN(mobileNumber)) {
      alert('Please enter a valid mobile number.');
      return false;
    }
    if (usernameExists) {
      alert('Username already exists.');
      return false;
    }
    return true;
  };

  const checkUsernameExists = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleUsernameChange = async (text) => {
    setUsername(text);
    if (text.length > 0) {
      const exists = await checkUsernameExists(text);
      setUsernameExists(exists);
    } else {
      setUsernameExists(false);
    }
  };

  const signUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const userId = response.user.uid;

      // Save user details to Firestore
      await setDoc(doc(db, 'users', userId), {
        username,
        firstname: firstName,
        lastname: lastName,
        email,
        mobile: parseInt(mobileNumber),
      });

      console.log('User registered and details saved to Firestore');
      alert('Check your email');
      navigation.navigate('CreateLoginPin'); 
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={handleUsernameChange}
            value={username}
          />
          {usernameExists && <Text style={styles.errorText}>Username already exists</Text>}
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            onChangeText={(text) => setMobileNumber(text)}
            value={mobileNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Button title="Create Account" onPress={signUp} disabled={loading} />
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    position: 'relative',
    marginTop: -50,
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
  },
  blueCircle: {
    backgroundColor: '#3B82F6',
    width: 150,
    height: 150,
    top: 60,
    left: 250,
  },
  purpleCircle: {
    backgroundColor: '#4B0082',
    width: 180,
    height: 200,
    top: -50,
    left: 200,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
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
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default SignUp;
