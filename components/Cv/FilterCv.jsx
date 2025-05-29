import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { getAllSkillByJobCode } from "../../api/jobApi";
import { getDetailCompanyByUserId } from "../../api/userApi";
import { getFilterCvUV } from "../../api/CvApi";
import { useFetchDataExpType } from "../../hooks/useFetchDataExpType";
import { useFetchDataJobLocation } from "../../hooks/useFetchDataJobLocation";
import { useFetchDataJobType } from "../../hooks/useFetchDataJobType";
import { useFetchDataSalaryType } from "../../hooks/useFetchDataSalaryType";
import { AuthContext } from "../AuthContext";
import { PAGINATION } from "../../constants/Pagination";

const FilterCv = () => {
  const { userData, userToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [dataCv, setDataCv] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState({
    categoryJobCode: "",
    experienceJobCode: "",
    listSkills: [],
    provinceCode: "",
    salaryCode: "",
  });
  const [tempInputValue, setTempInputValue] = useState(inputValue);
  const [listSkills, setListSkills] = useState([]);
  const [isHiddenPercent, setIsHiddenPercent] = useState(true);
  const [companySeeAllow, setCompanySeeAllow] = useState({
    free: 0,
    notFree: 0,
  });
  const router = useRouter();

  let { dataJobLocation: dataProvince } = useFetchDataJobLocation();
  let { dataExpType: dataExp } = useFetchDataExpType();
  let { dataSalaryType: dataSalary } = useFetchDataSalaryType();
  let { dataJobType: listdataJobType } = useFetchDataJobType();

  dataProvince = [
    { value: "", label: "Chọn khu vực", type: "provinceCode" },
    ...(dataProvince || []).map((item) => ({
      value: item.code,
      label: item.value,
      type: "provinceCode",
    })),
  ];

  dataExp = [
    { value: "", label: "Chọn kinh nghiệm", type: "experienceJobCode" },
    ...(dataExp || []).map((item) => ({
      value: item.code,
      label: item.value,
      type: "experienceJobCode",
    })),
  ];

  dataSalary = [
    { value: "", label: "Chọn khoảng lương", type: "salaryCode" },
    ...(dataSalary || []).map((item) => ({
      value: item.code,
      label: item.value,
      type: "salaryCode",
    })),
  ];

  listdataJobType = [
    { value: "", label: "Chọn lĩnh vực", type: "categoryJobCode" },
    ...(listdataJobType || []).map((item) => ({
      value: item.code,
      label: item.value,
      type: "categoryJobCode",
    })),
  ];

  const fetchCompany = async (userId, companyId = null) => {
    try {
      const res = await getDetailCompanyByUserId(userId, companyId, userToken);
      if (res && res.errCode === 0) {
        setCompanySeeAllow({
          free: res.data.allowCvFree,
          notFree: res.data.allowCV,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const listSkillsArray = inputValue.listSkills.filter(
        (item) => typeof item === "number"
      );
      const otherSkills = inputValue.listSkills.filter(
        (item) => typeof item !== "number"
      );
      const data = {
        limit: PAGINATION.pagerow || 5,
        offset: numberPage * (PAGINATION.pagerow || 5),
        categoryJobCode: inputValue.categoryJobCode,
        experienceJobCode: inputValue.experienceJobCode,
        salaryCode: inputValue.salaryCode,
        provinceCode: inputValue.provinceCode,
        listSkills: listSkillsArray,
        otherSkills,
      };

      const arrData = await getFilterCvUV(data, userToken);

      if (arrData && arrData.errCode === 0) {
        setDataCv(arrData.data.content || []);
        setIsHiddenPercent(arrData.isHiddenPercent);
        setCount(Math.ceil(arrData.data.totalElements / PAGINATION.pagerow));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể lấy danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchData();
      if (isFirstTime) {
        fetchCompany(userData.id, userData.idCompany);
        setIsFirstTime(false);
      }
    }
  }, [inputValue, userData, numberPage]);

  const handleChange = useCallback(async (value, type) => {
    if (!value) {
      setTempInputValue((prev) => ({
        ...prev,
        [type]: type === "listSkills" ? [] : "",
      }));
      return;
    }

    if (type === "listSkills") {
      const skillValue = value.toString();
      setTempInputValue((prev) => ({ ...prev, listSkills: [skillValue] }));
    } else if (type === "categoryJobCode") {
      setSkillsLoading(true);
      try {
        const res = await getAllSkillByJobCode(value);
        const skills = [
          { value: "", label: "Chọn kỹ năng" },
          ...(res || []).map((item) => ({
            value: item.id.toString(),
            label: item.name,
          })),
        ];
        setListSkills(skills);
        setTempInputValue((prev) => ({
          ...prev,
          [type]: value,
          listSkills: [],
        }));
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không thể lấy danh sách kỹ năng");
      } finally {
        setSkillsLoading(false);
      }
    } else {
      setTempInputValue((prev) => ({ ...prev, [type]: value }));
    }
  }, []);

  const handleApplyFilter = () => {
    setInputValue(tempInputValue);
    setIsModalVisible(false);
    setNumberPage(0);
  };

  const handleCancelFilter = () => {
    setTempInputValue(inputValue);
    setIsModalVisible(false);
  };

  const handleChangePage = async (newPage) => {
    setNumberPage(newPage);
  };

  const confirmSeeCandidate = (id) => {
    Alert.alert("Xác nhận", "Khi xem bạn sẽ mất 1 lần xem thông tin ứng viên", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: () => router.push(`/detailcandidate/${id}`),
      },
    ]);
  };

  const renderCvItem = ({ item, index }) => {
    const matchPercentage = item.matchPercentage || "0%";
    const percentageValue = +matchPercentage.split("%")[0];
    const badgeStyle =
      percentageValue >= 50
        ? styles.badgeSuccess
        : percentageValue >= 25
        ? styles.badgeWarning
        : styles.badgeDanger;
    const badgeText =
      percentageValue >= 50
        ? "Khá Tốt"
        : percentageValue >= 25
        ? "Tạm chấp nhận"
        : "Tệ";

    return (
      <View style={styles.cvItem}>
        <Text style={styles.cvText}>
          Tên: {item.firstName + " " + item.lastName}
        </Text>
        <Text style={styles.cvText}>Lĩnh vực: {item.jobTypeValue}</Text>
        {!isHiddenPercent && (
          <>
            <Text style={styles.cvText}>Tỉ lệ phù hợp: {matchPercentage}</Text>
            <Text style={[styles.badge, badgeStyle]}>
              Đánh giá: {badgeText}
            </Text>
          </>
        )}
        <TouchableOpacity onPress={() => confirmSeeCandidate(item.userId)}>
          <Text style={styles.actionText}>Xem chi tiết ứng viên</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <View>
            <Text style={styles.companyInfoTitle}>Công ty còn:</Text>
            <Text style={styles.companyInfoText}>
              Số lượt xem miễn phí: {companySeeAllow.free}
            </Text>
            <Text style={styles.companyInfoText}>
              Số lượt xem: {companySeeAllow.notFree}
            </Text>
          </View>
          <View style={styles.viewPostContainer}>
            <TouchableOpacity
              onPress={() => router.push("/companysetting/buycv")}
            >
              <Text style={styles.viewPost}>Mua thêm lượt xem</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setTempInputValue(inputValue);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.filterButtonText}>
            Bộ lọc <AntDesign name="filter" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bộ lọc ứng viên</Text>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Lĩnh vực: <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempInputValue.categoryJobCode}
                    onValueChange={(value) =>
                      handleChange(value, "categoryJobCode")
                    }
                    style={styles.picker}
                  >
                    {listdataJobType.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kinh nghiệm:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempInputValue.experienceJobCode}
                    onValueChange={(value) =>
                      handleChange(value, "experienceJobCode")
                    }
                    style={styles.picker}
                    enabled={!!tempInputValue.categoryJobCode}
                  >
                    {dataExp.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Khoảng lương:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempInputValue.salaryCode}
                    onValueChange={(value) => handleChange(value, "salaryCode")}
                    style={styles.picker}
                    enabled={!!tempInputValue.categoryJobCode}
                  >
                    {dataSalary.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Khu vực làm việc:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tempInputValue.provinceCode}
                    onValueChange={(value) =>
                      handleChange(value, "provinceCode")
                    }
                    style={styles.picker}
                    enabled={!!tempInputValue.categoryJobCode}
                  >
                    {dataProvince.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kỹ năng:</Text>
                <View style={styles.pickerContainer}>
                  {skillsLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="#007bff"
                      style={styles.pickerLoading}
                    />
                  ) : (
                    <Picker
                      selectedValue={tempInputValue.listSkills[0] || ""}
                      onValueChange={(value) =>
                        handleChange(value, "listSkills")
                      }
                      style={styles.picker}
                      enabled={!!tempInputValue.categoryJobCode}
                    >
                      {listSkills.length > 0 ? (
                        listSkills.map((item, index) => (
                          <Picker.Item
                            key={index}
                            label={item.label}
                            value={item.value}
                          />
                        ))
                      ) : (
                        <Picker.Item label="Không có dữ liệu" value="" />
                      )}
                    </Picker>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelFilter}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilter}
              >
                <Text style={styles.applyButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Danh sách ứng viên</Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loading}
        />
      ) : dataCv.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={dataCv}
            renderItem={renderCvItem}
            keyExtractor={(_item, index) => index.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>Không có ứng viên nào phù hợp</Text>
      )}

      {dataCv.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              numberPage === 0 && styles.disabledButton,
            ]}
            onPress={() => numberPage > 0 && handleChangePage(numberPage - 1)}
            disabled={numberPage === 0}
          >
            <Text style={styles.pageButtonText}>Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.pageText}>
            Trang {numberPage + 1} / {count}
          </Text>
          <TouchableOpacity
            style={[
              styles.pageButton,
              numberPage >= count - 1 && styles.disabledButton,
            ]}
            onPress={() =>
              numberPage < count - 1 && handleChangePage(numberPage + 1)
            }
            disabled={numberPage >= count - 1}
          >
            <Text style={styles.pageButtonText}>Tiếp</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
  },
  companyInfo: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewPostContainer: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  viewPost: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  companyInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  companyInfoText: {
    fontSize: 16,
    color: "#666",
  },
  filterButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalScroll: {
    flexGrow: 1,
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
    padding: 5,
  },
  pickerLoading: {
    height: 50,
    justifyContent: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingBottom: 70, // Để lại khoảng trống cho phần phân trang cố định
  },
  cvItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cvText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  badgeSuccess: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  badgeWarning: {
    backgroundColor: "#ffc107",
    color: "#fff",
  },
  badgeDanger: {
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  actionText: {
    color: "#4B49AC",
    fontSize: 14,
    marginTop: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pageText: {
    fontSize: 16,
    color: "#333",
  },
  required: {
    color: "red",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FilterCv;
