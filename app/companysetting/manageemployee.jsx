import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import ManageEmployer from "../../components/User/ManageEmployer";

const ManageEmployee = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Quản lý nhân viên",
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
      <ManageEmployer />
    </>
  );
};

export default ManageEmployee;
