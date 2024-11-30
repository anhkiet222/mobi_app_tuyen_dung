// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import * as Notifications from 'expo-notifications';


// const notification = () => {
//     const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // Lắng nghe thông báo nhận được khi ứng dụng ở foreground
//     const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
//       console.log('Thông báo nhận được:', notification);
//       setNotifications(prevNotifications => [
//         ...prevNotifications,
//         notification,
//       ]);
//     });

//     const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log('Thông báo background:', response);
//       // Xử lý khi người dùng nhấn vào thông báo (có thể điều hướng tới một màn hình chi tiết)
//     });

//     return () => {
//       foregroundSubscription.remove();
//       backgroundSubscription.remove();
//     };
//   }, []);
//   return (
//     <View>
//       <Text>notification</Text>
//     </View>
//   )
// }

// export default notification