import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Adjust the path as per your project structure
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}

const AccountVerification = ({ route, navigation }: RouterProps) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    bvn: '',
    nin: '',
  });

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserData(user.uid);
    }
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          bvn: data.bvn || '',
          nin: data.nin || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const handleVerifyDetails = async () => {
    const { bvn, nin } = userData;

    if (!bvn || !nin) {
      Alert.alert('Error', 'Please enter both BVN and NIN.');
      return;
    }

    try {
      const response = await fetch('https://api.verifyme.ng/v1/identity/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY', // Replace with your actual VerifyMe API key
        },
        body: JSON.stringify({
          bvn,
          nin,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verification successful
        Alert.alert('Success', 'Verification successful.');
        // You can also update the user's profile in Firebase or navigate to another screen
      } else {
        // Verification failed
        Alert.alert('Verification Failed', data.message || 'Failed to verify your details.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'An error occurred while verifying your details.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerText}>Account Verification</Text>
        <Icon name="notifications-outline" size={24} color="#000" />
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{userData.username}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bank Verification Number (BVN)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={userData.bvn}
            secureTextEntry={true}
            onChangeText={(text) => setUserData({ ...userData, bvn: text })}
          />
          <Icon name="alert-circle-outline" size={24} color="red" />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>NIN</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={userData.nin}
            secureTextEntry={true}
            onChangeText={(text) => setUserData({ ...userData, nin: text })}
          />
          <Icon name="alert-circle-outline" size={24} color="red" />
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleVerifyDetails}>
        <Text style={styles.saveButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  
  },
  quickActionsOverlay: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    flexDirection: 'row',
  },
  animatedButton: {
    marginVertical: 10,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    marginBottom: 30,
  },
  quickActionText: {
    marginTop: 5,
    color: '#374151',
    fontSize: 12,
  },
  optionsMenu: {
    position: 'absolute',
    width: 200,
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  optionItem: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#4B0082',
  },

  quickActiontoggle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    // flexDirection: 'row',
    padding: 15,
    alignContent: 'flex-end',
    borderRadius: 50,
    marginBottom: 25,
    right: 35,
    marginRight: 25,
  },

  quickActionTexttoggle: {
    marginTop: 5,
    color: '#374151',
    fontSize: 12,
  },

  centerIconContainer: {   
     width: 80,
     height: 80,
    borderRadius: 50,
     backgroundColor: '#3B82F6',
     alignItems: 'center',
    justifyContent: 'center',
    marginTop: -35,  
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
   
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0000ff',
  },
  inputContainer: {
    marginBottom: 20,
    padding: 10,

    
  },
  label: {
    marginBottom: 5,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 30,
    width: 300,
    alignContent: 'center',
    left: 30,
    
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
  justifyContent: 'space-around', 
  paddingVertical: 10,
  backgroundColor: '#4B0082',
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  height: 80,
  marginTop: 160,
  bottom: -115,
  position: 'static',

  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 24,
  },
});

export default AccountVerification;






