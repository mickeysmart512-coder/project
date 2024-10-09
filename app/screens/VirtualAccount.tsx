// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { createAndStoreVirtualAccount } from './VirtualAccount'; // Ensure the path is correct
// import { FIREBASE_AUTH } from '../../FirebaseConfig'; // Adjust path to Firebase config

// const VirtualAccount = () => {
//   const [accountDetails, setAccountDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const createAccount = async () => {
//       const user = FIREBASE_AUTH.currentUser;
//       if (user) {
//         const { uid, displayName, email } = user;
//         try {
//           const virtualAccount = await createAndStoreVirtualAccount(uid, displayName, email);
//           setAccountDetails(virtualAccount);
//         } catch (error) {
//           console.error('Error creating virtual account:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     createAccount();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4B0082" />
//         <Text style={styles.loadingText}>Creating your virtual account...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Bank Name: {accountDetails?.bankName}</Text>
//       <Text style={styles.text}>Account Number: {accountDetails?.accountNumber}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     color: '#333',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#4B0082',
//   },
// });

// export default VirtualAccount;









import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VirtualAccount = () => {
  return (
    <View>
      <Text>VirtualAccount</Text>
    </View>
  )
}

export default VirtualAccount

const styles = StyleSheet.create({})