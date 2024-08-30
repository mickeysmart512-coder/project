import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Switch } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const CreateGroup = ({ route, navigation }) => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [contributionDuration, setContributionDuration] = useState('');
  const [payoutPlan, setPayoutPlan] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [payoutPerUser, setPayoutPerUser] = useState('');
  const [isRegistrationFee, setIsRegistrationFee] = useState(false);
  const [registrationFeeAmount, setRegistrationFeeAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    if (route.params && route.params.currentUserId) {
      setCurrentUserId(route.params.currentUserId);
    } else {
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        Alert.alert('Error', 'User is not authenticated.');
        navigation.goBack();
      }
    }
  }, [route.params]);

  // Calculate payout per user
  useEffect(() => {
    if (groupSize && contributionAmount && contributionDuration) {
      let totalAmount = parseFloat(contributionAmount) * parseInt(groupSize, 10);
      let membersPerPayout;
      
      switch (contributionDuration) {
        case '2 weeks':
          membersPerPayout = Math.ceil(parseInt(groupSize, 10) / 2);
          break;
        case 'a month':
        case '2 months':
          membersPerPayout = Math.ceil(parseInt(groupSize, 10) / 4);
          break;
        case '4 months':
          membersPerPayout = Math.ceil(parseInt(groupSize, 10) / 4);
          break;
        default:
          membersPerPayout = 1;
      }
      
      setPayoutPerUser((totalAmount / membersPerPayout).toFixed(2));
    }
  }, [groupSize, contributionAmount, contributionDuration]);

  // Calculate start and end dates based on contribution duration
  useEffect(() => {
    if (contributionDuration) {
      const current = moment();
      let end;

      switch (contributionDuration) {
        case '2 weeks':
          end = current.add(2, 'weeks').format('DD/MM/YYYY');
          break;
        case 'a month':
          end = current.add(1, 'month').format('DD/MM/YYYY');
          break;
        case '2 months':
          end = current.add(2, 'months').format('DD/MM/YYYY');
          break;
        case '4 months':
          end = current.add(4, 'months').format('DD/MM/YYYY');
          break;
        default:
          end = current.format('DD/MM/YYYY');
      }

      setStartDate(moment().format('DD/MM/YYYY'));
      setEndDate(end);
    }
  }, [contributionDuration]);

  const handleCreateGroup = async () => {
    if (!groupName || !groupDescription || !groupSize || !contributionAmount || !contributionDuration || !payoutPlan) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (isRegistrationFee && !registrationFeeAmount) {
      Alert.alert('Error', 'Please enter the registration fee amount.');
      return;
    }

    const newGroup = {
      name: groupName,
      description: groupDescription,
      size: parseInt(groupSize, 10),
      contributionDuration,
      payoutPlan, // Storing payout plan
      contributionAmount: parseFloat(contributionAmount),
      payoutPerUser: parseFloat(payoutPerUser), // Storing payout per user
      isRegistrationFee,
      registrationFeeAmount: isRegistrationFee ? parseFloat(registrationFeeAmount) : 0,
      createdAt: new Date(),
      creatorId: currentUserId,
      members: [currentUserId],
      startDate: startDate,
      endDate: endDate,
    };

    try {
      await addDoc(collection(db, 'groups'), newGroup);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not create group. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Description"
        value={groupDescription}
        onChangeText={setGroupDescription}
      />

      <Picker
        selectedValue={groupSize}
        style={styles.picker}
        onValueChange={(itemValue) => setGroupSize(itemValue)}
      >
        <Picker.Item label="Select Group Size" value="" />
        {[2, 4, 6, 8].map(size => (
          <Picker.Item key={size} label={`${size}`} value={size.toString()} />
        ))}
      </Picker>

      <Picker
        selectedValue={contributionDuration}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setContributionDuration(itemValue);
          // Adjust payout plan based on contribution duration and group size rules
          if (itemValue === '2 weeks' || itemValue === 'a month') {
            setPayoutPlan('weekly');
          } else {
            setPayoutPlan('');
          }
        }}
      >
        <Picker.Item label="Select Contribution Duration" value="" />
        <Picker.Item label="2 weeks" value="2 weeks" />
        <Picker.Item label="a month" value="a month" />
        <Picker.Item label="2 months" value="2 months" />
        <Picker.Item label="4 months" value="4 months" />
      </Picker>

      <Picker
        selectedValue={payoutPlan}
        style={styles.picker}
        onValueChange={(itemValue) => setPayoutPlan(itemValue)}
        enabled={contributionDuration !== '2 weeks' && contributionDuration !== 'a month'}
      >
        <Picker.Item label="Select Payout Plan" value="" />
        <Picker.Item label="Weekly" value="weekly" />
        {contributionDuration === '4 months' && (
          <Picker.Item label="Monthly" value="monthly" />
        )}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Fixed Contribution Amount"
        value={contributionAmount}
        onChangeText={setContributionAmount}
        keyboardType="numeric"
      />

      {payoutPerUser && (
        <Text style={styles.payoutDisplay}>
          Payout Per Person: ₦{payoutPerUser} 
        </Text>
      )}

      {/* Display Start and End Dates */}
      {startDate && endDate && (
        <Text style={styles.dateDisplay}>
          Contribution Period: {startDate} - {endDate}
        </Text>
      )}

      {/* Registration Fee Switch */}
      <View style={styles.switchContainer}>
        <Text>Enable Registration Fee?</Text>
        <Switch
          value={isRegistrationFee}
          onValueChange={(value) => setIsRegistrationFee(value)}
        />
      </View>

      {/* Registration Fee Amount Input */}
      {isRegistrationFee && (
        <TextInput
          style={styles.input}
          placeholder="Registration Fee Amount"
          value={registrationFeeAmount}
          onChangeText={setRegistrationFeeAmount}
          keyboardType="numeric"
        />
      )}

      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  payoutDisplay: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  dateDisplay: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default CreateGroup;
