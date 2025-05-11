

// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Text,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import axios from 'axios';

// const SignUp = ({ navigation }: { navigation: any }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [loading, setLoading] = useState(false);

//   const auth = FIREBASE_AUTH;
//   const db = FIREBASE_DB;

//   const validateInputs = () => {
//     if (!username || !firstName || !lastName || !email || !password || !mobileNumber) {
//       alert('Please fill out all fields.');
//       return false;
//     }
//     return true;
//   };

//   const generateMonnifyToken = async () => {
//     try {
//       const apiKey = 'MK_TEST_J0BV4E7B70';
//       const secretKey = 'M32JU59N2QQV6E1L8HH33RUMSJU2DXG0';

//       const authHeaders = {
//         Authorization: 'Basic ' + btoa(`${apiKey}:${secretKey}`),
//         'Content-Type': 'application/json',
//       };

//       const tokenResponse = await axios.post(
//         'https://sandbox.monnify.com/api/v1/auth/login',
//         {},
//         { headers: authHeaders }
//       );
//       return tokenResponse.data.responseBody.accessToken;
//     } catch (error) {
//       console.error('Error generating Monnify token:', error);
//       throw new Error('Failed to generate Monnify token');
//     }
//   };

//   const createMonnifyAccount = async (userId: string, token: string) => {
//     try {
//       const monnifyUrl = 'https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts';
//       const monnifyData = {
//         accountReference: `USER_${userId}`, // Unique reference for the account
//         accountName: `${firstName} ${lastName}`,
//         currencyCode: 'NGN',
//         contractCode: '1737544075', // Your Monnify contract code
//         customerEmail: email,
//         customerName: `${firstName} ${lastName}`,
//         getAllAvailableBanks: false,
//         preferredBanks: ['035', '232'], // Bank codes for Wema Bank and Sterling Bank
//       };

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       const monnifyResponse = await axios.post(monnifyUrl, monnifyData, { headers });
//       return monnifyResponse.data.responseBody.accounts; // Return the created accounts
//     } catch (error) {
//       console.error('Error creating Monnify virtual account:', error);
//       throw new Error('Failed to create Monnify virtual account');
//     }
//   };



//   const signUp = async () => {
//     if (!validateInputs()) return;
  
//     setLoading(true);
//     try {
//       // Step 1: Create user in Firebase Auth
//       const response = await createUserWithEmailAndPassword(auth, email, password);
//       const userId = response.user.uid;
  
//       // Step 2: Generate Monnify token
//       const monnifyToken = await generateMonnifyToken();
  
//       // Step 3: Create Monnify account for the user
//       const accounts = await createMonnifyAccount(userId, monnifyToken);
//       const accountInfo = accounts.map(acc => ({
//         bankName: acc.bankName,
//         accountNumber: acc.accountNumber,
//         accountName: acc.accountName, // Include account name for clarity
//         reference: `USER_${userId}`, // Save the unique reference here
//       }));
//       console.log('Monnify virtual accounts created:', accountInfo);
  
//       // Step 4: Save user details and Monnify account info to Firestore
//       const userDoc = {
//         username,
//         firstname: firstName,
//         lastname: lastName,
//         email,
//         mobile: parseInt(mobileNumber),
//         monnifyAccounts: accountInfo, // Array with reference included
//       };
  
//       console.log('User data to be saved to Firestore:', userDoc);
  
//       await setDoc(doc(db, 'users', userId), userDoc);
  
//       console.log('User registered and Monnify account saved to Firestore.');
//       Alert.alert(
//         'Account created successfully',
//         `Your account has been created. You can now deposit funds using your virtual account.`
//       );
//       navigation.navigate('CreateLoginPin');
//     } catch (error: any) {
//       console.log('Sign up error:', error);
//       alert('Sign up failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  













import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import axios from 'axios';

const SignUp = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const validateInputs = () => {
    if (!username || !firstName || !lastName || !email || !password || !mobileNumber) {
      alert('Please fill out all fields.');
      return false;
    }
    return true;
  };

  const generateMonnifyToken = async () => {
    try {
      const apiKey = 'MK_TEST_J0BV4E7B70';
      
      const secretKey = 'M32JU59N2QQV6E1L8HH33RUMSJU2DXG0';
      

      const authHeaders = {
        Authorization: 'Basic ' + btoa(`${apiKey}:${secretKey}`),
        'Content-Type': 'application/json',
      };

      const tokenResponse = await axios.post(
        'https://sandbox.monnify.com/api/v1/auth/login',
        {},
        { headers: authHeaders }
      );
      return tokenResponse.data.responseBody.accessToken;
    } catch (error) {
      console.error('Error generating Monnify token:', error);
      throw new Error('Failed to generate Monnify token');
    }
  };

  const createMonnifyAccount = async (userId: string, token: string) => {
    try {
      const monnifyUrl = 'https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts';
      const monnifyData = {
        accountReference: `USER_${userId}`,
        accountName: `${firstName} ${lastName}`,
        currencyCode: 'NGN',
        contractCode: '1737544075',
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        getAllAvailableBanks: false,
        preferredBanks: ['035', '232'],
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const monnifyResponse = await axios.post(monnifyUrl, monnifyData, { headers });
      return monnifyResponse.data.responseBody.accounts;
    } catch (error) {
      console.error('Error creating Monnify virtual account:', error);
      throw new Error('Failed to create Monnify virtual account');
    }
  };

  const createTransactionCollection = async (userId: string) => {
    try {
      const transactionRef = doc(collection(db, 'transactions'), userId);
      const transactionData = {
        transactions: [],
      };
      await setDoc(transactionRef, transactionData);
      console.log('Transaction collection initialized for user:', userId);
    } catch (error) {
      console.error('Error creating transaction collection:', error);
      throw new Error('Failed to create transaction collection');
    }
  };

  const signUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const userId = response.user.uid;

      const monnifyToken = await generateMonnifyToken();
      const accounts = await createMonnifyAccount(userId, monnifyToken);
      const accountInfo = accounts.map((acc) => ({
        bankName: acc.bankName,
        accountNumber: acc.accountNumber,
        accountName: acc.accountName,
        reference: `USER_${userId}`,
      }));

      const userDoc = {
        username,
        firstname: firstName,
        lastname: lastName,
        email,
        mobile: parseInt(mobileNumber),
        monnifyAccounts: accountInfo,
      };

      await setDoc(doc(db, 'users', userId), userDoc);
      await createTransactionCollection(userId);

      Alert.alert(
        'Account created successfully',
        `Your account has been created. You can now deposit funds using your virtual account.`
      );
      navigation.navigate('CreateLoginPin');
    } catch (error: any) {
      console.log('Sign up error:', error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        style={styles.input}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={signUp} style={styles.button}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
    </View>
  );
};




// alright lets do something diferent 

// so we willl be doing like a virtual dedicated account for each user that signs up so that when they want to deposit into their account they can just use the account number dedicated to them to do that and from this code you can see that after the account has been given to the user from monnify it is saved in the firestore database just like it is in this code:
// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Text,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc, collection } from 'firebase/firestore';
// import axios from 'axios';

// const SignUp = ({ navigation }: { navigation: any }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [loading, setLoading] = useState(false);

//   const auth = FIREBASE_AUTH;
//   const db = FIREBASE_DB;

//   const validateInputs = () => {
//     if (!username || !firstName || !lastName || !email || !password || !mobileNumber) {
//       alert('Please fill out all fields.');
//       return false;
//     }
//     return true;
//   };

//   const generateMonnifyToken = async () => {
//     try {
//       const apiKey = 'MK_TEST_J0BV4E7B70';
//       const secretKey = 'M32JU59N2QQV6E1L8HH33RUMSJU2DXG0';

//       const authHeaders = {
//         Authorization: 'Basic ' + btoa(`${apiKey}:${secretKey}`),
//         'Content-Type': 'application/json',
//       };

//       const tokenResponse = await axios.post(
//         'https://sandbox.monnify.com/api/v1/auth/login',
//         {},
//         { headers: authHeaders }
//       );
//       return tokenResponse.data.responseBody.accessToken;
//     } catch (error) {
//       console.error('Error generating Monnify token:', error);
//       throw new Error('Failed to generate Monnify token');
//     }
//   };

//   const createMonnifyAccount = async (userId: string, token: string) => {
//     try {
//       const monnifyUrl = 'https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts';
//       const monnifyData = {
//         accountReference: `USER_${userId}`,
//         accountName: `${firstName} ${lastName}`,
//         currencyCode: 'NGN',
//         contractCode: '1737544075',
//         customerEmail: email,
//         customerName: `${firstName} ${lastName}`,
//         getAllAvailableBanks: false,
//         preferredBanks: ['035', '232'],
//       };

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       const monnifyResponse = await axios.post(monnifyUrl, monnifyData, { headers });
//       return monnifyResponse.data.responseBody.accounts;
//     } catch (error) {
//       console.error('Error creating Monnify virtual account:', error);
//       throw new Error('Failed to create Monnify virtual account');
//     }
//   };

//   const createTransactionCollection = async (userId: string) => {
//     try {
//       const transactionRef = doc(collection(db, 'transactions'), userId);
//       const transactionData = {
//         transactions: [],
//       };
//       await setDoc(transactionRef, transactionData);
//       console.log('Transaction collection initialized for user:', userId);
//     } catch (error) {
//       console.error('Error creating transaction collection:', error);
//       throw new Error('Failed to create transaction collection');
//     }
//   };

//   const signUp = async () => {
//     if (!validateInputs()) return;

//     setLoading(true);
//     try {
//       const response = await createUserWithEmailAndPassword(auth, email, password);
//       const userId = response.user.uid;

//       const monnifyToken = await generateMonnifyToken();
//       const accounts = await createMonnifyAccount(userId, monnifyToken);
//       const accountInfo = accounts.map((acc) => ({
//         bankName: acc.bankName,
//         accountNumber: acc.accountNumber,
//         accountName: acc.accountName,
//         reference: `USER_${userId}`,
//       }));

//       const userDoc = {
//         username,
//         firstname: firstName,
//         lastname: lastName,
//         email,
//         mobile: parseInt(mobileNumber),
//         monnifyAccounts: accountInfo,
//       };

//       await setDoc(doc(db, 'users', userId), userDoc);
//       await createTransactionCollection(userId);

//       Alert.alert(
//         'Account created successfully',
//         `Your account has been created. You can now deposit funds using your virtual account.`
//       );
//       navigation.navigate('CreateLoginPin');
//     } catch (error: any) {
//       console.log('Sign up error:', error);
//       alert('Sign up failed: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="First Name"
//         value={firstName}
//         onChangeText={setFirstName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Last Name"
//         value={lastName}
//         onChangeText={setLastName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         keyboardType="email-address"
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         style={styles.input}
//         secureTextEntry
//       />
//       <TextInput
//         placeholder="Mobile Number"
//         value={mobileNumber}
//         onChangeText={setMobileNumber}
//         style={styles.input}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity onPress={signUp} style={styles.button}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// };

//  i hope its clear??? we are doing this to our own signup code 

//  when you are clear on what the task is here then we can continue so i will provide my code so we can implement it into my code

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SignUp;
