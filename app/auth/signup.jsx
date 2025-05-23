import DropDownPicker from "react-native-dropdown-picker";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../../api/userApi";
import handleValidate from "../../utils/Validation";
import { createNewUser } from "../../api/userApi";
const SignUpScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValidates, setValidates] = useState({
    phonenumber: true,
    password: true,
    firstName: true,
    lastName: true,
    email: true,
    againPass: true,
  });
  const [inputValues, setInputValues] = useState({
    phonenumber: "",
    firstName: "",
    lastName: "",
    password: "",
    isOpen: false,
    dataUser: {},
    roleCode: "",
    email: "",
    againPass: "",
    genderCode: "",
  });

  const [roleOpen, setRoleOpen] = useState(false);
  const [roleValue, setRoleValue] = useState(null);
  const [roleItems, setRoleItems] = useState([
    { label: "Ứng viên", value: "CANDIDATE" },
    { label: "Người tuyển dụng", value: "EMPLOYER" },
  ]);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: "NAM", value: "M" },
    { label: "NỮ", value: "FE" },
  ]);

  const handleOnChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleRoleOpen = (open) => {
    setRoleOpen(open);
    if (open) {
      setGenderOpen(false);
    }
  };

  const handleGenderOpen = (open) => {
    setGenderOpen(open);
    if (open) {
      setRoleOpen(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgainPassVisible, setIsAgainPassVisible] = useState(false);

  let handleOpenVerifyOTP = async () => {
    if (
      inputValues.phonenumber === "" ||
      inputValues.password === "" ||
      inputValues.firstName === "" ||
      inputValues.lastName === "" ||
      inputValues.email === "" ||
      inputValues.roleCode === "" ||
      inputValues.genderCode === "" ||
      inputValues.genderCode === "" ||
      inputValues.againPass === ""
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin !");
      return;
    }
    let checkPhonenumber = handleValidate(inputValues.phonenumber, "phone");
    if (checkPhonenumber !== true) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
      return;
    }
    let checkPassword = handleValidate(inputValues.password, "password");
    if (checkPassword !== true) {
      Alert.alert("Lỗi", "Mật khẩu phải chứa ít nhất 6 ký tự");
      return
    }
    let checkFirstName = handleValidate(inputValues.firstName, "isEmpty");
    if (checkFirstName !== true) {
      Alert.alert("Lỗi", "Họ không được để trống");
      return
    }
    let checkLastName = handleValidate(inputValues.lastName, "isEmpty");
    if (checkLastName !== true) {
      Alert.alert("Lỗi", "Tên không được để trống");
      return
    }
    let checkEmail = handleValidate(inputValues.email, "email");
    if (checkEmail !== true) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }
    let checklastNameNumber = handleValidate(formData.lastName, "noNumber");
    if (checklastNameNumber !== true) {
      Alert.alert("L��i", "Tên không được chứa số");
      return;
    }
    let checkfirstNameNumber = handleValidate(formData.lastName, "noNumber");
    if (checkfirstNameNumber !== true) {
      Alert.alert("Lỗi", "Họ không được chứa số");
      return;
    }

    if (
      !(
        checkPhonenumber === true &&
        checkPassword === true &&
        checkFirstName === true &&
        checkLastName === true &&
        checkEmail === true
      )
    ) {
      setValidates({
        phonenumber: checkPhonenumber,
        password: checkPassword,
        firstName: checkFirstName,
        lastName: checkLastName,
        email: checkEmail,
      });
      return;
    }

    if (inputValues.againPass !== inputValues.password) {
      Alert.alert("Thông báo", "Mật khẩu nhập lại không trùng khớp!");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(inputValues.phonenumber);
    if (res === true) {
      Alert.alert("Thông báo", "Số điện thoại đã tồn tại !");
    } else {
      let reponse = await createNewUser({
        ...inputValues,
        ["dataUser"]: {
          phonenumber: inputValues.phonenumber,
          firstName: inputValues.firstName,
          lastName: inputValues.lastName,
          password: inputValues.password,
          roleCode: inputValues.roleCode,
          email: inputValues.email,
          genderCode: inputValues.genderCode,
          image:
            "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg",
        },
      });
      console.log(inputValues);
      console.log(reponse);
      if (reponse && reponse.statusCode === 200) {
        Alert.alert("Thông báo", "Tạo tài khoản thành công");
        setIsLoading(false);
        router.push("/auth/signin");
      } else {
        setIsLoading(false);
        console.error(reponse.errMessage);
        Alert.alert("Thông báo", "Tạo tài khoản thất bại");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!inputValues.isOpen && (
        <View style={styles.form}>
          <Text style={styles.title}>Người mới?</Text>
          <Text style={styles.subtitle}>
            Đăng ký dễ dàng chỉ vài bước đơn giản
          </Text>
          <TextInput
            style={styles.input}
            value={inputValues.firstName}
            placeholderTextColor="#ccc"
            onChangeText={(text) => handleOnChange("firstName", text)}
            placeholder="Họ"
          />
          {inputValidates.firstName && (
            <Text style={styles.errorText}>{inputValidates.firstName}</Text>
          )}
          <TextInput
            style={styles.input}
            value={inputValues.lastName}
            placeholderTextColor="#ccc"
            onChangeText={(text) => handleOnChange("lastName", text)}
            placeholder="Tên"
          />
          {inputValidates.lastName && (
            <Text style={styles.errorText}>{inputValidates.lastName}</Text>
          )}
          <TextInput
            style={styles.input}
            value={inputValues.phonenumber}
            placeholderTextColor="#ccc"
            onChangeText={(text) => handleOnChange("phonenumber", text)}
            placeholder="Số điện thoại"
            keyboardType="numeric"
          />
          {inputValidates.phonenumber && (
            <Text style={styles.errorText}>{inputValidates.phonenumber}</Text>
          )}
          <TextInput
            style={styles.input}
            value={inputValues.email}
            onChangeText={(text) => handleOnChange("email", text)}
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
          />
          {inputValidates.email && (
            <Text style={styles.errorText}>{inputValidates.email}</Text>
          )}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={inputValues.password}
              onChangeText={(text) => handleOnChange("password", text)}
              placeholder="Mật khẩu"
              placeholderTextColor="#ccc"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Feather
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {inputValidates.password && (
            <Text style={styles.errorText}>{inputValidates.password}</Text>
          )}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={inputValues.againPass}
              onChangeText={(text) => handleOnChange("againPass", text)}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#ccc"
              secureTextEntry={!isAgainPassVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsAgainPassVisible(!isAgainPassVisible)}
            >
              <Feather
                name={isAgainPassVisible ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {inputValidates.againPass && (
            <Text style={styles.errorText}>{inputValidates.againPass}</Text>
          )}

          <View style={{ zIndex: roleOpen ? 2000 : 1000 }}>
            <DropDownPicker
              open={roleOpen}
              value={roleValue}
              items={roleItems}
              setOpen={setRoleOpen}
              setValue={setRoleValue}
              setItems={setRoleItems}
              placeholder="Chọn vai trò"
              containerStyle={styles.dropdownContainer}
              dropDownContainerStyle={styles.dropDownContainer}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              onChangeValue={(value) => handleOnChange("roleCode", value ?? "")}
            />
          </View>

          <View style={{ zIndex: genderOpen ? 2000 : 1000 }}>
            <DropDownPicker
              open={genderOpen}
              value={genderValue}
              items={genderItems}
              setOpen={setGenderOpen}
              setValue={setGenderValue}
              setItems={setGenderItems}
              placeholder="Chọn giới tính"
              dropDownContainerStyle={styles.dropDownContainer}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              listMode="SCROLLVIEW"
              onChangeValue={(value) =>
                handleOnChange("genderCode", value ?? "")
              }
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOpenVerifyOTP}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Text style={{ marginTop: 20, fontSize: 16 }}>
              Bạn đã có tài khoản rồi?
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signin")}>
              <Text style={styles.linkText}> Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "300",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 13,
  },
});

export default SignUpScreen;
