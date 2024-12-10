import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getCategoryJob } from "../../api/jobApi";

const CategoryJob = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategoryJob();
        setData(response);
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
  const ListItem = ({ item }) => {
    return (
      <View style={{ flexDirection: "column", marginRight: 20 }}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/categorylist/${item.value}`,
              params: item.code,
            })
          }
        >
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        </TouchableOpacity>
        <Text style={styles.textitem}>{item.value}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.label}>
        <Text style={styles.title}>#Các nghề nghiệp nổi bật</Text>
        <TouchableOpacity onPress={() => router.push("(tabs)/job")}>
          <Text style={styles.subtitle}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ paddingLeft: 30 }}
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.categoryJobCode}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  image: {
    width: 30,
    height: 30,
  },
  itemContainer: {
    padding: 20,
    backgroundColor: "#EDECFD",
    borderRadius: 99,
    alignItems: "center",
    flexWrap: "wrap",
  },
  textitem: {
    fontSize: 12,
    fontWeight: "medium",
    textAlign: "center",
    marginTop: 5,
    flexShrink: 1,
    flexWrap: "wrap",
    width: 70,
  },
});
export default CategoryJob;
