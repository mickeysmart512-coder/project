
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; // Import your Firebase config
import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { Paystack } from 'react-native-paystack-webview';
import { Paystack } from 'react-native-paystack-webview';


const Deposit = ({ navigation }) => {
  const [selectedBank, setSelectedBank] = useState('Firstbank');
  const [accountName, setAccountName] = useState('Savi Cooperative FirstBank PLC');
  const [accountNumber, setAccountNumber] = useState('30289458948');
  const [amount, setAmount] = useState('');

  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
    switch (bank) {
      case 'Opay':
        setAccountName('SAVI Opay Limited');
        setAccountNumber('728742009');
        break;
      case 'Firstbank':
        setAccountName('Savi Cooperative FirstBank PLC');
        setAccountNumber('30289458948');
        break;
      case 'Palmpay':
        setAccountName('Savi Palmpay Services');
        setAccountNumber('90284792472');
        break;
      case 'Kuda':
        setAccountName('Savi Kuda');
        setAccountNumber('483849375');
        break;
      default:
        setAccountName('');
        setAccountNumber('');
    }
  };

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    // Trigger the Paystack payment
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (userId) {
      const userRef = doc(FIREBASE_DB, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Configure the Paystack payment
        const paystackConfig = {
          email: userDoc.data().email, // Assuming you have the user's email in Firestore
          amount: depositAmount * 100, // Amount is in kobo
          currency: 'NGN',
          // Additional configurations can be added here
        };

        Paystack.showPaymentUI(paystackConfig, async (response) => {
          if (response.status) {
            // Payment was successful
            const currentBalance = userDoc.data().wallet || 0;
            const newBalance = currentBalance + depositAmount;

            await updateDoc(userRef, { wallet: newBalance });
            Alert.alert('Deposit Successful', `Your new balance is ₦${newBalance.toFixed(2)}`);
            navigation.goBack();
          } else {
            Alert.alert('Payment Failed', 'Please try again.');
          }
        }, (error) => {
          console.error('Payment Error:', error);
          Alert.alert('Error', 'There was an error processing your payment. Please try again.');
        });
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } else {
      Alert.alert('Error', 'User not authenticated.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit</Text>
        <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Select a bank</Text>

        {['Opay', 'Firstbank', 'Palmpay', 'Kuda'].map(bank => (
          <TouchableOpacity
            key={bank}
            style={styles.bankOption}
            onPress={() => handleBankSelection(bank)}
          >
            <View style={[styles.bankIconContainer, bank === 'Opay' ? { backgroundColor: '#10B981' } :
                                                      bank === 'Firstbank' ? { backgroundColor: '#EF4444' } :
                                                      bank === 'Palmpay' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#9CA3AF' }]} >
              <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
            </View>
            <Text style={styles.bankName}>{bank}</Text>
            <MaterialIcons name={selectedBank === bank ? "radio-button-checked" : "radio-button-unchecked"} size={24} color="#4B0082" />
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Account Name</Text>
        <TextInput style={styles.input} value={accountName} editable={false} />

        <Text style={styles.label}>Account Number</Text>
        <TextInput style={styles.input} value={accountNumber} editable={false} />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleDeposit}>
          <Text style={styles.submitButtonText}>Yes I have made payment</Text>
        </TouchableOpacity>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#4B0082',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#4B0082',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Deposit;










































































// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; // Import your Firebase config
// import { doc, updateDoc, getDoc } from 'firebase/firestore';

// const Deposit = ({ navigation }) => {
//   const [selectedBank, setSelectedBank] = useState('Firstbank');
//   const [accountName, setAccountName] = useState('Savi Cooperative FirstBank PLC');
//   const [accountNumber, setAccountNumber] = useState('30289458948');
//   const [amount, setAmount] = useState('');

//   const handleBankSelection = (bank) => {
//     setSelectedBank(bank);
//     switch (bank) {
//       case 'Opay':
//         setAccountName('SAVI Opay Limited');
//         setAccountNumber('728742009');
//         break;
//       case 'Firstbank':
//         setAccountName('Savi Cooperative FirstBank PLC');
//         setAccountNumber('30289458948');
//         break;
//       case 'Palmpay':
//         setAccountName('Savi Palmpay Services');
//         setAccountNumber('90284792472');
//         break;
//       case 'Kuda':
//         setAccountName('Savi Kuda');
//         setAccountNumber('483849375');
//         break;
//       default:
//         setAccountName('');
//         setAccountNumber('');
//     }
//   };

//   const handleDeposit = async () => {
//     const depositAmount = parseFloat(amount);

//     if (isNaN(depositAmount) || depositAmount <= 0) {
//       Alert.alert('Invalid Amount', 'Please enter a valid deposit amount.');
//       return;
//     }

//     try {
//       const userId = FIREBASE_AUTH.currentUser?.uid;
//       if (userId) {
//         const userRef = doc(FIREBASE_DB, 'users', userId);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           const currentBalance = userData.wallet || 0;
//           const newBalance = currentBalance + depositAmount;

//           await updateDoc(userRef, { wallet: newBalance });
//           Alert.alert('Deposit Successful', `Your new balance is ₦${newBalance.toFixed(2)}`);
//           navigation.goBack();
//         } else {
//           Alert.alert('Error', 'User not found.');
//         }
//       } else {
//         Alert.alert('Error', 'User not authenticated.');
//       }
//     } catch (error) {
//       console.error('Error updating balance:', error);
//       Alert.alert('Error', 'There was an error processing your deposit. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Deposit</Text>
//         <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
//       </View>

//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <Text style={styles.sectionTitle}>Select a bank</Text>

//         {['Opay', 'Firstbank', 'Palmpay', 'Kuda'].map(bank => (
//           <TouchableOpacity
//             key={bank}
//             style={styles.bankOption}
//             onPress={() => handleBankSelection(bank)}
//           >
//             <View style={[styles.bankIconContainer, bank === 'Opay' ? { backgroundColor: '#10B981' } :
//                                                       bank === 'Firstbank' ? { backgroundColor: '#EF4444' } :
//                                                       bank === 'Palmpay' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#9CA3AF' }]}>
//               <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
//             </View>
//             <Text style={styles.bankName}>{bank}</Text>
//             <MaterialIcons name={selectedBank === bank ? "radio-button-checked" : "radio-button-unchecked"} size={24} color="#4B0082" />
//           </TouchableOpacity>
//         ))}

//         <Text style={styles.label}>Account Name</Text>
//         <TextInput style={styles.input} value={accountName} editable={false} />

//         <Text style={styles.label}>Account Number</Text>
//         <TextInput style={styles.input} value={accountNumber} editable={false} />

//         <Text style={styles.label}>Amount</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter amount"
//           keyboardType="numeric"
//           value={amount}
//           onChangeText={setAmount}
//         />


//         <TouchableOpacity style={styles.submitButton} onPress={handleDeposit}>
//           <Text style={styles.submitButtonText}>Yes I have made payment</Text>
//         </TouchableOpacity>
//       </ScrollView>

     
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 50,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4B0082',
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#4B0082',
//     marginBottom: 10,
//   },
//   bankOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F9FAFB',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   bankIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bankName: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#4B0082',
//   },
//   label: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 20,
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     color: '#4B0082',
//     marginBottom: 10,
//   },
//   timerText: {
//     fontSize: 14,
//     color: '#EF4444',
//     textAlign: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   submitButton: {
//     backgroundColor: '#3B82F6',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 20,
//     backgroundColor: '#F9FAFB',
//   },
//   footerIcon: {
//     alignItems: 'center',
//   },
// });

// export default Deposit;
