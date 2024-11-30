import React, { useContext, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthContext } from '../components/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider } from '../components/AuthContext';
import { useRouter } from 'expo-router';

function RootLayout() {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) { 
            if (!isAuthenticated) {
                router.replace('/auth/signin');
            }
            else {
                router.replace('/(tabs)/home');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (

        <Stack>
            {!isAuthenticated ? (
                <Stack.Screen name="auth" options={{ headerShown: false }} />
            ) : (
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            )}
        </Stack>
    );
}
export default function AppLayout() {
    return (
        <AuthProvider>
            <RootLayout />
        </AuthProvider>
    );
}
