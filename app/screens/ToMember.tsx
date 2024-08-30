import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ToMember = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [members, setMembers] = useState([
    { id: 1, name: 'Jonathan', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Ahmed James', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'John Doe', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Christy Pearl', image: 'https://via.placeholder.com/150' },
  ]);

  const handleContinue = () => {
    
    console.log('Proceeding to next step');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>To Group Member</Text>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      </View>

      <Text style={styles.sectionTitle}>Transfer to Member</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by username/firstname"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.groupSelector} onPress={() => console.log('Select Group')}>
        <Text style={styles.groupText}>{selectedGroup || 'Select Group'}</Text>
        <FontAwesome5 name="caret-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {members.map(member => (
        <TouchableOpacity key={member.id} style={styles.memberOption}>
          <Image source={{ uri: member.image }} style={styles.memberImage} />
          <Text style={styles.memberText}>{member.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginVertical: 15,
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginVertical: 10,
  },
  groupText: {
    fontSize: 16,
    color: '#6B7280',
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  memberText: {
    fontSize: 16,
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ToMember;
