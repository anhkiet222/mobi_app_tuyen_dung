import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../components/AuthContext";
import { getDetailCvServicebyAdmin } from "../../api/postApi";
import { ActivityIndicator } from "react-native-web";

const AdminCv = () => {
  const { userToken } = useContext(AuthContext);
  const [dataCV, setDataCV] = useState({
    userCvData: {
      firstName: "",
      lastName: "",
    },
    file: {
      data: "",
    },
    description: "",
    filePDF: "",
  });
  const { idCv } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (idCv) {
      const fetchCV = async () => {
        try {
          const res = await getDetailCvServicebyAdmin(idCv, userToken);
          console.log(res);
          if (res && res.data.code === 200) {
            setDataCV({
              ...res.data.result,
              userCvData: res.data.result.userCvData || {
                firstName: "",
                lastName: "",
              },
              file: res.data.result.file || { data: "" },
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchCV();
    }
  }, [idCv]);

  console.log(dataCV.file);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Giới thiệu bản thân</Text>
      <View style={styles.quoteContainer}>
        <Text style={styles.description}>
          {dataCV.description || "Không có mô tả"}
        </Text>
        <Text style={styles.footer}>
          {dataCV.userCvData.firstName + " " + dataCV.userCvData.lastName}
        </Text>
      </View>

      <Text style={styles.title}>FILE CV</Text>
      {dataCV.filePDF ? (
        <WebView
          source={{ uri: dataCV.filePDF }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#007bff"
              style={styles.loading}
            />
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Không có file CV</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  backButton: {
    padding: 10,
    marginBottom: 20,
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
    textAlign: "center",
    marginBottom: 20,
  },
  quoteContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  webview: {
    height: 500, // Điều chỉnh chiều cao phù hợp với mobile
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});

export default AdminCv;
