import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Eye, EyeOff, User } from 'lucide-react-native';

import { login } from '../services/authService';
import { COLORS, SIZES } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter both Email and Password');
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const response = await login(email, password);
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
        
        // Use replace or navigate to trigger re-render in AppNavigator
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Driver Portal</Text>
          <Text style={styles.headerSubtitle}>Welcome back! Please login to continue.</Text>
        </View>

        <View style={styles.formContainer}>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputContainer}>
            <User color={COLORS.gray} size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={COLORS.gray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingLeft: 15 }]}
              placeholder="Password"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff color={COLORS.gray} size={20} />
              ) : (
                <Eye color={COLORS.gray} size={20} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  headerContainer: {
    marginBottom: SIZES.padding * 3,
  },
  headerTitle: {
    fontSize: SIZES.extraLarge * 1.2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  headerSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.darkGray,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.base * 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.lightGray,
  },
  inputIcon: {
    paddingLeft: SIZES.small,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: SIZES.small,
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  eyeIcon: {
    padding: SIZES.small,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: SIZES.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
});

export default LoginScreen;
