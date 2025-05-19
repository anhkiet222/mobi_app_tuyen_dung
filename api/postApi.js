import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const createPostService = async (data, userToken) => {
  try {
    const response = await axios.post(`${apiUrl}/post/create-new-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error createPostService", error);
  }
};

export const getDetailToEditPostService = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/post/get-detail-post-by-id?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getDetailToEditPostService", error);
  }
};
export const reupPostService = async (data, userToken) => {
  try {
    const response = await axios.post(`${apiUrl}/post/reup-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error reupPostService", error);
  }
};

export const updatePostService = async (data, userToken) => {
  try {
    const response = await axios.put(`${apiUrl}/post/update-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updatePostService", error);
  }
};

export const getAllCodeGenderPost = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/genders-post`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};

export const getAllCodeJobLevel = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/job-levels`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};
export const getAllCodeJobType = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/job-types`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};

export const getAllCodeJobLocation = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/provinces`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};

export const getAllCodeSalaryType = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/salary-types`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};

export const getAllCodeWorkType = async () => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-code/work-types`);
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeGenderPost", error);
  }
};

export const getDetailPostById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/post/get-detail-post-by-id?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getDetailPostById", error);
  }
};

export const banPostService = async (data, userToken) => {
  try {
    const response = await axios.put(`${apiUrl}/post/ban-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error banPostService", error);
    throw error;
  }
};

export const getAllPostByAdminService = async (data, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/post/get-list-post-admin?idCompany=${data.idCompany}&limit=${data.limit}&offset=${data.offset}&search=${data.search}&censorCode=${data.censorCode}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllPostByAdminService", error.response.data);
    throw error;
  }
};

export const activePostService = async (data, userToken) => {
  try {
    const response = await axios.put(`${apiUrl}/v1/post/activate-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error activePostService", error);
    throw error;
  }
};

export const getAllPostByRoleAdminService = async (data, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/post/get-All-Post-RoleAdmin?limit=${data.limit}&offset=${data.offset}&search=${data.search}&censorCode=${data.censorCode}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllPostByRoleAdminService", error);
    throw error;
  }
};

export const acceptPostService = async (data, userToken) => {
  try {
    const response = await axios.put(`${apiUrl}/post/accept-post`, data, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error acceptPostService", error);
  }
};

export const getListNoteByPost = async (data, userToken) => {
  try {
    const response = await axios.get(
      `${apiUrl}/post/get-note-by-post?limit=${data.limit}&offset=${data.offset}&id=${data.id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getListNoteByPost", error.response.data);
  }
};

export const getAllListCvByPostService = async (data) => {
  try {
    const response = await axios.get(
      `${apiUrl}/cv/detail/${data.postId}?limit=${data.limit}&offset=${data.offset}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getAllListCvByPostService", error.response.data);
  }
};

export const getDetailCvServicebyAdmin = async (id, userToken) => {
  try {
    const response = await axios.get(`${apiUrl}/cv/detail/${id}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getDetailCvServicebyAdmin", error.response.data);
  }
};

export const getDetailPostByIdService = async (id, userToken) => {
  try {
    const response = await axios.get(`${apiUrl}/cv/by-post/${id.postId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getDetailPostByIdService", error.response.data);
  }
};
