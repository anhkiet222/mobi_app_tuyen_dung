import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import moment from "moment";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { FilterJob } from "../../api/jobApi";
import ReadHTML from "./ReadJobHTML";
import { useRouter } from "expo-router";
import Foundation from "@expo/vector-icons/Foundation";

const JobDetail = React.memo(({ data, handleOpenModal }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const currentDate = moment();
  const endDate = moment.unix(data?.timeEndValue / 1000);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (loading) return;

      setLoading(true);

      let params = {
        offset: 0,
        limit: 5,
        categoryJobCode: data.categoryJobCode,
      };

      try {
        const response = await FilterJob(params);
        setPost(response.content);
      } catch (error) {
        console.error("Error fetching feature data", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, []);
  return (
    <View style={{ backgroundColor: "#f5f5ef" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.circleButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data?.thumbnailCompanyValue }}
            style={styles.img}
            resizeMode="cover"
          />
        </View>

        <View>
          <View style={styles.row}>
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{data?.name}</Text>
              <Text>Nơi làm việc: {data?.addressCompanyValue}</Text>
            </View>
          </View>

          <View style={styles.additionalInfoContainer}>
            <Text style={styles.sectionTitle}>Thông tin công việc</Text>
            <View style={styles.task}>
              <Text style={styles.textcateJob}>
                Ngành: {data?.categoryJobCodeValue}
              </Text>
            </View>
            <View style={styles.task}>
              <Text style={styles.textExJob}>
                Làm việc: {data?.categoryWorktypeCodeValue}
              </Text>
            </View>
            <View style={styles.task}>
              <Text style={styles.textMoney}>
                Lương: {data?.salaryCodeValue}
              </Text>
            </View>
            <View style={styles.task}>
              <Text style={styles.textWorkJob}>
                Kinh nghiệm: {data?.experienceJobCodeValue}
              </Text>
            </View>
            <View style={styles.task}>
              <Text style={styles.textSex}>
                Giới tính: {data?.genderPostCodeValue}
              </Text>
            </View>
            <View style={styles.task}>
              {endDate.isAfter(currentDate) && (
                <LottieView
                  source={require("../../assets/lottie/lightning.json")}
                  autoPlay
                  loop
                  style={styles.lottieBackground}
                />
              )}
              <Text style={styles.hotText}>
                Hạn nộp:{" "}
                {endDate.isAfter(currentDate)
                  ? endDate.format("DD/MM/YYYY")
                  : "Hết hạn tuyển dụng"}
              </Text>
            </View>
          </View>
          <View style={styles.detail}>
            <ReadHTML data={data} />
            <Text style={styles.title}>Các Công Việc Liên Quan</Text>
            <View>
              {post && post.length > 0 ? (
                post.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      router.push(`/detailjob/${item.id}`);
                    }}
                  >
                    <View style={styles.jobItem}>
                      <View style={styles.box}>
                        <View style={styles.imgJob}>
                          <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.jobImage}
                            resizeMode="contain"
                          />
                        </View>
                        <View style={styles.jobBody}>
                          <View style={styles.itemTitle}>
                            <Text style={styles.JobTitle}>
                              {item.postDetailData.name}
                            </Text>
                          </View>
                          <View style={styles.itask}>
                            <Text style={styles.itextcateJob}>
                              <Foundation
                                name="torso-business"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.jobLevelPostData.value}
                            </Text>
                            <Text style={styles.itextExJob}>
                              <FontAwesome5
                                name="business-time"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.expTypePostData.value}
                            </Text>
                            <Text style={styles.itextMoney}>
                              <FontAwesome5
                                name="money-bill-wave"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.salaryTypePostData.value}
                            </Text>
                          </View>
                          <View style={styles.itask}>
                            <Text style={styles.itextAdd}>
                              <FontAwesome5
                                name="map-marker-alt"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.provincePostData.value}
                            </Text>
                            <Text style={styles.itextWorkJob}>
                              <FontAwesome5
                                name="user-clock"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.workTypePostData.value}
                            </Text>
                            <Text style={styles.itextSex}>
                              <FontAwesome
                                name="intersex"
                                size={13}
                                color="white"
                              />{" "}
                              {item.postDetailData.genderPostData.value}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.timepost}>
                        <Text style={styles.textTime}>
                          {moment.unix(item.timeEnd / 1000).isAfter(currentDate)
                            ? `Còn ${moment
                                .unix(item.timeEnd / 1000)
                                .diff(currentDate, "days")} ngày`
                            : "Hết hạn tuyển dụng"}
                        </Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPosts}>
                  Không có công việc nào liên quan
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleOpenModal} style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Ứng tuyển ngay</Text>
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 10,
    width: "100%",
    padding: 10,
    top: 48,
    left: 6,
    alignItems: "flex-start",
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  imageContainer: {
    alignItems: "center",
  },
  detail: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  img: {
    width: "100%",
    height: 340,
  },
  row: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -20,
    flexDirection: "row",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#f5f5ef",
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginLeft: 13,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  additionalInfoContainer: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  companyInfoContainer: {
    padding: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  JobTitle: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  applyButton: {
    position: "absolute",
    zIndex: 10,
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: "#007BFF",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  textName: {
    fontWeight: "bold",
    fontSize: 20,
  },
  textAdd: {
    padding: 5,
    borderRadius: 10,
    fontSize: 20,
    color: "white",
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: "#28A745",
  },
  textMoney: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    fontSize: 20,
    color: "white",
    overflow: "hidden",
    textAlign: "center",
    backgroundColor: "#FFC107",
  },
  textSex: {
    marginTop: 5,
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
    fontSize: 20,
    color: "white",
    overflow: "hidden",
    textAlign: "center",
    backgroundColor: "#6F42C1",
  },
  task: {
    flexDirection: "row",
    paddingLeft: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textcateJob: {
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 20,
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
  },
  textExJob: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 20,
    color: "white",
    textAlign: "center",
    backgroundColor: "#007BFF",
  },
  textWorkJob: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 20,
    color: "white",
    textAlign: "center",
    backgroundColor: "#8B4513",
  },
  lottieBackground: {
    position: "absolute",
    width: 40,
    height: 50,
    top: -20,
    right: 90,
    elevation: 5,
    zIndex: 10,
  },
  hotText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF4500",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  jobItem: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  box: {
    flexDirection: "row",
    padding: 5,
  },
  imgJob: {
    width: "30%",
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: "center",
  },
  jobImage: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    marginBottom: 0,
  },
  jobBody: {
    width: "70%",
  },
  itemTitle: {
    marginTop: 7,
    marginRight: 5,
  },
  timepost: {
    paddingBottom: 5,
  },
  textTime: {
    textAlign: "center",
    color: "blue",
  },
  itask: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  itextAdd: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#28A745",
  },
  itextMoney: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#FFC107",
  },
  itextSex: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#6F42C1",
  },
  itextcateJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#3498DB",
  },
  itextExJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#8B4513",
  },
  itextWorkJob: {
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 10,
    color: "white",
    textAlign: "center",
    backgroundColor: "#007BFF",
  },
});
export default JobDetail;
