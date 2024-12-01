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
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { createNewUser } from "../../api/userApi";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import firebaseApp from "../../utils/firebase";
const Otp = ({ dataUser }) => {
  const [inputValues, setInputValues] = useState({
    so1: "",
    so2: "",
    so3: "",
    so4: "",
    so5: "",
    so6: "",
  });
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    if (dataUser) {
      let fetchOtp = async () => {
        await onSignInSubmit(false);
      };
      fetchOtp();
    }
  }, [dataUser]);

  const handleOnChange = (text, name) => {
    setInputValues({ ...inputValues, [name]: text });
  };

  const configureCaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        // theme: "dark", // Chủ đề của ReCAPTCHA
        defaultCountry: "VN",
      },
      auth
    );
  };

  let onSignInSubmit = async (isResend) => {
    if (!isResend) {
      configureCaptcha();
    }
    let phoneNumber = props.dataUser.phonenumber;
    if (phoneNumber) {
      phoneNumber = "+84" + phoneNumber.slice(1);
    }

    console.log("check phonenumber", phoneNumber);
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      Alert.alert("Thông báo", "Đã gửi mã OTP vào điện thoại");
    } catch (error) {
      Alert.alert("Thông báo", "Gửi mã thất bại !");
    }
  };

  let submitOTP = async () => {
    if (
      inputValues.so1 === "" ||
      inputValues.so2 === "" ||
      inputValues.so3 === "" ||
      inputValues.so4 === "" ||
      inputValues.so5 === "" ||
      inputValues.so6 === ""
    ) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ mã OTP !");
      return;
    }
    const code = +(
      inputValues.so1 +
      inputValues.so2 +
      inputValues.so3 +
      inputValues.so4 +
      inputValues.so5 +
      inputValues.so6
    );

    await window.confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        Alert.alert("Thông báo", "Đã xác minh số điện thoại !");
        let createUser = async () => {
          let res = await createNewUser({
            password: props.dataUser.password,
            firstName: props.dataUser.firstName,
            lastName: props.dataUser.lastName,
            phonenumber: props.dataUser.phonenumber,
            roleCode: props.dataUser.roleCode,
            email: props.dataUser.email,
            genderCode: props.dataUser.genderCode,
          });
          if (res && res.statusCode === 200) {
            Alert.alert("Thông báo", "Tạo tài khoản thành công");
            handleLogin(props.dataUser.phonenumber, props.dataUser.password);
          } else {
            toast.error(res.errMessage);
          }
        };
        createUser();
      })
      .catch((error) => {
        Alert.alert("Thông báo", "Mã OTP không đúng !");
        console.log(error);
      });
  };

  let resendOTP = async () => {
    await onSignInSubmit(true);
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
          {["so1", "so2", "so3", "so4", "so5", "so6"].map((name, index) => (
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
        <TouchableOpacity onPress={resendOTP}>
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
