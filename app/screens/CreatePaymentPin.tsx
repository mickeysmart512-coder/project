import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Adjust the path as needed
import { doc, updateDoc } from 'firebase/firestore';

const CreatePaymentPin = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSavePin = async () => {
    if (pin !== confirmPin) {
      Alert.alert('Error', 'Pins do not match.');
      return;
    }
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), { paymentPin: pin });
        Alert.alert('Success', 'Payment PIN set successfully.');
        navigation.goBack();
      } catch (error) {
        console.error('Error setting payment PIN: ', error);
        Alert.alert('Error', 'Failed to set payment PIN.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Payment PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        secureTextEntry
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm PIN"
        secureTextEntry
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="numeric"
        maxLength={6}
      />
      <Button title="Save PIN" onPress={handleSavePin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default CreatePaymentPin;
