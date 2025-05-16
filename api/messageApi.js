import axios from "axios";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig.extra.apiUrl;

export const sendUserNotification = async ({
  subject,
  image,
  message,
  attachedUrl,
  sender,
  userId,
  userToken,
}) => {
  const payload = {
    subject,
    image,
    data: {
      message,
      attachedUrl,
      sender,
    },
    userId,
  };

  try {
    const response = await axios.post(
      `${apiUrl}/notification/sendUser`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    throw error;
  }
};
