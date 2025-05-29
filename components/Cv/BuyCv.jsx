import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

import { AuthContext } from "../AuthContext";
import { getAllPackageCV, getPaymentLinkCv } from "../../api/CvApi";

const BuyCv = () => {
  const { userData, userToken } = useContext(AuthContext);
  const router = useRouter();
  const [inputValues, setInputValues] = useState({
    amount: 1,
    packageCvId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataPackage, setDataPackage] = useState([]);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const handleOnChangePackage = (value) => {
    const item = dataPackage.find((item) => item.id == value);
    if (item) {
      setPrice(item.price);
      setTotal(item.price * inputValues.amount);
      setInputValues({
        ...inputValues,
        packageCvId: item.id,
      });
    }
  };

  const handleOnChangeAmount = (value) => {
    const amount = parseInt(value) || 1;
    setInputValues({
      ...inputValues,
      amount: amount,
    });
    setTotal(amount * price);
  };

  const handleBuy = async () => {
    if (!inputValues.packageCvId || inputValues.amount < 1) {
      Alert.alert("Lỗi", "Vui lòng chọn gói và nhập số lượng hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getPaymentLinkCv(
        inputValues.packageCvId,
        inputValues.amount,
        userToken
      );
      if (res.errCode === 0) {
        const data = {
          packageCvId: inputValues.packageCvId,
          amount: inputValues.amount,
          userId: userData.id,
        };
        Linking.openURL(res.link);
      } else {
        Alert.alert("Lỗi", res.errMessage);
      }
    } catch (error) {
      console.log("Error in handleBuy:", error);
      Alert.alert("Lỗi", "Không thể tạo liên kết thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackagePost = async () => {
    try {
      const res = await getAllPackageCV(userToken);
      if (res && res.data && res.data.length > 0) {
        setDataPackage(res.data);
        setInputValues({
          ...inputValues,
          packageCvId: res.data[0].id,
        });
        setPrice(res.data[0].price);
        setTotal(res.data[0].price * inputValues.amount);
      } else {
        setDataPackage([]);
        Alert.alert("Thông báo", "Không có gói tìm ứng viên nào");
      }
    } catch (error) {
      console.log("Error fetching packages:", error);
      setDataPackage([]);
      Alert.alert("Lỗi", "Không thể tải danh sách gói tìm ứng viên");
    }
  };

  useEffect(() => {
    fetchPackagePost();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>Mua lượt tìm ứng viên</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Các gói tìm ứng viên</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={inputValues.packageCvId}
                  style={styles.picker}
                  onValueChange={(value) => handleOnChangePackage(value)}
                >
                  {dataPackage.length > 0 ? (
                    dataPackage.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.id}
                      />
                    ))
                  ) : (
                    <Picker.Item label="Không có gói nào" value="" />
                  )}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Đơn giá</Text>
              <Text style={styles.text}>{price} USD</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số lượng</Text>
              <TextInput
                style={styles.input}
                value={String(inputValues.amount)}
                onChangeText={(text) => handleOnChangeAmount(text)}
                keyboardType="numeric"
                placeholder="Nhập số lượng"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tổng tiền</Text>
              <Text style={styles.text}>{total} USD</Text>
            </View>

            <TouchableOpacity
              style={styles.buyButton}
              onPress={handleBuy}
              disabled={isLoading}
            >
              <Text style={styles.buyButtonText}>Mua</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  card: {
    elevation: 2,
    marginBottom: 10,
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    color: "#333",
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  buyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BuyCv;
