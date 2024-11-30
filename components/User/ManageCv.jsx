import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, SafeAreaView, Alert } from 'react-native';
import { getAllListCvByUserIdService } from '../../api/userApi';
import moment from 'moment';
import { AuthContext } from '../AuthContext';
import { useRouter } from 'expo-router';

const ManageCv = () => {
    const router = useRouter();
    const [dataCv, setDataCv] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingJob, setLoadingJob] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { userData } = useContext(AuthContext);
    const [showPDF, setShowPDF] = useState(false);


    useEffect(() => {
        if (userData) {
            fetchData(userData.id, 0, true);
        }
    }, []);

    const fetchData = async (userId, page, isInitialLoad = false) => {
        if (!hasMore && !isInitialLoad) return;

        isInitialLoad ? setLoading(true) : setLoadingJob(true);
        try {
            const data = await getAllListCvByUserIdService({
                limit: 10,
                offset: page * 10,
                userId: userId
            });
            if (data && data.code === 200) {
                const newData = data.result.content;
                setDataCv(prevData => (isInitialLoad ? newData : [...prevData, ...newData]));
                setHasMore(newData.length > 0);
                setPage(page + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            isInitialLoad ? setLoading(false) : setLoadingJob(false);
        }
    };

    // const closeWebView = () => {
    //     setShowPDF(false);
    // };

    // const handleViewFile = () => {
    //     if (inputValues.file) {
    //         if (inputValues.file.startsWith('data:')) {
    //             setPdfUrl(inputValues.file);
    //         } else {
    //             setPdfUrl(inputValues.file);
    //         }
    //         setShowPDF(true);
    //     } else {
    //         Alert.alert('No file selected');
    //     }
    // };

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Tên công việc: {item.name}</Text>
                <Text style={styles.itemText}>Ngành: {item.valueWorkType}</Text>
                <Text style={styles.itemText}>Chức vụ: {item.valueJobLevel}</Text>
                <Text style={styles.itemText}>Địa chỉ: {item.valueProvince}</Text>
                <Text style={styles.itemText}>Thời gian nộp: {moment(item.createdAtCv).format('DD-MM-YYYY HH:mm:ss')}</Text>
                <Text style={styles.itemText}>Trạng thái: {getStatusText(item.status)}</Text>
                <Text style={styles.itemText}>Thời gian phỏng vấn: {item.interviewTime? moment(item.interviewTime).format('DD-MM-YYYY HH:mm:ss'): 'Chưa rõ'}</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => { router.push(`/detailjob/${item.idPost}`) }}>
                        <Text style={styles.actionText}>Xem công việc</Text>
                    </TouchableOpacity>
                    {/* {showPDF ? (<View style={styles.containerPDF}>
                        <Modal
                            visible={showWebView}
                            animationType="fade"
                            onRequestClose={closeWebView}
                            transparent={false}
                        >
                            <SafeAreaView style={styles.safeArea}>
                                <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
                                    <Ionicons name="close-circle" size={36} color="#f00" />
                                </TouchableOpacity>
                                <View style={styles.webviewContainer}>
                                    <WebView
                                        source={{
                                            html: `
                                    <html>
                                        <body>
                                        <embed src="${pdfUrl}" style="width:100%; height:100%;" />
                                        </body>
                                    </html>
                                    `,
                                        }}
                                        style={styles.webview}
                                        originWhitelist={['*']}
                                        javaScriptEnabled={true}
                                        scalesPageToFit={true}
                                        allowFileAccess={true}
                                    />
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>
                    ) : (<></>)} */}
                    {/* <TouchableOpacity onPress={() => { handleViewFile }}>
                        <Text style={styles.actionText}>Xem CV đã nộp</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted':
                return 'Chấp nhận';
            case 'rejected':
                return 'Từ chối';
            case 'pending':
                return 'Chờ xử lý';
            case 'interview':
                return 'Phỏng vấn';
            default:
                return 'Trạng thái không xác định';
        }
    };

    const handleLoadMore = () => {
        if (!loadingJob && hasMore) {
            fetchData(userData.id, page);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {dataCv.length > 0 ? (
                <FlatList
                    data={dataCv.sort((a, b) => new Date(b.createdAtCv) - new Date(a.createdAtCv))}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.idCv.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingJob ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.title}>Bạn chưa ứng tuyển công việc nào</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin:'auto',
        justifyContent: 'center'
    },
    itemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    actionText: {
        color: '#4B49AC',
    },
    footer: {
        padding: 10,
        alignItems: 'center',
    },
    list: {
        paddingBottom: 100,
    },
    containerPDF: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    webview: {
        flex: 1,
    },
    webviewContainer: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

export default ManageCv;
