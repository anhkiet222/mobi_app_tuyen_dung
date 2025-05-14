import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import EmployerInfo from "../../components/User/EmployerInfo";

const Userinfo = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Thông tin",
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
      <EmployerInfo />
    </>
  );
};

export default Userinfo;
