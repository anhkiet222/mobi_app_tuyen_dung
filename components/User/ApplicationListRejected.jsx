import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { getCVsByStatusService } from "../../api/CvApi";
import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";

const ApplicationListRejected = ({ currentPage, setCount, setLoading }) => {
  const { userData, userToken } = useContext(AuthContext);
  const [dataCv, setDataCv] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRejectedCVs(currentPage);
  }, [currentPage]);

  const fetchRejectedCVs = async (page) => {
    setLoading(true);
    try {
      const data = {
        limit: PAGINATION.pagerow,
        offset: page * PAGINATION.pagerow,
        status: "rejected",
      };
      const res = await getCVsByStatusService(
        userData.idCompany,
        data,
        userToken
      );
      if (res && res.code === 200) {
        setDataCv(res.result.content || []);
        setCount(Math.ceil(res.result.totalElements / PAGINATION.pagerow));
      } else {
        setDataCv([]);
        setCount(0);
        Alert.alert("Lỗi", "Không thể tải danh sách CV");
      }
    } catch (error) {
      console.log("Error fetching CVs:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi tải dữ liệu");
      setDataCv([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const renderCVItem = ({ item, index }) => {
    if (!item) return null;
    return (
      <View style={styles.cvItem}>
        <Text style={styles.cvText}>ID Người dùng: {item.userId || ""}</Text>
        <Text style={styles.cvText}>
          Họ và tên: {(item.firstName || "") + " " + (item.lastName || "")}
        </Text>
        <Text style={styles.cvText}>Email: {item.email || ""}</Text>
        <Text style={styles.cvText}>ID Bài đăng: {item.postId || ""}</Text>
        <Text style={styles.cvText}>Trạng thái: {item.status || ""}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataCv}
        renderItem={renderCVItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              Không có ứng viên nào bị từ chối. Hãy kiểm tra Danh sách ứng tuyển
              mới{" "}
              <Text
                style={styles.linkText}
                onPress={() => router.push(`/companysetting/findcadidate`)}
              >
                Tại đây!
              </Text>
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cvItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cvText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default ApplicationListRejected;
