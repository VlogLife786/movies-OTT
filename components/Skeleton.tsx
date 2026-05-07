import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants';

export const Skeleton: React.FC<{ width?: number | string; height?: number; borderRadius?: number }> = ({
  width = '100%',
  height = 200,
  borderRadius = 12,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{ width: width as any, height, borderRadius, backgroundColor: COLORS.shimmer, opacity }}
    />
  );
};

export const MovieCardSkeleton = () => (
  <View style={styles.card}>
    <Skeleton height={220} borderRadius={12} />
    <View style={{ marginTop: 8 }}>
      <Skeleton height={16} width="70%" borderRadius={4} />
    </View>
    <View style={{ marginTop: 6 }}>
      <Skeleton height={12} width="40%" borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { width: '47%', marginBottom: 20 },
});
