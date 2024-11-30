import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { createNewUser, requestOtp, verifyOtp } from "../../api/userApi";

const Otp = ({ dataUser }) => {
  const [requestID, setRequestID] = useState("");
  const [inputValues, setInputValues] = useState({
    so1: "",
    so2: "",
    so3: "",
    so4: "",
  });

  useEffect(() => {
    if (dataUser) {
      sendOtpToUser();
    }
  }, [dataUser]);

  const handleOnChange = (text, name) => {
    setInputValues({ ...inputValues, [name]: text });
  };

  const sendOtpToUser = async () => {
    try {
      const phoneNumber = dataUser.phonenumber;
      const response = await requestOtp(phoneNumber);
      if (response) {
        setRequestID(response.result);
        
        Alert.alert("Thông báo", "Đã gửi OTP thành công!");
      }
    } catch (error) {
      Alert.alert("Thông báo", "Gửi OTP thất bại!");
      console.log("🚀 ~ sendOtpToUser ~ error:", error);
    }
  };

  const submitOTP = async () => {
    try {
      const otpCode = Object.values(inputValues).join("");

      if (otpCode.length !== 4) {
        Alert.alert("Thông báo", "Vui lòng nhập đầy đủ 4 số OTP!");
        return;
      }

      const response = await verifyOtp(requestID, otpCode);
      if (response.result) {
        Alert.alert("Thông báo", "Xác minh OTP thành công!");

        const res = await createNewUser({
          password: dataUser.password,
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          phonenumber: dataUser.phonenumber,
          roleCode: dataUser.roleCode,
          email: dataUser.email,
          genderCode: dataUser.genderCode,
          image: dataUser.image,
        });

        if (res && res.statusCode === 200) {
          Alert.alert("Thông báo", "Tạo tài khoản thành công!");
        } else {
          Alert.alert("Thông báo", "Tạo tài khoản thất bại!");
        }
      } else {
        Alert.alert("Thông báo", "Mã OTP không đúng!");
      }
    } catch (error) {
      Alert.alert("Thông báo", "Xác minh OTP thất bại!");
      console.log("🚀 ~ submitOTP ~ error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={{
              uri: "https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png",
            }}
          />
          <Text style={styles.title}>XÁC THỰC OTP</Text>
          <Text style={styles.subTitle}>
            Mã đã được gửi tới số điện thoại {dataUser?.phonenumber}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          {["so1", "so2", "so3", "so4"].map((name, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={inputValues[name]}
              onChangeText={(text) => handleOnChange(text, name)}
              maxLength={1}
              keyboardType="number-pad"
            />
          ))}
        </View>
        <TouchableOpacity onPress={sendOtpToUser}>
          <Text style={styles.resendText}>
            Bạn không nhận được OTP? Gửi lại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={submitOTP}>
          <Text style={styles.buttonText}>Xác thực</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    width: 50,
    height: 50,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
  },
  resendText: {
    color: "#3366FF",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Otp;
