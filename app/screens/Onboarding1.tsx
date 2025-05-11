import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

const OnboardingPage1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome Onboard</Text>
        
        <Image source={require('../../assets/image.png')} style={styles.image} />
        {/* Add some descriptive text about the app */}
        <Text style={styles.description}>
          Manage your finances efficiently and effortlessly with our app. Track your expenses, monitor your investments, and achieve your financial goals with ease.
        </Text>

        {/* Add an image or illustration */}
   

        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Onboarding2')}>
          <Text style={styles.signInButtonText}>Get Started</Text>
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
    position: 'absolute'
  },
  bottomContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 90,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 20,
    textAlign: 'left',
    bottom: 80,
  },
  description: {
    fontSize: 16,
    color: '#4B0082',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    width: '50%',
    borderRadius: 8,
    marginVertical: 20,
    top: 60,
    left: 60,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OnboardingPage1;
