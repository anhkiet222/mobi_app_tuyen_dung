import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getAllListCvByPostService,
  getDetailCvServicebyAdmin,
  getDetailPostByIdService,
} from "../../api/postApi";
import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";

const ListCv = () => {
  const { userToken } = useContext(AuthContext);
  const [dataCv, setDataCv] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState(0);
  const [post, setPost] = useState("");
  const { postId } = useLocalSearchParams();
  const router = useRouter();

  const fetchPost = async (idCv) => {
    try {
      const res = await getDetailCvServicebyAdmin(idCv, userToken);
      if (res && res?.data?.code === 200) {
        setPost(res.data.result.name || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (postId && userToken) {
      const fetchData = async () => {
        try {
          const arrData = await getDetailPostByIdService(
            {
              limit: PAGINATION.pagerow,
              offset: 0,
              postId,
            },
            userToken
          );
          if (arrData) {
            setDataCv(arrData.result.content || []);
            setCount(
              Math.ceil(arrData.result.totalElements / PAGINATION.pagerow)
            );
            if (arrData.result.content.length > 0) {
              await fetchPost(arrData.result.content[0].idCv);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [postId, userToken]);

  const handleChangePage = async (newPage) => {
    if (userToken) {
      setNumberPage(newPage);
      try {
        const arrData = await getAllListCvByPostService(
          {
            limit: PAGINATION.pagerow,
            offset: newPage * PAGINATION.pagerow,
            postId,
          },
          userToken
        );
        if (arrData) {
          const combinedData = arrData.data.map((cv, index) => ({
            ...cv,
            matchPercentage:
              arrData.matchPercentage[index]?.matchPercentage || "0%",
            phoneNumber: arrData.matchPercentage[index]?.phoneNumber || "N/A",
          }));
          setDataCv(combinedData);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderCvItem = ({ item, index }) => (
    <View style={styles.cvItem}>
      <Text style={styles.cvText}>
        Tên: {item.firstName + " " + item.lastName}
      </Text>
      <Text style={styles.cvText}>SĐT: {item.phoneNumber}</Text>
      <Text style={styles.cvText}>Trạng thái: {item.status}</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push(`/admin/admin-cv/${item.idCv}`)}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>Xem CV</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {post && <Text style={styles.postTitle}>{post}</Text>}

      <FlatList
        data={dataCv}
        renderItem={renderCvItem}
        keyExtractor={(item, index) => index.toString()}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
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
  actionButton: {
    backgroundColor: "#4B49AC",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
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
});

export default ListCv;
