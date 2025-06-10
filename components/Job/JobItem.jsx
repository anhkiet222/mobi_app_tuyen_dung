import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import FilterOverlay from "./FilterOverlay";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FilterJob } from "../../api/jobApi";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "moment/locale/vi";
import JobList from "./JobList";

const JobItem = () => {
  const router = useRouter();
  const [post, setPost] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [isEnd, setIsEnd] = useState(false);
  const [filters, setFilters] = useState({
    categoryJobCode: "",
    categoryJoblevelCode: [],
    salaryJobCode: [],
    experienceJobCode: [],
    categoryWorktypeCode: [],
    addressCode: [],
  });
  const flatListRef = useRef(null);

  const loadPost = useCallback(
    async (reset = false, currentFilters = filters) => {
      if (isLoading || isLoadingMore) return;

      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      let params = {
        offset: reset ? 0 : page,
        limit: 10,
        name: search.trim() || null,
        ...currentFilters,
      };

      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(",");
        }
      });

      try {
        const response = await FilterJob(params);
        if (response && response.content) {
          if (reset) {
            setPost(response.content);
            setPage(1);
          } else {
            setPost((prevPosts) => [...prevPosts, ...response.content]);
            setPage((prevPage) => prevPage + 1);
          }
          setCount(response.totalElements);
          setIsEnd(response.content.length < 10);
        } else {
          setPost([]);
          setIsEnd(true);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        if (reset) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [isLoading, isLoadingMore, page, search, filters]
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

  const applyFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      loadPost(true, newFilters);
    },
    [loadPost]
  );

  const handlePress = useCallback((id) => {
    router.push(`/detailjob/${id}`);
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
              placeholder="Tìm kiếm công việc..."
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
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <MaterialCommunityIcons
              name="filter-menu"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={post}
        renderItem={({ item }) => (
          <JobList post={[item]} handlePress={handlePress} />
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
      <FilterOverlay
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
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

export default JobItem;
