import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CommonUtils from '../../utils/CommonUtils';
import { getCountJobByCompanyId } from '../../api/companyApi';

const CompanyList = ({ post, loading, handleLoadMore, handlePress }) => {

    const [jobCounts, setJobCounts] = useState({});
    const loadData = async (id) => {
        try {
            const response = await getCountJobByCompanyId(id);
            const count = response.filter(j => CommonUtils.formatDate(j.timeEnd) > 0).length;
            return count;
        } catch (error) {
            console.log('Error: ', error);
            return 0;
        }
    };
    useEffect(() => {
        const fetchJobCounts = async () => {
            const counts = await Promise.all(
                post.map(async (item) => {
                    const count = await loadData(item.id);
                    return { id: item.id, count };
                })
            );
            const jobCountMap = {};
            counts.forEach(({ id, count }) => {
                jobCountMap[id] = count;
            });
            setJobCounts(jobCountMap);
        };

        fetchJobCounts();
    }, [post]);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <FlatList
                data={post}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item.id)}>
                        <View style={styles.itemContainer}>
                            <View style={styles.topContainer}>
                                <View style={styles.img}>
                                    <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode='contain' />
                                </View>
                                <View style={styles.title}>
                                    <View style={styles.itemTitle}>
                                        <Text style={styles.textName}>{item.name}</Text>
                                        <Text style={styles.textCount}>
                                            {jobCounts[item.id] || 0} việc đang tuyển
                                        </Text>
                                        <Text style={styles.textAddr}>
                                            <FontAwesome5 name="map-marker-alt" size={17} color="#6699ff" style={styles.icon} /> {item.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 5,
        marginLeft: 5,
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    topContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    img: {
        width: '30%',
        paddingLeft: 5,
        paddingRight: 5,
    },
    title: {
        width: '70%',
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 15,
        margin: 'auto',
    },
    itemTitle: {
        marginTop: 7,
        marginRight: 5,
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
    },
    textAddr: {
        paddingTop: 3,
        paddingLeft: 15,
        fontSize: 17,
    },
    textCount: {
        paddingTop: 5,
        paddingLeft: 15,
        color: 'blue',
        fontSize: 17,
    },
    icon: {
        marginRight: 8,
    }
});

export default CompanyList