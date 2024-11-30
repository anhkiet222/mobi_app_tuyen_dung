import React, {useEffect} from 'react'
import { useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import UserSetting from '../../components/User/UserSetting'

const Advancedsetting = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Cài đặt tài Khoản',
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
      <UserSetting/>
    </>
  )
}

export default Advancedsetting