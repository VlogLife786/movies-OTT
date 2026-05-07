import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    Animated.timing(taglineOpacity, { toValue: 1, duration: 600, delay: 1200, useNativeDriver: true }).start();
    const timer = setTimeout(() => router.replace('/home'), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0000', '#0B0B0B', '#000a1a']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Text style={styles.logo}>🎬</Text>
        <Text style={styles.title}>MovieStream</Text>
      </Animated.View>
      <Animated.View style={{ opacity: taglineOpacity }}>
        <Text style={styles.tagline}>Unlimited Entertainment</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  logo: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginTop: 12, textAlign: 'center' },
  tagline: { fontSize: 14, color: COLORS.textSecondary, marginTop: 16 },
});
