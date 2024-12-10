import React, { useEffect, useState, useCallback } from 'react';
import { View, Modal, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Constants from 'expo-constants';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const FilterOverlay = React.memo(({ visible = false, onClose = () => { }, onApply = () => { } }) => {
  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedJobLevel, setSelectedJobLevel] = useState([]);
  const [selectedSalaryType, setSelectedSalaryType] = useState([]);
  const [selectedExpType, setSelectedExpType] = useState([]);
  const [selectedWorkType, setSelectedWorkType] = useState([]);
  const [selectedJobLocation, setSelectedJobLocation] = useState("");

  const [dataJobType, setDataJobType] = useState([]);
  const [dataJobLevel, setDataJobLevel] = useState([]);
  const [dataSalaryType, setDataSalaryType] = useState([]);
  const [dataExpType, setDataExpType] = useState([]);
  const [dataWorkType, setDataWorkType] = useState([]);
  const [dataJobLocation, setDataJobLocation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobTypes, jobLevels, salaryTypes, expTypes, workTypes, jobLocations] = await Promise.all([
          axios.get(`${apiUrl}/get-all-code/job-types`),
          axios.get(`${apiUrl}/get-all-code/job-levels`),
          axios.get(`${apiUrl}/get-all-code/salary-types`),
          axios.get(`${apiUrl}/get-all-code/exp-types`),
          axios.get(`${apiUrl}/get-all-code/work-types`),
          axios.get(`${apiUrl}/get-all-code/provinces`),
        ]);

        setDataJobType(jobTypes.data.map(item => ({ label: item.value, value: item.code })));
        setDataJobLevel(jobLevels.data.map(item => ({ label: item.value, value: item.code })));
        setDataSalaryType(salaryTypes.data.map(item => ({ label: item.value, value: item.code })));
        setDataExpType(expTypes.data.map(item => ({ label: item.value, value: item.code })));
        setDataWorkType(workTypes.data.map(item => ({ label: item.value, value: item.code })));
        setDataJobLocation(jobLocations.data.map(item => ({ label: item.value, value: item.code })));
      } catch (error) {
        console.error("Error fetching filter data", error);
      }
    };
    console.log("fetching filter data");
    fetchData();
  }, []);

  useEffect(() => {
    if (!visible) {
      clearFilters();
    }
  }, [visible]);

  const applyFilters = () => {
    onApply({
      categoryJobCode: selectedJobType,
      categoryJoblevelCode: selectedJobLevel,
      salaryJobCode: selectedSalaryType,
      experienceJobCode: selectedExpType,
      categoryWorktypeCode: selectedWorkType,
      addressCode: selectedJobLocation,
    });

    onClose();
  };


  const clearFilters = () => {
    setSelectedJobType("");
    setSelectedJobLevel([]);
    setSelectedSalaryType([]);
    setSelectedExpType([]);
    setSelectedWorkType([]);
    setSelectedJobLocation("");
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      style={styles.modalContainer}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Bộ Lọc</Text>
            <View style={styles.iconContainer}>
              {selectedJobType || selectedJobLevel.length || selectedSalaryType.length || selectedExpType.length || selectedWorkType.length || selectedJobLocation ? (
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                  <MaterialIcons name="delete-forever" size={24} color="black" />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Loại công việc</Text>
              <RNPickerSelect
                onValueChange={setSelectedJobType}
                items={dataJobType}
                placeholder={{ label: 'Tất cả', value: '' }}
                style={pickerSelectStyles}
                value={selectedJobType}
                doneText="Đóng"
              />
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>Cấp bậc</Text>
              {dataJobLevel.map((level) => (
                <View key={level.value} style={styles.checkboxContainer}>
                  <CheckBox
                    title={level.label}
                    containerStyle={styles.checkbox}
                    checked={selectedJobLevel.includes(level.value)}
                    onPress={() => {
                      if (selectedJobLevel.includes(level.value)) {
                        setSelectedJobLevel(selectedJobLevel.filter(item => item !== level.value));
                      } else {
                        setSelectedJobLevel([...selectedJobLevel, level.value]);
                      }
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>Loại lương</Text>
              {dataSalaryType.map((type) => (
                <View key={type.value} style={styles.checkboxContainer}>
                  <CheckBox
                    title={type.label}
                    containerStyle={styles.checkbox}
                    checked={selectedSalaryType.includes(type.value)}
                    onPress={() => {
                      if (selectedSalaryType.includes(type.value)) {
                        setSelectedSalaryType(selectedSalaryType.filter(item => item !== type.value));
                      } else {
                        setSelectedSalaryType([...selectedSalaryType, type.value]);
                      }
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>Loại kinh nghiệm</Text>
              {dataExpType.map((type) => (
                <View key={type.value} style={styles.checkboxContainer}>
                  <CheckBox
                    title={type.label}
                    containerStyle={styles.checkbox}
                    checked={selectedExpType.includes(type.value)}
                    onPress={() => {
                      if (selectedExpType.includes(type.value)) {
                        setSelectedExpType(selectedExpType.filter(item => item !== type.value));
                      } else {
                        setSelectedExpType([...selectedExpType, type.value]);
                      }
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>Hình thức làm việc</Text>
              {dataWorkType.map((type) => (
                <View key={type.value} style={styles.checkboxContainer}>
                  <CheckBox
                    title={type.label}
                    containerStyle={styles.checkbox}
                    checked={selectedWorkType.includes(type.value)}
                    onPress={() => {
                      if (selectedWorkType.includes(type.value)) {
                        setSelectedWorkType(selectedWorkType.filter(item => item !== type.value));
                      } else {
                        setSelectedWorkType([...selectedWorkType, type.value]);
                      }
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={styles.itemContainer}>
              <Text style={styles.label}>Vị trí</Text>
              <RNPickerSelect
                onValueChange={setSelectedJobLocation}
                items={dataJobLocation}
                placeholder={{ label: 'Tất cả', value: '' }}
                style={pickerSelectStyles}
                value={selectedJobLocation}
                doneText="Đóng"
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});


const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: 'white',
    borderColor: 'transparent',
    marginLeft: 0,
  },
  applyButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 10,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    color: 'black',
    justifyContent: 'center',
    backgroundColor: '#F0F8FF',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    color: 'black',
    marginBottom: 15,
    backgroundColor: '#F0F8FF',
  },
  placeholder: {
    color: '#A9A9A9',
  },
});

export default FilterOverlay;