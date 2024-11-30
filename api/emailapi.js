import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const sendEmail = async (formData, token) => {
    try {
        const response = await axios.post(`${apiUrl}/email/send-mail/send-application-email`, formData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sendEmail', error);
        throw error;
    }
};