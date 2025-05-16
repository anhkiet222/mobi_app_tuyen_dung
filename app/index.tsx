import { Redirect } from "expo-router";
import React, { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import "moment/locale/vi";
import * as Notifications from "expo-notifications";
import { getToken } from "firebase/messaging";
import { messaging } from "../Config/firebase-config";

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext);
  // const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  // const [fcmToken, setFcmToken] = useState<string | null>(null);

  // useEffect(() => {
  //   async function requestNotificationPermission() {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Permission for notifications was denied');
  //       return;
  //     }

  //     const expoPushTokenResponse = await Notifications.getExpoPushTokenAsync();
  //     setExpoPushToken(expoPushTokenResponse.data);
  //     console.log('Expo Push Token:', expoPushTokenResponse.data);

  //     try {
  //       const fcmTokenResponse = await getToken(messaging);
  //       setFcmToken(fcmTokenResponse);
  //       console.log('FCM Token:', fcmTokenResponse);
  //     } catch (error) {
  //       console.log('Error getting FCM token:', error);
  //     }
  //   }

  //   requestNotificationPermission();

  //   const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log('Thông báo nhận được:', notification);
  //   });

  //   const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log('Thông báo background:', response);
  //   });

  //   return () => {
  //     foregroundSubscription.remove();
  //     backgroundSubscription.remove();
  //   };
  // }, []);
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }
  return <Redirect href="/auth/signin" />;
}
