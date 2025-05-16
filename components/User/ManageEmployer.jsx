import { useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAllUserByCompanyIdService,
  QuitCompanyService,
} from "../../api/companyApi";
import { AuthContext } from "../AuthContext";

const PAGINATION = {
  pagerow: 10,
};

const ManageEmployer = () => {
  const route = useRouter();
  const { userData, userToken } = useContext(AuthContext);
  const [dataUser, setDataUser] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userData && userData.idCompany) {
        await fetchAllUsers(userData.idCompany, 0);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy thông tin công ty");
      }
    };
    fetchUserData();
  }, [userData, userToken]);

  const fetchAllUsers = async (idCompany, page) => {
    setIsLoading(true);
    try {
      const res = await getAllUserByCompanyIdService(
        {
          limit: PAGINATION.pagerow,
          offset: page * PAGINATION.pagerow,
          idCompany,
        },
        userToken
      );
      if (res && res.errCode === 0) {
        setDataUser(res.data || []);
        setCount(Math.ceil(res.count / PAGINATION.pagerow));
      } else {
        Alert.alert("Lỗi", "Lỗi khi lấy danh sách nhân viên");
      }
    } catch (error) {
      console.error("Error fetching users:", error.response.data);
      Alert.alert("lỗi", "Lỗi khi lấy danh sách nhân viên");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = async (newPage) => {
    setCurrentPage(newPage);
    if (userData && userData.idCompany) {
      await fetchAllUsers(userData.idCompany, newPage);
    }
  };

  const handleQuitCompany = async (userId) => {
    try {
      const res = await QuitCompanyService(userId, userToken);
      if (res && res.errCode === 0) {
        Alert.alert("Thành công", "Thôi việc thành công!");
        if (userData && userData.idCompany) {
          await fetchAllUsers(userData.idCompany, currentPage);
        }
      } else {
        Alert.alert("Lỗi", "Lỗi khi thực hiện thôi việc");
      }
    } catch (error) {
      console.error("Error quitting company:", error);
      Alert.alert("Lỗi", "Lỗi khi thực hiện thôi việc");
    }
  };

  const handleAddEmployee = () => {
    route.push("/companysetting/addemployee");
  };

  const renderUserItem = ({ item, index }) => {
    const date = moment.unix(item?.birthday / 1000).format("DD/MM/YYYY");
    // const rowNumber = index + 1 + currentPage * PAGINATION.pagerow;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text
            style={styles.cardTitle}
          >{`${item.firstName} ${item.lastName}`}</Text>
          {/* <Text style={styles.cardSubtitle}>STT: {rowNumber}</Text> */}
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.detailText}>SĐT: {item.phoneNumber}</Text>
          <Text style={styles.detailText}>Giới tính: {item.genderValue}</Text>
          <Text style={styles.detailText}>Ngày sinh: {date}</Text>
          <Text style={styles.detailText}>Quyền: {item.roleValue}</Text>
          <Text
            style={[
              styles.detailText,
              item.statusCode === "S1"
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          >
            Trạng thái: {item.statusValue}
          </Text>
        </View>
        <View style={styles.cardActions}>
          {userData.id !== item.userId && (
            <TouchableOpacity
              style={styles.quitButton}
              onPress={() => handleQuitCompany(item.userId)}
            >
              <Text style={styles.quitText}>Thôi việc</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 0 && styles.disabledButton,
        ]}
        onPress={() => handleChangePage(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <Text style={styles.paginationText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.pageNumber}>
        Trang {currentPage + 1} / {count}
      </Text>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage >= count - 1 && styles.disabledButton,
        ]}
        onPress={() => handleChangePage(currentPage + 1)}
        disabled={currentPage >= count - 1}
      >
        <Text style={styles.paginationText}>Tiếp</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách nhân viên</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <>
          <FlatList
            data={dataUser}
            renderItem={renderUserItem}
            keyExtractor={(item, index) => `${item.userId}-${index}`}
            contentContainerStyle={styles.listContent}
          />
          {count > 1 && renderPagination()}
        </>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddEmployee}
      >
        <Text style={styles.floatingButtonText}>Thêm nhân viên</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
    marginBottom: 5,
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardDetails: {
    paddingVertical: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginVertical: 3,
  },
  statusActive: {
    color: "#28a745",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  quitButton: {
    backgroundColor: "#4B49AC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  quitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 80,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 70,
  },
  paginationButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  paginationText: {
    color: "#fff",
    fontSize: 14,
  },
  pageNumber: {
    fontSize: 14,
    color: "#333",
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
    zIndex: 1000,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageEmployer;
