import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { useRouter, useLocalSearchParams } from "expo-router";

import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";
import { sendUserNotification } from "../../api/messageApi";
import { getUsersByCategory } from "../../api/userApi";
import {
  acceptPostService,
  activePostService,
  banPostService,
  getAllPostByAdminService,
  getAllPostByRoleAdminService,
  getDetailPostById,
} from "../../api/postApi";

const ManagePost = () => {
  const { userData, userToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchBy, setIsSearchBy] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState(0);
  const [search, setSearch] = useState("");
  const [censorCode, setCensorCode] = useState("PS3");
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalPostId, setModalPostId] = useState("");
  const [modalNote, setModalNote] = useState("");
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const censorOptions = [
    { value: "", label: "Tất cả" },
    { value: "PS1", label: "Đã kiểm duyệt" },
    { value: "PS2", label: "Đã bị từ chối" },
    { value: "PS3", label: "Chờ kiểm duyệt" },
    { value: "PS4", label: "Bài viết đã bị chặn" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id && !isSearchBy) {
          setIsSearchBy(true);
          setSearch(id);
          setCensorCode("");
          const arrDataById = await getAllPostByAdminService(
            {
              limit: PAGINATION.pagerow,
              offset: 0,
              search: id,
              censorCode: "",
              idCompany: userData?.idCompany,
            },
            userToken
          );
          if (arrDataById && arrDataById.errCode === 0) {
            setDataPost(arrDataById.content || []);
            setNumberPage(0);
            setCount(Math.ceil(arrDataById.totalElements / PAGINATION.pagerow));
            setTotal(arrDataById.totalElements);
          }
        } else {
          let arrData = [];
          if (userData?.codeRoleAccount === "ADMIN") {
            arrData = await getAllPostByRoleAdminService(
              {
                limit: PAGINATION.pagerow,
                offset: 0,
                search: search.trim(),
                censorCode,
              },
              userToken
            );
          } else {
            arrData = await getAllPostByAdminService(
              {
                limit: PAGINATION.pagerow,
                offset: 0,
                idCompany: userData?.idCompany,
                search: search.trim(),
                censorCode,
              },
              userToken
            );
          }
          if (arrData) {
            setDataPost(arrData.content || []);
            setNumberPage(0);
            setCount(Math.ceil(arrData.totalElements / PAGINATION.pagerow));
            setTotal(arrData.totalElements);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        Alert.alert("Lỗi", "Lỗi khi lấy danh sách bài đăng");
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userToken) {
      fetchData();
    }
  }, [search, censorCode, userData, userToken, id]);

  const handleChangePage = async (newPage) => {
    setNumberPage(newPage);
    setIsLoading(true);
    try {
      let arrData = [];
      if (userData?.codeRoleAccount === "ADMIN") {
        arrData = await getAllPostByRoleAdminService(
          {
            limit: PAGINATION.pagerow,
            offset: newPage * PAGINATION.pagerow,
            search: search.trim(),
            censorCode,
          },
          userToken
        );
      } else {
        arrData = await getAllPostByAdminService(
          {
            limit: PAGINATION.pagerow,
            offset: newPage * PAGINATION.pagerow,
            idCompany: userData?.idCompany,
            search: search.trim(),
            censorCode,
          },
          userToken
        );
      }
      if (arrData) {
        setDataPost(arrData.content || []);
        setTotal(arrData.totalElements);
      }
    } catch (error) {
      console.error("Error changing page:", error);
      Alert.alert("Lỗi", "Lỗi khi chuyển trang");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChangeCensor = (value) => {
    setCensorCode(value);
    setNumberPage(0); // Reset page về 0 khi thay đổi bộ lọc
  };

  const handleBanPost = async () => {
    setIsLoading(true);
    try {
      const res = await banPostService(
        {
          postId: modalPostId,
          userId: userData?.id,
          note: modalNote,
        },
        userToken
      );
      if (res) {
        await refreshData();
        Alert.alert("Thành công", res.errMessage || "Chặn bài đăng thành công");
      } else {
        Alert.alert("Thất bại", res.errMessage || "Lỗi khi chặn bài đăng");
      }
    } catch (error) {
      console.error("Error banning post:", error);
      Alert.alert("Thất bại", "Lỗi khi chặn bài đăng");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setModalNote("");
    }
  };

  const handleActivePost = async () => {
    setIsLoading(true);
    try {
      const res = await activePostService(
        {
          id: modalPostId,
          userId: userData?.id,
          note: modalNote,
        },
        userToken
      );
      if (res) {
        await refreshData();
        Alert.alert(
          "Thành công",
          res.errMessage || "Mở lại bài đăng thành công"
        );
      } else {
        Alert.alert("Thất bại", res.errMessage || "Lỗi khi mở lại bài đăng");
      }
    } catch (error) {
      console.error("Error activating post:", error);
      Alert.alert("Thất bại", "Lỗi khi mở lại bài đăng");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setModalNote("");
    }
  };

  const handleAcceptPost = async (statusCode = "PS2") => {
    setIsLoading(true);
    try {
      const postDetail = await getDetailPostById(modalPostId, userToken);
      if (!postDetail || !postDetail.data) {
        throw new Error("Không thể lấy chi tiết bài đăng");
      }
      const categoryJobCode = postDetail?.data?.categoryJobCode;
      if (!categoryJobCode) {
        throw new Error("Không tìm thấy categoryJobCode");
      }
      const users = await getUsersByCategory(categoryJobCode, userToken);
      const payload = {
        subject: `${postDetail?.data?.nameCompanyValue} vừa đăng bài tuyển dụng với vị trí ${postDetail?.data?.name}.`,
        image: postDetail?.data?.thumbnailCompanyValue,
        message: `${postDetail?.data?.nameCompanyValue} vừa đăng bài tuyển dụng với vị trí ${postDetail?.data?.name}.`,
        attachedUrl: `/detail-job/${postDetail?.data?.id}`,
        sender: "ADMIN",
        userId: users?.result,
      };
      const res = await acceptPostService(
        {
          id: modalPostId,
          statusCode,
          note: modalNote,
          userId: userData?.id,
        },
        userToken
      );
      if (res) {
        await sendUserNotification(payload, userToken);
        await refreshData();
        Alert.alert(
          "Thành công",
          res.errMessage || "Xử lý bài đăng thành công"
        );
      } else {
        Alert.alert("Thất bại", res.errMessage || "Lỗi khi xử lý bài đăng");
      }
    } catch (error) {
      console.error("Error accepting post:", error);
      Alert.alert("Thất bại", "Lỗi khi xử lý bài đăng");
    } finally {
      setIsLoading(false);
      setModalVisible(false);
      setModalNote("");
    }
  };

  const confirmPost = (id) => {
    setModalPostId(id);
    setModalAction(() => () => handleAcceptPost("PS1"));
    setModalVisible(true);
  };

  const refreshData = async () => {
    try {
      let arrData = [];
      if (userData?.codeRoleAccount === "ADMIN") {
        arrData = await getAllPostByRoleAdminService(
          {
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            search: search.trim(),
            censorCode,
          },
          userToken
        );
      } else {
        arrData = await getAllPostByAdminService(
          {
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            idCompany: userData?.idCompany,
            search: search.trim(),
            censorCode,
          },
          userToken
        );
      }
      if (arrData) {
        setDataPost(arrData.content || []);
        setTotal(arrData.totalElements);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const renderPostItem = ({ item, index }) => {
    const date = moment.unix(item.timeEnd / 1000).format("DD/MM/YYYY");
    return (
      <View style={styles.postItem}>
        <Text style={styles.postText}>
          {index + 1 + numberPage * PAGINATION.pagerow}
        </Text>
        <Text style={styles.postText}>{item.id}</Text>
        <Text style={styles.postText}>{item.postName}</Text>
        {userData?.codeRoleAccount === "ADMIN" && (
          <Text style={styles.postText}>{item.companyName}</Text>
        )}
        <Text style={styles.postText}>{item.fullName}</Text>
        <Text style={styles.postText}>{date}</Text>
        <Text
          style={[
            styles.statusText,
            item.statusCode === "PS1"
              ? styles.statusSuccess
              : item.statusCode === "PS3"
              ? styles.statusWarning
              : styles.statusDanger,
          ]}
        >
          {item.statusValue}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push(`/note/${item.id}`)}>
            <Text style={styles.actionText}>Chú thích</Text>
          </TouchableOpacity>
          {(userData?.codeRoleAccount === "COMPANY" ||
            userData?.codeRoleAccount === "EMPLOYER") && (
            <TouchableOpacity
              onPress={() => router.push(`/list-cv/${item.id}`)}
            >
              <Text style={styles.actionText}>Xem CV nộp</Text>
            </TouchableOpacity>
          )}
          {item.statusCode !== "PS4" && (
            <TouchableOpacity
              onPress={() => router.push(`/edit-post/${item.id}`)}
            >
              <Text style={styles.actionText}>
                {userData?.codeRoleAccount === "ADMIN" ||
                userData?.codeRoleAccount === "EMPLOYER"
                  ? "Xem chi tiết"
                  : "Sửa"}
              </Text>
            </TouchableOpacity>
          )}
          {userData?.codeRoleAccount === "ADMIN" && (
            <>
              {item.statusCode === "PS1" ? (
                <TouchableOpacity
                  onPress={() => {
                    setModalPostId(item.id);
                    setModalAction(() => handleBanPost);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.actionText}>Chặn</Text>
                </TouchableOpacity>
              ) : item.statusCode === "PS4" ? (
                <TouchableOpacity
                  onPress={() => {
                    setModalPostId(item.id);
                    setModalAction(() => handleActivePost);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.actionText}>Mở lại</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity onPress={() => confirmPost(item.id)}>
                    <Text style={styles.actionText}>Duyệt</Text>
                  </TouchableOpacity>
                  {item.statusCode !== "PS2" && (
                    <TouchableOpacity
                      onPress={() => {
                        setModalPostId(item.id);
                        setModalAction(() => () => handleAcceptPost("PS2"));
                        setModalVisible(true);
                      }}
                    >
                      <Text style={styles.actionText}>Từ chối</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Danh sách bài đăng</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={
              userData?.codeRoleAccount === "ADMIN"
                ? "Nhập tên/mã bài đăng, tên công ty"
                : "Nhập tên/mã bài đăng"
            }
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearch(search.trim())}
          >
            <Text style={styles.searchButtonText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.censorFilter}>
          <Text style={styles.label}>Loại trạng thái:</Text>
          <Picker
            selectedValue={censorCode}
            onValueChange={handleOnChangeCensor}
            style={styles.picker}
          >
            {censorOptions.map((option, index) => (
              <Picker.Item
                key={index}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.totalText}>Số lượng bài viết: {total}</Text>

      <FlatList
        data={dataPost}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có dữ liệu</Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, numberPage === 0 && styles.disabledButton]}
          onPress={() => numberPage > 0 && handleChangePage(numberPage - 1)}
          disabled={numberPage === 0}
        >
          <Text style={styles.pageButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Trang {numberPage + 1} / {count}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageButton,
            numberPage >= count - 1 && styles.disabledButton,
          ]}
          onPress={() =>
            numberPage < count - 1 && handleChangePage(numberPage + 1)
          }
          disabled={numberPage >= count - 1}
        >
          <Text style={styles.pageButtonText}>Tiếp</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalAction === handleBanPost
                ? "Chặn bài đăng"
                : modalAction === handleActivePost
                ? "Mở lại bài đăng"
                : "Từ chối bài đăng"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={modalNote}
              onChangeText={setModalNote}
              placeholder="Nhập ghi chú (nếu có)"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={modalAction}
              >
                <Text style={styles.modalButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setModalNote("");
                }}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
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
    flex: 1,
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  censorFilter: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    fontSize: 16,
    color: "#333",
  },
  totalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  postItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  postText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusSuccess: {
    color: "#28a745",
  },
  statusWarning: {
    color: "#ffc107",
  },
  statusDanger: {
    color: "#dc3545",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  actionText: {
    color: "#4B49AC",
    fontSize: 14,
    marginRight: 10,
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  paginationContainer: {
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
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManagePost;
