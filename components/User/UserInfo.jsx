import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { updateUserInfo, fetchDataCodeGender } from '../../api/userApi';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import handleValidate from "../../utils/Validation";

const UserInfo = () => {
    const [loading, setLoading] = useState(false);
    const [birthday, setBirthday] = useState("");
    const { userData, setUserData } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);
    const [genderItems, setGenderItems] = useState([]);
    const [formData, setFormData] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        address: userData.addressUser || '',
        phoneNumber: userData.phoneNumber || '',
        genderCode: userData.genderCodeValue ||'',
        dob: isNaN(userData.dobUser) ? moment().valueOf() : userData.dobUser,
        email: userData.email || '',
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const isValidDate = (dateString) => {
        return moment(dateString, "DD/MM/YYYY", true).isValid();
    };


    useEffect(() => {
        if (userData.dobUser) {
            const formattedDate = moment.unix(userData.dobUser / 1000).locale("vi").format("DD/MM/YYYY");
            if (isValidDate(formattedDate)) {
                setBirthday(formattedDate);
            } else {
                setBirthday("");
            }
        } else {
            setBirthday("");
        }
    }, [userData.dobUser]);


    useEffect(() => {
        const fetchGenderData = async () => {
            try {
                const genderData = await fetchDataCodeGender();
                if (genderData) {
                    const formattedData = genderData.map(item => ({
                        label: item.value,
                        value: item.code,
                    }));
                    setGenderItems(formattedData);
    
                    const matchedItem = formattedData.find(item => item.label === userData.genderCodeValue);
                    if (matchedItem) {
                        setFormData(prevData => ({
                            ...prevData,
                            genderCode: matchedItem.value,
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };
    
        fetchGenderData();
    }, [userData.genderCodeValue]);
    

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditToggle = async () => {
        if (isEditing) {

            let checkEmail = handleValidate(formData.email, "email");
            if (checkEmail!== true) {
                Alert.alert("Lỗi", "Email không hợp lệ");
                return 
            }
            let checkfirstName = handleValidate(formData.firstName, "noNumber");

            if (checkfirstName !== true) {
                Alert.alert("Lỗi", "Họ không hợp lệ");
                return 
            }
            let checklastName = handleValidate(formData.lastName, "noNumber");

            if (checklastName !== true) {
                Alert.alert("Lỗi", "Tên không hợp lệ");
                return 
            }

            setLoading(true);
            const userUpdateRequest = {
                id: userData.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                genderCode: formData.genderCode,
                dob: formData.dob,
                email: formData.email,
            };

            try {
                const data = await updateUserInfo(userUpdateRequest);
                if (data.code === 200) {
                    setUserData({
                        ...userData,
                        addressUser: formData.address,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        dobUser: formData.dob,
                        genderCodeValue: genderItems.find(item => item.value === formData.genderCode)?.label || '',
                        email: formData.email,
                    });
                    Alert.alert('Thành công', 'Cập nhật thông tin người dùng thành công!');
                } else {
                    Alert.alert('Thất bại', 'Cập nhật thông tin người dùng thất bại.');
                }
            } catch (error) {
                Alert.alert('Có lỗi xảy ra khi cập nhật thông tin.');
            } finally {
                setLoading(false);
                setIsEditing(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const showDatepicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatepicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = (date) => {
        if (date) {
            const formattedDate = moment(date).locale("vi").format("DD/MM/YYYY");
            const timestamp = moment(date).valueOf();
            if (moment(formattedDate, "DD/MM/YYYY", true).isValid()) {
                setBirthday(formattedDate);
                handleInputChange('dob', timestamp);
            } else {
                const currentDate = moment().locale("vi").format("DD/MM/YYYY");
                setBirthday(currentDate);
                handleInputChange('dob', moment().valueOf());
            }
        }
        hideDatepicker();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Họ:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.firstName}
                        editable={isEditing}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                    />

                    <Text style={styles.label}>Tên:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.lastName}
                        editable={isEditing}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                    />

                    <Text style={styles.label}>Địa Chỉ:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.address}
                        editable={isEditing}
                        onChangeText={(value) => handleInputChange('address', value)}
                    />

                    <Text style={styles.label}>Số Điện thoại:</Text>
                    <TextInput
                        style={styles.inputPhone}
                        value={formData.phoneNumber}
                        editable={false}
                    />

                    <Text style={styles.label}>Giới tính:</Text>
                    {isEditing ? (
                        <DropDownPicker
                            open={genderOpen}
                            value={formData.genderCode || null}
                            items={genderItems}
                            setOpen={setGenderOpen}
                            setValue={(callback) => {
                                const selectedCode = callback(formData.genderCode);
                                handleInputChange("genderCode", selectedCode);
                            }}
                            setItems={setGenderItems}
                            placeholder="Chọn giới tính"
                            disabled={!isEditing}
                            style={styles.dropdown}
                        />
                    ) : (
                        <Text style={styles.input}>{userData.genderCodeValue || 'Chưa xác định'}</Text>
                    )}

                    <Text style={styles.label}>Ngày sinh:</Text>
                    {isEditing ? (
                        <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
                            <Text style={styles.dobText}>
                                {isValidDate(birthday) ? birthday : 'chưa chọn ngày'}
                            </Text>
                            <Ionicons name="calendar" size={24} color="#007BFF" />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.input}>
                            {isValidDate(birthday) ? birthday : 'Chưa xác định'}
                        </Text>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        date={formData.dob ? new Date(formData.dob * 1000) : new Date()}
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatepicker}
                    />

                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        editable={isEditing}
                        onChangeText={(value) => handleInputChange('email', value)}
                    />
                </View>

                <View style={styles.footer}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity onPress={handleEditToggle} style={styles.saveButton}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Lưu</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    scrollView: {
        paddingBottom: 20,
    },
    infoContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#fff',
        color:'black'
    },
    inputPhone: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        color:'gray'
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    dobText: {
        fontSize: 16,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    editButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 10,
        flex: 1,
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default UserInfo;