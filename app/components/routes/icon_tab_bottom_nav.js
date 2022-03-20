import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';

let textFocus = 'blue';
let textNotFocus = '#999999';
let bgFocus = '#d1e5ff';
let bgNotFocus = 'none';

const getTabIconStyle = props => {
  let textColor = props.focused ? textFocus : textNotFocus;
  let borderColor = props.focused ? textFocus : textNotFocus;
  let backgroundColor = props.focused ? bgFocus : bgNotFocus;
  return {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: borderColor,
    borderTopWidth: 4,
    padding: 20,
    backgroundColor,
    textColor
  };
};

const TaoPhieuGiaoHangTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="bookmark-plus" size={25} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Tạo H/Trình</Text>
    </View>
  );
};

const DanhSachPhieuGiaoHangTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="book-open" size={25} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Danh sách</Text>
    </View>
  );
};

const QuetGiaoXongTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="qrcode" size={25} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Quét</Text>
    </View>
  );
};
export default (IconsGiaoHang = {
  TaoPhieuGiaoHangTabIcon,
  DanhSachPhieuGiaoHangTabIcon,
  QuetGiaoXongTabIcon
});
