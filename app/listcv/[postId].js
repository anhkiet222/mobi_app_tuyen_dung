import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import ListCv from "../../components/User/ListCv";

const ListNote = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Danh sách CV",
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
      <ListCv />
    </>
  );
};

export default ListNote;
