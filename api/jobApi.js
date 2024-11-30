import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;
axios.defaults.timeout = 10000;

export const getCategoryJob = async () => {
    try {
        const response = await axios.get(`${apiUrl}/post/get-list-job-count-post`);
        return response.data.content;
    }
    catch (error) {
        console.log('Error fetching getCategoryJob data', error);
        throw error;
    }
};

export const getListJob = async () => {
    try {
        console.log("🚀 ~ getListJob ~ `${apiUrl}/post/get-search-post`:", `${apiUrl}/post/get-search-post`)
        const response = await axios.get(`${apiUrl}/post/get-search-post`, {
            params: {
                limit: 5,
                offset: 0
            }
        });
        return response.data.result;
    } catch (error) {
        console.error('Error fetching getListJob data:', error);
        throw error;
    }
}

export const FilterJob = async (params) => {
    try {
        const response = await axios.get(`${apiUrl}/post/get-search-post`, { params });
        return response.data.result;
    }
    catch (error) {
        console.error('Error fetching FilterJob data:', error);
        throw error;
    }
}

export const DetailJob = async (params) => {
    try {
        const response = await axios.get(`${apiUrl}/post/get-detail-post-by-id`, { params });
        return response.data.data;

    } catch (error) {
        console.error('Error fetching DetailJob data:', error);
        throw error;
    }
}
export const getAllSkillByJobCode = async (categoryJobCode) => {
    try {
        const response = await axios.get(`${apiUrl}/skill/get-all-skill-by-job-code?categoryJobCode=${categoryJobCode}`);
        return response.data.result;
    } catch (error) {
        console.log("Error fetching Skill data:", error);
        throw error;
    }
};
export const fetchDataJobType = async () => {
    try {
        const response = await axios.get(`${apiUrl}/get-all-code/job-types`);
        return response.data;
    } catch (error) {
        console.log("Error fetching JobType data:", error);
        throw error;
    }
};

export const fetchDataSalaryType = async () => {
    try {
        const response = await axios.get(`${apiUrl}/get-all-code/salary-types`)
        return response.data;
    } catch (error) {
        console.log("Error fetching SalaryType data:", error);
        throw error;
    }
};
export const fetchDataExpType = async () => {
    try {
        const response = await axios.get(`${apiUrl}/get-all-code/exp-types`)
        return response.data;
    } catch (error) {
        console.log("Error fetching ExpType data:", error);
        throw error;
    }
};
export const fetchDataJobLocation = async () => {
    try {
        const response = await axios.get(`${apiUrl}/get-all-code/provinces`)
        return response.data;
    } catch (error) {
        console.log("Error fetching JobLocation data:", error);
        throw error;
    }
};

export const createCV = async (payload, token) => {  
    try {
      const response = await axios.post(
        `${apiUrl}/cv/createCV`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error createCV data:", error);
      throw error;
    }
  };
  