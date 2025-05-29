import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { AuthContext } from "../AuthContext";
import { DetailCompany } from "../../api/companyApi";
import { PAGINATION } from "../../constants/Pagination";
import { getPhoneByUserId, sendUserNotification } from "../../api/userApi";
import {
  getCVsByStatusService,
  acceptCVService,
  rejectCVService,
  reviewCVService,
} from "../../api/CvApi";
import ApplicationListUnderReview from "./ApplicationListUnderReview";

const ApplicationList = () => {
  const { userData, userToken } = useContext(AuthContext);
  const router = useRouter();
  const [dataCv, setDataCv] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "Ứng tuyển mới", value: "new" },
    { label: "Đã xem xét", value: "under-review" },
    { label: "Đã chấp nhận", value: "accepted" },
    { label: "Đã từ chối", value: "rejected" },
  ];

  useEffect(() => {
    if (selectedStatus !== "under-review") {
      fetchCVsByStatus(currentPage, selectedStatus);
    }
  }, [currentPage, selectedStatus]);

  const fetchCVsByStatus = async (page, status) => {
    setLoading(true);
    try {
      const data = {
        limit: PAGINATION.pagerow,
        offset: page * PAGINATION.pagerow,
        status,
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

  const handleSendNotification = async (userId, status) => {
    try {
      const phoneNumber = await getPhoneByUserId(userId, userToken);
      const response = await DetailCompany(userData.idCompany);
      let subject = "";
      let message = "";

      switch (status) {
        case "accepted":
          subject = `${response.result?.name} đã chấp nhận CV của bạn!`;
          message = `Chúc mừng! ${response.result?.name} đã đồng ý với hồ sơ của bạn.`;
          break;
        case "rejected":
          subject = `${response.result?.name} đã từ chối CV của bạn.`;
          message = `Rất tiếc! Hồ sơ của bạn đã bị ${response.result?.name} từ chối.`;
          break;
        case "reviewed":
          subject = `${response.result?.name} đang xem xét CV của bạn.`;
          message = `Hồ sơ của bạn đang được ${response.result?.name} xem xét. Vui lòng chờ thông báo tiếp theo.`;
          break;
        default:
          subject = "Trạng thái không xác định.";
          message = "Vui lòng kiểm tra lại trạng thái hồ sơ.";
      }

      const payload = {
        subject,
        image: response.result?.thumbnail,
        data: {
          message,
          attachedUrl: "/home",
          sender: "ADMIN",
        },
        userId: [phoneNumber.result],
      };

      await sendUserNotification(payload, userToken);
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Lỗi", "Không thể gửi thông báo");
    }
  };

  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= count) return;
    setCurrentPage(newPage);
  };

  const handleReview = async (cv) => {
    try {
      const res = await reviewCVService(cv.id, userToken);
      if (res) {
        await handleSendNotification(cv.userId, "reviewed");
        fetchCVsByStatus(currentPage, selectedStatus);
        Alert.alert("Thành công", "Đã duyệt hồ sơ thành công!");
      } else {
        Alert.alert("Lỗi", "Duyệt hồ sơ thất bại!");
      }
    } catch (error) {
      console.log("Error reviewing CV:", error);
      Alert.alert("Lỗi", "Duyệt hồ sơ thất bại!");
    }
  };

  const handleAccept = async (cv) => {
    try {
      const res = await acceptCVService(cv.id, userToken);
      if (res) {
        await handleSendNotification(cv.userId, "accepted");
        fetchCVsByStatus(currentPage, selectedStatus);
        Alert.alert("Thành công", "Duyệt hồ sơ thành công!");
      } else {
        Alert.alert("Lỗi", "Duyệt hồ sơ thất bại!");
      }
    } catch (error) {
      console.log("Error accepting CV:", error);
      Alert.alert("Lỗi", "Duyệt hồ sơ thất bại!");
    }
  };

  const handleReject = async (cv) => {
    try {
      const res = await rejectCVService(cv.id, userToken);
      if (res) {
        await handleSendNotification(cv.userId, "rejected");
        fetchCVsByStatus(currentPage, selectedStatus);
        Alert.alert("Thành công", "Từ chối hồ sơ thành công!");
      } else {
        Alert.alert("Lỗi", "Từ chối hồ sơ thất bại!");
      }
    } catch (error) {
      console.log("Error rejecting CV:", error);
      Alert.alert("Lỗi", "Từ chối hồ sơ thất bại!");
    }
  };

  const handleViewCV = (postId) => {
    router.push(`/listcv/${postId}`);
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
        <View style={styles.statusContainer}>
          <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
            {item.status || ""}
          </Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewCV(item.postId)}
          >
            <Text style={styles.actionButtonText}>Xem CV</Text>
          </TouchableOpacity>
          {selectedStatus === "new" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.reviewButton]}
                onPress={() => handleReview(item)}
              >
                <Text style={styles.actionButtonText}>Duyệt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAccept(item)}
              >
                <Text style={styles.actionButtonText}>Chấp nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(item)}
              >
                <Text style={styles.actionButtonText}>Từ chối</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "new":
        return { backgroundColor: "#ffc107", color: "#fff" };
      case "under-review":
        return { backgroundColor: "#17a2b8", color: "#fff" };
      case "accepted":
        return { backgroundColor: "#28a745", color: "#fff" };
      case "rejected":
        return { backgroundColor: "#dc3545", color: "#fff" };
      default:
        return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Danh sách hồ sơ</Text>

          <View style={styles.statusPickerContainer}>
            <Text style={styles.statusLabel}>Trạng thái:</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(0);
              }}
              style={styles.statusPicker}
            >
              {statuses.map((status) => (
                <Picker.Item
                  key={status.value}
                  label={status.label}
                  value={status.value}
                />
              ))}
            </Picker>
          </View>

          {selectedStatus === "under-review" ? (
            <ApplicationListUnderReview />
          ) : (
            <FlatList
              data={dataCv}
              renderItem={renderCVItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    Không có ứng viên nào với trạng thái này. Tìm kiếm ứng viên{" "}
                    <Text
                      style={styles.linkText}
                      onPress={() =>
                        Linking.openURL(
                          "http://localhost:3002/admin/list-candiate/"
                        )
                      }
                    >
                      Tại đây!
                    </Text>
                  </Text>
                </View>
              }
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>

        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 0 && styles.disabledButton,
            ]}
            onPress={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <Text style={styles.pageButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>
            Trang {currentPage + 1} / {count || 1}
          </Text>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage >= count - 1 && styles.disabledButton,
            ]}
            onPress={() => handleChangePage(currentPage + 1)}
            disabled={currentPage >= count - 1}
          >
            <Text style={styles.pageButtonText}>Tiếp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  card: {
    flex: 1,
  },
  cardBody: {
    padding: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statusPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  statusPicker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingBottom: 60,
  },
  cvItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cvText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  statusContainer: {
    alignItems: "flex-start",
    marginVertical: 5,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: "#4B49AC",
  },
  reviewButton: {
    backgroundColor: "#17a2b8",
  },
  acceptButton: {
    backgroundColor: "#28a745",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageText: {
    fontSize: 16,
    color: "#333",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ApplicationList;
