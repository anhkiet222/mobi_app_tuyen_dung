import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const loginUser = async (phonenumber, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      phonenumber: phonenumber,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error Login Failed", error.response.data);
    throw error;
  }
};

export const getUserInfo = async (token) => {
  try {
    const response = await axios.post(
      `${apiUrl}/user/get-info`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data[0];
  } catch (error) {
    console.error("Error getUserInfo", error);
    throw error;
  }
};
export const updatePassword = (data) => {
  try {
    return axios.post(`${apiUrl}/account/change-password`, data);
  } catch (error) {
    console.error("Error updatePassword getListCompany data:", error);
  }
};
export const updateImage = async (userId, imageUri) => {
  try {
    const formData = new FormData();
    formData.append("fileImage", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    });
    formData.append("id", userId);

    const response = await axios.put(`${apiUrl}/user/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updateImg", error);
    throw error;
  }
};

export const updateUserInfo = async (userUpdateRequest) => {
  try {
    const formData = new FormData();
    Object.keys(userUpdateRequest).forEach((key) => {
      formData.append(key, userUpdateRequest[key]);
    });

    const response = await axios.put(`${apiUrl}/user/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return await response.data;
  } catch (error) {
    console.error("Error updateUser", error);
    throw error;
  }
};
export const fetchDataCodeGender = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/genders-user`);
    return response.data;
  } catch (error) {
    console.error("Error getUserInfo", error);
    throw error;
  }
};

export const saveUserSettings = async (inputValues, userToken) => {
  try {
    const res = await axios.post(
      `${apiUrl}/user/set-user-setting-mobi`,
      inputValues,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Error update userSetting:", error);
    throw error;
  }
};
export const getDetailUserById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/user/get-users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getDetailUserById", error);
    throw error;
  }
};

export const getAllListCvByUserIdService = async (data) => {
  try {
    const response = await axios.get(`${apiUrl}/cv/get-all-cv-by-userId`, {
      params: {
        limit: data.limit,
        offset: data.offset,
        userId: data.userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getAllListCvByUserIdService", error);
    throw error;
  }
};

export const registerUser = async (params) => {
  try {
    const response = await axios.get(`${apiUrl}/user/check-phonenumber-user`, {
      params: { phonenumber: params },
    });
    return response.data;
  } catch (error) {
    console.error("Error registerUser", error);
    throw error;
  }
};

export const createNewUser = async (params) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, params);
    return response.data;
  } catch (error) {
    console.error("Error createNewUser", error);
    throw error;
  }
};

export const requestOtp = async (phoneNumber) => {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/otp/request-otp?phoneNumber=${phoneNumber}`
    );
    return response;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (requestId, OTP) => {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/otp/verify-otp?requestId=${requestId}&OTP=${OTP}`
    );
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const checkUserPhoneService = async (phonenumber) => {
  try {
    const response = await axios.get(
      `${apiUrl}/user/check-phonenumber-user?phonenumber=${phonenumber}`
    );
    return response;
  } catch (error) {
    console.error("Error checkUserPhoneService :", error);
    throw error;
  }
};

export const forgetPassword = async (phoneNumber) => {
  try {
    const response = await axios.put(
      `${apiUrl}/auth/forget-password/${phoneNumber}`
    );
    return response;
  } catch (error) {
    console.error("Error forgetPassword:", error);
    throw error;
  }
};

export const forgetPasswordMobile = async (phoneNumber) => {
  try {
    const response = await axios.post(`${apiUrl}/user/ForgotPasswordMobile`, {
      phoneNumber,
    });
    return response;
  } catch (error) {
    console.error("Error forgetPassword:", error);
    throw error;
  }
};
export const getDetailCompanyByUserId = async (
  userId,
  companyId,
  userToken
) => {
  try {
    const response = await axios.get(
      `${apiUrl}/company/get-detail-company-by-userId?userId=${userId}&companyId=${companyId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getDetailCompanyByUserId", error.response.data);
    throw error;
  }
};

export const UpdateUserService = async (data, userToken) => {
  try {
    const response = axios.put(`${apiUrl}/user/update`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updateUser", error);
    throw error;
  }
};

export const getRuleUser = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/rules-user`);
    return response.data;
  } catch (error) {
    console.error("Error getRuleUser", error);
    throw error;
  }
};

export const getUsersByCategory = async (categoryJobCode, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/user/phone`,
      {
        params: {
          categoryJobCode: categoryJobCode,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users by category:", error);
    throw error;
  }
};

export const getPackageByType = async (isHot, userToken) => {
  try {
    const response = await axios.get(
      `http://171.244.40.25:8080/app-tuyen-dung/api/v1/package/get-package-by-Type?isHot=${isHot}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getPackageByType", error.response.data);
    throw error;
  }
};

export const getPaymentLink = async (id, amount, userToken) => {
  try {
    const response = await axios.get(
      `http://171.244.40.25:8080/app-tuyen-dung/api/v1/payment/get-payment-link?id=${id}&amount=${amount}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getPaymentLink", error);
    throw error;
  }
};

export const getPhoneByUserId = async (userId, userToken) => {
  try {
    const response = await axios.get(`/user/phone/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching phone numbers by company ID:", error);
    throw error;
  }
};

export const sendUserNotification = async (payload, userToken) => {
  try {
    const response = await axios.post(`/notification/sendUser`, payload, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    throw error;
  }
};
