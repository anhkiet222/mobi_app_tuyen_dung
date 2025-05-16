import { Picker } from "@react-native-picker/picker"; // Thay thế select
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { createNewUserByEmployeer } from "../../api/companyApi";
import { getDetailUserById, UpdateUserService } from "../../api/userApi";
import { useFetchDataCodeGender } from "../../hooks/useFetchDataCodeGender";
import { useFetchRuleUser } from "../../hooks/useFetchRuleUser";
import { AuthContext } from "../AuthContext";
import { useRouter } from "expo-router";

const AddEmployer = () => {
  const { userData, userToken } = useContext(AuthContext);
  const [birthday, setBirthday] = useState(null);
  const [isChangeDate, setIsChangeDate] = useState(false);
  const [isActionADD, setIsActionADD] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [inputValues, setInputValues] = useState({
    id: "",
    dob: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phonenumber: "",
    genderCode: "",
    roleCode: "",
    image: "",
  });
  const route = useRouter();
  const { id } = route.params || {};

  const { dataGender: Genderdata } = useFetchDataCodeGender();
  const { dataRulesUser: dataRole } = useFetchRuleUser();

  let filteredDataRole = dataRole || [];
  if (dataRole && dataRole.length > 0) {
    if (userData?.codeRoleAccount === "COMPANY") {
      filteredDataRole = filteredDataRole.filter(
        (item) => item.code !== "ADMIN" && item.code !== "CANDIDATE"
      );
    } else if (userData?.codeRoleAccount === "ADMIN" && isActionADD) {
      filteredDataRole = filteredDataRole.filter(
        (item) => item.code !== "COMPANY"
      );
    }
  }

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setIsActionADD(false);
        try {
          const user = await getDetailUserById(id);
          if (user && user.errCode === 0) {
            setInputValues({
              ...inputValues,
              firstName: user.data.userAccountData.firstName || "",
              lastName: user.data.userAccountData.lastName || "",
              address: user.data.userAccountData.address || "",
              phonenumber: user.data.phonenumber || "",
              genderCode: user.data.userAccountData.genderCode || "",
              roleCode: user.data.roleData.code || "",
              id: user.data.userAccountData.id || "",
              dob: user.data.userAccountData.dob || "",
            });
            setBirthday(
              user.data.userAccountData.dob
                ? new Date(user.data.userAccountData.dob)
                : null
            );
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          Alert.alert("Lỗi", "Lỗi khi lấy thông tin người dùng");
        }
      };
      fetchUser();
    }
  }, [id]);

  useEffect(() => {
    if (
      Genderdata &&
      Genderdata.length > 0 &&
      inputValues.genderCode === "" &&
      dataRole &&
      dataRole.length > 0 &&
      inputValues.roleCode === "" &&
      isActionADD
    ) {
      setInputValues({
        ...inputValues,
        genderCode: Genderdata[0].code,
        roleCode: dataRole[0].code,
      });
    }
  }, [Genderdata, dataRole, isActionADD]);

  const handleOnChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOnChangeDatePicker = (date) => {
    setBirthday(date);
    setIsChangeDate(true);
    setDatePickerVisible(false);
  };

  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      if (isActionADD) {
        const params = {
          email: inputValues.email,
          firstName: inputValues.firstName,
          lastName: inputValues.lastName,
          address: inputValues.address,
          roleCode: inputValues.roleCode,
          genderCode: inputValues.genderCode,
          phonenumber: inputValues.phonenumber,
          image:
            "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
          dob: birthday ? birthday.getTime() : null,
        };
        if (userData?.codeRoleAccount === "COMPANY") {
          params.companyId = userData.idCompany;
        }
        const res = await createNewUserByEmployeer(params, userToken);
        console.log("🚀 ~ handleSaveUser ~ res:", res);
        if (res && res.errCode === 0) {
          Alert.alert(
            "Thành công",
            `Thêm mới user thành công, chúng tôi đã gửi tài khoản mật khẩu qua ${inputValues.email}`
          );
          setInputValues({
            ...inputValues,
            firstName: "",
            lastName: "",
            address: "",
            phonenumber: "",
            genderCode: "",
            roleCode: "",
            image: "",
            email: "",
          });
          setBirthday(null);
          route.back();
        } else {
          Alert.alert("Lỗi", "Lỗi khi thêm người dùng");
        }
      } else {
        const res = await UpdateUserService(
          {
            id: inputValues.id,
            firstName: inputValues.firstName,
            lastName: inputValues.lastName,
            address: inputValues.address,
            roleCode: inputValues.roleCode,
            genderCode: inputValues.genderCode,
            dob: isChangeDate
              ? birthday
                ? birthday.getTime()
                : null
              : inputValues.dob,
          },
          userToken
        );
        if (res && res.errCode === 0) {
          Alert.alert("Thành công", "Cập nhật người dùng thành công");
          route.backack();
        } else {
          Alert.alert("Lỗi", " Lỗi khi cập nhật người dùng");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      Alert.alert("Lỗi", "Lỗi khi lưu người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ</Text>
            <TextInput
              style={styles.input}
              value={inputValues.firstName}
              onChangeText={(value) => handleOnChange("firstName", value)}
              placeholder="Nhập họ"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              style={styles.input}
              value={inputValues.lastName}
              onChangeText={(value) => handleOnChange("lastName", value)}
              placeholder="Nhập tên"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={inputValues.email}
              onChangeText={(value) => handleOnChange("email", value)}
              placeholder="Nhập email"
              keyboardType="email-address"
              editable={isActionADD}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={inputValues.phonenumber}
              onChangeText={(value) => handleOnChange("phonenumber", value)}
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
              editable={isActionADD}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <Picker
              selectedValue={inputValues.genderCode}
              onValueChange={(value) => handleOnChange("genderCode", value)}
              style={styles.picker}
            >
              {Genderdata && Genderdata.length > 0 ? (
                Genderdata.map((item, index) => (
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
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.dateText}>
                {birthday
                  ? moment(birthday).format("DD/MM/YYYY")
                  : "Chọn ngày sinh"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              date={birthday || new Date()}
              onConfirm={handleOnChangeDatePicker}
              onCancel={() => setDatePickerVisible(false)}
              locale="vi"
              confirmText="Xác nhận"
              cancelText="Hủy"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={inputValues.address}
              onChangeText={(value) => handleOnChange("address", value)}
              placeholder="Nhập địa chỉ"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quyền</Text>
            <Picker
              selectedValue={inputValues.roleCode}
              onValueChange={(value) => handleOnChange("roleCode", value)}
              style={styles.picker}
            >
              {filteredDataRole && filteredDataRole.length > 0 ? (
                filteredDataRole.map((item, index) => (
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
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleSaveUser}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.floatingButtonText}>Lưu</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
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
  floatingButton: {
    position: "absolute",
    bottom: 20, // Cách đáy màn hình 20px
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000, // Đảm bảo nút nổi lên trên các thành phần khác
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddEmployer;
