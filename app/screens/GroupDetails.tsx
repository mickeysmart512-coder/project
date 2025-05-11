import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import GroupMembersList from './GroupMembersList';

const GroupDetails = ({ route, navigation }) => {
  const { groupId, isAdmin } = route.params;
  const [group, setGroup] = useState(null);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (groupDoc.exists()) {
        setGroup(groupDoc.data());
      } else {
        navigation.goBack();
      }
    };

    fetchGroupDetails();
  }, [db, groupId, navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group</Text>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>

      {group && (
        <>
          {/* Group Image */}
          <Image
            source={{ uri: 'https://via.placeholder.com/300x150' }} // Replace with actual group image URL
            style={styles.groupImage}
          />

          {/* Group Description */}
          <View style={styles.groupDescription}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDescriptionText}>{group.description}</Text>
          </View>

          {/* Group Members */}
          <Text style={styles.sectionTitle}>Group Members</Text>
          <GroupMembersList groupId={groupId} />

          {/* Continue Button */}
          <TouchableOpacity 
  style={styles.continueButton} 
  onPress={() => navigation.navigate('GroupDashboard', { groupId })}
>
  <Text style={styles.continueButtonText}>Continue</Text>
</TouchableOpacity>


          {/* Admin Button */}
          {isAdmin && (
            <TouchableOpacity 
              style={styles.manageButton}
              onPress={() => navigation.navigate('ManageGroup', { groupId })}
            >
              <Text style={styles.manageButtonText}>Manage Group</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  groupImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 20,
  },
  groupDescription: {
    marginTop: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  groupDescriptionText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 30,
  },
  continueButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    top: -80,
    marginTop: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manageButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default GroupDetails;







