import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { getListJob } from "../../api/jobApi";
import moment from "moment";
import "moment/locale/vi";

const JobItem = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSplitTime = (time) => {
    const now = moment();
    const postTime = moment(new Date(+time));
    const diffInYears = now.diff(postTime, "years");
    const diffInMonths = now.diff(postTime, "months");
    const diffInDays = now.diff(postTime, "days");
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (postTime.isAfter(now)) {
      return "Đăng sau ...";
    }

    if (diffInYears >= 1) {
      return `đăng ${diffInYears} năm trước`;
    } else if (diffInMonths >= 1) {
      return `đăng ${diffInMonths} tháng trước`;
    } else if (diffInWeeks >= 1) {
      return `đăng ${diffInWeeks} tuần trước`;
    } else if (diffInDays >= 1) {
      return `đăng ${diffInDays} ngày trước`;
    } else {
      const diffInHours = now.diff(postTime, "hours");
      if (diffInHours > 0) {
        return `đăng ${diffInHours} giờ trước`;
      } else {
        return "Đăng vừa xong";
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListJob();
        setData(response.content || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const ListJob = ({ item = {} }) => {
    return (
      <TouchableOpacity onPress={() => router.push(`/detailjob/${item.id}`)}>
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.contentContainer}>
            <View style={styles.itemTitle}>
              <Text
                style={styles.textName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.postDetailData?.name || "N/A"}
              </Text>
            </View>
            <View style={styles.task}>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textcateJob}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <Foundation name="torso-business" size={13} color="white" />{" "}
                  {item.postDetailData?.jobLevelPostData?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textExJob}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome5 name="business-time" size={13} color="white" />{" "}
                  {item.postDetailData?.expTypePostData?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textMoney}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome5
                    name="money-bill-wave"
                    size={13}
                    color="white"
                  />{" "}
                  {item.postDetailData?.salaryTypePostData?.value || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.task}>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textAdd}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome5 name="map-marker-alt" size={13} color="white" />{" "}
                  {item.postDetailData?.provincePostData?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textWorkJob}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome5 name="user-clock" size={13} color="white" />{" "}
                  {item.postDetailData?.workTypePostData?.value || "N/A"}
                </Text>
              </View>
              <View style={styles.taskItem}>
                <Text
                  style={styles.textSex}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome name="intersex" size={13} color="white" />{" "}
                  {item.postDetailData?.genderPostData?.value || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.timepost}>
              <Text style={styles.textTime}>
                {handleSplitTime(item.timePost)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.label}>
        <Text style={styles.title}>#Top Công Việc Tuyển Dụng</Text>
        <TouchableOpacity onPress={() => router.push("(tabs)/job")}>
          <Text style={styles.subtitle}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListJob item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    marginTop: 5,
    color: "#4682B4",
    fontWeight: "600",
  },
  listContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  itemContainer: {
    width: 340,
    height: 350,
    flexDirection: "column",
    marginRight: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  itemTitle: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  textName: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    flexWrap: "wrap",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  taskItem: {
    width: "33%",
    minWidth: 0,
  },
  textAdd: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#28A745",
    borderWidth: 1,
    borderColor: "#1e7e34",
  },
  textMoney: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#007BFF",
    borderWidth: 1,
    borderColor: "#0056b3",
  },
  textSex: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#6F42C1",
    borderWidth: 1,
    borderColor: "#5a32a3",
  },
  textcateJob: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
    borderWidth: 1,
    borderColor: "#2a7ab0",
  },
  textExJob: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#8B4513",
    borderWidth: 1,
    borderColor: "#6f3a10",
  },
  textWorkJob: {
    padding: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "white",
    textAlign: "center",
    backgroundColor: "#FFC107",
    borderWidth: 1,
    borderColor: "#d39e00",
  },
  timepost: {
    alignItems: "center",
  },
  textTime: {
    color: "#4682B4",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default JobItem;
