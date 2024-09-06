import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const OnboardingPage3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={[styles.circle, styles.blueCircle]} />
        <View style={[styles.circle, styles.purpleCircle]} />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>All Set</Text>
       <Text style={styles.subtitle}>Congratulations you all set</Text> 

        <View style={styles.done}>
          <Image source={require('../../assets/done.png')} style={styles.img} />
            
        </View> 
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circle: {
    marginTop: -50,
  },
  purpleCircle: {
    backgroundColor: '#4B0082',
    top: -50, 
    left: 200, 
    width: 180, 
    height: 200, 
    borderRadius: 100,
    
   
  },
blueCircle: {
    backgroundColor: '#3B82F6',
    top: 60, 
    left: 250, 
    width: 150, 
    height: 150, 
    borderRadius: 150,
    position: 'absolute'
  },
  bottomContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 90,
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 90,
    textAlign: 'left',
    bottom: 80,
  },
  subtitle: {
     fontSize: 20,
      color: '#000', 
      marginTop: 0,
       top: 90,
        fontWeight: 'bold'
       },

  
  signInButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    // paddingHorizontal: 40,
    width: '50%',
    borderRadius: 8,
    marginVertical: 20,
    top: 80,
    left: 60,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  done: {
    flexDirection: 'row',
    marginTop: -90,
    marginVertical: 20,
    top: -30,
  },
  img:{
    width: 200,
    height: 200,
    marginBottom:0,
    marginTop: -10,
    padding: 10,
  }
  
});

export default OnboardingPage3;