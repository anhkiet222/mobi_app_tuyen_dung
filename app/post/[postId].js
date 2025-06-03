import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import AddPost from "../../components/Post/AddPost";

const ListNote = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Chỉnh sửa bài đăng",
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

export default ListNote;
