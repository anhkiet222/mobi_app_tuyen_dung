import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { AuthContext } from "../AuthContext";
import { createCV } from "../../api/jobApi";
import { getDetailUserById } from "../../api/userApi";
import { sendEmail } from "../../api/emailapi";
import "react-native-polyfill-globals";

const SendCV = ({
  isOpen,
  onHide,
  postId,
  jobTitle,
  emailCompany,
}) => {
  const [selectedType, setSelectedType] = useState("pcCv");
  const [loading, setloading] = useState(false);
  const { userData, userToken } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState({
    userId: "",
    postId: "",
    file: "",
    linkFileUser: "",
    fileUser: "",
    linkFile: "",
    description: "",
    userEmail: "",
    companyEmail: "",
    jobTitle: "",
    userName: "",
  });

  useEffect(() => {
    if (userData) {
      getFileCv(userData.id);
    }
  }, [postId, userData?.id]);

  const getFileCv = async (id) => {
    try {
      const res = await getDetailUserById(id);
      const user = res.result.userAccountData;
      setInputValue((prev) => ({
        ...prev,
        jobTitle,
        companyEmail: emailCompany,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user?.email,
        userId: id,
        postId: postId,
        linkFileUser: user.userSettingData?.file || "",
        fileUser: user.userSettingData?.file || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSendCV = async () => {
    setloading(true);

    try {
      const cvSend =
        selectedType === "userCv" ? inputValue.fileUser : inputValue.file;

      if (!cvSend) {
        Alert.alert("Thông báo", "Vui lòng chọn hoặc tải CV của bạn.");
        setloading(false);
        return;
      }

      const payload = {
        userId: inputValue.userId,
        postId: inputValue.postId,
        description: inputValue.description,
        fileBase64: cvSend,
      };

      const response = await createCV(payload, userToken);

      if (response.errCode === 0) {
        const emailPayload = {
          userEmail: inputValue.userEmail,
          companyEmail: inputValue.companyEmail,
          jobTitle: inputValue.jobTitle,
          userName: inputValue.userName,
        };
        const emailRes = await sendEmail(emailPayload, userToken);

        if (emailRes.code === 200) {
          setInputValue({
            ...inputValue,
            file: "",
            description: "",
            linkFile: "",
          });
          Alert.alert("Thành công", "Đã nộp CV và gửi email thành công!");
          onHide();
        } else {
          Alert.alert("Thất bại", "Gửi Email thất bại.");
        }
      } else {
        Alert.alert("Thất bại", "Gửi CV thất bại.");
      }
    } catch (error) {
      console.error("Error sending CV:", error);
      Alert.alert("Thất bại", "Có lỗi xảy ra khi gửi CV.");
    } finally {
      setloading(false);
    }
  };

  const handleFilePick = async () => {
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

      const newPath = `${FileSystem.documentDirectory}${result.name}`;
      await FileSystem.copyAsync({ from: fileUri, to: newPath });

      const base64Data = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setInputValue((prev) => ({
        ...prev,
        file: base64Data,
        linkFile: base64Data,
      }));
      Alert.alert("Thành công", `File ${result.assets[0].name} đã được chọn`);
    } catch (error) {
      console.error("Lỗi khi chọn file:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn file.");
    }
  };

  
  if (loading) {
    return (
      <Modal visible={loading} transparent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>
    );
  }
  
  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>NỘP CV CỦA BẠN CHO NHÀ TUYỂN DỤNG</Text>
          <ScrollView>
            <TextInput
              style={styles.textArea}
              placeholder="Giới thiệu hoặc mô tả về bản thân"
              multiline
              value={inputValue.description}
              onChangeText={(text) =>
                setInputValue({ ...inputValue, description: text })
              }
            />
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSelectedType("pcCv")}
              >
                <View style={styles.radioCircle}>
                  {selectedType === "pcCv" && (
                    <View style={styles.selectedCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>Tự chọn CV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSelectedType("userCv")}
              >
                <View style={styles.radioCircle}>
                  {selectedType === "userCv" && (
                    <View style={styles.selectedCircle} />
                  )}
                </View>
                <Text style={styles.radioText}>CV online</Text>
              </TouchableOpacity>
            </View>

            {selectedType === "pcCv" && (
              <>
                <TouchableOpacity
                  style={styles.filePicker}
                  onPress={handleFilePick}
                >
                  <Text style={styles.filePickerText}>
                    {inputValue.linkFile ? "Đổi CV" : "Chọn CV (.pdf)"}
                  </Text>
                </TouchableOpacity>

                {/* {inputValue.file && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(inputValue.linkFile)}
                  >
                    <Text style={[styles.linkText, { color: "blue" }]}>
                      Nhấn vào đây để xem lại CV của bạn
                    </Text>
                  </TouchableOpacity>
                )} */}
              </>
            )}

            {/* {selectedType === "userCv" && inputValue.linkFileUser && (
              <TouchableOpacity
                onPress={() => Linking.openURL(inputValue.linkFileUser)}
              >
                <Text style={[styles.linkText, { color: "blue" }]}>
                  Nhấn vào đây để xem lại CV của bạn
                </Text>
              </TouchableOpacity>
            )} */}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleSendCV}>
              <Text style={styles.buttonText}>Gửi hồ sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setInputValue({
                  ...inputValue,
                  file: "",
                  description: "",
                  linkFile: "",
                });
                onHide();
              }}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    textAlign: "center",
    color: "red",
    fontSize: 18,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: "top",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  selectedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  radioText: {
    fontSize: 16,
  },
  filePicker: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
  filePickerText: {
    color: "#FFF",
    fontSize: 16,
  },
  linkText: {
    marginTop: 5,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ff4d4f",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingOverlay: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
},

});

export default SendCV;
