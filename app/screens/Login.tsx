import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Login = ({ navigation }: { navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleSignIn = async () => {
    setLoading(true);
    if (!email || !password) {
      alert('Please enter both email and password');
      setLoading(false);
      return;
    }
    try {
      console.log('Signing in with email:', email); // Log email
      const response = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      navigation.navigate('LoginPin'); // Navigate to login pin screen upon successful sign-in
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
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
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#3B82F6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#3B82F6" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>
              {/* navigation.navigate('InsideLayout', { screen: 'Settings' }); */}

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circle: {
    marginTop: -50,
  },
  purpleCircle: {
    backgroundColor: '#4B0082',
    top: -50,
    left: 200,
    width: 180,
    height: 200,
    borderRadius: 100,
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
  bottomContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    width: '80%',
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#3B82F6',
    marginVertical: 10,
  },
  signUpText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default Login;
