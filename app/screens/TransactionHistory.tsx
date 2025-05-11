

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
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import navigation hook
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// const TransactionHistory = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation(); // Use navigation hook

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

//   const handleTransactionClick = (transaction) => {
//     navigation.navigate('ReceiptScreen', { transaction });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Transaction History</Text>
//       <FlatList
//         data={transactions}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.transactionItem}
//             onPress={() => handleTransactionClick(item)}
//           >
//             <Text style={styles.description}>{item.description}</Text>
//             <Text style={styles.amount}>
//               {item.transactionType === 'deposit' ? '+' : '-'}N{item.amount.toFixed(2)}
//             </Text>
//             <Text style={styles.status}>
//               Status: <Text style={styles[item.status]}>{item.status}</Text>
//             </Text>
//             <Text style={styles.date}>
//               {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
//             </Text>
//           </TouchableOpacity>
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
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

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
        setFilteredTransactions(fetchedTransactions);
        
        // Extract unique months from transactions
        const months = new Set();
        fetchedTransactions.forEach(transaction => {
          if (transaction.createdAt) {
            const date = new Date(transaction.createdAt.seconds * 1000);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            months.add(monthYear);
          }
        });
        
        const sortedMonths = Array.from(months).sort((a, b) => {
          return new Date(b) - new Date(a);
        });
        
        setAvailableMonths(['All Months', ...sortedMonths]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  const filterByMonth = (month) => {
    setSelectedMonth(month);
    setModalVisible(false);
    
    if (month === 'All Months') {
      setFilteredTransactions(transactions);
      return;
    }
    
    const filtered = transactions.filter(transaction => {
      if (!transaction.createdAt) return false;
      const date = new Date(transaction.createdAt.seconds * 1000);
      const transactionMonthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      return transactionMonthYear === month;
    });
    
    setFilteredTransactions(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6a5acd" />
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Ionicons name="receipt-outline" size={60} color="#6a5acd" />
        <Text style={styles.noDataText}>No transactions found</Text>
        <Text style={styles.noDataSubText}>Your transactions will appear here</Text>
      </View>
    );
  }

  const handleTransactionClick = (transaction) => {
    navigation.navigate('ReceiptScreen', { transaction });
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit':
        return <Ionicons name="arrow-down-circle" size={24} color="#4CAF50" />;
      case 'withdrawal':
        return <Ionicons name="arrow-up-circle" size={24} color="#F44336" />;
      default:
        return <Ionicons name="swap-horizontal" size={24} color="#6a5acd" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      
      {/* Month Filter Dropdown */}
      <TouchableOpacity 
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>{selectedMonth}</Text>
        <Ionicons name="chevron-down" size={20} color="#6a5acd" />
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            {availableMonths.map((month, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.monthItem,
                  pressed && styles.monthItemPressed,
                  month === selectedMonth && styles.selectedMonthItem
                ]}
                onPress={() => filterByMonth(month)}
              >
                <Text style={styles.monthText}>{month}</Text>
                {month === selectedMonth && (
                  <Ionicons name="checkmark" size={20} color="#6a5acd" />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      
      {filteredTransactions.length === 0 ? (
        <View style={styles.noFilteredDataContainer}>
          <Ionicons name="calendar-outline" size={50} color="#6a5acd" />
          <Text style={styles.noFilteredDataText}>No transactions for {selectedMonth}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.transactionItem}
              onPress={() => handleTransactionClick(item)}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.iconContainer}>
                  {getTransactionIcon(item.transactionType)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.date}>
                    {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                  </Text>
                </View>
                <Text style={[
                  styles.amount,
                  item.transactionType === 'deposit' ? styles.amountPositive : styles.amountNegative
                ]}>
                  {item.transactionType === 'deposit' ? '+' : '-'}N{item.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[
                  styles.status,
                  item.status === 'success' ? styles.success : 
                  item.status === 'failed' ? styles.failed : styles.pending
                ]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
    marginTop: 24,
    textAlign: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#4B0082',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 16,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
    textAlign: 'center',
  },
  monthItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthItemPressed: {
    backgroundColor: '#f9fafb',
  },
  selectedMonthItem: {
    backgroundColor: '#f3f0ff',
  },
  monthText: {
    fontSize: 14,
    color: '#374151',
  },
  noFilteredDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noFilteredDataText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    flexDirection: 'row',
  },
  date: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    left: 80,
  },
  amountPositive: {
    color: '#10B981',
  },
  amountNegative: {
    color: '#EF4444',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 39,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  success: {
    color: '#10B981',
  },
  failed: {
    color: '#EF4444',
  },
  pending: {
    color: '#F59E0B',
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
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
  },
  noDataSubText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
export default TransactionHistory;