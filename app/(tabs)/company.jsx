import { View, Text } from 'react-native'
import React from 'react'
import CompanyItem from '../../components/Company/CompanyItem'
import SafeAreaWrapper from '../../components/SafeAreaWrapper';

const company = () => {
  return (
    <SafeAreaWrapper>
      <CompanyItem />
    </SafeAreaWrapper>
  )
}

export default company