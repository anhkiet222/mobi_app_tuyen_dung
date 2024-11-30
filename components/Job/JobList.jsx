import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import moment from "moment";

const JobList = React.memo(({ post, loading, handleLoadMore, handlePress }) => {
  const handleSplitTime = (time) => {
    const now = moment();
    const postTime = moment(new Date(+time));
    const diffInYears = now.diff(postTime, "years");
    const diffInMonths = now.diff(postTime, "months");
    const diffInDays = now.diff(postTime, "days");
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (postTime.isAfter(now)) {
      const diffInFutureDays = postTime.diff(now, "days");
      const diffInFutureWeeks = Math.floor(diffInFutureDays / 7);
      const diffInFutureMonths = postTime.diff(now, "months");
      const diffInFutureYears = postTime.diff(now, "years");

      if (diffInFutureDays === 1) {
        return "Hết hạn vào ngày mai";
      } else if (diffInFutureWeeks === 1) {
        return "Hết hạn vào tuần sau";
      } else if (diffInFutureMonths === 1) {
        return "Hết hạn vào tháng tới";
      } else if (diffInFutureYears === 1) {
        return "Hết hạn vào năm sau";
      } else {
        return `Hết hạn vào ${postTime.format("DD-MM-YYYY")}`;
      }
    }

    if (diffInYears >= 1) {
      return `Đã hết hạn ${diffInYears} năm trước`;
    } else if (diffInMonths >= 1) {
      return `Đã hết hạn ${diffInMonths} tháng trước`;
    } else if (diffInWeeks >= 1) {
      return `Đã hết hạn ${diffInWeeks} tuần trước`;
    } else if (diffInDays >= 1) {
      return `Đã hết hạn ${diffInDays} ngày trước`;
    } else {
      const diffInHours = now.diff(postTime, "hours");
      if (diffInHours > 0) {
        return `Đã hết hạn ${diffInHours} giờ trước`;
      } else {
        return "Hết hạn vừa xong";
      }
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={post}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.id)}>
            <View style={styles.itemContainer}>
              <View style={styles.topContainer}>
                <View style={styles.img}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.title}>
                  <View style={styles.itemTitle}>
                    <Text style={styles.textName}>
                      {item.postDetailData.name}
                    </Text>
                  </View>
                  <View style={styles.task}>
                    <Text style={styles.textcateJob}>
                      <Foundation
                        name="torso-business"
                        size={13}
                        color="white"
                      />{" "}
                      {item.postDetailData.jobLevelPostData.value}
                    </Text>
                    <Text style={styles.textExJob}>
                      <FontAwesome5
                        name="business-time"
                        size={13}
                        color="white"
                      />{" "}
                      {item.postDetailData.expTypePostData.value}
                    </Text>
                    <Text style={styles.textMoney}>
                      <FontAwesome5
                        name="money-bill-wave"
                        size={13}
                        color="white"
                      />{" "}
                      {item.postDetailData.salaryTypePostData.value}
                    </Text>
                  </View>
                  <View style={styles.task}>
                    <Text style={styles.textAdd}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={13}
                        color="white"
                      />{" "}
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
                </View>
              </View>
              <View style={styles.timepost}>
                <Text style={styles.textTime}>
                  {handleSplitTime(item.timePost)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  topContainer: {
    flexDirection: "row",
    padding: 10,
  },
  img: {
    width: "30%",
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "center",
  },
  title: {
    width: "70%",
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 15,
  },
  itemTitle: {
    marginTop: 7,
    marginRight: 5,
  },
  textName: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  textAdd: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#28A745",
  },
  textMoney: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#FFC107",
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
    justifyContent: "space-between",
    marginTop: 10,
  },
  textcateJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
  },
  textExJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#8B4513",
  },
  textWorkJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#007BFF",
  },
  timepost: {
    paddingBottom: 5,
  },
  textTime: {
    textAlign: "center",
    color: "blue",
  },
});

export default JobList;
