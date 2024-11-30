// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Firebase Auth import

// const Deposit = () => {
//   const [showWebView, setShowWebView] = useState(false);
//   const [userFullName, setUserFullName] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   // Fetch current user's information
//   useEffect(() => {
//     const user = FIREBASE_AUTH.currentUser;
//     if (user) {
//       setUserFullName(user.displayName || 'Anonymous');  // Set default if displayName is not available
//       setUserEmail(user.email);
//     }
//   }, []);

//   const handlePayment = () => {
//     if (userEmail) {
//       setShowWebView(true);
//     } else {
//       Alert.alert("Error", "User information not found. Please login again.");
//     }
//   };

//   const monnifyHtml = `
//     <html>
//     <head>
//         <script type="text/javascript" src="https://sdk.monnify.com/plugin/monnify.js"></script>
//         <script>
//             function payWithMonnify() {
//                 MonnifySDK.initialize({
//                     amount: 100000, // Replace with dynamic amount
//                     currency: "NGN",
//                     reference: "TRANSACTION_REF_${new Date().getTime()}", // Dynamic reference
//                     customerFullName: "${userFullName}",
//                     customerEmail: "${userEmail}",
//                     apiKey: "MK_TEST_J0BV4E7B70",
//                     contractCode: "1737544075",
//                     paymentDescription: "Payment for services",
//                     onComplete: function(response) {
//                         window.ReactNativeWebView.postMessage(JSON.stringify(response));
//                     },
//                     onClose: function(data) {
//                         window.ReactNativeWebView.postMessage(JSON.stringify(data));
//                     }
//                 });
//             }
//             window.onload = payWithMonnify;
//         </script>
//     </head>
//     <body></body>
//     </html>
//   `;

//   return (
//     <View style={{ flex: 1 }}>
//       {showWebView ? (
//         <WebView
//           originWhitelist={['*']}
//           source={{ html: monnifyHtml }}
//           onMessage={(event) => {
//             const data = JSON.parse(event.nativeEvent.data);
//             console.log('Payment response:', data);
//             if (data.status === "SUCCESS") {
//               Alert.alert("Payment Successful", "Your transaction was completed successfully.");
//             } else {
//               Alert.alert("Payment Failed", "Unable to process your transaction request.");
//             }
//             setShowWebView(false);
//           }}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//         />
//       ) : (
//         <TouchableOpacity style={styles.signInButton} onPress={handlePayment}>
//           <Text style={styles.signInButtonText}>Pay with Monnify</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   signInButton: {
//     backgroundColor: '#3B82F6',
//     paddingVertical: 15,
//     width: '50%',
//     borderRadius: 8,
//     marginVertical: 20,
//     top: 80,
//     left: 60,
//   },
//   signInButtonText: {
//     color: '#FFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
// });

// export default Deposit;





// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { WebView } from 'react-native-webview';
// import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig'; // Import your Firebase config
// import { doc, updateDoc, getDoc } from 'firebase/firestore';

// const Deposit = ({ navigation }) => {
//   const [selectedBank, setSelectedBank] = useState('Firstbank');
//   const [accountName, setAccountName] = useState('Savi Cooperative FirstBank PLC');
//   const [accountNumber, setAccountNumber] = useState('30289458948');
//   const [amount, setAmount] = useState('');
//   const [showWebView, setShowWebView] = useState(false);

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

//   const handlePayment = () => {
//     setShowWebView(true);
//   };

//   const monnifyHtml = `
//     <html>
//     <head>
//         <script type="text/javascript" src="https://sdk.monnify.com/plugin/monnify.js"></script>
//         <script>
//             function payWithMonnify() {
//                 MonnifySDK.initialize({
//                     amount: ${amount},
//                     currency: "NGN",
//                     reference: "TRANSACTION_REF_123",
//                     customerFullName: "John Doe",
//                     customerEmail: "johndoe@example.com",
//                     apiKey: "MK_TEST_J0BV4E7B70",
//                     contractCode: "1737544075",
//                     paymentDescription: "Payment for services",
//                     onComplete: function(response) {
//                         window.ReactNativeWebView.postMessage(JSON.stringify(response));
//                     },
//                     onClose: function(data) {
//                         window.ReactNativeWebView.postMessage(JSON.stringify(data));
//                     }
//                 });
//             }
//             window.onload = payWithMonnify;
//         </script>
//     </head>
//     <body></body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={24} color="#6B7280" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Deposit</Text>
//         <MaterialIcons name="notifications-none" size={24} color="#4B0082" />
//       </View>

//       {showWebView ? (
//         <WebView
//           originWhitelist={['*']}
//           source={{ html: monnifyHtml }}
//           onMessage={(event) => {
//             const data = JSON.parse(event.nativeEvent.data);
//             console.log('Payment response:', data);
//             setShowWebView(false);
//             // Handle payment response here
//           }}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//         />
//       ) : (
//         <ScrollView contentContainerStyle={styles.contentContainer}>
//           <Text style={styles.sectionTitle}>Select a bank</Text>

//           {['Opay', 'Firstbank', 'Palmpay', 'Kuda'].map(bank => (
//             <TouchableOpacity
//               key={bank}
//               style={styles.bankOption}
//               onPress={() => handleBankSelection(bank)}
//             >
//               <View style={[styles.bankIconContainer, bank === 'Opay' ? { backgroundColor: '#10B981' } :
//                                                         bank === 'Firstbank' ? { backgroundColor: '#EF4444' } :
//                                                         bank === 'Palmpay' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#9CA3AF' }]}>
//                 <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
//               </View>
//               <Text style={styles.bankName}>{bank}</Text>
//               <MaterialIcons name={selectedBank === bank ? "radio-button-checked" : "radio-button-unchecked"} size={24} color="#4B0082" />
//             </TouchableOpacity>
//           ))}

//           <Text style={styles.label}>Account Name</Text>
//           <TextInput style={styles.input} value={accountName} editable={false} />

//           <Text style={styles.label}>Account Number</Text>
//           <TextInput style={styles.input} value={accountNumber} editable={false} />

//           <Text style={styles.label}>Amount</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter amount"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />

//           <TouchableOpacity style={styles.submitButton} onPress={handlePayment}>
//             <Text style={styles.submitButtonText}>Pay with Monnify</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
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
// });

// export default Deposit;

































































import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import * as Clipboard from 'expo-clipboard';

const Deposit = ({ navigation }) => {
  const [accountInfo, setAccountInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = FIREBASE_AUTH.currentUser?.uid;

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!userId) return;

      try {
        const userDocRef = doc(FIREBASE_DB, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setAccountInfo(userData.monnifyAccounts || []);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [userId]);

  const copyAccountNumber = async (accountNumber) => {
    try {
      await Clipboard.setStringAsync(accountNumber);
      Alert.alert('Copied', 'Account number copied to clipboard.');
    } catch (error) {
      console.error('Error copying account number:', error);
      Alert.alert('Error', 'Could not copy account number. Please try again.');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;

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
      <TouchableOpacity
            style={styles.bankOption}>
            <View style={styles.bankIconContainer}> 
              <MaterialIcons name="account-balance-wallet" size={24} color="#EF4444" />
            </View>
            <Text style={styles.transferText}>Bank Transfer</Text>
            <MaterialIcons name={"radio-button-checked" } size={24} color="#4B0082" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.transfer} onPress={() => navigation.navigate('Transfer')}>
          <View style={styles.transferIconContainer}>
            <MaterialIcons name="compare-arrows" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.transferText}>Transfer to Savi user</Text>
        </TouchableOpacity>


        <Text style={styles.sectionTitle}> Account Details:</Text>
        {accountInfo.map((account, index) => (
          <View key={index} style={styles.accountContainer}>
            <Text style={styles.label}>Bank Name:</Text>
            <TextInput style={styles.input} value={account.bankName} editable={false} />
            {/* <Text style={styles.accountText}>{account.bankName}</Text> */}
            <Text style={styles.label}>Account Number:</Text>
            <TextInput style={styles.input} value={account.accountNumber} editable={false} />
            {/* <Text style={styles.accountText}>{account.accountNumber}</Text> */}
            <Text style={styles.label}>Account Name:</Text>
            <TextInput style={styles.input} value={account.accountName} editable={false} />

            {/* <Text style={styles.accountText}>{account.accountName}</Text> */}
            <TouchableOpacity style={styles.copyButton} onPress={() => copyAccountNumber(account.accountNumber)}>
              <Text style={styles.copyButtonText}>Copy Acct.Number</Text>
            </TouchableOpacity>
          </View>
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
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
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
    marginBottom: 30,
  },
  bankIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 40,
  },
  bankName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#4B0082',
  },
  transferIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 40,
  },

  transfer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    top: -15,
    padding: 25,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',


  },

  transferText: {
    flex: 1,
    fontSize: 16,
    color: '#4B0082',
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
  accountContainer: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 5,
  },
  accountText: {
    fontSize: 16,
    color: '#4B0082',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Deposit;







