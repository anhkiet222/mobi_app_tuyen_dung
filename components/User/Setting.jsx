import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useContext } from "react";
import { AuthContext } from '../AuthContext';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ImageBackground, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { updateImage } from "../../api/userApi";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

const DEFAULT_USER_IMAGE = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg?fbclid=IwY2xjawFBAwlleHRuA2FlbQIxMAABHaE053TNouFB_uCoaIiXj56WSPQytGf8ywL1PNzfktyF2TOX7qVMRDhaUw_aem_f65zQPMOofTyGlTMIbierQ";

const Setting = () => {
    const { userData, setUserData, logout } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const handleLogout = async () => {
        try {
            await logout();
            Alert.alert('Thông báo', 'Đăng xuất thành công.');
        } catch (error) {
            Alert.alert('Lỗi', 'Đăng xuất thất bại.');
            console.error('Logout failed:', error);
        }
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const chooseImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cấp quyền truy cập để chọn ảnh.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            await UpImg(result.assets[0].uri);
        }
    };

    const UpImg = async (uri) => {
        if (!uri) {
            Alert.alert('Vui lòng chọn ảnh trước!');
            return;
        }

        setLoading(true);
        try {
            const data = await updateImage(userData.id, uri);
            if (data.code === 200) {
                const updatedUserData = {
                    ...userData,
                    image: data.result.image,
                };
                setUserData(updatedUserData);
                Alert.alert('Thành công', 'Cập nhật ảnh thành công!');
            } else {
                Alert.alert('Thất bại', 'Cập nhật ảnh thất bại.');
            }
        } catch (error) {
            Alert.alert('Có lỗi xảy ra khi cập nhật ảnh.');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={chooseImage}>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <View style={{ position: 'relative' }}>
                            <ImageBackground source={{ uri: userData?.image || DEFAULT_USER_IMAGE }} style={styles.profileImage}>
                                <View style={styles.editCircle}>
                                    <Text style={styles.editText}>SỬA</Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.profileText}>Welcome, {userData?.firstName} {userData?.lastName}</Text>
                <Text style={styles.profileEmail}>Email: {userData?.email}</Text>
            </View>

            <View style={styles.list}>
                <TouchableOpacity style={styles.listItem} onPress={() => router.push('/usersetting/userinfo')}>
                    <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.listText}>Thông tin người dùng</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} onPress={() => router.push('/usersetting/advancedsetting')}>
                    <AntDesign name="setting" size={24} color="black" style={styles.icon} />
                    <Text style={styles.listText}>Cài đặt tài khoản</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.arrowIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.listItem} onPress={() => router.push('/usersetting/updatepassword')}>
                    <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
                    <Text style={styles.listText}>Thay đổi mật khẩu</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.listItem} onPress={() => router.push('/usersetting/listjob')}>
                    <Feather name="send" size={24} color="black" style={styles.icon} />
                    <Text style={styles.listText}>Công việc đã ứng tuyển</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
                    <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.deleteButton} onPress={handleLogout}>
                    <AntDesign name="warning" size={14} color="black" style={styles.icon} />
                    <Text style={styles.deleteButtonText}>Xóa tài khoản</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    profileText: {
        fontSize: 23,
    },
    profileEmail: {
        fontSize: 18,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    editCircle: {
        position: 'absolute',
        bottom: 0,
        width: 100,
        height: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    list: {
        flex: 1,
        marginBottom: 30,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    listText: {
        fontSize: 16,
        flex: 1,
    },
    icon: {
        marginRight: 10,
    },
    arrowIcon: {
        color: '#ccc',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff3b30',
        padding: 15,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    deleteButton: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 13,
        color: 'gray',
    },
});

export default Setting;