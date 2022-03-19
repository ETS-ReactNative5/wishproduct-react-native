import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-toast-message';
import {
  StyleSheet, Picker, ScrollView,
  Text,
  TouchableOpacity,
  Linking, View, Button, Alert, ToastAndroid, TextInput
} from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Sound from 'react-native-sound';
import ScanBarcodeComponent from '../share-components/scanBarcode';
import { APP_STYLES } from '../../styles_app';
import styles from './nhapKhoThanhPhamStyles';
import * as _ from 'lodash';
import apiService from '../../services/apiService';
import LoadingIndicator from '../loadingIndicator/loadingIndicator';

// const VIEW_LIST_VAT_TU =  'VIEW_LIST_VAT_TU';
// const VIEW_FORM_SEARCH =  'VIEW_FORM_SEARCH';
const VIEW_SCAN_BARCODE = 'VIEW_SCAN_BARCODE';
const STEP_SCAN_KE = 'STEP_SCAN_KE';
const STEP_SCAN_THANH_PHAM = 'STEP_SCAN_THANH_PHAM';
// const STEP_SCAN_NHAP_KHO_AO =  'STEP_SCAN_NHAP_KHO_AO';
class NhapKhoThanhPham extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scanData: {
        keKhoBarCode: '',
        thanhPhamBarCode: '',
      },
      viewType: VIEW_SCAN_BARCODE,
      scanStep: STEP_SCAN_KE,

    }
  }

  componentDidMount() {
  }
  componentWillUnmount() {

  }

  getListVatTuKho = async () => {
    //   Nhập kho thật:
    // - Vào màn hình là thực hiện quét barcode luôn, loop cycle cho tới khi user nhấn thoát
    // - Filter VatTuKho TrangThai: READY
  }



  playAudio = (fileName = 'ting_ios.mp3') => {
    Sound.setCategory('Playback');
    const s = new Sound(fileName, Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        ToastAndroid.show(`ERROR in Sound` + JSON.stringify(e), ToastAndroid.LONG);
        console.log('Error in SOUND', e);
        return;
      }
      s.play((success) => {
        if (success) {
          // ToastAndroid.show('successfully finished playing',ToastAndroid.LONG);
          s.release();
        } else {
          ToastAndroid.show('playback failed due to audio decoding errors', ToastAndroid.LONG);
        }
      });
    });
  }

  onScanSuccess = async (data) => {
    console.log(`onScanSuccess`, data);
    if (this.state.scanStep === STEP_SCAN_KE) {
      this.playAudio('capture_beep.mp3');
      ToastAndroid.show(`Scan barCode kệ kho thành công: ${data.data}`, ToastAndroid.LONG);
      let scanData = this.state.scanData;
      scanData.keKhoBarCode = data.data;
      this.setState({
        scanData: scanData,
        scanStep: STEP_SCAN_THANH_PHAM, //next scan thanhPham 
      });
      return;
    }
    else
      if (this.state.scanStep === STEP_SCAN_THANH_PHAM) {
        this.playAudio('capture_beep.mp3');
        ToastAndroid.show(`Scan barCode thành phẩm thành công: ${data.data}`, ToastAndroid.LONG);
        let scanData = this.state.scanData;
        scanData.thanhPhamBarCode = data.data;
        this.setState({
          scanData: scanData,
        }, async () => {
          //call api assign VatTu vao Ke
          let scanData = _.cloneDeep(this.state.scanData);
          let url = '/admin/v1/thanh-pham-kho/nhap/kho-chinh';
          try {
            let params = {
              thanhPhamBarCode: scanData.thanhPhamBarCode,
              keKhoBarCode: scanData.keKhoBarCode,
            };
            let rs = await apiService.post(url, params);
            if (rs) {
              this.playAudio('single_beep_01.mp3');
              ToastAndroid.show(`Nhập thành phẩm vào kho thành công`, ToastAndroid.LONG);
              this.setState({
                scanStep: STEP_SCAN_KE,//quay lai scan Ke Kho
                scanData: { keKhoBarCode: '', thanhPhamBarCode: '' },
              });
            }
          } catch (e) {
            console.log(e);
            this.playAudio('error_beep_01.mp3');
            ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
            Toast.show({
              type: 'error',
              text1: 'ERROR',
              text2: JSON.stringify(e || `No message from API ${url}`),
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
              onShow: () => { },
              onHide: () => { },
              onPress: () => { }
            });
            //quay lai scan Ke Kho
            this.setState({
              scanStep: STEP_SCAN_KE,
              scanData: {
                keKhoBarCode: '',
                thanhPhamBarCode: ''
              },
            });
          }
        });
      }
  }

  exitScanScreen = () => {
    this.setState({
      scanStep: '',
      viewType: ''
    }, () => {
      return Actions.home();
    });
  }

  render() {
    if (this.state.viewType === VIEW_SCAN_BARCODE) {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScanBarcodeComponent onScanSuccess={this.onScanSuccess}></ScanBarcodeComponent>
          <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', alignContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Vui lòng scan barcode {this.state.scanStep === STEP_SCAN_KE ? 'kệ kho' : 'thành phẩm'}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => this.exitScanScreen()} style={APP_STYLES.button}>
              <Text style={APP_STYLES.buttonTitle}>
                <Icon name="close" color="#ffffff" size={20}></Icon> Thoát
              </Text>
            </TouchableOpacity>
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
      </View>
    );
  }
}

const mapStateToProps = ({ routes, sessionReducer }) => ({
  routes: routes,
  user: sessionReducer.user,
  logged: sessionReducer.logged,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NhapKhoThanhPham);
