import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import handleValidate from "../../utils/Validation";
import { checkUserPhoneService } from "../../api/userApi";
import OtpForgetPassword from "../../components/User/OtpForgotPassword";

const ForgetPassword = () => {
  const router = useRouter();
  const [inputValues, setInputValues] = useState({
    phonenumber: "",
    newPassword: "",
    confirmPassword: "",
    isSuccess: false,
  });
  const [inputValidates, setValidates] = useState({
    phonenumber: true,
    newPassword: true,
    confirmPassword: true,
  });

  const handleOnChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOpenVerifyOTP = async () => {
    let checkPhone = handleValidate(inputValues.phonenumber, "phone");
    if (checkPhone !== true) {
      setValidates({
        ...inputValidates,
        phonenumber: checkPhone,
      });
      return;
    }

    try {
      let res = await checkUserPhoneService(inputValues.phonenumber);
      if (res === true) {
        setInputValues({ ...inputValues, isOpen: true });
      } else {
        setValidates({
          ...inputValidates,
          phonenumber: true,
        });
        Alert.alert("Lỗi", "Số điện thoại không tồn tại!");
      }
    } catch (error) {
      console.log("🚀 ~ handleOpenVerifyOTP ~ error:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xác thực số điện thoại.");
    }
  };

  if (inputValues.isOpen) {
    return <OtpForgetPassword dataUser={inputValues.phonenumber} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Quên mật khẩu?</Text>
        <Text style={styles.subtitle}>Đừng lo! Khôi phục trong vài giây</Text>

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
          value={inputValues.phonenumber}
          onChangeText={(value) => handleOnChange("phonenumber", value)}
        />

        {inputValidates.phonenumber !== true && (
          <Text style={styles.errorText}>{inputValidates.phonenumber}</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleOpenVerifyOTP}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={styles.link}> Đăng ký</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.footerText}>Đã có tài khoản?</Text>
            <TouchableOpacity onPress={() => router.push("/auth/signin")}>
              <Text style={styles.link}> Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  formContainer: {
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footerLinks: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    marginTop: 10,
    fontSize: 15,
  },
  footerText: {
    marginTop: 10,
    fontSize: 15,
  },
});

export default ForgetPassword;