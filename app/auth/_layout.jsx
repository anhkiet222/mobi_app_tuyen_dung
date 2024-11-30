import React from 'react';
import { Stack } from 'expo-router';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
import { StatusBar} from 'react-native';

const AuthLayout = () => {
  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor="#6a51ae" />
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgotpassword" />
      </Stack>
    </SafeAreaWrapper>
  );
};


export default AuthLayout;
