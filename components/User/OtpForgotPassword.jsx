import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { forgetPassword, requestOtp, verifyOtp } from "../../api/userApi";

const OtpForgetPassword = ({ dataUser }) => {
  const [requestID, setRequestID] = useState("");
  const [inputValues, setInputValues] = useState({
    so1: "",
    so2: "",
    so3: "",
    so4: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (dataUser) {
      sendOtpToUser();
    }
  }, [dataUser]);

  const handleOnChange = (text, name) => {
    setInputValues((prev) => ({ ...prev, [name]: text }));
  };

  const sendOtpToUser = async () => {
    try {
      const phoneNumber = dataUser?.phonenumber;
      const response = await requestOtp(phoneNumber);
      if (response) {
        setRequestID(response.result.requestID);
        Alert.alert("Thông báo", "Đã gửi OTP thành công!");
      }
    } catch (error) {
      console.log("🚀 ~ sendOtpToUser ~ error:", error)
      Alert.alert("Lỗi", "Gửi OTP thất bại!");
    }
  };

  const submitOTP = async () => {
    try {
      const otpCode = Object.values(inputValues).join("");

      if (otpCode.length !== 4) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ 4 số OTP!");
        return;
      }

      const response = await verifyOtp(requestID, otpCode);
      if (response.result) {
        Alert.alert("Thành công", "Xác minh OTP thành công!");
        const forgetPasswordResponse = await forgetPassword(
          dataUser.phonenumber
        );
        if (forgetPasswordResponse && forgetPasswordResponse.code === 200) {
          setNewPassword(forgetPasswordResponse.result);
          setShowDialog(true);
        } else {
          Alert.alert("Lỗi", "Không thể lấy lại mật khẩu. Vui lòng thử lại.");
        }
      } else {
        Alert.alert("Lỗi", "Mã OTP không đúng!");
      }
    } catch (error) {
      console.log("🚀 ~ submitOTP ~ error:", error)
      Alert.alert("Lỗi", "Xác minh OTP hoặc lấy lại mật khẩu thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>XÁC THỰC OTP</Text>
        <Text style={styles.subHeader}>
          Mã đã được gửi tới số điện thoại {dataUser?.phonenumber}
        </Text>
        <View style={styles.inputContainer}>
          {["so1", "so2", "so3", "so4"].map((name, index) => (
            <TextInput
              key={index}
              value={inputValues[name]}
              onChangeText={(text) => handleOnChange(text, name)}
              style={styles.input}
              maxLength={1}
              keyboardType="numeric"
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

      <Modal visible={showDialog} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              Khôi phục mật khẩu thành công
            </Text>
            <Text style={styles.modalBody}>
              Mật khẩu mới của bạn là:{" "}
              <Text style={styles.newPassword}>{newPassword}</Text>
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowDialog(false)}
            >
              <Text style={styles.modalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
  },
  resendText: {
    color: "#3366FF",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 15,
  },
  newPassword: {
    fontWeight: "bold",
    color: "green",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OtpForgetPassword;
