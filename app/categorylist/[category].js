import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { FilterJob } from '../../api/jobApi';
import JobList from '../../components/Job/JobList';
import Ionicons from '@expo/vector-icons/Ionicons';

const JobListByCategory = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const { category, code } = useLocalSearchParams();
    const [isEnd, setIsEnd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: category,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
            ),
        })
        loadPost();
    }, []);

    const loadPost = async (reset = false) => {
        if (loading) return;

        setLoading(true);
        let params = {
            offset: reset ? 0 : page,
            limit: 10,
            categoryJobCode: code
        };

        try {
            const response = await FilterJob(params);
            if (reset) {
                setPost(response.content);
            } else {
                setPost(prevPosts => [...prevPosts, ...response.content]);
            }
            setCount(response.totalElements);
            if (response.content.length < 10) {
                setIsEnd(true);
            } else {
                setPage(prevPage => prevPage + 1);
                setIsEnd(false);
            }
        } catch (error) {
            console.error("Error fetching feature data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = useCallback(() => {
        if (!isEnd && !loading) {
            loadPost();
        }
    });
    const handlePress = useCallback((id) => {
        router.push(`/detailjob/${id}`);
    });
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <JobList
            post={post}
            loading={loading}
            handleLoadMore={handleLoadMore}
            handlePress={handlePress}
        />
    )
}
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 5,
        marginLeft: 5,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    img: {
        width: '30%',
        paddingLeft: 5,
        paddingRight: 5
    },
    title: {
        width: "70%",
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 15,
        margin: 'auto'
    },
    itemTitle: {
        marginTop: 7,
        marginRight: 5
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center'
    },
    textAdd: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#28A745',
    },
    textMoney: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#FFC107',
    },
    textSex: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#6F42C1',
    },
    task: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        marginTop: 10,
        paddingRight: 5
    },
    textcateJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#3498DB',
    },
    textExJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#8B4513',
    },
    textWorkJob: {
        padding: 5,
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#DC3545',
    },
    timepost: {
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 5
    },
});
export default JobListByCategory;