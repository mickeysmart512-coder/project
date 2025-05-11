import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [userBalance, setUserBalance] = useState('Loading...');


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
        const userData = userDoc.data();
        setName(userData.username);
                    setUserBalance(userData.wallet ? userData.wallet.toFixed(2) : '0.00');

      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileLocation}>Nigeria</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Total Balance</Text>
        <Text style={styles.balanceAmount}>N{userBalance}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.menuIconContainer}>
            <FontAwesome5 name="user-friends" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={()=> navigation.navigate('AccountVerification')}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="verified-user" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Verification</Text>
          <Text style={styles.menuExtra}>Unverified</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notification')}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="notifications-none" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Notification Center</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={()=> navigation.navigate('ForgotPassword')}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="lock" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Change Login Pin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="contact-support" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={()=> navigation.navigate('Terms')}>
          <View style={styles.menuIconContainer}>
            <MaterialIcons name="gavel" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Legal Terms</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Beta Version</Text>
        <Text style={styles.footerText}>Savi.Co</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  profileLocation: {
    fontSize: 16,
    color: '#6B7280',
  },
  balanceContainer: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    top: -10,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 16,
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  menuContainer: {
    marginHorizontal: 20,
    top: -15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    top: -15,
  },
  menuIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#4B0082',
  },
  menuExtra: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },

});

export default Profile;
