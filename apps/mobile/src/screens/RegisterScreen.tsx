import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender || !height || !weight || !activityLevel) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {      await register({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender as 'male' | 'female' | 'other',
        height: parseFloat(height),
        weight: parseFloat(weight),
        activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Start your fitness journey today
            </Text>

            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              label="Date of Birth (YYYY-MM-DD)"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              mode="outlined"
              style={styles.input}
              placeholder="1990-01-01"
            />

            <TextInput
              label="Gender"
              value={gender}
              onChangeText={setGender}
              mode="outlined"
              style={styles.input}
              placeholder="male, female, or other"
            />

            <TextInput
              label="Height (cm)"
              value={height}
              onChangeText={setHeight}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="170"
            />

            <TextInput
              label="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
              placeholder="70"
            />

            <TextInput
              label="Activity Level"
              value={activityLevel}
              onChangeText={setActivityLevel}
              mode="outlined"
              style={styles.input}
              placeholder="sedentary, light, moderate, active, very_active"
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            >
              Create Account
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Already have an account? Sign in
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    marginHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 8,
  },
});
