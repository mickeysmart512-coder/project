import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Animated, Easing, Button } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouterProps {
  navigation: NavigationProp<any, any>;
  route: any;
}

const Groups = ({ navigation }: RouterProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const depositAnim = useRef(new Animated.Value(0)).current;
  const withdrawAnim = useRef(new Animated.Value(0)).current;
  const optionsMenuAnim = useRef(new Animated.Value(0)).current;

  const fetchGroups = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userId = user.uid;
        setUserId(userId);
        const querySnapshot = await getDocs(collection(FIREBASE_DB, 'groups'));
        const userGroups: any = [];
        querySnapshot.forEach((doc) => {
          const groupData = doc.data();
          if (groupData.members.includes(userId)) {
            userGroups.push({ id: doc.id, ...groupData });
          }
        });
        setGroups(userGroups);
      } else {
        console.error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'Could not fetch groups. Please try again.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups().then(() => setRefreshing(false));
  }, []);

  const toggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
    if (!showQuickActions) {
      Animated.parallel([
        Animated.timing(depositAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(withdrawAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(depositAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(withdrawAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await FIREBASE_AUTH.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LandingPage' }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Failed to sign out:', error.message);
    }
  };

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
    Animated.timing(optionsMenuAnim, {
      toValue: showOptionsMenu ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
  };

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      await AsyncStorage.removeItem('userToken');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {groups.map((group) => (
          <View key={group.id} style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.name}</Text>
              {userId === group.creatorId && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ManageGroup', { groupId: group.id })}
                >
                  <Ionicons name="settings" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.groupDescription}>Group Description: {group.description}</Text>
            <Text style={styles.groupSize}>Group Size: {group.size}</Text>
            {/* <Text style={styles.groupCreator}>Creator: {group.creatorId}</Text> */}
            <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { groupId: group.id })}>
           <Text style={styles.button}>View Group</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateGroup')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Groups')}>
          <Ionicons name="people" size={24} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerIconContainer} onPress={toggleQuickActions}>
          <Ionicons name="swap-horizontal" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('TransactionHistory')}>
                  <Ionicons name="sync-outline" size={24} color="white" />
                </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={toggleOptionsMenu}>
          <Ionicons name="grid" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {showQuickActions && (
        <View style={styles.quickActionsOverlay}>
          <Animated.View style={[styles.animatedButton, { transform: [{ scale: depositAnim }] }]}>
            <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Deposit')}>
              <Ionicons name="arrow-down" size={24} color="white" />
              <Text style={styles.quickActionText}>Deposit</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.animatedButton, { transform: [{ scale: withdrawAnim }] }]}>
            <TouchableOpacity style={styles.quickActiontoggle} onPress={() => navigation.navigate('Withdraw')}>
              <Ionicons name="arrow-up" size={24} color="white" />
              <Text style={styles.quickActionText}>Withdraw</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      {showOptionsMenu && (
        <Animated.View style={[styles.optionsMenu, { opacity: optionsMenuAnim }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ManageProfile')}>
            <Text>Manage Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <Text>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Complaints')}>
            <Text>Complaints</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ContactUs')}>
            <Text>Contact Us</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f0f0f0',
},
scrollContainer: {
  paddingHorizontal: 16,
  paddingBottom: 16,
  marginTop: 50,
},
groupContainer: {
  backgroundColor: '#F9FAFB',
  padding: 16,
  borderRadius: 10,
  marginBottom: 16,
},
groupHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
groupTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
groupDescription: {
  fontSize: 14,
  color: '#6B7280',
  marginBottom: 8,
},
groupSize: {
  fontSize: 14,
  color: '#6B7280',
},
groupCreator: {
  fontSize: 14,
  color: '#6B7280',
},
button:{
  marginTop: 15,
  fontWeight: '700',
  fontSize: 15,
},

footer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingVertical: 10,
  backgroundColor: '#4B0082',
  borderTopWidth: 1,
  borderTopColor: '#ccc',
  height: 80,
  marginTop: 110,
  bottom: -5,
  position: 'static',
},
footerButton: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 24,
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
fab: {
  position: 'absolute',
  bottom: 100,
  right: 20,
  backgroundColor: '#3B82F6',
  borderRadius: 25,
  padding: 15,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 4,
},
quickActionsOverlay: {
  position: 'absolute',
  bottom: 130,
  right: 20,
},
animatedButton: {
  marginBottom: 10,
},
quickActiontoggle: {
  backgroundColor: '#FFF',
  borderRadius: 25,
  padding: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
quickActionText: {
  marginLeft: 8,
  color: '#374151',
},
optionsMenu: {
  position: 'absolute',
  bottom: 70,
  right: 20,
  backgroundColor: '#FFF',
  borderRadius: 10,
  elevation: 4,
},
optionItem: {
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#F3F4F6',
},
optionText: {
  fontSize: 16,
  color: '#374151',
},

});

export default Groups;
