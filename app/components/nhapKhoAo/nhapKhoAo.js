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
import styles from './nhapKhoAoStyles';
import * as _ from 'lodash';
import apiService from '../../services/apiService';
import LoadingIndicator from '../loadingIndicator/loadingIndicator';

const VIEW_LIST_VAT_TU = 'VIEW_LIST_VAT_TU';
const VIEW_LIST_VAT_TU_AFTER_SCANED = 'VIEW_LIST_VAT_TU_AFTER_SCANED';
const VIEW_FORM_SEARCH = 'VIEW_FORM_SEARCH';
const STEP_SCAN_NHAP_KHO_AO = 'STEP_SCAN_NHAP_KHO_AO';
const STEP_REVIEW_PROCESS_SCANED = 'STEP_REVIEW_PROCESS_SCANED';

const TABLE_LIST_VAT_TU_KHO = [
  { title: 'Mã Vật Tư', key: 'maVatTu', width: 100, order: 1 },
  { title: 'Khổ cuộn', key: 'khoCuon', width: 100, order: 2 },
  { title: 'C/dài thực tế', key: 'chieuDaiThucTe', width: 100, order: 3 },
  { title: 'Mã NCC', key: 'maNCC', width: 100, order: 4 },
  { title: 'Mã V/tư NCC', key: 'maVatTuNCC', width: 100, order: 5 },
]

const TABLE_LIST_VAT_TU_KHO_SCANED = [
  { title: 'Mã Vật Tư', key: 'maVatTu', width: 100, order: 1 },
  { title: 'Khổ cuộn', key: 'khoCuon', width: 100, order: 2 },
  { title: 'BarCode', key: 'barCode', width: 100, order: 4 },
  { title: 'C/dài thực tế', key: 'chieuDaiThucTe', width: 100, order: 4 },
  { title: 'Mã NCC', key: 'maNCC', width: 100, order: 5 },
  { title: 'Mã V/tư NCC', key: 'maVatTuNCC', width: 100, order: 6 },
]
class NhapKhoAo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchCondition: {
        // idPO: '',
        idPhieuNhap: ''
      },
      scanData: {
        barCodeKe: '',
        barCodeVatTu: '',
      },
      viewType: VIEW_FORM_SEARCH,
      scanStep: '',
      ngSelectNhaCC: {
        items: [
        ],
        selectedItem: ''
      },
      ngSelectPO: {
        items: [
        ],
        selectedItem: ''
      },
      ngSelectPhieuNhap: {
        items: [
        ],
        selectedItem: ''
      },
      ngSelectKhoCuon: {
        items: [
        ],
        selectedItem: ''
      },
      ngSelectChieuDaiThucTe: {
        items: [
        ],
        selectedItem: ''
      },
      ngSelectMaVatTuNCC: {
        items: [
        ],
        selectedItem: ''
      },
      listVatTuKho: [], // araay array
      isLoading: false,
    }
  }

  componentDidMount() {
    this.getListNhaCC();
  }
  componentWillUnmount() {
  }
  playAudio = (fileAudioName = 'ting_ios.mp3') => {
    Sound.setCategory('Playback');
    const s = new Sound(fileAudioName, Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        ToastAndroid.show(`ERROR in Sound` + JSON.stringify(e), ToastAndroid.LONG);
        console.log('Error in SOUND', e);
        return;
      }
      s.play((success) => {
        if (success) {
          s.release();
        } else {
          ToastAndroid.show('playback failed due to audio decoding errors', ToastAndroid.LONG);
        }
      });
    });
  }

  getListNhaCC = async () => {
    try {
      let params = {
        page: 0,
        limit: 1000,
      }
      let rs = await apiService.get('/v1/provider/active', { params });
      if (rs && rs.data && rs.data.items) {
        this.setState({
          ngSelectNhaCC: {
            ...this.state.ngSelectNhaCC,
            items: _.orderBy(rs.data.items, ['code'], ['asc']).map(item => {
              return {
                ...item,
                label: item.code + ' | ' + item.name,
                name: item.code + ' | ' + item.name,
                value: item.id,
              }
            }),
          }
        })
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get list Nha Cung Cap',
        text2: JSON.stringify(e),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { }
      });
    }
  }
  getListPO = async () => {
    let { ngSelectNhaCC } = this.state;
    let nhaCC = ngSelectNhaCC.selectedItem;
    try {
      let params = {
        page: 0,
        limit: 1000,
        maNCC: nhaCC ? nhaCC.code || nhaCC.maNCC : '',
        listTrangThai: 'WAITING',
      };
      let rs = await apiService.get('/admin/v1/phieu-dat-vat-tu-cuon/get-by-ncc', { params });
      if (rs && rs.data && rs.data.items) {
        this.setState({
          ngSelectPO: {
            ...this.state.ngSelectPO,
            items: _.orderBy(rs.data.items, ['id'], ['asc']).map(item => {
              return {
                ...item,
                label: `${item.id} - ${item.maNCC} - Trang Thai:${item.trangThai} `, //  + ' | ' +item.name,
                value: item.id,
              }
            }),
          }
        })
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get list PO ',
        text2: JSON.stringify(e),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { }
      });
    }
  }
  getListPhieuNhap = async () => {
    let { ngSelectNhaCC } = this.state;
    let nhaCC = ngSelectNhaCC.selectedItem;
    try {
      let params = {
        page: 0,
        limit: 100,
        tuNguon: 'PO',
        maNCC: nhaCC ? (nhaCC.maNCC || nhaCC.code) : '',
        idNCC: nhaCC ? (nhaCC.id) : '',
      };
      let rs = await apiService.get('/admin/v1/phieu-nhap-vat-tu-cuon/filter', { params });
      if (rs && rs.data && rs.data.items) {
        this.setState({
          ngSelectPhieuNhap: {
            ...this.state.ngSelectPhieuNhap,
            items: rs.data.items.map(item => {
              return {
                ...item,
                label: `${item.id} - ${item.maNCC} - Nguon:${item.tuNguon}`,
                value: item.id,
              }
            }),
          }
        })
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get list Phieu Nhap ',
        text2: JSON.stringify(e),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { }
      });
    }
  }

  getListVatTuKho = async () => {
    let { ngSelectNhaCC: { selectedItem: nhaCC }, ngSelectPO: { selectedItem: selectedPO }, ngSelectPhieuNhap: { selectedItem: selectedPhieuNhap }, searchCondition } = this.state;
    try {
      let params = {
        // idPO=3&
        // idPhieuNhap=&
        // trangThai=PO&
        // khoCuon=100&
        // maNCC=NAM THÁI BÌNH&
        trangThai: 'WAITING'
      };
      if (nhaCC)
        params.maNCC = nhaCC.maNCC || nhaCC.code;
      // if(selectedPO)  params.idPO = selectedPO.id;
      // if(selectedPhieuNhap) params.idPhieuNhap = selectedPhieuNhap.id;
      // if (searchCondition && searchCondition.idPO) params.idPO = searchCondition.idPO;
      if (searchCondition && searchCondition.idPhieuNhap) params.idPhieuNhap = searchCondition.idPhieuNhap;

      let rs = await apiService.get('/admin/v1/vat-tu-cuon-kho/filter', { params });
      if (rs && rs.data && rs.data.items) {
        rs.data.items = _.orderBy(rs.data.items, ['id'], ['asc']);
        let listKhoCuon = [];
        let listChieuDaiThucTe = [];
        let listMaVatTuNCC = [];
        rs.data.items = rs.data.items.map(r => {
          r.khoCuon = r.khoCuon ? parseInt(r.khoCuon) : null;
          r.chieuDaiThucTe = r.chieuDaiThucTe ? parseInt(r.chieuDaiThucTe) : null;
          r.isHide = false;
          if (r.khoCuon && listKhoCuon.includes(r.khoCuon) === false) {
            listKhoCuon.push(r.khoCuon);
          }
          if (r.chieuDaiThucTe && listChieuDaiThucTe.includes(r.chieuDaiThucTe) === false) {
            listChieuDaiThucTe.push(r.chieuDaiThucTe);
          }
          if (r.maVatTuNCC && listMaVatTuNCC.includes(r.maVatTuNCC) === false) {
            listMaVatTuNCC.push(r.maVatTuNCC);
          }
          return r;
        });
        this.setState({
          listVatTuKho: rs.data.items,
          ngSelectKhoCuon: {
            items: listKhoCuon.map(ite => {
              return {
                label: (ite || '').toString(),
                value: ite,
                id: ite,
              }
            }),
            selectedItem: null,
          },
          ngSelectChieuDaiThucTe: {
            items: listChieuDaiThucTe.map(ite => {
              return {
                label: (ite || '').toString(),
                value: ite,
                id: ite,
              }
            }),
            selectedItem: null,
          },
          ngSelectMaVatTuNCC: {
            items: listMaVatTuNCC.map(ite => {
              return {
                label: (ite || '').toString(),
                value: ite,
                id: ite,
              }
            }),
            selectedItem: null,
          }
        })
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get list Vat Tu Kho ',
        text2: JSON.stringify(e),
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { }
      });
    }
  }

  convertListToDataTable = (typeScan = '') => {
    let { listVatTuKho } = this.state;
    let dataTable = [];
    if (typeScan === '') {
      listVatTuKho.map(r => {
        let perRow = [];
        let rowKeys = TABLE_LIST_VAT_TU_KHO.map(ite => ite.key);
        for (let k of rowKeys) {
          perRow.push(r[k] || '');
        }
        if (r.isHide !== true) {
          dataTable.push(perRow);
        }
      });
      return dataTable;
    } else if(typeScan==='scanCompleted'){
      listVatTuKho.filter(r => r.isHide !== true && r.barCode).map(r => {
        let perRow = [];
        let rowKeys = TABLE_LIST_VAT_TU_KHO_SCANED.map(ite => ite.key);
        for (let k of rowKeys) {
          perRow.push(r[k] || '');
        }
        dataTable.push(perRow);
      });
      return dataTable;
    }else if(typeScan === 'processScaned'){
      listVatTuKho.filter(r => r.isHide !== true && r.barCode).map(r => {
        let perRow = [];
        let rowKeys = TABLE_LIST_VAT_TU_KHO_SCANED.map(ite => ite.key);
        for (let k of rowKeys) {
          perRow.push(r[k] || '');
        }
        dataTable.push(perRow);
      });
      return dataTable;
    }
  }

  setDataListScanComplete = async () => {
    let { listVatTuKho } = this.state;
    this.setState({
      scanStep: '',
      viewType: VIEW_LIST_VAT_TU_AFTER_SCANED,
    }, () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Scan xong hết danh sách vật tư kho ảo`,
        position: 'top',
        visibilityTime: 5000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { },
      });
    })
  }


  onScanSuccess = async (data) => {
    if (this.state.isLoading === true) return;

    let barCodeScaned = data ? data.data : '';
    let { listVatTuKho } = this.state;
    this.playAudio('capture_beep.mp3');
    if (this.state.scanStep === STEP_SCAN_NHAP_KHO_AO) {
      let listNeedScan = listVatTuKho.filter(r => r.isHide !== true);
      let findIndex = -1;
      for (let i = 0; i < listNeedScan.length; i++) { if (['', null, undefined].includes(listNeedScan[i].barCode)) { findIndex = i; break; } }
      if (findIndex >= 0) {
        try {
          let param = {
            ...listNeedScan[findIndex],
            vatTuKhoBarCode: barCodeScaned,
            vatTuKhoId: listNeedScan[findIndex].id,
          }
          if (!param.vatTuKhoId || !param.vatTuKhoBarCode) {
            Toast.show({
              type: 'error',
              text1: 'Request error',
              text2: !param.vatTuKhoId ? 'Missing vatTuKhoId' : 'Missing vatTuKhoBarCode',
              visibilityTime: 3000,
            });
            return;
          }
          this.setState({ isLoading: true });
          let rs = await apiService.post('/admin/v1/vat-tu-cuon-kho/nhap/kho-ao', { ...param, });
          if (rs) {
            this.playAudio('single_beep_01.mp3');
            listNeedScan[findIndex].barCode = barCodeScaned; //set barCode if call api OK

            //cap nhap lai barCode cho list listVatTuKho
            let ffind = _.findIndex(listVatTuKho, { id: listNeedScan[findIndex].id });
            if (ffind >= 0) {
              listVatTuKho[ffind].barCode = barCodeScaned;
              this.setState({ listVatTuKho: listVatTuKho });
            }
            ToastAndroid.show(`${findIndex + 1}/${listNeedScan.length} items được cập nhập`, ToastAndroid.LONG);
            if ((findIndex + 1) >= listNeedScan.length) {
              this.setDataListScanComplete();
            }
          }
          this.setState({ isLoading: false });
        } catch (e) {
          this.setState({ isLoading: false });
          this.playAudio('error_beep_01.mp3');
          ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG);
          Toast.show({
            type: 'error',
            text1: 'Lỗi nhập kho ảo',
            text2: JSON.stringify(e),
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
            // topOffset: 30,
            // bottomOffset: 40,
            onShow: () => { },
            onHide: () => { },
            onPress: () => { }
          });
        }
      } else {
        // khong con item nao co barCode = null
        this.setDataListScanComplete();
      }
      return;
    }
  }


  submitSearch = async () => {
    let { ngSelectNhaCC: { selectedItem: nhaCC }, ngSelectPO: { selectedItem: selectedPO }, ngSelectPhieuNhap: { selectedItem: selectedPhieuNhap } } = this.state;
    if (!nhaCC) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Chọn nhà cung cấp `,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        // topOffset: 30,
        // bottomOffset: 40,
        onShow: () => { },
        onHide: () => { },
        onPress: () => { }
      });
      return;
    }
    await this.getListVatTuKho();
    this.setState({
      viewType: VIEW_LIST_VAT_TU,
    });
  }


  exitScanScreen = () => {
    this.setState({
      scanStep: '',
      viewType: '',
    }, () => {
      Actions.home();
    });
  }

  exitCameraScanKhoAo = () => {
    let { listVatTuKho } = this.state;
    let listScanning = listVatTuKho.filter(r => r.isHide !== true && !r.barCode);
    if (listScanning.length > 0) {
      Alert.alert(
        "Tắt scan kho ảo !",
        "Đang thực hiện scan barCode kho ảo. Nếu chọn thoát danh sách sẽ còn lại những vật tư chưa được scan. Bạn có chắc muốn thoát ?",
        [
          {
            text: "Không",
            onPress: () => { console.log("Cancel Pressed"); },
            style: "cancel"
          },
          {
            text: "Có",
            onPress: () => {
              let listNotScan = listVatTuKho.filter(r => { return ['', null, undefined].includes(r.barCode); });
              this.setState({
                scanStep: '',
                viewType: VIEW_LIST_VAT_TU,
                listVatTuKho: listNotScan.map(r => {
                  r.isHide = false;
                  return r;
                })
              })
            }
          }
        ]
      );
    } else {
      this.setState({
        scanStep: '',
        viewType: VIEW_LIST_VAT_TU,
        listVatTuKho: listVatTuKho.map(r => {
          r.isHide = false;
          return r;
        })
      })
    }
  }

  backToListVatTuKho_ToScanContinue = () => {
    let { listVatTuKho,ngSelectKhoCuon, ngSelectChieuDaiThucTe, ngSelectMaVatTuNCC } = this.state;
    ngSelectKhoCuon.selectedItem = null;
    ngSelectChieuDaiThucTe.selectedItem = null;
    ngSelectMaVatTuNCC.selectedItem = null;
    let listCanScan = listVatTuKho.filter(r => {
      return r.isHide === true || !r.barCode;
    });
    listCanScan = listCanScan.map(r => {
      r.isHide = false;
      return r;
    });
    this.setState({
      listVatTuKho: listCanScan,
      viewType: VIEW_LIST_VAT_TU,
      ngSelectKhoCuon,
      ngSelectChieuDaiThucTe,
      ngSelectMaVatTuNCC,
    });
  }

  filterDSVatTuCuon = ()=>{
    let {listVatTuKho, ngSelectKhoCuon:{selectedItem: selectKhoCuon}, ngSelectMaVatTuNCC:{selectedItem: selectMaVatTuNCC},
    ngSelectChieuDaiThucTe:{selectedItem: selectChieuDaiThucTe}} = this.state;
    listVatTuKho = listVatTuKho.map(r => {
      // if(selectKhoCuon && selectChieuDaiThucTe && selectMaVatTuNCC){
      //   r.isHide = !(r.khoCuon == selectKhoCuon.value && r.chieuDaiThucTe == selectChieuDaiThucTe.value && r.maVatTuNCC == selectMaVatTuNCC.value);
      //   return r;
      // }
      let isShow = true;
      if(selectKhoCuon){
        isShow = isShow && (r.khoCuon == selectKhoCuon.value);
      }
      if(selectChieuDaiThucTe){
        isShow = isShow && (r.chieuDaiThucTe == selectChieuDaiThucTe.value);
      }
      if(selectMaVatTuNCC){
        isShow = isShow && (r.maVatTuNCC == selectMaVatTuNCC.value);
      }
      r.isHide = !isShow;
      return r;
    });
    this.setState({listVatTuKho});
  }
  render() {
    let { ngSelectNhaCC, ngSelectPO, ngSelectPhieuNhap, listVatTuKho, ngSelectKhoCuon, ngSelectChieuDaiThucTe, ngSelectMaVatTuNCC, viewType } = this.state;
    let { searchCondition } = this.state;
    if (viewType === VIEW_FORM_SEARCH) {
      return (
        <View style={styles.containerFormSearch}>
          <View>
            <Text style={styles.textLabel}>Nhà cung cấp<Text style={{ color: 'red' }}> * </Text></Text>
            <SearchableDropdown
              onTextChange={text => { }}
              onItemSelect={item => {
                console.log(`select Nha CC`, item);
                ngSelectNhaCC.selectedItem = item;
                if (item) {
                  this.setState({ ngSelectNhaCC }, async () => {
                    await this.getListPhieuNhap();
                    // await this.getListPO();
                  });
                }
              }}
              containerStyle={{ padding: 10, }}
              textInputStyle={{
                padding: 10,
                paddingLeft: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                backgroundColor: '#f1f1f1',
                borderRadius: 5,
              }}
              itemStyle={{
                padding: 10,
                paddingLeft: 10,
                marginTop: 0,
                backgroundColor: '#FAF9F8',
                borderColor: '#bbb',
                borderWidth: 1,
                size: 12,
              }}
              itemTextStyle={{
                color: '#222',
                fontSize: 12
              }}
              itemsContainerStyle={{
                maxHeight: '60%',
              }}
              items={ngSelectNhaCC.items}
              // defaultIndex={2}
              placeholder="Gõ chọn nhà cung cấp"
              underlineColorAndroid="transparent"
              resetValue={true}
            />
            {ngSelectNhaCC.selectedItem ? <Text style={{ textAlign: 'left', paddingLeft: 0, marginLeft: 10, marginTop: 5, color: 'blue' }}>
              {ngSelectNhaCC.selectedItem.code + ' | ' + ngSelectNhaCC.selectedItem.name}
            </Text> : null}
          </View>

          {/* <View>
            <Text style={styles.textLabel}>Nhập PO </Text>
            <RNPickerSelect style={APP_STYLES.ngSelectStyle}
                onValueChange={(id) => {
                  let item = _.find(ngSelectPO.items,{id: id});
                  ngSelectPO.selectedItem=item;
                  this.setState({ngSelectPO},()=>{
                  });
                }}
                items={ngSelectPO.items}
            />
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              placeholder="Nhập PO"
              returnKeyType="next"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
                searchCondition.idPO = e;
                this.setState({ searchCondition });
              }}
              value={searchCondition.idPO}
              underlineColorAndroid={'transparent'}
            />
          </View> */}

          <View>
            <Text style={styles.textLabel}>Chọn Phiếu Nhập </Text>
            <RNPickerSelect 
              style={APP_STYLES.ngSelectStyle}
              items={ngSelectPhieuNhap.items}
              onValueChange={(id) => {
                console.log(`select Chọn Phiếu Nhập`, id);
                let item = _.find(ngSelectPhieuNhap.items,{id:id});
                ngSelectPhieuNhap.selectedItem = item;
                searchCondition.idPhieuNhap = item && item.id ? item.id : id;
                this.setState({
                  ngSelectPhieuNhap,
                  searchCondition,
                },()=>{
                });
              }}
            />
            {/* <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              placeholder="Nhập Phiếu Nhập"
              returnKeyType="done" 
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
                searchCondition.idPhieuNhap = e;
                this.setState({ searchCondition });
              }}
              value={searchCondition.idPhieuNhap}
              underlineColorAndroid={'transparent'}
            /> */}
          </View>
          <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>

            <TouchableOpacity onPress={() => this.exitScanScreen()} style={[APP_STYLES.button, { width: '45%' }]}>
              <Text style={APP_STYLES.buttonTitle}><IconFontAwesome name="close" color="#ffffff" size={20} /> Thoát </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.submitSearch()} style={[APP_STYLES.button, { width: '45%' }]}>
              <Text style={APP_STYLES.buttonTitle}><IconFontAwesome name="search" color="#ffffff" size={20} /> Tìm Vật tư</Text>
            </TouchableOpacity>
          </View>


          <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>
      );
    }

    if (viewType === VIEW_LIST_VAT_TU) {
      if (this.state.scanStep === STEP_SCAN_NHAP_KHO_AO) {
        let totalScanedItems = listVatTuKho.filter(r=>r.isHide != true && r.barCode).length;
        let totalItemsScan = listVatTuKho.filter(r=>r.isHide != true).length;
        return (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <ScanBarcodeComponent onScanSuccess={this.onScanSuccess}></ScanBarcodeComponent>
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', alignContent: 'center', alignItems: 'center', zIndex: 9999 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14, }}>Vui lòng scan barcode nhập kho ảo</Text>
            </View>

            <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => this.exitCameraScanKhoAo()} style={[APP_STYLES.button, { width: '45%' }]} >
                <Text style={APP_STYLES.buttonTitle}>
                  <Icon name="close" color="#ffffff" size={20}></Icon> Thoát camera
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() =>{
                return totalItemsScan == 0 || totalScanedItems == 0 ? null : this.setState({scanStep:STEP_REVIEW_PROCESS_SCANED})
                }} style={[APP_STYLES.button, { width: '45%' }]}>
                <Text style={APP_STYLES.buttonTitle}>
                  <IconFontAwesome name="eye" color="#ffffff" size={20} /> Scan được {totalScanedItems}/{totalItemsScan}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </View>
        );
      }
      if(this.state.scanStep === STEP_REVIEW_PROCESS_SCANED){
        let listProcessItemsScaned = this.convertListToDataTable('processScaned');
        return (
          <ScrollView>
            <View>
              <Text style={{ ...styles.textLabel, textAlign: 'center' }}>Tiến trình d/sách vật tư đã scan</Text>
            </View>
            <View>
              {listProcessItemsScaned && listProcessItemsScaned.length > 0
                ?
                <ScrollView horizontal={true} style={{ marginTop: 15 }}>
                  <View>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                      <Row data={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.title)}
                        widthArr={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.width)}
                        style={{ backgroundColor: "#ffffff" }}
                        textStyle={{ color: 'black', fontWeight: 'bold', fontSize: 12, padding: 5, height: 30 }} />
                    </Table>
                    <ScrollView style={{}}>
                      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        {
                          listProcessItemsScaned.map((item, index) => ( //item is array
                            <Row
                              key={index}
                              data={item}
                              widthArr={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.width)}
                              style={[index % 2 && { backgroundColor: '#F7F6E7' }]}
                              textStyle={{}}
                            />
                          ))
                        }
                      </Table>
                    </ScrollView>
                  </View>
                </ScrollView>
                : 
                <View>
                  <Text style={{ ...styles.textLabel, textAlign: 'center' }}>Chưa có item nào được scan.</Text>
                </View>}
            </View>
            
            <View>
              <TouchableOpacity onPress={() => { 
                this.setState({
                  scanStep: STEP_SCAN_NHAP_KHO_AO,
                })
               }}
                style={APP_STYLES.button}>
                <Text style={APP_STYLES.buttonTitle}>
                  <IconFontAwesome name="arrow-left" color="#ffffff" size={20}></IconFontAwesome> 
                  Quay lại camera scan
                </Text>
              </TouchableOpacity>
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </ScrollView>
        )
      }
      return (
        <ScrollView>
          <View>
            <Text style={{ ...styles.textLabel, textAlign: 'center' }}>Danh sách vật tư cuộn trong kho</Text>
          </View>
          <View>
            <Text style={styles.textLabel}>Filter Khổ cuộn</Text>
            <RNPickerSelect style={APP_STYLES.ngSelectStyle}
              onValueChange={(vKhoCuon) => {
                console.log(`filter Khổ cuộn `, vKhoCuon);
                let item = _.find(ngSelectKhoCuon.items, { value: vKhoCuon });
                ngSelectKhoCuon.selectedItem = item;
                this.setState({ ngSelectKhoCuon }, () => {
                  this.filterDSVatTuCuon();
                });
              }}
              items={ngSelectKhoCuon.items}
            />
          </View>
          <View>
            <Text style={styles.textLabel}>Filter Mã V/tư NCC</Text>
            <RNPickerSelect 
              style={APP_STYLES.ngSelectStyle}
              onValueChange={(e) => {
                console.log(`filter Mã V/tư NCC `, e);
                let item = _.find(ngSelectMaVatTuNCC.items, { value: e });
                ngSelectMaVatTuNCC.selectedItem = item;
                this.setState({ ngSelectMaVatTuNCC},()=>{
                  this.filterDSVatTuCuon();
                });
              }}
              items={ngSelectMaVatTuNCC.items}
            />
          </View>
          <View>
            <Text style={styles.textLabel}>Filter C/dài thực tế</Text>
            <RNPickerSelect 
              style={APP_STYLES.ngSelectStyle}
              onValueChange={(e) => {
                console.log(`filter C/dài thực tế `, e);
                let item = _.find(ngSelectChieuDaiThucTe.items, { value: e });
                ngSelectChieuDaiThucTe.selectedItem = item;
                this.setState({ ngSelectChieuDaiThucTe},()=>{
                  this.filterDSVatTuCuon();
                });
              }}
              items={ngSelectChieuDaiThucTe.items}
            />
          </View>
          <View>
            {this.state.listVatTuKho.length
              ?
              <ScrollView horizontal={true} style={{ marginTop: 15 }}>
                <View>
                  <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Row
                      data={TABLE_LIST_VAT_TU_KHO.map(r => r.title)}
                      widthArr={TABLE_LIST_VAT_TU_KHO.map(r => r.width)}
                      style={{ backgroundColor: "#ffffff" }}
                      textStyle={{ color: 'black', fontWeight: 'bold', fontSize: 12, padding: 5, height: 30 }} />
                  </Table>
                  <ScrollView style={{}}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                      {
                        this.convertListToDataTable().filter(r => r.isHide !== true).map((item, index) => ( //item is array
                          <Row
                            key={index}
                            data={item}
                            widthArr={TABLE_LIST_VAT_TU_KHO.map(r => r.width)}
                            style={[index % 2 && { backgroundColor: '#F7F6E7' }]}
                            textStyle={{}}
                          />
                        ))
                      }
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
              : null}
          </View>

          <View>
            {listVatTuKho.filter(r => r.isHide !== true).length
              ? <TouchableOpacity onPress={(e) => { this.setState({ scanStep: STEP_SCAN_NHAP_KHO_AO }) }} style={APP_STYLES.button}>
                <Text style={APP_STYLES.buttonTitle}><Icon name="qrcode" color="#ffffff" size={20}></Icon> Scan Nhập kho ảo</Text>
              </TouchableOpacity>
              : null}
            <TouchableOpacity
              onPress={() => { this.setState({ viewType: VIEW_FORM_SEARCH, }) }}
              style={APP_STYLES.button}>
              <Text style={APP_STYLES.buttonTitle}><IconFontAwesome name="arrow-left" color="#ffffff" size={20}></IconFontAwesome> Quay lại </Text>
            </TouchableOpacity>
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
      )
    }


    if (viewType === VIEW_LIST_VAT_TU_AFTER_SCANED) {
      let listVatTuKhoScanedComplete = this.convertListToDataTable('scanCompleted');
      return (
        <ScrollView>
          <View>
            <Text style={{ ...styles.textLabel, textAlign: 'center' }}>Danh sách vật tư kho sau khi scan</Text>
          </View>
          <View>
            {listVatTuKhoScanedComplete.length
              ?
              <ScrollView horizontal={true} style={{ marginTop: 15 }}>
                <View>
                  <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    <Row data={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.title)}
                      widthArr={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.width)}
                      style={{ backgroundColor: "#ffffff" }}
                      textStyle={{ color: 'black', fontWeight: 'bold', fontSize: 12, padding: 5, height: 30 }} />
                  </Table>
                  <ScrollView style={{}}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                      {
                        listVatTuKhoScanedComplete.map((item, index) => ( //item is array
                          <Row
                            key={index}
                            data={item}
                            widthArr={TABLE_LIST_VAT_TU_KHO_SCANED.map(r => r.width)}
                            style={[index % 2 && { backgroundColor: '#F7F6E7' }]}
                            textStyle={{}}
                          />
                        ))
                      }
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
              : null}
          </View>
          <View style={{ width: '100%', alignContent: 'center', alignItems: 'center' }} >
            <Text style={{ color: 'green', fontSize: 14, padding: 15 }}>Scan xong hết danh sách vật tư kho ảo</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => { this.backToListVatTuKho_ToScanContinue() }}
              style={APP_STYLES.button}>
              <Text style={APP_STYLES.buttonTitle}><IconFontAwesome name="arrow-left" color="#ffffff" size={20}></IconFontAwesome> Quay lại vật tư kho</Text>
            </TouchableOpacity>
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
      )
    }

    return (
      <View >
        <Toast ref={(ref) => Toast.setRef(ref)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NhapKhoAo);
