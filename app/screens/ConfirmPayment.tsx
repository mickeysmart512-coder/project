import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConfirmPayment = ({ route, navigation }) => {
  const { groupName, amount, transactionID, charge } = route.params;

  const handlePayment = () => {
    // Logic for processing the payment goes here

    // On successful payment, navigate to the WithdrawSuccess screen
    navigation.navigate('WithdrawSuccess');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <View style={styles.content}>
        <Text style={styles.confirmationText}>Are you sure?</Text>
        <Text style={styles.descriptionText}>Please make sure that you want to make this payment</Text>

        <Image source={{ uri: 'file:///mnt/data/Withdraw (1).png' }} style={styles.image} />

        <View style={styles.transactionDetails}>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.accountNumber}>Account Number: 12345678</Text>
          <Text style={styles.status}>Transactions Status: Unpaid</Text>
          <Text style={styles.amount}>₦{amount}</Text>
          <Text style={styles.transactionId}>Transaction ID: {transactionID}</Text>
          <Text style={styles.charge}>Charge: ₦{charge}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  transactionDetails: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  accountNumber: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: '#F87171',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  transactionId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  charge: {
    fontSize: 14,
    color: '#6B7280',
  },
  payButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConfirmPayment;
