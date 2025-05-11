import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LandingPage = ({ navigation }:{navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding1');
    }, 6000);



    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.circleTopLeft} />
      <View style={styles.circleTopRight} />
      <Text style={styles.title}>SAVI</Text>
      <Text style={styles.subtitle}>Key to financial opportunity</Text>
      <View style={styles.circleBottomLeft} />
      <View style={styles.circleBottomRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     flex: 1, 
     justifyContent: 'center', 
     alignItems: 'center', 
     backgroundColor: '#FFF'
     },
  circleTopLeft: {
     position: 'absolute',
      top: 0, 
      left: -60, 
      width: 300, 
      height: 300, 
      borderRadius: 150,
       backgroundColor: '#3B82F6', 
       marginTop: -60,
      },
  circleTopRight: {
     position: 'absolute', 
     top: 0,
      right: 0,
       width: 200,
        height: 200,
         borderRadius: 100, 
        backgroundColor: '#4B0082',
        marginRight: -25,
        marginTop: -40,
       },
  circleBottomLeft: { 
    position: 'absolute',
     bottom: 0, 
     left: 0, 
     width: 200,
      height: 200, 
      borderRadius: 100, 
      backgroundColor: '#4B0082',
      marginBottom: -90,
      marginLeft:-40,
     },
  circleBottomRight: {
     position: 'absolute', 
     bottom: 0, 
     right: -80,
      width: 300,
       height: 300,
        borderRadius: 150,
         backgroundColor: '#3B82F6',
         marginBottom: -150,
         },
  title: { fontSize: 48, fontWeight: 'bold', color: '#4B0082' },
  subtitle: { fontSize: 20, color: '#3B82F6', marginTop: 10, fontWeight: 'bold' },
});

export default LandingPage;

