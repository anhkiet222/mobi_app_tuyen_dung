import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../AuthContext";
import { WebView } from "react-native-webview";
import { useFetchDataExpType } from "../../hooks/useFetchDataExpType";
import { useFetchDataJobLocation } from "../../hooks/useFetchDataJobLocation";
import { useFetchDataJobType } from "../../hooks/useFetchDataJobType";
import { useFetchDataSalaryType } from "../../hooks/useFetchDataSalaryType";
import { getAllSkillByJobCode } from "../../api/jobApi";
import { checkSeeCandiate } from "../../api/CvApi";
import { getDetailUserById } from "../../api/userApi";

const DetailFilterUser = () => {
  const { userData, userToken } = useContext(AuthContext);
  const router = useRouter();
  const { candidateid } = useLocalSearchParams();
  const [listSkills, setListSkills] = useState([]);
  const [inputValues, setInputValues] = useState({
    jobType: "",
    salary: "",
    skills: [],
    jobProvince: "",
    exp: "",
    file: "",
  });
  const [loading, setLoading] = useState(false);

  const getListSkill = async (jobType) => {
    try {
      const res = await getAllSkillByJobCode(jobType);
      if (res && res.data) {
        const listSkills = res.data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        }));
        setListSkills(listSkills);
      } else {
        setListSkills([]);
      }
    } catch (error) {
      console.log("Error in getListSkill:", error);
      setListSkills([]);
    }
  };

  const setStateUser = (data) => {
    const jobType = data.userAccountData.userSettingData.categoryJobCode.code;
    getListSkill(jobType);
    let listSkills = [];
    if (
      data.listSkills &&
      Array.isArray(data.listSkills) &&
      data.listSkills.length > 0
    ) {
      listSkills = data.listSkills.map((item) => item.skill?.name || "");
    }
    setInputValues({
      jobType: jobType || "",
      salary: data.userAccountData.userSettingData.salaryJobCode.code || "",
      skills: listSkills,
      jobProvince: data.userAccountData.userSettingData.addressCode.code || "",
      exp: data.userAccountData.userSettingData.experienceJobCode.code || "",
      isFindJob: data.userAccountData.userSettingData.isFindJob || false,
      isTakeMail: data.userAccountData.userSettingData.isTakeMail || false,
      file: data.userAccountData.userSettingData.file || "",
    });
  };

  useEffect(() => {
    if (candidateid && userData) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const check = await checkSeeCandiate(
            {
              userId: userData.id,
              companyId: userData.idCompany,
            },
            userToken
          );
          if (check.errCode === 0) {
            const user = await getDetailUserById(candidateid);
            if (user && user.code === 200) {
              setStateUser(user.result);
            } else {
              Alert.alert("Lỗi", "Không tìm thấy thông tin ứng viên");
            }
          } else {
            Alert.alert("Lỗi", check.errMessage, [
              {
                text: "OK",
                onPress: () => router.push("/companysetting/findcadidate"),
              },
            ]);
          }
        } catch (error) {
          console.log("Error fetching user:", error);
          Alert.alert("Lỗi", "Không thể tải thông tin ứng viên");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [candidateid, userData]);

  const { dataJobLocation: dataJobLocationF } = useFetchDataJobLocation();
  const { dataExpType: dataExpTypeF } = useFetchDataExpType();
  const { dataSalaryType: dataSalaryTypeF } = useFetchDataSalaryType();
  const { dataJobType: dataJobTypeF } = useFetchDataJobType();

  const dataJobLocationFOptions = dataJobLocationF
    ? dataJobLocationF.map((item) => ({
        value: item.code,
        label: item.value,
      }))
    : [];

  const dataExpTypeFOptions = dataExpTypeF
    ? dataExpTypeF.map((item) => ({
        value: item.code,
        label: item.value,
      }))
    : [];

  const dataSalaryTypeFOptions = dataSalaryTypeF
    ? dataSalaryTypeF.map((item) => ({
        value: item.code,
        label: item.value,
      }))
    : [];

  const dataJobTypeFOptions = dataJobTypeF
    ? dataJobTypeF.map((item) => ({
        value: item.code,
        label: item.value,
      }))
    : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>

          <Text style={styles.cardTitle}>Thông tin chi tiết ứng viên</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Lĩnh vực</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={inputValues.jobType}
                  style={styles.picker}
                  enabled={false}
                  onValueChange={(value) =>
                    setInputValues({ ...inputValues, jobType: value })
                  }
                >
                  <Picker.Item label="Chọn lĩnh vực" value="" />
                  {dataJobTypeFOptions.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mức lương</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={inputValues.salary}
                  style={styles.picker}
                  enabled={false}
                  onValueChange={(value) =>
                    setInputValues({ ...inputValues, salary: value })
                  }
                >
                  <Picker.Item label="Chọn mức lương" value="" />
                  {dataSalaryTypeFOptions.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kỹ năng</Text>
              {inputValues.skills.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.skillsContainer}
                >
                  {inputValues.skills.map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noSkillsText}>Không có kỹ năng nào</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Khu vực làm việc</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={inputValues.jobProvince}
                  style={styles.picker}
                  enabled={false}
                  onValueChange={(value) =>
                    setInputValues({ ...inputValues, jobProvince: value })
                  }
                >
                  <Picker.Item label="Chọn nơi làm việc" value="" />
                  {dataJobLocationFOptions.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kinh nghiệm làm việc</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={inputValues.exp}
                  style={styles.picker}
                  enabled={false}
                  onValueChange={(value) =>
                    setInputValues({ ...inputValues, exp: value })
                  }
                >
                  <Picker.Item label="Chọn khoảng kinh nghiệm" value="" />
                  {dataExpTypeFOptions.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* File */}
            {inputValues.file && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>File</Text>
                <WebView
                  source={{ uri: inputValues.file }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  cardBody: {
    padding: 15,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    color: "#333",
    paddingHorizontal: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  skillChip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  skillText: {
    fontSize: 14,
    color: "#333",
  },
  noSkillsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  webView: {
    height: 700,
    width: "100%",
    marginTop: 10,
  },
});

export default DetailFilterUser;
