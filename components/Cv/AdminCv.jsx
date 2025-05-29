import { useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { getDetailCvServicebyAdmin } from "../../api/postApi";
import { AuthContext } from "../AuthContext";

const AdminCv = () => {
  const { userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dataCV, setDataCV] = useState({
    firstName: "",
    lastName: "",
    file: {
      data: "",
    },
    description: "",
    filePDF: "",
  });
  const { idCv } = useLocalSearchParams();

  useEffect(() => {
    if (idCv) {
      const fetchCV = async () => {
        try {
          setLoading(true);
          const res = await getDetailCvServicebyAdmin(idCv, userToken);

          if (res?.data && res.data.code === 200) {
            setDataCV({
              ...res.data.result,
              file: res.data.result.file || { data: "" },
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchCV();
    }
  }, [idCv]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giới thiệu bản thân</Text>
      <View style={styles.quoteContainer}>
        <Text style={styles.description}>
          {dataCV.description || "Không có mô tả"}
        </Text>
        <Text style={styles.footer}>
          {dataCV.firstName + " " + dataCV.lastName}
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
