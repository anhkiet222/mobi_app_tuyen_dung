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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import handleValidate from "../../utils/Validation";
import { checkUserPhoneService } from "../../api/userApi";
import {forgetPasswordMobile} from "../../api/userApi";

const ForgetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    phonenumber: "",
  });
  const [inputValidates, setValidates] = useState({
    phonenumber: true,
  });

  const handleOnChange = (name, value) => {
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOpenVerifyOTP = async () => {
    setIsLoading(true);
    try {
      let checkPhone = handleValidate(inputValues.phonenumber, "phone");
      if (checkPhone !== true) {
        setValidates({
          ...inputValidates,
          phonenumber: checkPhone,
        });
        return;
      }
      let res = await checkUserPhoneService(inputValues.phonenumber);
      if (res.data === true) {
        let sendNewPassword = await forgetPasswordMobile(inputValues.phonenumber);
        console.log(sendNewPassword.data.error);
        console.log(sendNewPassword.data.errorMessage);
        if (sendNewPassword && sendNewPassword.data.error == 0) {
          Alert.alert("Thành công", "Mật khẩu mới đã được gửi qua mail của bạn. Vui lòng kiểm tra hộp thư đến, hoặc hộp thư rác nếu không thấy trong hộp thư đến.");
          router.push("/auth/signin");
        }
        else{
          Alert.alert("Lỗi", sendNewPassword.errorMessage);
        }
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
    finally{
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
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