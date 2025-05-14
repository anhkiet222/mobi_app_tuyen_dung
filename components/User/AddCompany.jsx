import base64 from "base-64";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import MarkdownIt from "markdown-it";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useToast } from "react-native-toast-notifications";
import { createCompany, updateCompany } from "../../api/companyApi";
import { getDetailCompanyByUserId } from "../../api/userApi";
import { AuthContext } from "../AuthContext";
import PdfViewer from "./PdfViewer";

const getBase64 = async (uri) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:application/pdf;base64,${base64}`;
  } catch (error) {
    console.error("Error converting to Base64:", error);
    throw new Error("Failed to convert file to Base64");
  }
};

const base64ToBlob = (base64Data) => {
  const byteCharacters = base64.decode(base64Data.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: "application/pdf" });
};

const AddCompany = () => {
  const mdParser = new MarkdownIt();
  const { userData, setUserData, userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    website: "",
    employeeCount: "",
    taxNumber: "",
    descriptionMarkdown: "",
    descriptionHTML: "",
    image: "",
    coverImage: "",
    imageReview: "",
    coverImageReview: "",
    isOpen: false,
    isActionADD: true,
    id: "",
    file: "",
    imageClick: "",
    isFileChange: false,
  });
  const [pdfSource, setPdfSource] = useState(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const toast = useToast();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền bị từ chối",
          "Cần phải có quyền truy cập vào thư viện phương tiện."
        );
      }
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      if (!userData) return;
      try {
        const userId =
          userData.codeRoleAccount !== "ADMIN" ? userData.id : null;
        const companyId = userData.codeRoleAccount === "ADMIN" ? id : null;
        if (userId || companyId) {
          const res = await getDetailCompanyByUserId(
            userId,
            companyId,
            userToken
          );
          if (res?.errCode === 0) {
            setFormData({
              ...formData,
              name: res.data.name || "",
              phoneNumber: res.data.phonenumber || "",
              address: res.data.address || "",
              website: res.data.website || "",
              employeeCount: res.data.amountEmployer || "",
              taxNumber: res.data.taxnumber || "",
              descriptionMarkdown: res.data.descriptionMarkdown || "",
              descriptionHTML: res.data.descriptionHTML || "",
              image: res.data.thumbnail || "",
              coverImage: res.data.coverImage || "",
              imageReview: res.data.thumbnail || "",
              coverImageReview: res.data.coverImage || "",
              isActionADD: false,
              id: res.data.id || "",
              file: res.data.file || "",
            });
            if (res.data.file) {
              setPdfSource({
                base64: `data:application/pdf;base64,${res.data.file}`,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, [id, userData, userToken]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        setFormData((prev) => ({
          ...prev,
          [type]: uri,
          [`${type}Review`]: uri,
        }));
      }
    } catch (error) {
      console.error(`Error selecting ${type}:`, error);
    }
  };

  const handlePdfSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.type === "success" && result.size <= 2097152) {
        const base64 = await getBase64(result.uri);
        setPdfSource({ base64 });
        setFormData((prev) => ({ ...prev, file: base64, isFileChange: true }));
      } else if (result.size > 2097152) {
        Alert.alert("Thất bại", "Tệp tin phải có kích thước dưới 2MB!");
      }
    } catch (error) {
      console.error("Error selecting PDF:", error);
      toast.show(`Lỗi khi chọn tệp PDF: ${error.message}`, { type: "danger" });
    }
  };

  const handleDescriptionChange = (text) => {
    const html = mdParser.render(text);
    setFormData((prev) => ({
      ...prev,
      descriptionMarkdown: text,
      descriptionHTML: html,
    }));
  };
  console.log(pdfSource);
  const handleSave = async () => {
    setIsLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("descriptionHTML", formData.descriptionHTML);
    data.append("descriptionMarkdown", formData.descriptionMarkdown);
    data.append("website", formData.website);
    data.append("address", formData.address);
    data.append("phonenumber", formData.phoneNumber);
    data.append("amountEmployer", formData.employeeCount);
    data.append("taxnumber", formData.taxNumber);
    if (formData.file) data.append("file", formData.file);
    if (formData.image)
      data.append("filethumb", {
        uri: formData.image,
        name: "thumbnail.jpg",
        type: "image/jpeg",
      });
    if (formData.coverImage)
      data.append("fileCover", {
        uri: formData.coverImage,
        name: "cover.jpg",
        type: "image/jpeg",
      });

    try {
      if (formData.isActionADD) {
        const res = await createCompany(data, userToken);
        if (res.data?.errCode === 0) {
          Alert.alert("Thành công", "Công ty đã được tạo thành công!");
          const newUser = {
            ...userData,
            codeRoleAccount: "COMPANY",
            idCompany: res.data.companyId,
          };
          setUserData(newUser);
          router.back();
        } else {
          Alert.alert("Thất bại", "Không thể tạo công ty!");
          console.log(res.data?.errMessage);
        }
      } else {
        data.append("id", formData.id);
        if (formData.image)
          data.append("thumbnailImage", {
            uri: formData.image,
            name: "thumbnail.jpg",
            type: "image/jpeg",
          });
        if (formData.coverImage)
          data.append("coverimagefile", {
            uri: formData.coverImage,
            name: "cover.jpg",
            type: "image/jpeg",
          });
        if (formData.isFileChange && formData.file) {
          const blob = base64ToBlob(formData.file);
          data.append("filePDF", blob, "file.pdf");
        }
        const res = await updateCompany(data, userToken);
        if (res.data?.errCode === 0) {
          Alert.alert("Thành công", "Công ty đã được cập nhật!");
          router.back();
        } else {
          Alert.alert("Thất bại", "Không thể cập nhật công ty!");
          console.log(res.data?.errMessage);
        }
      }
    } catch (error) {
      Alert.alert("Thất bại", "Lỗi khi lưu công ty!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    userData?.codeRoleAccount === "EMPLOYER" && userData?.idCompany;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>
          {formData.isActionADD
            ? "Thêm công ty"
            : userData?.codeRoleAccount === "ADMIN"
            ? "Xem công ty"
            : "Cập nhật công ty"}
        </Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên công ty</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange("phoneNumber", value)}
              keyboardType="numeric"
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã số thuế</Text>
            <TextInput
              style={styles.input}
              value={formData.taxNumber}
              onChangeText={(value) => handleInputChange("taxNumber", value)}
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số nhân viên</Text>
            <TextInput
              style={styles.input}
              value={String(formData.employeeCount)}
              onChangeText={(value) =>
                handleInputChange("employeeCount", value)
              }
              keyboardType="numeric"
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link website</Text>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(value) => handleInputChange("website", value)}
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ảnh đại diện</Text>
            {formData.imageReview && (
              <TouchableOpacity
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: true,
                    imageClick: prev.imageReview,
                  }))
                }
              >
                <Image
                  source={{ uri: formData.imageReview }}
                  style={styles.previewImage}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => handleImageSelect("image")}
              disabled={isDisabled || userData?.codeRoleAccount === "ADMIN"}
            >
              <Text style={styles.fileButtonText}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ảnh bìa</Text>
            {formData.coverImageReview && (
              <TouchableOpacity
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: true,
                    imageClick: prev.coverImageReview,
                  }))
                }
              >
                <Image
                  source={{ uri: formData.coverImageReview }}
                  style={styles.previewImage}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => handleImageSelect("coverImage")}
              disabled={isDisabled || userData?.codeRoleAccount === "ADMIN"}
            >
              <Text style={styles.fileButtonText}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tệp PDF</Text>
            {(pdfSource || formData.file) && (
              <View style={styles.pdfViewerContainer}>
                <PdfViewer
                  source={pdfSource || { base64: formData.file }}
                  style={styles.pdfViewer}
                  webviewProps={{ renderType: "DIRECT_BASE64" }}
                  onError={(error) => {
                    console.error("PDF Viewer Error:", error);
                    Alert.alert("Thất bại", `Lỗi khi hiển thị PDF: ${error}`);
                  }}
                  onLoadEnd={() => console.log("PDF loaded successfully")}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.fileButton}
              onPress={handlePdfSelect}
              disabled={isDisabled || userData?.codeRoleAccount === "ADMIN"}
            >
              <Text style={styles.fileButtonText}>Chọn PDF</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giới thiệu công ty</Text>
            <TextInput
              style={[styles.input, styles.markdownInput]}
              value={formData.descriptionMarkdown}
              onChangeText={handleDescriptionChange}
              multiline
              editable={!isDisabled && userData?.codeRoleAccount !== "ADMIN"}
            />
          </View>
          {(userData?.codeRoleAccount === "COMPANY" ||
            (userData?.codeRoleAccount === "EMPLOYER" &&
              !userData?.idCompany)) && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
          )}
          {userData?.codeRoleAccount === "EMPLOYER" && userData?.idCompany && (
            <Text style={styles.noPermission}>Không có quyền cập nhật</Text>
          )}
        </View>
        <ImageViewing
          images={[{ uri: formData.imageClick }]}
          imageIndex={0}
          visible={formData.isOpen}
          onRequestClose={() =>
            setFormData((prev) => ({ ...prev, isOpen: false }))
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  markdownInput: {
    height: 400,
    textAlignVertical: "top",
  },
  fileButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  fileButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 4,
    alignSelf: "center",
  },
  pdfViewerContainer: {
    marginTop: 10,
    height: 400,
  },
  pdfViewer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noPermission: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddCompany;
