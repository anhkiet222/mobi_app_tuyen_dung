import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import MarkdownIt from "markdown-it";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  createPostService,
  getDetailToEditPostService,
  reupPostService,
  updatePostService,
} from "../../api/postApi";
import { getDetailCompanyByUserId } from "../../api/userApi";
import { useFetchDataExpType } from "../../hooks/useFetchDataExpType";
import { useFetchDataGenderPost } from "../../hooks/useFetchDataGenderPost";
import { useFetchDataJobLevel } from "../../hooks/useFetchDataJobLevel";
import { useFetchDataJobLocation } from "../../hooks/useFetchDataJobLocation";
import { useFetchDataJobType } from "../../hooks/useFetchDataJobType";
import { useFetchDataSalaryType } from "../../hooks/useFetchDataSalaryType";
import { useFetchDataWorkType } from "../../hooks/useFetchDataWorkType";
import { AuthContext } from "../AuthContext";

const AddPost = () => {
  const mdParser = new MarkdownIt();
  const { userData, userToken } = useContext(AuthContext);
  const [timeEnd, setTimeEnd] = useState(null);
  const [isChangeDate, setIsChangeDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [companyPostAllow, setCompanyPostAllow] = useState({
    hot: 0,
    nonHot: 0,
  });
  const [inputValues, setInputValues] = useState({
    name: "",
    categoryJobCode: "",
    addressCode: "",
    salaryJobCode: "",
    amount: "",
    timeEnd: "",
    categoryJoblevelCode: "",
    categoryWorktypeCode: "",
    experienceJobCode: "",
    genderCode: "",
    descriptionHTML: "",
    descriptionMarkdown: "",
    isActionADD: true,
    id: "",
    isHot: 0,
  });
  const [reupModalVisible, setReupModalVisible] = useState(false);
  const [reupDate, setReupDate] = useState(null);
  const [reupDatePickerVisible, setReupDatePickerVisible] = useState(false);
  const route = useRouter();
  const { id } = route.params || {};

  const { dataJobLevel: dataJobLevels } = useFetchDataJobLevel();
  const { dataGenderPost: dataGenderPosts } = useFetchDataGenderPost();
  const { dataWorkType: dataWorkTypes } = useFetchDataWorkType();
  const { dataJobLocation: dataJobLocations } = useFetchDataJobLocation();
  const { dataExpType: dataExpTypes } = useFetchDataExpType();
  const { dataSalaryType: dataSalaryTypes } = useFetchDataSalaryType();
  const { dataJobType: dataJobTypes } = useFetchDataJobType();

  useEffect(() => {
    const fetchCompany = async (userId, companyId = null) => {
      try {
        const res = await getDetailCompanyByUserId(
          userId,
          companyId,
          userToken
        );
        if (res && res.errCode === 0) {
          setCompanyPostAllow({
            ...companyPostAllow,
            hot: res.data.allowHotPost || 0,
            nonHot: res.data.allowPost || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    if (userData && userData.codeRoleAccount !== "ADMIN") {
      fetchCompany(userData.id);
    }

    if (id) {
      fetchPost(id);
    }
  }, [userData, userToken, id]);

  const fetchPost = async (postId) => {
    try {
      const res = await getDetailToEditPostService(postId, userToken);
      if (res.errCode === 0) {
        setInputValues({
          ...inputValues,
          name: res.data.name || "",
          categoryJobCode: res.data.categoryJobCode || "",
          addressCode: res.data.adressCode || "",
          salaryJobCode: res.data.salaryCode || "",
          amount: res.data.amount || "",
          timeEnd: res.data.timeEndValue || "",
          categoryJoblevelCode: res.data.categoryJobLevelCode || "",
          categoryWorktypeCode: res.data.categoryWorktypeCode || "",
          experienceJobCode: res.data.experienceJobCode || "",
          genderCode: res.data.genderPostCode || "",
          descriptionHTML: res.data.descriptionHTMLValue || "",
          descriptionMarkdown: res.data.descriptionMarkdownValue || "",
          isActionADD: false,
          id: res.data.id || "",
        });
        setTimeEnd(
          res.data.timeEndValue ? new Date(res.data.timeEndValue) : null
        );
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Lỗi", "Lỗi khi lấy thông tin bài đăng");
    }
  };

  useEffect(() => {
    if (
      dataGenderPosts?.length > 0 &&
      inputValues.genderCode === "" &&
      dataJobTypes?.length > 0 &&
      inputValues.categoryJobCode === "" &&
      dataJobLevels?.length > 0 &&
      inputValues.categoryJoblevelCode === "" &&
      dataSalaryTypes?.length > 0 &&
      inputValues.salaryJobCode === "" &&
      dataExpTypes?.length > 0 &&
      inputValues.experienceJobCode === "" &&
      dataWorkTypes?.length > 0 &&
      inputValues.categoryWorktypeCode === "" &&
      dataJobLocations?.length > 0 &&
      inputValues.addressCode === ""
    ) {
      setInputValues({
        ...inputValues,
        genderCode: dataGenderPosts[0].code,
        categoryJobCode: dataJobTypes[0].code,
        categoryJoblevelCode: dataJobLevels[0].code,
        salaryJobCode: dataSalaryTypes[0].code,
        experienceJobCode: dataExpTypes[0].code,
        categoryWorktypeCode: dataWorkTypes[0].code,
        addressCode: dataJobLocations[0].code,
      });
    }
  }, [
    dataGenderPosts,
    dataJobTypes,
    dataJobLevels,
    dataSalaryTypes,
    dataExpTypes,
    dataWorkTypes,
    dataJobLocations,
  ]);

  const handleOnChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleIsHot = (value) => {
    setInputValues({ ...inputValues, isHot: value ? 1 : 0 });
  };

  const handleEditorChange = (text) => {
    const html = mdParser.render(text);
    setInputValues({
      ...inputValues,
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  const handleOnChangeDatePicker = (date) => {
    setTimeEnd(date);
    setIsChangeDate(true);
    setDatePickerVisible(false);
  };

  const handleSavePost = async () => {
    setIsLoading(true);
    try {
      if (inputValues.isActionADD) {
        if (new Date().getTime() > new Date(timeEnd).getTime()) {
          Alert.alert("Lỗi", "Ngày kết thúc phải lớn hơn ngày hiện tại");
        } else {
          const res = await createPostService(
            {
              name: inputValues.name,
              descriptionHTML: inputValues.descriptionHTML,
              descriptionMarkdown: inputValues.descriptionMarkdown,
              categoryJobCode: inputValues.categoryJobCode,
              addressCode: inputValues.addressCode,
              salaryJobCode: inputValues.salaryJobCode,
              amount: inputValues.amount,
              timeEnd: timeEnd ? timeEnd.getTime() : null,
              categoryJoblevelCode: inputValues.categoryJoblevelCode,
              categoryWorktypeCode: inputValues.categoryWorktypeCode,
              experienceJobCode: inputValues.experienceJobCode,
              genderPostCode: inputValues.genderCode,
              userId: userData?.id,
              isHot: inputValues.isHot,
            },
            userToken
          );
          if (res && res.errCode === 0) {
            if (userData?.codeRoleAccount !== "ADMIN") {
              const companyRes = await getDetailCompanyByUserId(
                userData.id,
                null,
                userToken
              );
              if (companyRes && companyRes.errCode === 0) {
                setCompanyPostAllow({
                  ...companyPostAllow,
                  hot: companyRes.data.allowHotPost || 0,
                  nonHot: companyRes.data.allowPost || 0,
                });
              }
            }
            Alert.alert("Thành công", "Thêm bài đăng thành công");
            setInputValues({
              ...inputValues,
              name: "",
              descriptionHTML: "",
              descriptionMarkdown: "",
              categoryJobCode: "",
              addressCode: "",
              salaryJobCode: "",
              amount: "",
              timeEnd: "",
              categoryJoblevelCode: "",
              categoryWorktypeCode: "",
              experienceJobCode: "",
              genderCode: "",
              isHot: 0,
            });
            setTimeEnd(null);
            route.back();
          } else {
            Alert.alert("Lỗi", "Lỗi khi thêm bài đăng");
          }
        }
      } else {
        const res = await updatePostService(
          {
            name: inputValues.name,
            descriptionHTML: inputValues.descriptionHTML,
            descriptionMarkdown: inputValues.descriptionMarkdown,
            categoryJobCode: inputValues.categoryJobCode,
            addressCode: inputValues.addressCode,
            salaryJobCode: inputValues.salaryJobCode,
            amount: inputValues.amount,
            timeEnd: isChangeDate
              ? timeEnd
                ? timeEnd.getTime()
                : null
              : inputValues.timeEnd,
            categoryJoblevelCode: inputValues.categoryJoblevelCode,
            categoryWorktypeCode: inputValues.categoryWorktypeCode,
            experienceJobCode: inputValues.experienceJobCode,
            genderPostCode: inputValues.genderCode,
            id: inputValues.id,
            userId: userData?.id,
          },
          userToken
        );
        if (res && res.errCode === 0) {
          Alert.alert("Thành công", "Cập nhật bài đăng thành công");
          route.back();
        } else {
          Alert.alert("Lỗi", "Lỗi khi cập nhật bài đăng");
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      Alert.alert("Lỗi", "Lỗi khi lưu bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReupPost = async () => {
    if (!reupDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày kết thúc mới");
      return;
    }
    try {
      const res = await reupPostService(
        {
          userId: userData?.id,
          postId: id,
          timeEnd: reupDate.getTime(),
        },
        userToken
      );
      if (res && res.errCode === 0) {
        Alert.alert("Thành công", "Đăng lại bài đăng thành công");
        setReupModalVisible(false);
        route.back();
      } else {
        Alert.alert("Lỗi", "Lỗi khi đăng lại bài đăng");
      }
    } catch (error) {
      console.error("Error reup post:", error);
      Alert.alert("Lỗi", "Lỗi khi đăng lại bài đăng");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {inputValues.isActionADD && userData?.codeRoleAccount !== "ADMIN" && (
          <View style={styles.companyInfo}>
            <Text style={styles.companyInfoTitle}>Công ty còn:</Text>
            <Text style={styles.companyInfoText}>
              {companyPostAllow.nonHot} bài bình thường
            </Text>
            <Text style={styles.companyInfoText}>
              {companyPostAllow.hot} bài nổi bật
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên bài đăng</Text>
            <TextInput
              style={styles.input}
              value={inputValues.name}
              onChangeText={(value) => handleOnChange("name", value)}
              placeholder="Nhập tên bài đăng"
              editable={userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <Picker
              selectedValue={inputValues.addressCode}
              onValueChange={(value) => handleOnChange("addressCode", value)}
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataJobLocations && dataJobLocations.length > 0 ? (
                dataJobLocations.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số lượng nhân viên</Text>
            <TextInput
              style={styles.input}
              value={inputValues.amount}
              onChangeText={(value) => handleOnChange("amount", value)}
              placeholder="Nhập số lượng"
              keyboardType="numeric"
              editable={userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thời gian kết thúc</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() =>
                inputValues.isActionADD && setDatePickerVisible(true)
              }
            >
              <Text style={styles.dateText}>
                {timeEnd
                  ? moment(timeEnd).format("DD/MM/YYYY")
                  : "Chọn thời gian kết thúc"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              date={timeEnd || new Date()}
              onConfirm={handleOnChangeDatePicker}
              onCancel={() => setDatePickerVisible(false)}
              locale="vi"
              confirmText="Xác nhận"
              cancelText="Hủy"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <Picker
              selectedValue={inputValues.genderCode}
              onValueChange={(value) => handleOnChange("genderCode", value)}
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataGenderPosts && dataGenderPosts.length > 0 ? (
                dataGenderPosts.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kinh nghiệm</Text>
            <Picker
              selectedValue={inputValues.experienceJobCode}
              onValueChange={(value) =>
                handleOnChange("experienceJobCode", value)
              }
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataExpTypes && dataExpTypes.length > 0 ? (
                dataExpTypes.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngành</Text>
            <Picker
              selectedValue={inputValues.categoryJobCode}
              onValueChange={(value) =>
                handleOnChange("categoryJobCode", value)
              }
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataJobTypes && dataJobTypes.length > 0 ? (
                dataJobTypes.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chức vụ</Text>
            <Picker
              selectedValue={inputValues.categoryJoblevelCode}
              onValueChange={(value) =>
                handleOnChange("categoryJoblevelCode", value)
              }
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataJobLevels && dataJobLevels.length > 0 ? (
                dataJobLevels.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lương</Text>
            <Picker
              selectedValue={inputValues.salaryJobCode}
              onValueChange={(value) => handleOnChange("salaryJobCode", value)}
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataSalaryTypes && dataSalaryTypes.length > 0 ? (
                dataSalaryTypes.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình thức làm việc</Text>
            <Picker
              selectedValue={inputValues.categoryWorktypeCode}
              onValueChange={(value) =>
                handleOnChange("categoryWorktypeCode", value)
              }
              style={styles.picker}
              enabled={userData?.codeRoleAccount !== "ADMIN"}
            >
              {dataWorkTypes && dataWorkTypes.length > 0 ? (
                dataWorkTypes.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.value}
                    value={item.code}
                  />
                ))
              ) : (
                <Picker.Item label="Không có dữ liệu" value="" />
              )}
            </Picker>
          </View>

          {inputValues.isActionADD && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bài viết nổi bật</Text>
              <Switch
                value={inputValues.isHot === 1}
                onValueChange={handleIsHot}
                disabled={userData?.codeRoleAccount === "ADMIN"}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả công việc</Text>
            <TextInput
              style={[styles.input, styles.markdownInput]}
              value={inputValues.descriptionMarkdown}
              onChangeText={handleEditorChange}
              multiline
              placeholder="Nhập mô tả công việc"
              editable={userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
        </View>
      </ScrollView>

      {userData?.codeRoleAccount !== "ADMIN" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleSavePost}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.floatingButtonText}>Thêm bài đăng </Text>
            )}
          </TouchableOpacity>

          {id &&
            userData?.codeRoleAccount !== "ADMIN" &&
            userData?.codeRoleAccount !== "EMPLOYER" &&
            new Date().getTime() > new Date(timeEnd).getTime() && (
              <TouchableOpacity
                style={[styles.floatingButton, styles.reupButton]}
                onPress={() => setReupModalVisible(true)}
              >
                <Text style={styles.floatingButtonText}>Đăng lại</Text>
              </TouchableOpacity>
            )}
        </View>
      )}

      {/* Modal để chọn ngày đăng lại */}
      {reupModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày kết thúc mới</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setReupDatePickerVisible(true)}
            >
              <Text style={styles.dateText}>
                {reupDate
                  ? moment(reupDate).format("DD/MM/YYYY")
                  : "Chọn ngày kết thúc"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={reupDatePickerVisible}
              mode="date"
              date={reupDate || new Date()}
              onConfirm={(date) => {
                setReupDate(date);
                setReupDatePickerVisible(false);
              }}
              onCancel={() => setReupDatePickerVisible(false)}
              locale="vi"
              confirmText="Xác nhận"
              cancelText="Hủy"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleReupPost}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setReupModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  companyInfo: {
    marginBottom: 20,
  },
  companyInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  companyInfoText: {
    fontSize: 16,
    color: "#666",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    color: "#333",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  markdownInput: {
    height: 400,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  floatingButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  reupButton: {
    backgroundColor: "#28a745",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddPost;
