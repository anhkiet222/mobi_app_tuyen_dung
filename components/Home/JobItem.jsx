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
        setData(response.content);
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
            resizeMode="contain"
          />
          <View style={styles.itemTitle}>
            <Text style={styles.textName}>{item.postDetailData.name}</Text>
          </View>
          <View style={styles.task}>
            <Text style={styles.textcateJob}>
              <Foundation name="torso-business" size={13} color="white" />{" "}
              {item.postDetailData.jobLevelPostData.value}
            </Text>
            <Text style={styles.textExJob}>
              <FontAwesome5 name="business-time" size={13} color="white" />{" "}
              {item.postDetailData.expTypePostData.value}
            </Text>
            <Text style={styles.textMoney}>
              <FontAwesome5 name="money-bill-wave" size={13} color="white" />{" "}
              {item.postDetailData.salaryTypePostData.value}
            </Text>
          </View>
          <View style={styles.task}>
            <Text style={styles.textAdd}>
              <FontAwesome5 name="map-marker-alt" size={13} color="white" />{" "}
              {item.postDetailData.provincePostData.value}
            </Text>
            <Text style={styles.textWorkJob}>
              <FontAwesome5 name="user-clock" size={13} color="white" />{" "}
              {item.postDetailData.workTypePostData.value}
            </Text>
            <Text style={styles.textSex}>
              <FontAwesome name="intersex" size={13} color="white" />{" "}
              {item.postDetailData.genderPostData.value}
            </Text>
          </View>
          <View style={styles.timepost}>
            <Text style={styles.textTime}>
              {handleSplitTime(item.timePost)}
            </Text>
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
      ></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 5,
    color: "#4682B4",
    fontWeight: "medium",
  },
  itemContainer: {
    maxWidth: "300",
    flexDirection: "column",
    marginLeft: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 100,
  },
  itemTitle: {
    marginTop: 7,
  },
  textName: {
    fontWeight: "bold",
    fontSize: 17,
  },
  textAdd: {
    marginRight: 10,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#28A745",
  },
  textMoney: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#007BFF",
  },
  textSex: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#6F42C1",
  },
  task: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textcateJob: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
  },
  textExJob: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#8B4513",
  },
  textWorkJob: {
    marginRight: 10,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#FFC107",
  },
  timepost: {
    paddingTop: 10,
  },
  textTime: {
    color: "blue",
  },
});
export default JobItem;
