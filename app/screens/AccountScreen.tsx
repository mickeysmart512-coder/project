import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, TextInput } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Adjust the path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

interface Props {
  navigation: NavigationProp<any, any>;
}

const AccountScreen = ({ navigation }: Props) => {
  const [isLockAccountEnabled, setIsLockAccountEnabled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      fetchUserData(user.uid);
    }
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          ...data,
          wallet: data.wallet || 0 // Default to 0 if wallet doesn't exist
        });
        setIsLockAccountEnabled(data.status === 'locked');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const toggleLockAccountSwitch = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const newStatus = isLockAccountEnabled ? 'active' : 'locked';
      try {
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), { status: newStatus });
        setIsLockAccountEnabled(!isLockAccountEnabled);
        setUserData({ ...userData, status: newStatus });
      } catch (error) {
        console.error('Error updating account status: ', error);
      }
    }
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Confirm Deactivation',
      'Are you sure you want to deactivate your account?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => promptForPassword(),
        },
      ],
      { cancelable: false }
    );
  };

  const promptForPassword = () => {
    Alert.prompt(
      'Confirm Password',
      'Please enter your password to confirm:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (inputPassword) => handleReauthentication(inputPassword),
        },
      ],
      'secure-text'
    );
  };

  const handleReauthentication = async (inputPassword: string) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user && inputPassword) {
      const credential = EmailAuthProvider.credential(user.email!, inputPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), { status: 'deactivated' });
        FIREBASE_AUTH.signOut();
        navigation.navigate('SignIn');
      } catch (error) {
        console.error('Error deactivating account: ', error);
        Alert.alert('Error', 'Incorrect password. Please try again.');
      }
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.walletContainer}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}> ₦{(userData.wallet || 0).toFixed(2)}
</Text>          
          <Text style={styles.accountNumber}>**** **** **** 8635</Text>
          <Text style={styles.accountHolder}>Username: {userData.username}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>Account Status</Text>
          <Text style={isLockAccountEnabled ? styles.statusInactive : styles.statusActive}>
            {isLockAccountEnabled ? 'Locked' : 'Active'}
          </Text>
        </View>
        <View style={styles.statusBox}>
          <TouchableOpacity onPress={()=> navigation.navigate('AccountVerification')}>
          <Text style={styles.statusText}>Verification</Text>
          <Text style={styles.statusInactive}>Not Verified</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('CreatePaymentPin')}>
          <Text style={styles.settingText}>Create Payment Pin</Text>
          <Ionicons name="chevron-forward" size={24} color="#4B0082" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Lock Account</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#4B0082' }}
            thumbColor={isLockAccountEnabled ? '#ffffff' : '#f4f3f4'}
            onValueChange={toggleLockAccountSwitch}
            value={isLockAccountEnabled}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleDeactivateAccount}>
          <Text style={styles.settingText}>Deactivate Account</Text>
          <Ionicons name="chevron-forward" size={24} color="#4B0082" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceCard: {
    backgroundColor: '#4B0082',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  walletContainer: {
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  accountHolder: {
    fontSize: 14,
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  statusActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusInactive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AccountScreen;
