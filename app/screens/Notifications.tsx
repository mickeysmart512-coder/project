import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const notifications = [
  {
    id: 1,
    type: 'paymentReceived',
    amount: 'N5,000.00',
    from: 'David John',
    time: 'Today',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    type: 'paymentRequest',
    amount: 'N20,000',
    from: 'Avian Rizky',
    time: 'Today',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    type: 'duePayment',
    message: 'Your monthly contribution payment is due',
    time: 'This Week',
    image: null,
  },
  {
    id: 4,
    type: 'paymentReceived',
    amount: 'N5,600.00',
    from: 'David John',
    time: 'This Week',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 5,
    type: 'announcement',
    from: 'Taj Cooperative',
    time: 'This Week',
    message: 'sent an announcement',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 6,
    type: 'paymentReceived',
    amount: 'N15,000',
    from: 'Taj Cooperative',
    time: 'This Week',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 7,
    type: 'paymentRequest',
    amount: '$369.00',
    from: 'Avian Rizky',
    time: 'This Week',
    image: 'https://via.placeholder.com/150',
  },
];

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.notificationItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.notificationImage} />}
      <View style={styles.notificationTextContainer}>
        {item.type === 'paymentReceived' && (
          <Text style={styles.notificationText}>
            You received a payment of <Text style={styles.notificationAmount}>{item.amount}</Text> from{' '}
            <Text style={styles.notificationFrom}>{item.from}</Text>
          </Text>
        )}
        {item.type === 'paymentRequest' && (
          <Text style={styles.notificationText}>
            <Text style={styles.notificationFrom}>{item.from}</Text> request a payment of{' '}
            <Text style={styles.notificationAmount}>{item.amount}</Text>
          </Text>
        )}
        {item.type === 'duePayment' && (
          <Text style={styles.notificationText}>{item.message}</Text>
        )}
        {item.type === 'announcement' && (
          <View style={styles.announcementContainer}>
            <Text style={styles.notificationText}>
              <Text style={styles.notificationFrom}>{item.from}</Text> {item.message}
            </Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const Notifications = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Profile')}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage}/>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Today</Text>
        {notifications.filter(n => n.time === 'Today').map(item => (
          <NotificationItem key={item.id} item={item} />
        ))}

        <Text style={styles.sectionTitle}>This Week</Text>
        {notifications.filter(n => n.time === 'This Week').map(item => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </ScrollView>
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 20,
    marginLeft: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  notificationImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#4B0082',
  },
  notificationAmount: {
    fontWeight: 'bold',
    color: '#4B0082',
  },
  notificationFrom: {
    fontWeight: 'bold',
    color: '#4B0082',
  },
  announcementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewButtonText: {
    color: '#FFF',
  },
});

export default Notifications;
