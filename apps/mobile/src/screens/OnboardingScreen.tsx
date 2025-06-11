import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' }}
            style={styles.heroImage}
          />
          <Text variant="headlineLarge" style={styles.title}>
            AI Fitness Coach
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Your personal AI-powered fitness and nutrition companion
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text variant="titleMedium" style={styles.featureTitle}>
              Personalized Plans
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              AI-generated workout and nutrition plans tailored to your goals
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text variant="titleMedium" style={styles.featureTitle}>
              Progress Tracking
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Monitor your fitness journey with detailed analytics
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text variant="titleMedium" style={styles.featureTitle}>
              AI Guidance
            </Text>
            <Text variant="bodyMedium" style={styles.featureText}>
              Get real-time coaching and recommendations from AI
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Register')}
            style={styles.primaryButton}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.secondaryButton}
          >
            I Already Have an Account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#6366f1',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
  },
  features: {
    marginVertical: 32,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 32,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureText: {
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 4,
  },
  secondaryButton: {
    paddingVertical: 4,
  },
});
