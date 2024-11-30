import React, { useState, useContext } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { View, ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { AuthContext } from '../../components/AuthContext';
import { useRouter } from 'expo-router';
import { loginUser, getUserInfo} from '../../api/userApi';

const SignInScreen = () => {
    const [inputValues, setInputValues] = useState({
        password: '', phonenumber: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleOnChange = (name, value) => {
        setInputValues({ ...inputValues, [name]: value });
    };

    const { login } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        const { phonenumber, password } = inputValues;
        if(inputValues.phonenumber === '' || inputValues.password === ''){
            Alert.alert('Thông báo', 'Vui lòng điển đủ thông tin.');
            setIsLoading(false);
            return;
        }
        else{
            try {
                const res = await loginUser(phonenumber, password);
                const token = res.token;
    
                const userData = await getUserInfo(token);
                if (userData !== null) {
                    await login(token, userData);
                }
    
                Alert.alert('Thông báo', 'Đăng nhập thành công.');
            } catch (error) {
                Alert.alert('Thông báo', 'Sai tài khoản hoặc mật khẩu');
                console.error('Login failed:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/images/logo.jpg')} style={styles.logo} resizeMode="contain" />
                </View>
                <Text style={styles.title}>Chào bạn! Tham gia ứng tuyển ngay</Text>
                <Text style={styles.subtitle}>Đăng nhập để tiếp tục.</Text>

                <View style={styles.group}>
                    <Feather name="phone" size={24} color="black" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        keyboardType="phone-pad"
                        placeholderTextColor="#ccc"
                        value={inputValues.phonenumber}
                        onChangeText={(text) => handleOnChange('phonenumber', text)}
                    />
                </View>
                <View style={styles.group}>
                    <Feather name="lock" size={24} color="black" style={styles.icon} />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            placeholderTextColor="#ccc"
                            secureTextEntry={!isPasswordVisible}
                            value={inputValues.password}
                            onChangeText={(text) => handleOnChange('password', text)}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            <Feather name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => router.push('/auth/forgotpassword')}>
                        <Text style={styles.linkText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <Text style={styles.orText}> | </Text>
                    <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                        <Text style={styles.linkText}>Tạo ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        paddingLeft: 45,
    },
    loginButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    linkText: {
        color: '#007bff',
        fontSize: 14,
    },
    orText: {
        color: '#000',
        fontSize: 14,
    },
    group: {
        marginTop: 10,
    },
    icon: {
        position: 'absolute',
        top: 13,
        zIndex: 1000,
        left: 10
    },
    passwordContainer: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 13,
    }
});

export default SignInScreen;