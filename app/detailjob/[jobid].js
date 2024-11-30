import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, ActivityIndicator, Alert } from 'react-native'
import { DetailJob } from '../../api/jobApi';
import JobDetail from '../../components/Job/JobDetail'; 
import CommonUtils from '../../utils/CommonUtils'
import SendCV from '../../components/Job/SendCV';

const Detailjob = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [isActiveModal, setAcitveModal] = useState(false);
    const { jobid } = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        })
        loadData();
    }, []);
    const params = { id: Number(jobid) };

    const loadData = async () => {
        try {
            const response = await DetailJob(params);
            setData(response);
        } catch (error) {
            console.error("Error fetching feature data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        if (data?.timeEndValue && CommonUtils.formatDate(data?.timeEndValue) > 0) {
            setAcitveModal(true);
        } else {
            Alert.alert("Thông báo", "Hạn ứng tuyển đã hết");
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

        <View>
            <JobDetail
                data={data}
                handleOpenModal={handleOpenModal}
            />
            <SendCV
                isOpen={isActiveModal}
                onHide={() => setAcitveModal(false)}
                emailCompany={data?.emailCompany}  
                postId={jobid}
                jobTitle={data?.name} 
            />
        </View>
    )
}
export default Detailjob