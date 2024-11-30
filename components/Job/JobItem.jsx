import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Text,
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
  const [loading, setLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);
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

  const loadPost = async (reset = false, currentFilters = filters) => {
    if (loading || loadingJob) return;

    if (reset) {
      setLoading(true);
    } else {
      setLoadingJob(true);
    }

    let params = {
      offset: reset ? 0 : page,
      limit: 10,
      name: search ? search : null,
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
        } else {
          setPost((prevPosts) => [...prevPosts, ...response.content]);
        }
        setCount(response.totalElements);
        if (response.content.length < 10) {
          setIsEnd(true);
        } else {
          setPage((prevPage) => prevPage + 1);
          setIsEnd(false);
        }
      } else {
        console.error("No data found in response.content");
      }
    } catch (error) {
      console.error("Error fetching feature data", error);
    } finally {
      setLoading(false);
      setLoadingJob(false);
    }
  };

  const handleSearch = () => {
    loadPost(true);
  };

  const handleLoadMore = () => {
    if (!isEnd && !loading && !loadingJob) {
      loadPost();
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    loadPost(true, newFilters);
  };
  const handlePress = useCallback((id) => {
    router.push(`/detailjob/${id}`);
  });

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
              placeholder="Tìm kiếm công việc..."
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
      {post.length === 0 && !loadingJob && loading && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Không có dữ liệu tìm kiếm</Text>
        </View>
      )}
      <JobList
        post={post}
        loading={loadingJob}
        handleLoadMore={handleLoadMore}
        handlePress={handlePress}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
  }
});

export default JobItem;
