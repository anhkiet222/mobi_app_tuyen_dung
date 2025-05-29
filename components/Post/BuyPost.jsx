import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../AuthContext";
import { getPackageByType, getPaymentLink } from "../../api/userApi";

const BuyPost = () => {
  const { userData, userToken } = useContext(AuthContext);
  const [inputValues, setInputValues] = useState({
    amount: 1,
    packageId: "",
    isHot: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataPackage, setDataPackage] = useState([]);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchPackagePost = async (isHot) => {
    try {
      const res = await getPackageByType(isHot, userToken);
      setDataPackage(res.data || []);
      if (res.data && res.data.length > 0) {
        setInputValues({
          ...inputValues,
          isHot,
          packageId: res.data[0].id,
        });
        setPrice(res.data[0].price);
        setTotal(res.data[0].price * inputValues.amount);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể lấy danh sách gói bài viết");
    }
  };

  useEffect(() => {
    fetchPackagePost(0);
  }, []);

  const handleOnChangeType = (value) => {
    setInputValues({ ...inputValues, isHot: value });
    fetchPackagePost(value);
  };

  const handleOnChangePackage = (value) => {
    const item = dataPackage.find((pkg) => pkg.id === value);
    setPrice(item.price);
    setTotal(item.price * inputValues.amount);
    setInputValues({
      ...inputValues,
      packageId: item.id,
    });
  };

  const handleOnChangeAmount = (value) => {
    const amount = parseInt(value) || 1;
    setInputValues({
      ...inputValues,
      amount,
    });
    setTotal(amount * price);
  };

  const handleBuy = async () => {
    if (!userData) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để thực hiện mua hàng");
      return;
    }
    setIsLoading(true);
    try {
      const res = await getPaymentLink(
        inputValues.packageId,
        inputValues.amount,
        userToken
      );
      if (res.errCode === 0) {
        await Linking.openURL(res.link);
      } else {
        Alert.alert("Lỗi", res.errMessage || "Không thể tạo link thanh toán");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thực hiện thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mua lượt đăng bài viết</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Loại lượt đăng bài viết:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={inputValues.isHot}
            onValueChange={handleOnChangeType}
            style={styles.picker}
          >
            <Picker.Item label="Bài viết bình thường" value={0} />
            <Picker.Item label="Bài viết nổi bật" value={1} />
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Các gói bài viết:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={inputValues.packageId}
            onValueChange={handleOnChangePackage}
            style={styles.picker}
          >
            {dataPackage.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.id} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Đơn giá:</Text>
        <Text style={styles.value}>{price} USD</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Số lượng:</Text>
        <TextInput
          style={styles.input}
          value={inputValues.amount.toString()}
          onChangeText={handleOnChangeAmount}
          keyboardType="numeric"
          placeholder="Nhập số lượng"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.value}>{total} USD</Text>
      </View>

      <TouchableOpacity
        style={styles.buyButton}
        onPress={handleBuy}
        disabled={isLoading}
      >
        <Text style={styles.buyButtonText}>Mua</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  pickerContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  picker: {
    height: 50,
    color: "#333",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: "#333",
    padding: 10,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BuyPost;
