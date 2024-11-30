import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getListCompany = async () => {
    try {
        const response = await axios.get(`${apiUrl}/company/get-list-company`, {
            params: {
                limit: 5,
                offset: 0
            }
        });
        return response.data.data.content;
    }
    catch (error) {
        console.error('Error fetching getListCompany data:', error);
    }
}
export const getCompany = async (params) => {
    try {
        const response = await axios.get(`${apiUrl}/company/get-list-company`,{params});
        return response.data.data.content;
    }
    catch (error) {
        console.log('Error fetching getCompany data', error);
        throw error;
    }
};
export const DetailCompany = async (companyid) => {
    try {
        console.log(`${apiUrl}/company/get_company/${companyid}`);
        const response = await axios.get(`${apiUrl}/company/get_company/${companyid}`);
        return response.data.result;
    }
    catch (error) {
        console.log('Error fetching DetailCompany data', error);
        throw error;
    }
};
export const getCountJobByCompanyId = async (companyid) => {
    try {
        const response = await axios.get(`${apiUrl}/company/get_post_times/${companyid}`);
        return response.data.result;
    }
    catch (error) {
        console.log('Error fetching getCountJobByCompanyId data', error);
        throw error;
    }
};