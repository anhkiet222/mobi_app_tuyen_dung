import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getCompany } from "../../api/companyApi";
import CompanyList from "./CompanyList";

const CompanyItem = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [post, setPost] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  const loadPost = async (reset = false) => {
    if (loading || loadingMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    let params = {
      offset: reset ? 0 : page,
      limit: 10,
      search: search ? search : null,
    };

    try {
      const response = await getCompany(params);
      if (reset) {
        setPost(response);
      } else {
        setPost((prevPosts) => [...prevPosts, ...response]);
      }
      setCount(response.totalElements);
      if (response.length < 10) {
        setIsEnd(true);
      } else {
        setPage((prevPage) => prevPage + 1);
        setIsEnd(false);
      }
    } catch (error) {
      console.error("Error fetching feature data", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  const handleSearch = () => {
    loadPost(true);
  };

  const handleLoadMore = () => {
    if (!isEnd && !loading && !loadingMore) {
      loadPost();
    }
  };
  const handlePress = (id) => {
    router.push(`/detailcompany/${id}`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "white",
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
        }}
      >
        <View style={styles.searchContainer}>
          <View style={styles.search}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm công ty..."
              placeholderTextColor="gray"
              value={search}
              onChangeText={setSearch}
              returnKeyType="Tìm"
              onSubmitEditing={handleSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearIconContainer}
                onPress={() => setSearch("")}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {post.length === 0 && !loadingMore && loading && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Không có dữ liệu tìm kiếm</Text>
        </View>
      )}

      <CompanyList
        post={post}
        handleLoadMore={handleLoadMore}
        handlePress={handlePress}
        loading={loadingMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  searchContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 15,
  },
  userIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  search: {
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: "black",
    marginRight: 10,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 3,
  },
  clearIconContainer: {
    marginLeft: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
  },
});
export default CompanyItem;
