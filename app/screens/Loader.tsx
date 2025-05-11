import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Loader = () => {
  const dotAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, []);

  const dotStyles = (index) => ({
    transform: [
      {
        translateX: dotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50 * index],
        }),
      },
      {
        scale: dotAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Animated.View key={index} style={[styles.dot, dotStyles(index)]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
  },
});

export default Loader;
