import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { updateImage } from "../../api/userApi";
import { AuthContext } from "../AuthContext";

const DEFAULT_USER_IMAGE =
  "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg?fbclid=IwY2xjawFBAwlleHRuA2FlbQIxMAABHaE053TNouFB_uCoaIiXj56WSPQytGf8ywL1PNzfktyF2TOX7qVMRDhaUw_aem_f65zQPMOofTyGlTMIbierQ";

const EmployerSetting = () => {
  const { userData, setUserData, logout } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setImageUri] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Thông báo", "Đăng xuất thành công.");
    } catch (error) {
      Alert.alert("Lỗi", "Đăng xuất thất bại.");
      console.error("Logout failed:", error);
    }
  };

  const chooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Vui lòng cấp quyền truy cập để chọn ảnh."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await UpImg(result.assets[0].uri);
    }
  };

  const UpImg = async (uri) => {
    if (!uri) {
      Alert.alert("Vui lòng chọn ảnh trước!");
      return;
    }

    setLoading(true);
    try {
      const data = await updateImage(userData.id, uri);
      if (data.code === 200) {
        const updatedUserData = {
          ...userData,
          image: data.result.image,
        };
        setUserData(updatedUserData);
        Alert.alert("Thành công", "Cập nhật ảnh thành công!");
      } else {
        Alert.alert("Thất bại", "Cập nhật ảnh thất bại.");
      }
    } catch (error) {
      Alert.alert("Có lỗi xảy ra khi cập nhật ảnh.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const menuItems = [
    {
      id: "1",
      title: "Thông tin người dùng",
      route: "/companysetting/companyinfo",
      iconComponent: "Ionicons",
      iconName: "person-outline",
    },
    {
      id: "2",
      title: "Quản lý công ty",
      route: "/companysetting/editcompany",
      iconComponent: "AntDesign",
      iconName: "setting",
    },
    {
      id: "3",
      title: "Quản lý nhân viên",
      route: "/companysetting/manageemployee",
      iconComponent: "FontAwesome5",
      iconName: "users-cog",
    },
    {
      id: "4",
      title: "Quản lý ứng tuyển",
      route: "/companysetting/listapplication",
      iconComponent: "Feather",
      iconName: "send",
    },
    {
      id: "5",
      title: "Quản lý bài đăng",
      route: "/companysetting/managepost",
      iconComponent: "MaterialCommunityIcons",
      iconName: "post-outline",
    },
    {
      id: "6",
      title: "Thêm bài đăng mới",
      route: "/companysetting/addpost",
      iconComponent: "MaterialIcons",
      iconName: "post-add",
    },
    {
      id: "7",
      title: "Lịch sử mua gói bài đăng",
      route: "/companysetting/listhistorypost/",
      iconComponent: "MaterialIcons",
      iconName: "history",
    },
    {
      id: "8",
      title: "Tìm kiếm ứng viên",
      route: "/companysetting/findcadidate",
      iconComponent: "MaterialIcons",
      iconName: "person-search",
    },
    {
      id: "9",
      title: "Lịch sử mua gói tìm ứng viên",
      route: "/companysetting/listhistorycv",
      iconComponent: "MaterialIcons",
      iconName: "history",
    },
  ];

  const renderMenuItem = ({ item }) => {
    const IconComponent =
      {
        Ionicons: Ionicons,
        AntDesign: AntDesign,
        FontAwesome5: FontAwesome5,
        MaterialCommunityIcons: MaterialCommunityIcons,
        MaterialIcons: MaterialIcons,
        Feather: Feather,
      }[item.iconComponent] || Ionicons;

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() => router.push(item.route)}
      >
        <IconComponent
          name={item.iconName}
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.listText}>{item.title}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color="#ccc"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={chooseImage}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <View style={{ position: "relative" }}>
              <ImageBackground
                source={{ uri: userData?.image || DEFAULT_USER_IMAGE }}
                style={styles.profileImage}
              >
                <View style={styles.editCircle}>
                  <Text style={styles.editText}>SỬA</Text>
                </View>
              </ImageBackground>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.profileText}>
          Welcome, {userData?.firstName} {userData?.lastName}
        </Text>
        <Text style={styles.profileEmail}>Email: {userData?.email}</Text>
      </View>

      <FlatList
        data={menuItems}
        showsVerticalScrollIndicator={false}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  profileText: {
    fontSize: 23,
    fontWeight: "600",
    color: "#333",
  },
  profileEmail: {
    fontSize: 18,
    color: "#666",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  editCircle: {
    position: "absolute",
    bottom: 0,
    width: 100,
    height: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  listContainer: {
    paddingBottom: 80,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  listText: {
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  arrowIcon: {
    color: "#ccc",
  },
  logoutContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmployerSetting;
