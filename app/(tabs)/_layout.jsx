import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { AuthContext } from "../../components/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
import { StatusBar } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TabLayout = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 0,
            marginBottom: 0,
            height: 50,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Trang Chủ",
            tabBarLabel: "Trang Chủ",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="job"
          options={{
            title: "Tìm Việc",
            tabBarLabel: "Tìm Việc",
            tabBarIcon: ({ color }) => (
              <Ionicons name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="company"
          options={{
            title: "Công Ty",
            tabBarLabel: "Công Ty",
            tabBarIcon: ({ color }) => (
              <Ionicons name="briefcase" size={24} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen name='notification' options={{ title: 'Thông báo', tabBarLabel: 'Thông Báo', tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} /> }} /> */}
        <Tabs.Screen
          name="user"
          options={{
            headerShown: false,
            title: "Cá Nhân",
            tabBarLabel: "Cá Nhân",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaWrapper>
  );
};

export default TabLayout;
