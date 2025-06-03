import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const getFilterCvUV = async (data, userToken) => {
  try {
    const response = await axios.post(`${apiUrl}/cv/filter`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getFilterCvUV", error);
    throw error;
  }
};
export const checkSeeCandiate = async (data, userToken) => {
  try {
    const response = await axios.post(
      `${apiUrl}/cv/checkSeeCandidate?userId=${data.userId}&companyId=${data.companyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checkSeeCandiate", error);
    throw error;
  }
};

export const getAllPackageCV = async (userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/package-cv/get-all-package-cv`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllPackage", error);
  }
};

export const getPaymentLinkCv = async (id, amount, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/payment/get-payment-link-cv?id=${id}&amount=${amount}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getPaymentLinkCv", error);
    throw error;
  }
};

export const getHistoryTradeCv = async (data, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/order-package-cv/get-history-trade-cv?limit=${data.limit}&offset=${data.offset}&fromDate=${data.fromDate}&toDate=${data.toDate}&companyId=${data.companyId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getHistoryTradeCv", error);
    throw error;
  }
};
export const acceptCVService = async (cvId, userToken) => {
  try {
    const response = await axios.put(
      `${apiUrl}/cv/accept`,
      { id: cvId },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error acceptCVService", error);
    throw error;
  }
};

export const rejectCVService = (cvId, userToken) => {
  try {
    const response = axios.put(
      `${apiUrl}/cv/reject`,
      {
        id: cvId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejectCVService", error);
    throw error;
  }
};
export const reviewCVService = (cvId, userToken) => {
  try {
    const response = axios.put(
      `${apiUrl}/cv/review`,
      {
        id: cvId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error reviewCVService", error);
    throw error;
  }
};

export const getCVsByStatusService = async (idCompany, data, userToken) => {
  try {
    const response = await axios.get(`${apiUrl}/cv/status`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      params: {
        idCompany: idCompany,
        status: data.status,
        limit: data.limit,
        offset: data.offset,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getCVsByStatusService", error.response.data);
    throw error;
  }
};

export const scheduleInterviewService = async (data, userToken) => {
  try {
    const response = await axios.put(`${apiUrl}/cv/schedule-interview`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error scheduleInterviewService", error);
    throw error;
  }
};
