import { View, Text } from 'react-native'
import React, {useEffect} from 'react'
import { useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import UserInfo from '../../components/User/UserInfo';

const Userinfo = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Thông tin người dùng',
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      ),
    })
  });
  return (
    <>
      <UserInfo />
    </>
  )
}

export default Userinfo