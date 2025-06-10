import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const flatListRef = useRef(null);

  const loadPost = useCallback(
    async (reset = false) => {
      if (isLoading || isLoadingMore) return;

      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      let params = {
        offset: reset ? 0 : page,
        limit: 10,
        search: search.trim() || null,
      };

      try {
        const response = await getCompany(params);
        if (response) {
          if (reset) {
            setPost(response.content || response);
            setPage(1);
          } else {
            setPost((prevPosts) => [
              ...prevPosts,
              ...(response.content || response),
            ]);
            setPage((prevPage) => prevPage + 1);
          }
          setCount(response.totalElements || response.length);
          setIsEnd((response.content || response).length < 10);
        } else {
          setPost([]);
          setIsEnd(true);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        if (reset) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [isLoading, isLoadingMore, page, search]
  );

  useEffect(() => {
    loadPost(true);
  }, []);

  const handleSearch = useCallback(() => {
    loadPost(true);
  }, [loadPost]);

  const handleLoadMore = useCallback(() => {
    if (!isEnd && !isLoading && !isLoadingMore) {
      loadPost(false);
    }
  }, [isEnd, isLoading, isLoadingMore, loadPost]);

  const handlePress = useCallback((id) => {
    router.push(`/detailcompany/${id}`);
  }, []);

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    }
    if (isEnd && post.length > 0) {
      return;
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
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
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity
                style={styles.clearIconContainer}
                onPress={() => {
                  setSearch("");
                  handleSearch();
                }}
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
      <FlatList
        ref={flatListRef}
        data={post}
        renderItem={({ item }) => (
          <CompanyList post={[item]} handlePress={handlePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Không có dữ liệu tìm kiếm</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
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
