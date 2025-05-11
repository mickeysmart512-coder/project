import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const MobileVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [mobile, setMobile] = useState('+234 800 000 00');

  const handleOtpChange = (text) => {
    setOtp(text);
  };

  const handleResendOtp = () => {
    // Logic to resend OTP to the user's Mobile
  };



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mobile Number</Text>
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Please enter the OTP send to your Mobile {mobile}</Text>
          <View style={styles.otpInputContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="numeric"
              maxLength={6}
              placeholder="Enter OTP"
            />
          </View>
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendOtp}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Dashboard')}>
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
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default MobileVerificationScreen;