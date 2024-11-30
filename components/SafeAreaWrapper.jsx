import React from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

const SafeAreaWrapper = ({ children }) => {
    return (
        <SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin:0,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        backgroundColor: '#fff',
    },
});

export default SafeAreaWrapper;
