import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const ManageGroup = ({ route, navigation }) => {
  const { groupId } = route.params || {};
  const [announcement, setAnnouncement] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [username, setUsername] = useState(''); // For adding new user
  const [members, setMembers] = useState([]); // For displaying members
  const [error, setError] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setError('Group ID is not provided');
        return;
      }

      try {
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          const groupData = groupDoc.data();
          setAnnouncement(groupData.announcement || '');
          setMembers(groupData.members || []);
        } else {
          setError('Group data not found');
        }
      } catch (error) {
        setError('Error fetching group data');
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [db, groupId]);

  const handleUpdateAnnouncement = async () => {
    if (!newAnnouncement.trim()) {
      setError('Announcement cannot be empty');
      return;
    }

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        announcement: newAnnouncement,
      });
      setAnnouncement(newAnnouncement);
      setNewAnnouncement('');
      setError(''); // Clear any previous errors
      alert('Announcement updated successfully');
    } catch (error) {
      setError('Error updating announcement');
      console.error('Error updating announcement:', error);
    }
  };

  const handleAddUser = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(username),
      });
      setMembers((prevMembers) => [...prevMembers, username]); // Update local state
      setUsername(''); // Clear the input field
      setError(''); // Clear any previous errors
      alert(`User ${username} added successfully`);
    } catch (error) {
      setError('Error adding user');
      console.error('Error adding user:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Group</Text>
      </View>

      <Text style={styles.label}>Current Announcement:</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.announcement}>{announcement || 'No announcement available'}</Text>
      )}

      <Text style={styles.label}>New Announcement:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new announcement"
        value={newAnnouncement}
        onChangeText={setNewAnnouncement}
      />
      <Button title="Update Announcement" onPress={handleUpdateAnnouncement} />

      <Text style={styles.label}>Add User by Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Add User" onPress={handleAddUser} />

      <Text style={styles.label}>Group Members:</Text>
      {members.length > 0 ? (
        members.map((member, index) => (
          <Text key={index} style={styles.member}>{member}</Text>
        ))
      ) : (
        <Text style={styles.noMembers}>No members yet</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  announcement: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginBottom: 16,
  },
  member: {
    fontSize: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noMembers: {
    fontSize: 16,
    color: '#999',
  },
});

export default ManageGroup;
