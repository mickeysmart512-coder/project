import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import fetchGroupMembers from './fetchGroupMembers';

const GroupMembersList = ({ groupId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersList = await fetchGroupMembers(groupId);
      setMembers(membersList);
    };

    fetchMembers();
  }, [groupId]);

  const renderItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberText}>{item.username}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberText: {
    fontSize: 18,
  },
});

export default GroupMembersList;
