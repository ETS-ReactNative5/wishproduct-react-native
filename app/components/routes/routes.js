import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';

// include
import navBarCustom from './../../components/navBarCustom/navBarCustom';
import IconsGiaoHang from './icon_tab_bottom_nav';

// page
import HomeModuleContainer from './../../components/home/home_modules';
import NhapKhoAoContainer from './../../components/nhapKhoAo/nhapKhoAo';
import NhapKhoChinhContainer from './../../components/nhapKhoChinh/nhapKhoChinh';
import NhapKhoKhacAoContainer from './../../components/nhapKhoKhac_Ao/nhapKhoKhac_Ao';
import NhapKhoKhacChinhContainer from './../../components/nhapKhoKhac_Chinh/nhapKhoKhac_Chinh';
import NhapKhoThanhPhamContainer from './../../components/nhapKhoThanhPham/nhapKhoThanhPham';
import GiaoHangContainer from './../../components/giaoHang/giaoHang';
import TaoPhieuGHContainer from './../../components/giaoHang/taoPhieuGH';
import DanhSachPhieuGHContainer from './../../components/giaoHang/danhSachPhieuGH';
import ScanCompletePhieuGHContainer from './../../components/giaoHang/scanCompletePhieuGH';

import LoginContainer from './../../components/auth/LoginForm';
import SignupContainer from './../../components/auth/SignupForm';

import profileContainer from './../../components/profile/profile';

//redux
import configureStore from './../../store/index';

export const store = configureStore();
const RouterRedux = connect()(Router);

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { TaoPhieuGiaoHangTabIcon, DanhSachPhieuGiaoHangTabIcon, QuetGiaoXongTabIcon } = IconsGiaoHang;
    return (
      <Provider store={store}>
        <RouterRedux>
          <Scene key="root">
            {/* Route not auth */}
            <Scene key="login" navBar={navBarCustom} hideNavBar={false} component={LoginContainer} title="Đăng nhập" initial={true} />
            <Scene key="signup" component={SignupContainer} title="Signup" />
            <Scene key="profile" navBar={navBarCustom} hideNavBar={false} component={profileContainer} title="Thông tin" />

            <Scene key="home" navBar={navBarCustom} hideNavBar={false} component={HomeModuleContainer} title="Trang Chủ" />

            <Scene key="kho_nhapKhoCuonChinh" navBar={navBarCustom} hideNavBar={false} component={NhapKhoChinhContainer} title="Kho Cuộn Chính" />
            <Scene key="kho_nhapKhoCuonAo" navBar={navBarCustom} hideNavBar={false} component={NhapKhoAoContainer} title="Kho Cuộn Ảo" />

            <Scene key="kho_nhapKhoKhacChinh" navBar={navBarCustom} hideNavBar={false} component={NhapKhoKhacChinhContainer} title="Kho Khác Chính" />
            <Scene key="kho_nhapKhoKhacAo" navBar={navBarCustom} hideNavBar={false} component={NhapKhoKhacAoContainer} title="Kho Khác Ảo" />

            <Scene key="kho_nhapKhoThanhPham" navBar={navBarCustom} hideNavBar={false} component={NhapKhoThanhPhamContainer} title="Kho Thành Phẩm" />

            {/* <Scene key="kho_giaoHang" navBar={navBarCustom} hideNavBar={false} component={GiaoHangContainer} title="Giao Hàng" /> */}
            {/* GIAO HANG TAB */}
            <Scene key="kho_giaoHang" showLabel={false} tabs={true} navBar={navBarCustom} hideNavBar={false} title="Giao Hàng">
              <Scene key="kho_giaoHang_taoPhieuGiaoHang" component={TaoPhieuGHContainer} hideNavBar={true} title="Tạo Hành Trình" initial={true} icon={TaoPhieuGiaoHangTabIcon} />
              <Scene key="kho_giaoHang_danhSachPhieu" component={DanhSachPhieuGHContainer} hideNavBar={true} title="Danh sách" icon={DanhSachPhieuGiaoHangTabIcon} />
              <Scene key="home_giaoHang_quetGiaoXong" component={ScanCompletePhieuGHContainer} hideNavBar={true} title={'Quét'} icon={QuetGiaoXongTabIcon} />
            </Scene>

            {/* TABs Containner */}
            {/* <Scene key='home' showLabel={false} tabs={true} navBar={navBarCustom} hideNavBar={false} title='Trang Chủ'>
              <Scene key='home_nhapKho'    component={nhapKhoContainer} hideNavBar={true} title='Nhap Kho' initial={true} icon={NhapKhoTabIcon} />
              <Scene key='home_nhapHang'   component={CounterContainer}  hideNavBar={true} title='Nhap Hang' icon={NhapHangTabIcon} />
              <Scene key='home_giaoHang'   component={TodolistContainer}  hideNavBar={true} title={'Giao Hang'} icon={GiaoHangTabIcon} />
            </Scene> */}

            {/* <Scene key="camera" back={true} backButtonTintColor={'#000000'} component={nhapKhoContainer} title="Scan BarCode" /> */}
          </Scene>
        </RouterRedux>
      </Provider>
    );
  }
}
