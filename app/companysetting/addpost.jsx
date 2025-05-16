import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import AddPost from "../../components/User/AddPost";

const EditCompany = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Thêm bài đăng mới",
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
  });
  return (
    <>
      <AddPost />
    </>
  );
};

export default EditCompany;
