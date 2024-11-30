import React, { createContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const cleanUserData = (data) => {
    const cleanedData = { ...data };
    Object.keys(cleanedData).forEach((key) => {
      if (
        cleanedData[key] === null ||
        cleanedData[key] === undefined ||
        Number.isNaN(cleanedData[key])
      ) {
        cleanedData[key] = '';
      }
    });
    return cleanedData;
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const storedUserData = await SecureStore.getItemAsync('userData');

        if (token) {
          setUserToken(token);
          setIsAuthenticated(true);

          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        } else {
          setUserToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Lỗi kiểm tra token hoặc userData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = async (token, userData) => {
    try {
      const cleanedData = cleanUserData(userData);
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(cleanedData));
      setUserToken(token);
      setUserData(cleanedData);
      setIsAuthenticated(true);
      console.log("Đăng nhập thành công và lưu dữ liệu:", cleanedData);
    } catch (error) {
      console.error('Lỗi lưu token hoặc userData:', error);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUserToken(null);
      setUserData(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, userData, setUserData, isAuthenticated, login, logout, isLoading }}>
      {isLoading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View> : children}
    </AuthContext.Provider>
  );
};
