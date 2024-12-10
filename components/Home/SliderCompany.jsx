import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
const { width: viewportWidth } = Dimensions.get("window");
import { useRouter } from "expo-router";
import { getListCompany } from "../../api/companyApi";

const SliderCompany = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListCompany();
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setLoading(false);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/detailcompany/${item.id}`)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.label}>
        <Text style={styles.title}>#Các Công Ty Hàng Đầu</Text>
        <TouchableOpacity onPress={() => router.push("(tabs)/company")}>
          <Text style={styles.subtitle}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ padding: 10 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  label: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitle: {
    marginTop: 5,
    color: "#4682B4",
    fontWeight: "medium",
  },
  item: {
    width: viewportWidth * 0.6,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "gray",
  },
});

export default SliderCompany;
