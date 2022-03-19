import React, { Component } from 'react';
import { View, Button, Text, TouchableOpacity, ToastAndroid, ScrollView, ListView, Dimensions, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { APP_STYLES } from '../../styles_app';
import styles from './giaoHangStyles';
import Sound from 'react-native-sound';
import * as _ from 'lodash';
import MultiSelect from 'react-native-multiple-select';
import apiService from '../../services/apiService';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import ScanBarcodeComponent from '../share-components/scanBarcode';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { LoadingIndicator } from './../../components/loadingIndicator/loadingIndicator';
import SearchableDropdown from 'react-native-searchable-dropdown';
import appService from '../../services/appService';
const TABLE_LIST_THANH_PHAM = [
  { title: 'Đã Scan', key: 'isScanedText', width: 70, order: 1 },
  { title: 'Sản phẩm', key: 'maSanPhamTenSanPham', width: 150, order: 1 },
  { title: 'Phiếu g/Hàng', key: 'idPhieuGiaoHang', width: 100, order: 4 },
  { title: 'Loại', key: 'loai', width: 70, order: 5 },
  { title: 'Số lượng', key: 'soLuongText', width: 100, order: 5 }
];
const PHIEU_GIAO_HANG_STATE = [
  { label: 'Khởi tạo', value: 'INIT' },
  { label: 'Sẵn kho', value: 'READY' },
  { label: 'Lên phiếu', value: 'FORM' },
  { label: 'Đã lấy', value: 'PICKUP' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Đã giao', value: 'DELIVERED' },
  { label: 'Trả lại', value: 'RETURNED' }
];
const PHIEU_GIAO_HANG_STATE_LABEL = v => {
  for (let item of PHIEU_GIAO_HANG_STATE) {
    if (item.value == v) {
      return item.label;
    }
  }
  return v;
};

export class ScanCompletePhieuGHComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
  componentDidMount() {}
  componentWillUnmount() {}

  playAudio = (fileAudioName = 'ting_ios.mp3') => {
    Sound.setCategory('Playback');
    const s = new Sound(fileAudioName, Sound.MAIN_BUNDLE, e => {
      if (e) {
        ToastAndroid.show(`ERROR in Sound` + JSON.stringify(e), ToastAndroid.LONG);
        console.log('Error in SOUND', e);
        return;
      }
      s.play(success => {
        if (success) {
          s.release();
        } else {
          ToastAndroid.show('playback failed due to audio decoding errors', ToastAndroid.LONG);
        }
      });
    });
  };

  onScanSuccess = async data => {
    if (this.state.isLoading === true) return;
    let idPhieuGiaoHang = data ? data.data : '';
    this.playAudio('capture_beep.mp3');
    if(!idPhieuGiaoHang) return;
    this.setState({
      isLoading: true
    });
    try {
      let rs = await apiService.put(`/admin/v1/phieu-giao-hang/${idPhieuGiaoHang}/delivered`, {
        id: idPhieuGiaoHang,
        trangThai: 'DELIVERED'
      });
      if (rs) {
        Toast.show({
          type: 'success',
          text1: 'Success ',
          text2: `Scan hoàn tất phiếu giao hàng ${idPhieuGiaoHang} thành công`,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          // topOffset: 30,
          // bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {}
        });
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi submit phiếu giao hàng',
        text2: JSON.stringify(e),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => {},
        onHide: () => {},
        onPress: () => {}
      });
    }
    this.setState({
      isLoading: false
    });
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScanBarcodeComponent onScanSuccess={this.onScanSuccess} />

        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', alignContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Vui lòng scan phiếu giao hàng đã giao</Text>
        </View>

        <Toast ref={ref => Toast.setRef(ref)} />
      </View>
    );
  }
}

const mapStateToProps = ({ routes }) => ({
  routes: routes
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanCompletePhieuGHComponent);
