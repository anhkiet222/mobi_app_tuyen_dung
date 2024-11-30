import { View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { DetailCompany } from '../../api/companyApi';
import CompanyDetail from '../../components/Company/CompanyDetail';

const DetailCompanyScreen = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { companyid } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await DetailCompany(companyid);
      setData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feature data", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <CompanyDetail
        data={data}
      />
    </>
  )
}
export default DetailCompanyScreen;