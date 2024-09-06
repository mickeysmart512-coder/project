import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permissions granted');
      } else {
        Alert.alert('Permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    Alert.alert('Permissions are automatically granted on iOS');
  }
};

const OnboardingPage2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Almost There</Text>
        <Text style={styles.description}>Please grant the following permissions to continue:</Text>
        <View style={styles.permissionsList}>
          <Text style={styles.permissionItem}><MaterialIcons name="photo" size={24} color="#3B82F6" style={styles.icon} />
 Camera</Text>
          <Text style={styles.permissionItem}><MaterialIcons name="map" size={24} color="#3B82F6" style={styles.icon} />
 Location</Text>
          <Text style={styles.permissionItem}>• Microphone</Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            requestPermissions();
            navigation.navigate('Onboarding3');
          }}
        >
          <Text style={styles.signInButtonText}>Next</Text>
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
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionsList: {
    marginBottom: 20,
  },
  permissionItem: {
    fontSize: 16,
    color: '#374151',
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    width: '50%',
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OnboardingPage2;
