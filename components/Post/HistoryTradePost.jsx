import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import { AuthContext } from "../AuthContext";
import { PAGINATION } from "../../constants/Pagination";
import { getHistoryTradePost } from "../../api/postApi";

const HistoryTradePost = () => {
  const { userData, userToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fromDatePost, setFromDatePost] = useState("");
  const [toDatePost, setToDatePost] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isPickingFromDate, setIsPickingFromDate] = useState(true);

  const sendParams = {
    limit: PAGINATION.pagerow,
    offset: 0,
    fromDate: "",
    toDate: "",
    companyId: userData?.idCompany || "",
  };

  const getData = async (params) => {
    setLoading(true);
    try {
      const res = await getHistoryTradePost(params, userToken);
      if (res && res.code === 200) {
        setData(res.result.content || []);
        setCount(Math.ceil(res.result.totalElements / PAGINATION.pagerow));
      } else {
        setData([]);
        setCount(0);
        Alert.alert("Lỗi", "Không thể tải lịch sử giao dịch");
      }
    } catch (error) {
      console.log("Error fetching trade history:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi tải dữ liệu");
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const onDatePickerChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

      if (isPickingFromDate) {
        if (toDatePost && dayjs(formattedDate).isAfter(dayjs(toDatePost))) {
          Alert.alert(
            "Lỗi",
            "Ngày bắt đầu không thể sau ngày kết thúc. Vui lòng chọn lại."
          );
          setFromDatePost("");
          return;
        }
        setFromDatePost(formattedDate);
      } else {
        if (
          fromDatePost &&
          dayjs(formattedDate).isBefore(dayjs(fromDatePost))
        ) {
          Alert.alert(
            "Lỗi",
            "Ngày kết thúc không thể trước ngày bắt đầu. Vui lòng chọn lại."
          );
          setToDatePost("");
          return;
        }
        setToDatePost(formattedDate);
      }
      setTempDate(selectedDate);
    }
  };

  const handleFilterByDate = () => {
    console.log("Filtering with:", { fromDatePost, toDatePost });
    if (!fromDatePost && !toDatePost) {
      Alert.alert("Lỗi", "Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }
    if (fromDatePost && toDatePost === "") {
      Alert.alert("Lỗi", "Bạn chưa chọn ngày kết thúc");
      return;
    }
    getData({
      ...sendParams,
      companyId: userData.idCompany,
      fromDate: fromDatePost,
      toDate: toDatePost,
      offset: 0,
    });
    setCurrentPage(0);
  };

  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= count) return;
    setCurrentPage(newPage);
    getData({
      ...sendParams,
      companyId: userData.idCompany,
      fromDate: fromDatePost,
      toDate: toDatePost,
      offset: newPage * PAGINATION.pagerow,
    });
  };

  const clearDate = (isFromDate) => {
    if (isFromDate) {
      setFromDatePost("");
    } else {
      setToDatePost("");
    }
  };

  useEffect(() => {
    if (userData) {
      getData({ ...sendParams, companyId: userData.idCompany });
    }
  }, [userData]);

  const renderTradeItem = ({ item, index }) => {
    return (
      <View style={styles.tradeItem}>
        <Text style={styles.tradeText}>Tên gói: {item.packageData.name}</Text>
        <Text style={styles.tradeText}>Mã giao dịch: {item.id}</Text>
        <Text style={styles.tradeText}>
          Loại gói:{" "}
          {item.packageData.isHot == 0 ? "Loại bình thường" : "Loại nổi bật"}
        </Text>
        <Text style={styles.tradeText}>Số lượng đã mua: {item.amount}</Text>
        <Text style={styles.tradeText}>
          Đơn giá: {item.packageData.price} USD
        </Text>
        <Text style={styles.tradeText}>
          Người mua: {item.userData.firstName + " " + item.userData.lastName}
        </Text>
        <Text style={styles.tradeText}>
          Thời gian mua: {dayjs(item.createdAt).format("DD-MM-YYYY HH:mm:ss")}
        </Text>
      </View>
    );
  };

  const minimumDateForToDate = fromDatePost
    ? dayjs(fromDatePost).toDate()
    : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setIsPickingFromDate(true);
                setShowDatePicker(true);
              }}
              disabled={!!toDatePost && !fromDatePost}
            >
              <View style={styles.dateContent}>
                <Text style={styles.dateButtonText}>
                  {fromDatePost
                    ? dayjs(fromDatePost).format("DD/MM/YYYY")
                    : "Chọn ngày bắt đầu"}
                </Text>
                {fromDatePost && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => clearDate(true)}
                  >
                    <Feather name="delete" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.dateSeparator}> - </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setIsPickingFromDate(false);
                setShowDatePicker(true);
              }}
              disabled={!fromDatePost}
            >
              <View style={styles.dateContent}>
                <Text style={styles.dateButtonText}>
                  {toDatePost
                    ? dayjs(toDatePost).format("DD/MM/YYYY")
                    : "Chọn ngày kết thúc"}
                </Text>
                {toDatePost && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => clearDate(false)}
                  >
                    <Feather name="delete" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", width: "100%", marginBottom: 15 }}
          >
            <TouchableOpacity
              style={styles.filterButton}
              onPress={handleFilterByDate}
            >
              <Text style={styles.filterButtonText}>Lọc theo ngày</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              onChange={onDatePickerChange}
              minimumDate={isPickingFromDate ? undefined : minimumDateForToDate}
              maximumDate={new Date()}
            />
          )}

          <FlatList
            data={data}
            renderItem={renderTradeItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.noDataText}>Chưa có loại giao dịch này</Text>
            }
            contentContainerStyle={styles.listContainer}
          />
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
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dateContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  dateSeparator: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  filterButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 60,
  },
  tradeItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tradeText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
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

export default HistoryTradePost;
