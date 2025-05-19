import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getListNoteByPost } from "../../api/postApi";
import { PAGINATION } from "../../constants/Pagination";
import { AuthContext } from "../AuthContext";

const NotePost = () => {
  const { userToken } = useContext(AuthContext);
  const [dataNotePost, setDataNotePost] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState(0);
  const { postId } = useLocalSearchParams();

  useEffect(() => {
    if (postId) {
      const fetchData = async () => {
        try {
          const arrData = await getListNoteByPost({
            limit: PAGINATION.pagerow,
            offset: 0,
            id: postId,
          });
          if (arrData && arrData.errCode === 0) {
            setDataNotePost(arrData.data || []);
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [postId]);

  const handleChangePage = async (newPage) => {
    setNumberPage(newPage);
    try {
      const arrData = await getListNoteByPost(
        {
          limit: PAGINATION.pagerow,
          offset: newPage * PAGINATION.pagerow,
          id: postId,
        },
        userToken
      );
      if (arrData && arrData.errCode === 0) {
        setDataNotePost(arrData.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNoteItem = ({ item, index }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteText}>
        Tên người ghi nhận: {item.recorderName}
      </Text>
      <Text style={styles.noteText}>Nội dung: {item.noteContent}</Text>
      <Text style={styles.noteText}>
        Thời gian ghi nhận:{" "}
        {moment(item.recordedAt).format("DD-MM-YYYY HH:mm:ss")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dataNotePost}
        renderItem={renderNoteItem}
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

  listContainer: {
    paddingBottom: 20,
  },
  noteItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  noteText: {
    fontSize: 14,
    color: "#333",
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
});

export default NotePost;
