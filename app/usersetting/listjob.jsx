import React, {useEffect} from 'react'
import ManageCv from '../../components/User/ManageCv'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router'

const Listjob = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Danh sách công việc đã ứng tuyển',
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
      <ManageCv />
    </>
  )
}

export default Listjob