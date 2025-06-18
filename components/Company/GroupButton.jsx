import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Share } from 'react-native'
import React from 'react'

 const GroupButton = ({ data }) => {

  const GroupButtonMenu = [
    {
      id: 1,
      name: 'Gọi',
      icon: require('./../../assets/images/call.png'),
      url: 'tel:' + data?.phonenumber

    },
    {
      id: 2,
      name: 'Địa chỉ',
      icon: require('./../../assets/images/pin.png'),
      url: 'https://www.google.com/maps/search/?api=1&query=' + data?.address
    },
    {
      id: 3,
      name: 'Trang web',
      icon: require('./../../assets/images/web.png'),
      url: data?.website
    },
    {
      id: 4,
      name: 'Chia sẻ',
      icon: require('./../../assets/images/share.png'),
      url: data?.website
    },
  ]
  const OnPressHandle = (item) => {
    if (item.name == 'Chia sẻ') {
      Share.share({
        message: `Chia sẻ thông tin: ${data?.website}`,
      });
      return;
    }
    Linking.openURL(item.url);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={GroupButtonMenu}
        numColumns={4}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}  onPress={() => OnPressHandle(item)}>
            <Image source={item.icon} style={styles.img} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5ef',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  img: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  text: {
    textAlign: 'center',
    marginTop: 3,
    fontWeight: 'bold',
    color: '#333',
  }
});
export default GroupButton
