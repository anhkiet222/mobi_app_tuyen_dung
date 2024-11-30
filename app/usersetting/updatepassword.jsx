import React, {useEffect} from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router'
import UpdatePassword from '../../components/User/UpdatePassword'

const Updatepassword = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Đổi Mật khẩu Tài khoản',
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
    <UpdatePassword />
  )
}

export default Updatepassword