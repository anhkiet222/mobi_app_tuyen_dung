import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import moment from "moment";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router'
import ReadHTML from './ReadCompanyHTML';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import GroupButton from './GroupButton';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const CompanyDetail = ({ data }) => {
    const router = useRouter();
    const navigation = useNavigation();
    const currentDate = moment();
    return (
        <View style={{ backgroundColor: '#f5f5ef' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: data?.coverImage }}
                        style={styles.img}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.companyCover}>
                    <View style={styles.row}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.companyTitle}>{data?.name}</Text>
                            <Text style={styles.textContent}>Nơi làm việc: {data?.address}</Text>
                            <Text style={{ color: '#595959', fontSize: 16 }}><FontAwesome name="users" size={15} color="#595959" /> {data?.amountEmployer}+ nhân viên</Text>
                        </View>
                    </View>

                </View>
                <View>
                    <GroupButton data={data} />
                </View>
                <View style={styles.detail}>
                    <Text style={styles.title}>Giới thiệu công ty </Text>
                    <ReadHTML data={data} />
                    <Text style={styles.title}>Tuyển dụng</Text>
                    <View>
                        {data?.postData && data?.postData.length > 0 ? (
                            data?.postData.map((item, index) => (
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
                                                    source={{ uri: data?.thumbnail }}
                                                    style={styles.jobImage}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <View style={styles.jobBody}>
                                                <View style={styles.itemTitle}>
                                                    <Text style={styles.jobTitle}>{item.postDetailData.name}</Text>
                                                </View>
                                                <View style={styles.itask}>
                                                    <Text style={styles.itextcateJob}>
                                                        <Foundation name="torso-business" size={13} color="white" /> {item.postDetailData.jobLevelPostData.value}
                                                    </Text>
                                                    <Text style={styles.itextExJob}>
                                                        <FontAwesome5 name="business-time" size={13} color="white" /> {item.postDetailData.expTypePostData.value}
                                                    </Text>
                                                    <Text style={styles.itextMoney}>
                                                        <FontAwesome5 name="money-bill-wave" size={13} color="white" /> {item.postDetailData.salaryTypePostData.value}
                                                    </Text>
                                                </View>
                                                <View style={styles.itask}>
                                                    <Text style={styles.itextAdd}>
                                                        <FontAwesome5 name="map-marker-alt" size={13} color="white" /> {item.postDetailData.provincePostData.value}
                                                    </Text>
                                                    <Text style={styles.itextWorkJob}>
                                                        <FontAwesome5 name="user-clock" size={13} color="white" /> {item.postDetailData.workTypePostData.value}
                                                    </Text>
                                                    <Text style={styles.itextSex}>
                                                        <FontAwesome name="intersex" size={13} color="white" /> {item.postDetailData.genderPostData.value}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={styles.timepost}>
                                            <Text style={styles.textTime}>
                                                {(moment.unix(item.timeEnd / 1000)).isAfter(currentDate)
                                                    ? `Còn ${(moment.unix(item.timeEnd / 1000)).diff(currentDate, 'days')} ngày`
                                                    : "Hết hạn tuyển dụng"}
                                            </Text>
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noPosts}>Không có bài đăng nào</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        padding: 10,
        top: 48,
        left: 6,
        alignItems: 'flex-start',
    },
    circleButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: -20,
        flexDirection: 'row',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: '#f5f5ef'
    },
    companyDetails: {
        flex: 1,
    },
    box: {
        flexDirection: 'row',
        padding: 5,
    },
    itemTitle: {
        marginTop: 7,
        marginRight: 5,
    },
    companyTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
    },
    img: {
        width: '100%',
        height: 340,
    },
    imgJob: {
        width: '30%',
        paddingLeft: 5,
        paddingRight: 5,
        justifyContent:'center',
    },
    detail: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    jobItem: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    jobImage: {
        width: '100%',
        height: 100,
        borderRadius: 15,
        margin: 'auto',
    },
    jobBody: {
        width: '70%',
    },
    jobTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
    },
    deadline: {
        color: '#888888',
        marginBottom: 5,
    },

    noPosts: {
        textAlign: 'center',
        color: '#888888',
        fontStyle: 'italic',
        marginTop: 20,
    },
    textContent: {
        fontSize: 16,
    },
    itextAdd: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#28A745',
    },
    itextMoney: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#FFC107',
    },
    itextSex: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#6F42C1',
    },
    itask: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    itextcateJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#3498DB',
    },
    itextExJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#8B4513',
    },
    itextWorkJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#007BFF',
    },
    timepost: {
        paddingBottom: 5
    },
    textTime: {
        textAlign: 'center',
        color: 'blue'
    }
});

export default CompanyDetail;