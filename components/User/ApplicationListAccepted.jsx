import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getCVsByStatusService,
  scheduleInterviewService,
} from "../../api/CvApi";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";

const ApplicationListAccepted = ({ currentPage, setCount, setLoading }) => {
  const { userData, userToken } = useContext(AuthContext);
  const [dataCv, setDataCv] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [interviewTime, setInterviewTime] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAcceptedCVs(currentPage);
  }, [currentPage]);

  const fetchAcceptedCVs = async (page) => {
    setLoading(true);
    try {
      const data = {
        limit: PAGINATION.pagerow,
        offset: page * PAGINATION.pagerow,
        status: "accepted",
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

  const handleScheduleClick = (cv) => {
    setSelectedCV(cv);
    setShowModal(true);
    setInterviewTime("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCV(null);
    setInterviewTime("");
    setDatePickerVisibility(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setInterviewTime(dayjs(selectedDate).format("YYYY-MM-DDTHH:mm"));
    hideDatePicker();
  };

  const handleScheduleInterview = async () => {
    if (selectedCV && interviewTime) {
      setModalLoading(true);
      try {
        const res = await scheduleInterviewService(
          {
            cvId: selectedCV.id,
            interviewTime,
          },
          userToken
        );
        console.log("🚀 ~ handleScheduleInterview ~ res:", res);
        // if (res) {
        //   setModalLoading(false);
        //   handleCloseModal();
        //   fetchAcceptedCVs(currentPage);
        //   Alert.alert("Thành công", "Lên lịch phỏng vấn thành công!");
        // } else {
        //   setModalLoading(false);
        //   Alert.alert("Lỗi", "Lên lịch phỏng vấn thất bại!");
        // }
      } catch (error) {
        console.log("Error scheduling interview:", error);
        setModalLoading(false);
        Alert.alert("Lỗi", "Lên lịch phỏng vấn thất bại!");
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
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
        <Text style={styles.cvText}>
          Thời gian phỏng vấn:{" "}
          {item.interviewTime
            ? dayjs(item.interviewTime).format("DD/MM/YYYY HH:mm:ss")
            : "N/A"}
        </Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => handleScheduleClick(item)}
          >
            <Text style={styles.actionButtonText}>Lên lịch phỏng vấn</Text>
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
              Không có ứng viên nào được chấp nhận. Tìm kiếm ứng viên{" "}
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

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Lên lịch phỏng vấn</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mã ứng viên:</Text>
              <Text>{selectedCV?.userId || ""}</Text>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Thời gian phỏng vấn:</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatePicker}
              >
                <Text style={styles.datePickerText}>
                  {interviewTime
                    ? dayjs(interviewTime).format("DD/MM/YYYY HH:mm")
                    : "Chọn ngày giờ"}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
                date={new Date()}
              />
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleScheduleInterview}
            >
              <Text style={styles.actionButtonText}>Xác nhận</Text>
            </TouchableOpacity>
            {modalLoading && (
              <View style={styles.modalLoadingOverlay}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  actionContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  scheduleButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fefefe",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#aaa",
    fontSize: 28,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  formGroup: {
    marginVertical: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  modalLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ApplicationListAccepted;
