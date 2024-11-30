import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SliderCompany from '../../components/Home/SliderCompany';
import Header from '../../components/Home/Header';
import CategoryJob from '../../components/Home/CategoryJob';
import JobItem from '../../components/Home/JobItem';
import SafeAreaWrapper from '../../components/SafeAreaWrapper';
const HomeScreen = () => {


  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Header />
        <SliderCompany />
        <CategoryJob />
        <JobItem />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  }
});

export default HomeScreen;