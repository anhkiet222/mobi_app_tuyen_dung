import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import NotePost from "../../components/Post/NotePost";

const ListNote = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Danh sách các ghi chú bài viết",
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
      <NotePost />
    </>
  );
};

export default ListNote;
