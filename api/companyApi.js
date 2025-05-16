import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getListCompany = async () => {
  try {
    const response = await axios.get(`${apiUrl}/company/get-list-company`, {
      params: {
        limit: 5,
        offset: 0,
      },
    });
    return response.data.data.content;
  } catch (error) {
    console.error("Error fetching getListCompany data:", error);
  }
};
export const getCompany = async (params) => {
  try {
    const response = await axios.get(`${apiUrl}/company/get-list-company`, {
      params,
    });
    return response.data.data.content;
  } catch (error) {
    console.log("Error fetching getCompany data", error);
    throw error;
  }
};
export const DetailCompany = async (companyid) => {
  try {
    console.log(`${apiUrl}/company/get_company/${companyid}`);
    const response = await axios.get(
      `${apiUrl}/company/get_company/${companyid}`
    );
    return response.data.result;
  } catch (error) {
    console.log("Error fetching DetailCompany data", error);
    throw error;
  }
};
export const getCountJobByCompanyId = async (companyid) => {
  try {
    const response = await axios.get(
      `${apiUrl}/company/get_post_times/${companyid}`
    );
    return response.data.result;
  } catch (error) {
    console.log("Error fetching getCountJobByCompanyId data", error);
    throw error;
  }
};
export const createCompany = async (token, formData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/company/create-company`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error createCompany", error);
    throw error;
  }
};
export const updateCompany = async (userToken, formData) => {
  try {
    const response = await axios.put(
      `${apiUrl}/company/update-company`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updateCompany", error);
    throw error;
  }
};

export const getAllUserByCompanyIdService = async (data, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/company/getAllUserByCompanyId?companyId=${data.idCompany}&limit=${data.limit}&offset=${data.offset}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllUserByCompanyIdService", error.response.data);
    throw error;
  }
};

export const QuitCompanyService = async (data, userToken) => {
  try {
    const response = await axios.put(
      `${apiUrl}/company/CancelCompanyByEmployer?userId=${data}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error getAllUserByCompanyIdService", error.response.data);
  }
};

export const createNewUserByEmployeer = async (data, userToken) => {
  try {
    const response = await axios.post(
      `${apiUrl}/company/CreateEmployee-FromCompany`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllUserByCompanyIdService", error.response.data);
  }
};
