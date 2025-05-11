import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, } from 'react-native';


const EmailVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('johndoe@gmail.com');

  const handleOtpChange = (text) => {
    setOtp(text);
  };

  const handleResendOtp = () => {
    // Logic to resend OTP to the user's email
  };

  const handleNext = () => {
    navigation.navigate('Dashboard');  
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.circleBlue]} />
        <View style={[styles.circle, styles.circlePurple]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Email</Text>
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Please enter the OTP sent to your email {email}</Text>
          <View style={styles.otpInputContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Enter OTP"
            />
          </View>
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendOtp}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -40,
    marginTop: -40,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  circleBlue: {
    backgroundColor: '#007AFF',
  },
  circlePurple: {
    backgroundColor: '#8E24AA',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 20,
  },
  otpLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  otpInputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  otpInput: {
    height: 40,
    fontSize: 18,
  },
  resendOtp: {
    fontSize: 14,
    color: '#007AFF',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});

export default EmailVerificationScreen;