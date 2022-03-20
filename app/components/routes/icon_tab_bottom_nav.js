import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';

let textFocus = '#fff';
let textNotFocus = '#000';
let bgFocus = '#3d8bfd';
let bgNotFocus = '#cfe2ff';
const FONT_SIZE_ICON = 22;
const FONT_SIZE_TEXT = 12;
const getTabIconStyle = props => {
  let textColor = props.focused ? textFocus : textNotFocus;
  let borderColor = props.focused ? bgFocus : bgNotFocus;
  let backgroundColor = props.focused ? bgFocus : bgNotFocus;
  return {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: borderColor,
    borderTopWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor,
    textColor,
    width:'100%'
  };
};

const IconTabHome = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="home" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor, fontSize: FONT_SIZE_TEXT }}>Home</Text>
    </View>
  );
};
const IconTabFilter = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="filter" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor, fontSize: FONT_SIZE_TEXT  }} >Filter</Text>
    </View>
  );
};
const IconTabAccount = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="account" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor, fontSize: FONT_SIZE_TEXT  }}>Account</Text>
    </View>
  );
};
const IconTabSearch = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="cloud-search" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor, fontSize: FONT_SIZE_TEXT  }}>Search</Text>
    </View>
  );
};



const TaoPhieuGiaoHangTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="bookmark-plus" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Tạo H/Trình</Text>
    </View>
  );
};

const DanhSachPhieuGiaoHangTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="book-open" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Danh sách</Text>
    </View>
  );
};

const QuetGiaoXongTabIcon = props => {
  let styles = getTabIconStyle(props);
  return (
    <View style={{ ...styles }}>
      <Icon name="qrcode" size={FONT_SIZE_ICON} color={styles.textColor} />
      <Text style={{ color: styles.textColor }}>Quét</Text>
    </View>
  );
};
export default (IconsGiaoHang = {
  IconTabHome,
  IconTabFilter,
  IconTabAccount,
  IconTabSearch,

  TaoPhieuGiaoHangTabIcon,
  DanhSachPhieuGiaoHangTabIcon,
  QuetGiaoXongTabIcon
});
