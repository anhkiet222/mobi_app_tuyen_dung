import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FilterJob } from "../../api/jobApi";
import JobList from "../../components/Job/JobList";
import Ionicons from "@expo/vector-icons/Ionicons";

const JobListByCategory = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { category, code } = useLocalSearchParams();
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [post, setPost] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category || "Jobs",
      headerTitleAlign: "center",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
      ),
    });
    loadPost(true);
  }, [code]);

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
        categoryJobCode: code,
      };

      try {
        const response = await FilterJob(params);
        if (reset) {
          setPost(response.content);
          setPage(1);
        } else {
          setPost((prevPosts) => [...prevPosts, ...response.content]);
          setPage((prevPage) => prevPage + 1);
        }
        setCount(response.totalElements);
        setIsEnd(response.content.length < 10);
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
    [code, page, isLoading, isLoadingMore]
  );

  const handleLoadMore = useCallback(() => {
    if (!isEnd && !isLoading && !isLoadingMore) {
      loadPost(false);
    }
  }, [isEnd, isLoading, isLoadingMore]);

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
        <View style={styles.emptyContainer}>
          <Text>Không tìm thấy việc làm nào cho danh mục này.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
  },
});

export default JobListByCategory;
