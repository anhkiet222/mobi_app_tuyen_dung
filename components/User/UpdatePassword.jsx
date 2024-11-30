import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useContext } from 'react';
import { updatePassword } from '../../api/userApi';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../AuthContext';

const UpdatePassword = () => {
    const { userData } = useContext(AuthContext);
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isConformPasswordVisible, setIsConformPasswordVisible] = useState(false);
    const [data, setData] = useState({ oldPassword: '', password: '', confirmPassword: '' })

    const handleUpdatePassword = async () => {
        if (!data.oldPassword || !data.password || !data.confirmPassword) {
            Alert.alert("Lỗi", "Bạn chưa điền đầy đủ các thông tin.");
            return;
        }
        if (data.password !== data.confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu mới và mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const res = await updatePassword({
                id: userData.id,
                oldpassword: data.oldPassword,
                password: data.password
            });
            if (res.status == 200) {
                Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật thành công.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Mật khẩu cũ không đúng. Vui lòng thử lại.");
            console.error("Update password error:", error);
        }
    };
    const handleOnChange = (name, value) => {
        setData({ ...data, [name]: value });
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu cũ"
                    placeholderTextColor="#ccc"
                    secureTextEntry={!isOldPasswordVisible}
                    value={data.oldPassword}
                    onChangeText={(test) => handleOnChange('oldPassword', test)}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                >
                    <Feather name={isOldPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    placeholderTextColor="#ccc"
                    secureTextEntry={!isPasswordVisible}
                    value={data.password}
                    onChangeText={(test) => handleOnChange('password', test)}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập lại mật khẩu mới"
                    value={data.confirmPassword}
                    placeholderTextColor="#ccc"
                    secureTextEntry={!isConformPasswordVisible}
                    onChangeText={(test) => handleOnChange('confirmPassword', test)}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsConformPasswordVisible(!isConformPasswordVisible)}
                >
                    <Feather name={isConformPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
                <Text style={styles.updateButtonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    updateButton: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 24,
    }
});

export default UpdatePassword;
