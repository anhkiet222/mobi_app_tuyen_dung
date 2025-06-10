import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  acceptCVService,
  getCVsByStatusService,
  rejectCVService,
} from "../../api/CvApi";
import { DetailCompany } from "../../api/companyApi";
import { getPhoneByUserId, sendUserNotification } from "../../api/userApi";
import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";

const ApplicationListUnderReview = ({ currentPage, setCount, setLoading }) => {
  const { userData, userToken } = useContext(AuthContext);
  const [dataCv, setDataCv] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchUnderReviewCVs(currentPage);
  }, [currentPage]);

  const fetchUnderReviewCVs = async (page) => {
    setLoading(true);
    try {
      const data = {
        limit: PAGINATION.pagerow,
        offset: page * PAGINATION.pagerow,
        status: "under-review",
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

  const handleAccept = async (cv) => {
    try {
      const res = await acceptCVService(cv.id, userToken);
      if (res) {
        await handleSendNotification(cv.userId, "accepted");
        fetchUnderReviewCVs(currentPage);
        Alert.alert("Thành công", "Chấp nhận hồ sơ thành công!");
      } else {
        Alert.alert("Lỗi", "Chấp nhận hồ sơ thất bại!");
      }
    } catch (error) {
      console.log("Error accepting CV:", error);
      Alert.alert("Lỗi", "Chấp nhận hồ sơ thất bại!");
    }
  };

  const handleReject = async (cv) => {
    try {
      const res = await rejectCVService(cv.id, userToken);
      if (res) {
        await handleSendNotification(cv.userId, "rejected");
        fetchUnderReviewCVs(currentPage);
        Alert.alert("Thành công", "Từ chối hồ sơ thành công!");
      } else {
        Alert.alert("Lỗi", "Từ chối hồ sơ thất bại!");
      }
    } catch (error) {
      console.log("Error rejecting CV:", error);
      Alert.alert("Lỗi", "Từ chối hồ sơ thất bại!");
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
        <View style={styles.actionContainer}>
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
        </View>
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
              Không có ứng viên nào được xem xét. Tìm kiếm ứng viên{" "}
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
    paddingBottom: 60,
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
  actionContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 4,
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
});

export default ApplicationListUnderReview;
