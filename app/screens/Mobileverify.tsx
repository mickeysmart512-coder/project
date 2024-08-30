import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MobileVerify = ({ navigation }) => {
  const [mobile, setMobile] = useState('');

  const handleNext = () => {
    // Logic to send OTP to the user's mobile and navigate to OTP screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
      <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#4B0082" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Mobile Number</Text>
        <View style={styles.iconContainer}>
          <MaterialIcons name="phone-android" size={100} color="#3B82F6" />
        </View>
        <Text style={styles.infoText}>An OTP will be sent to your mobile number</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone-android" size={24} color="#3B82F6" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholder="Enter your mobile number"
          />
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('MobileVerification')}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  bottomContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -40,
    top: -50,
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
    position: 'absolute'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 30,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    color: '#3B82F6',
    marginTop: 20,
  },
});

export default MobileVerify;
