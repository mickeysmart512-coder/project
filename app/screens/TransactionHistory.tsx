

    // #############   ####    ########   ##        ##     ###     ########   ##
    // ###  ###  ###    ##    ##          ##        ##   ##   ##   ##         ##
    // ###  ###  ###    ##    ##          ## ###### ##  #########  ######     ##
    // ###  ###  ###    ##    ##          ##        ##  ##     ##  ##         ##
    // ###  ###  ###    ##    ##          ##        ##  ##     ##  ##         ##
    // ###  ###  ###   ####    ########   ##        ##  ##     ##  ########   ########




    


//  ##########   ########   ########   ##        ##
// ##   ##   ##  ##        ##          ##        ##
//      ##       ######    ##          ## ###### ##  #######   #######     #######    ######    ######## 
//      ##       ##        ##          ##        ##  ##        ##    ##   ##     ##  ##        ##  ##  ##
//      ##       ##        ##          ##        ##  #####     #######    ##     ##  ######        ##
//      ##       ##        ##          ##        ##  ##        ##   ##    ##     ##       ##       ##
//      ##       ########   ########   ##        ##  ##        ##    ##    #######   ######        ##
     






// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// const TransactionHistory = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Get the currently signed-in user
//   const currentUser = FIREBASE_AUTH.currentUser;

//   useEffect(() => {
//     if (!currentUser) return;

//     const fetchTransactions = async () => {
//       try {
//         const transactionsRef = collection(FIREBASE_DB, 'transactions');
//         const q = query(
//           transactionsRef,
//           where('userId', '==', currentUser.uid),
//           orderBy('createdAt', 'desc')
//         );

//         const querySnapshot = await getDocs(q);
//         const fetchedTransactions = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setTransactions(fetchedTransactions);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching transactions:', error.message);
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (transactions.length === 0) {
//     return (
//       <View style={styles.noDataContainer}>
//         <Text style={styles.noDataText}>No transactions found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>
//       <FlatList
//         data={transactions}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.transactionItem}>
//             <Text style={styles.description}>{item.description}</Text>
//             <Text style={styles.amount}>
//               {item.transactionType === 'deposit' ? '+' : '-'}${item.amount.toFixed(2)}
//             </Text>
//             <Text style={styles.status}>
//               Status: <Text style={styles[item.status]}>{item.status}</Text>
//             </Text>
//             <Text style={styles.date}>
//               {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//     padding: 16,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#999',
//   },
//   transactionItem: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   description: {
//     fontSize: 14,
//     color: '#333',
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   status: {
//     fontSize: 14,
//     marginTop: 5,
//   },
//   success: {
//     color: 'green',
//   },
//   failed: {
//     color: 'red',
//   },
//   date: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 5,
//   },
// });

// export default TransactionHistory;




import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Use navigation hook

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const fetchTransactions = async () => {
      try {
        const transactionsRef = collection(FIREBASE_DB, 'transactions');
        const q = query(
          transactionsRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedTransactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTransactions(fetchedTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No transactions found.</Text>
      </View>
    );
  }

  const handleTransactionClick = (transaction) => {
    navigation.navigate('ReceiptScreen', { transaction });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.transactionItem}
            onPress={() => handleTransactionClick(item)}
          >
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.amount}>
              {item.transactionType === 'deposit' ? '+' : '-'}${item.amount.toFixed(2)}
            </Text>
            <Text style={styles.status}>
              Status: <Text style={styles[item.status]}>{item.status}</Text>
            </Text>
            <Text style={styles.date}>
              {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    marginTop: 5,
  },
  success: {
    color: 'green',
  },
  failed: {
    color: 'red',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default TransactionHistory;
