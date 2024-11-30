import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import moment from 'moment';

const Header = () => {
    const router = useRouter();
    const today = moment();
    const day = today.format('DD');
    const month = today.format('MM');
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <View style={styles.logo}>
                        <Image source={require('../../assets/images/logo.jpg')} style={styles.img} resizeMode="contain" />
                    </View>
                    <View style={styles.icons}>
                        <TouchableOpacity onPress={() => router.replace('/usersetting/notification')}>
                            <Ionicons name="notifications-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.text}>
                    <Text style={styles.todayText}>Hôm nay</Text>
                    <Text style={styles.dateText}>
                        {day} {monthNames[parseInt(month) - 1]}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "white",
    },
    header: {
        flexDirection: "column",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    text: {
        flex: 1,
        borderTopColor: '#C0C0C0',
        borderTopWidth: 1,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    todayText: {
        fontSize: 30,
        fontWeight: '900',
        color: 'black',
        marginRight: 5,
    },
    dateText: {
        fontSize: 20,
        color: 'gray',
        fontWeight: '500',
        marginTop: 8,
    },
    topRow: {
        marginLeft: 15,
        marginRight:15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    img: {
        width: 150,
        height: 50,
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    logo: {
        flex: 1,
    },

});

export default Header;