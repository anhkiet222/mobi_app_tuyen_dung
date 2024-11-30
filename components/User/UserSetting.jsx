import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Switch,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AuthContext } from "../AuthContext";
import MultiSelect from "react-native-multiple-select";
import * as DocumentPicker from "expo-document-picker";
import {
  getAllSkillByJobCode,
  fetchDataExpType,
  fetchDataJobLocation,
  fetchDataJobType,
  fetchDataSalaryType,
} from "../../api/jobApi";
import { getDetailUserById, saveUserSettings } from "../../api/userApi";
import * as FileSystem from "expo-file-system";

const UserSetting = () => {
  const { userToken, userData } = useContext(AuthContext);
  const [dataSkills, setDataSkills] = useState([]);
  const [dataJobType, setDataJobType] = useState([]);
  const [dataSalaryType, setDataSalaryType] = useState([]);
  const [dataJobLocation, setDataJobLocation] = useState([]);
  const [dataExpType, setDataExpType] = useState([]);
  const [inputValues, setInputValues] = useState({
    categoryJobCode: "",
    salaryJobCode: "",
    listSkills: [],
    addressCode: "",
    experienceJobCode: "",
    isFindJob: 0,
    isTakeMail: 0,
    file: "",
    fileBase64: "",
  });

  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user] = await Promise.all([getDetailUserById(userData.id)]);
        const dataExpType = await fetchDataExpType();
        const dataSalary = await fetchDataSalaryType();
        const dataJobLoca = await fetchDataJobLocation();
        const dataJobTyp = await fetchDataJobType();

        setDataExpType(
          dataExpType.map((item) => ({ label: item.value, value: item.code }))
        );
        setDataSalaryType(
          dataSalary.map((item) => ({ label: item.value, value: item.code }))
        );
        setDataJobLocation(
          dataJobLoca.map((item) => ({ label: item.value, value: item.code }))
        );
        setDataJobType(
          dataJobTyp.map((item) => ({ label: item.value, value: item.code }))
        );

        if (user && user.code === 200) {
          const listSkill =
            user.result.listSkills?.map((item) => item.skillId) || [];

          const updatedValues = {
            categoryJobCode:
              user.result.userAccountData.userSettingData.categoryJobCode ?? "",
            salaryJobCode:
              user.result.userAccountData.userSettingData.salaryJobCode ?? "",
            listSkills: listSkill,
            addressCode:
              user.result.userAccountData.userSettingData.addressCode ?? "",
            experienceJobCode:
              user.result?.userAccountData.userSettingData.experienceJobCode ??
              "",
            isFindJob:
              user.result.userAccountData.userSettingData.isFindJob === true
                ? 1
                : 0,
            isTakeMail:
              user.result.userAccountData.userSettingData.isTakeMail === true
                ? 1
                : 0,
            fileBase64: user.result.userAccountData.userSettingData.file ?? "",
          };

          setInputValues((prevState) => ({ ...prevState, ...updatedValues }));
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      if (inputValues.categoryJobCode) {
        try {
          const skillsData = await getAllSkillByJobCode(
            inputValues.categoryJobCode.code
          );
          const skillNames = skillsData.map((item) => ({
            id: item.id,
            name: item.name,
          }));
          setDataSkills(skillNames);
        } catch (error) {
          console.error("Error fetching skills: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSkills();
  }, [inputValues.categoryJobCode]);

  const handleOnChangeFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "cancel") {
        Alert.alert("Lỗi", "Không chọn được tệp");
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileSize = result.assets[0].size;

      if (!fileUri) {
        Alert.alert("Lỗi", "Không có URI của tệp. Vui lòng thử lại.");
        return;
      }

      if (fileSize > 2097152) {
        Alert.alert("Lỗi", "File của bạn quá lớn. Chỉ gửi file dưới 2MB.");
        return;
      }
      if (fileUri.startsWith("content://")) {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          fileUri = fileInfo.uri;
        } else {
          throw new Error("Không thể truy cập file.");
        }
      }
      const newPath = `${FileSystem.documentDirectory}${result.assets[0].name}`;
      await FileSystem.copyAsync({ from: fileUri, to: newPath });

      const base64Data = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64 = "data:application/pdf;base64," + base64Data;

      setInputValues((prevState) => ({ ...prevState, fileBase64: base64 }));
      Alert.alert("Thành công", `File ${result.assets[0].name} đã được chọn`);
    } catch (error) {
      console.error("Lỗi khi chọn file:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn file.");
    }
  };

  const handleChange = (value, type) => {
    const newValues = { ...inputValues };
    if (type === "listSkills") {
      const selectedSkills = dataSkills.filter((skill) =>
        value.includes(skill.id)
      );
      const updatedSkills = [
        ...new Set([
          ...inputValues.listSkills,
          ...selectedSkills.map((skill) => skill.id),
        ]),
      ];
      newValues.listSkills = updatedSkills;
    } else if (
      type === "categoryJobCode" &&
      value !== inputValues.categoryJobCode
    ) {
      newValues.categoryJobCode = { code: value };
      newValues.listSkills = [];
    } else if (type === "addressCode") {
      newValues.addressCode = { code: value, value: value };
    } else {
      newValues[type] = value;
    }

    setInputValues(newValues);
  };

  console.log("🚀 ~ handleChange:", inputValues);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleOnChangeSwitch = (name) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: prevValues[name] === 1 ? 0 : 1,
    }));
  };

  const handleSaveUser = async () => {
    try {
      const data = {
        experienceJobCode: inputValues.experienceJobCode,
        idUser: userData.id,
        isFindJob: inputValues.isFindJob,
        isTakeMail: inputValues.isTakeMail,
        addressCode: inputValues.addressCode.code,
        categoryJobCode: inputValues.categoryJobCode.code,
        salaryJobCode: inputValues.salaryJobCode,
        listSkills: inputValues.listSkills,
        file: inputValues.file,
        fileBase64: inputValues.fileBase64,
      };
      
      const res = await saveUserSettings(data, userToken);
      if (res && res.errCode === 0) {
        Alert.alert("Thành công", "Cập nhật thông tin người dùng thành công!");
      } else {
        Alert.alert("Thất bại", "Cập nhật thông tin người dùng thất bại.");
      }
    } catch (error) {
      Alert.alert("Có lỗi xảy ra khi cập nhật thông tin.");
      console.log(error);
    } finally {
      setLoading(false);
      setIsEditMode(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <DropDownPicker
          open={openDropdown === "categoryJobCode"}
          value={
            inputValues.categoryJobCode.code || inputValues.categoryJobCode
          }
          items={dataJobType}
          setOpen={() =>
            setOpenDropdown(
              openDropdown === "categoryJobCode" ? null : "categoryJobCode"
            )
          }
          setValue={(callback) => {
            const newValue = callback(inputValues.categoryJobCode);
            handleChange(newValue, "categoryJobCode");
          }}
          placeholder="Chọn lĩnh vực"
          zIndex={3000}
          zIndexInverse={1000}
          nestedScrollEnabled={true}
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          disabled={!isEditMode}
        />

        <DropDownPicker
          open={openDropdown === "salaryJobCode"}
          value={inputValues.salaryJobCode.code || inputValues.salaryJobCode}
          items={dataSalaryType}
          setOpen={() =>
            setOpenDropdown(
              openDropdown === "salaryJobCode" ? null : "salaryJobCode"
            )
          }
          setValue={(callback) => {
            const newValue = callback(inputValues.salaryJobCode.code);
            handleChange(newValue, "salaryJobCode");
          }}
          placeholder="Chọn mức lương"
          zIndex={2000}
          zIndexInverse={2000}
          listMode="SCROLLVIEW"
          nestedScrollEnabled={true}
          style={styles.dropdown}
          disabled={!isEditMode}
        />

        <DropDownPicker
          open={openDropdown === "addressCode"}
          value={inputValues.addressCode ? inputValues.addressCode.code : ""}
          items={dataJobLocation}
          setOpen={() =>
            setOpenDropdown(
              openDropdown === "addressCode" ? null : "addressCode"
            )
          }
          setValue={(callback) => {
            const newValue = callback(inputValues.addressCode);
            handleChange(newValue, "addressCode");
          }}
          placeholder="Chọn khu vực làm việc"
          zIndex={1500}
          zIndexInverse={2500}
          nestedScrollEnabled={true}
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          disabled={!isEditMode}
        />

        <DropDownPicker
          open={openDropdown === "experienceJobCode"}
          value={
            inputValues.experienceJobCode.code || inputValues.experienceJobCode
          }
          items={dataExpType}
          setOpen={() =>
            setOpenDropdown(
              openDropdown === "experienceJobCode" ? null : "experienceJobCode"
            )
          }
          setValue={(callback) => {
            const newValue = callback(inputValues.experienceJobCode.code);
            handleChange(newValue, "experienceJobCode");
          }}
          placeholder="Chọn kinh nghiệm"
          zIndex={1000}
          zIndexInverse={3000}
          nestedScrollEnabled={true}
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          disabled={!isEditMode}
        />

        <MultiSelect
          items={dataSkills}
          uniqueKey="id"
          displayKey="name"
          selectedItems={inputValues.listSkills}
          onSelectedItemsChange={(selectedItems) =>
            handleChange(selectedItems, "listSkills")
          }
          selectText="Chọn kỹ năng"
          searchInputPlaceholderText="Tìm kiếm kỹ năng..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#333"
          selectedItemTextColor="#007bff"
          selectedItemIconColor="#007bff"
          itemTextColor="#333"
          submitButtonText="Xác nhận"
          styleMainWrapper={{ marginBottom: 15, marginTop: 15 }}
          flatListProps={{ initialNumToRender: 20 }}
          disabled={!isEditMode}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Bật tìm việc</Text>
          <View style={styles.switchContainer}>
            <Switch
              disabled={!isEditMode}
              value={inputValues.isFindJob === 1}
              onValueChange={() => handleOnChangeSwitch("isFindJob")}
              trackColor={{ false: "#d3d3d3", true: "#81b0ff" }}
              thumbColor={inputValues.isFindJob === 1 ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nhận mail công việc</Text>
          <View style={styles.switchContainer}>
            <Switch
              disabled={!isEditMode}
              value={inputValues.isTakeMail === 1}
              onValueChange={() => handleOnChangeSwitch("isTakeMail")}
              trackColor={{ false: "#d3d3d3", true: "#81b0ff" }}
              thumbColor={inputValues.isTakeMail === 1 ? "#007bff" : "#f4f3f4"}
            />
          </View>
        </View>
        <View style={styles.previewContainer}>
          {inputValues.file || inputValues.fileBase64 ? (
            <>
              <View style={styles.pdfPreview}>
                <Image
                  source={require("../../assets/images/pdf-icon.jpg")}
                  style={styles.pdfIcon}
                />
              </View>
              <View style={styles.infoContainer}>
                {/* <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => handleViewFile(pdfUrl)}
                                >
                                    <Text style={styles.buttonText}>Xem chi tiết</Text>
                                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={handleOnChangeFile}
                  disabled={!isEditMode}
                >
                  <Text style={styles.buttonText}>Đổi file CV</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <Text style={styles.placeholderText}>Chưa có file PDF nào</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={handleOnChangeFile}
                disabled={!isEditMode}
              >
                <Text style={styles.buttonText}>Tải CV lên</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {isEditMode ? (
            <>
              <TouchableOpacity
                onPress={handleSaveUser}
                style={styles.saveButton}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsEditMode(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  previewContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  fileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  fileNameText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  previewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  previewButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  buttonCV: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  buttonTextPDF: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  switchContainer: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 2,
    backgroundColor: "#f0f0f0",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    textAlign: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pdfPreview: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e3e3e3",
  },
  pdfIcon: {
    width: 50,
    height: 50,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  containerPDF: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default UserSetting;
