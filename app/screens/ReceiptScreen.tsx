import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ReceiptScreen = ({ route }) => {
  const { transaction } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction Receipt</Text>
      <View style={styles.receipt}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{transaction.type}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>${transaction.amount}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{transaction.date}</Text>

        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>{transaction.transactionId}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{transaction.status}</Text>

        <Text style={styles.label}>Account Number:</Text>
        <Text style={styles.value}>{transaction.accountNumber}</Text>

        <Text style={styles.label}>Bank Name:</Text>
        <Text style={styles.value}>{transaction.bankName}</Text>
      </View>
    </View>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
});
