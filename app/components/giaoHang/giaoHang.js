import React, { Component } from 'react';
import { View, Button, Text, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
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
const VIEW_FORM_SEARCH = 'VIEW_FORM_SEARCH';
const STEP_SCAN_SAN_PHAM_CAN_GIAO = 'STEP_SCAN_SAN_PHAM_CAN_GIAO';
const TABLE_LIST_THANH_PHAM = [
  { title: 'Đã Scan', key: 'isScanedText', width: 70, order: 1 },
  { title: 'Sản phẩm', key: 'maSanPhamTenSanPham', width: 150, order: 1 },
  // { title: 'Tên Sản phẩm', key: 'tenSanPham', width: 100, order: 1 },
  { title: 'Phiếu g/Hàng', key: 'idPhieuGiaoHang', width: 100, order: 4 },
  { title: 'Loại', key: 'loai', width: 70, order: 5 },
  { title: 'Số lượng', key: 'soLuongText', width: 100, order: 5 },

  // { title: 'Mã Vật Tư', key: 'maVatTu', width: 100, order: 1 },
  // { title: 'Đơn vị', key: 'donVi', width: 100, order: 5 },
  // { title: 'Trạng thái', key: 'trangThai', width: 100, order: 5 },
];
const THANH_PHAM_KHO_STATE = [
  { label: 'Khởi tạo', value: 'INIT' },
  { label: 'Sẵn kho', value: 'READY' },
  { label: 'Lên phiếu', value: 'FORM' },
  { label: 'Đã lấy', value: 'PICKUP' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Đã giao', value: 'DELIVERED' },
  { label: 'Trả lại', value: 'RETURNED' }
];

const THANH_PHAM_KHO_STATE_LABEL = v => {
  for (let item of THANH_PHAM_KHO_STATE) {
    if (item.value == v) {
      return item.label;
    }
  }
  return v;
};
export class GiaoHangComponent extends React.Component {
  isTimeoutClearGetThanhPham = null;
  constructor(props) {
    super(props);
    this.state = {
      searchCondition: {},
      scanData: {
        barCodeKe: '',
        barCodeVatTu: ''
      },
      viewType: VIEW_FORM_SEARCH,
      scanStep: '',
      ngSelectKhachHang: {
        items: [],
        selectedItem: ''
      },
      ngSelectPhieuGiaoHang: {
        items: [
          // {
          //   id: 'suudydjsjd',
          //   name: 'Abuja'
          // }
        ],
        selectedItems: []
      },
      listThanhPham: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.getListKhachHang();
  }
  componentWillUnmount() {
    if (this.isTimeoutClearGetThanhPham) {
      clearTimeout(this.isTimeoutClearGetThanhPham);
    }
  }

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

  getListKhachHang = async () => {
    try {
      let params = {
        page: 0,
        limit: 10000
      };
      let rs = await apiService.get('/v1/customer/active', { params });
      if (rs && rs.data && rs.data.items) {
        this.setState({
          ngSelectKhachHang: {
            ...this.state.ngSelectKhachHang,
            items: _.orderBy(rs.data.items, ['code'], ['asc']).map(item => {
              return {
                ...item,
                label: item.code + ' | ' + item.name,
                name: item.code + ' | ' + item.name,
                value: item.id
              };
            })
          }
        });
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get khach hang',
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
  };

  resetValuePhieuGiaoHangVaThanhPham = () => {
    this.setState({
      ngSelectPhieuGiaoHang: {
        ...this.state.ngSelectPhieuGiaoHang,
        items: [],
        selectedItems: []
      },
      listThanhPham: []
    });
  };

  getListPhieuGiaoHang = async () => {
    let {
      ngSelectKhachHang: { selectedItem: selectKhachHang }
    } = this.state;
    try {
      let params = {
        page: 0,
        limit: 1000
      };
      if (selectKhachHang) {
        params.maKhachHang = selectKhachHang.code;
      }
      let rs = await apiService.get('/admin/v1/phieu-giao-hang/filter', { params });
      if (rs && rs.data && rs.data.items && rs.data.items.length > 0) {
        this.setState({
          ngSelectPhieuGiaoHang: {
            ...this.state.ngSelectPhieuGiaoHang,
            items: _.orderBy(rs.data.items, ['code'], ['asc']).map(item => {
              return {
                ...item,
                label: item.id + ' - ' + item.maKhachHang,
                name: item.id + ' - ' + item.maKhachHang,
                value: item.id.toString(),
                id: item.id.toString()
              };
            })
          }
        });
      } else {
        this.resetValuePhieuGiaoHangVaThanhPham();
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi getListPhieuGiaoHang',
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
  };

  getAllListThanhPham = async () => {
    if (this.isTimeoutClearGetThanhPham) {
      clearTimeout(this.isTimeoutClearGetThanhPham);
    }
    this.isTimeoutClearGetThanhPham = setTimeout(async () => {
      let {
        ngSelectKhachHang: { selectedItem: selectKhachHang },
        ngSelectPhieuGiaoHang: { items: itemsPhieuGH, selectedItems: selectPhieuGiaoHangIds }
      } = this.state;
      let selectPhieuGiaoHangItems = [];
      for (let idPhieuGH of selectPhieuGiaoHangIds) {
        let find = _.find(itemsPhieuGH, { id: idPhieuGH });
        if (find) selectPhieuGiaoHangItems.push(find);
      }
      if (selectPhieuGiaoHangItems.length == 0) {
        this.setState({
          listThanhPham: []
        });
      }
      if (Array.isArray(selectPhieuGiaoHangItems) && selectPhieuGiaoHangItems.length > 0) {
        let listThanhPhamAll = [];
        for (let phieuGH of selectPhieuGiaoHangItems) {
          try {
            let rs = await apiService.get('/admin/v1/phieu-giao-hang/' + phieuGH.id);
            if (rs && rs.data) {
              if (Array.isArray(rs.data.listThanhPham)) {
                listThanhPhamAll = [
                  ...listThanhPhamAll,
                  ...rs.data.listThanhPham.map(r => {
                    return {
                      isScaned: false,
                      ...r
                    };
                  })
                ];
              }
            }
          } catch (e) {
            console.log(e);
            ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
            Toast.show({
              type: 'error',
              text1: 'Lỗi get getAllListThanhPham',
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
        }
        this.setState({
          listThanhPham: listThanhPhamAll
        });
      }
    }, 1000);
  };

  convertListToDataTable = () => {
    let { listThanhPham } = this.state;
    let dataTable = [];

    listThanhPham.map(r => {
      r.isScanedText = r.isScaned ? 'X' : '';
      r.maSanPhamTenSanPham = `${r.tenSanPham} (${r.maSanPham})`;
      r.soLuongText = appService.numberWithCommas(r.soLuong);
      let perRow = [];
      let rowKeys = TABLE_LIST_THANH_PHAM.map(ite => ite.key);
      for (let k of rowKeys) {
        if (k == 'trangThai') {
          perRow.push(THANH_PHAM_KHO_STATE_LABEL(r[k]) || '');
        } else {
          perRow.push(r[k] || '');
        }
      }
      dataTable.push(perRow);
    });
    return dataTable;
  };

  onScanSuccess = async data => {
    let barCodeScaned = data ? data.data : '';
    let { listThanhPham } = this.state;
    this.playAudio('capture_beep.mp3');
    if (this.state.scanStep === STEP_SCAN_SAN_PHAM_CAN_GIAO && barCodeScaned) {
      let findIndex = _.findIndex(listThanhPham, { barCode: barCodeScaned, isScaned: false });
      if (findIndex >= 0) {
        // this.playAudio('single_beep_01.mp3');
        listThanhPham[findIndex].isScaned = true;
        ToastAndroid.show(`${listThanhPham.filter(r => r.isScaned).length}/${listThanhPham.length} items được cập nhập`, ToastAndroid.LONG);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Not found',
          text2: `Không tìm thấy barCode này trong danh sách dưới Hoặc barCode này đã scan rồi`,
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

      this.setState(
        {
          listThanhPham
        },
        () => {
          if (this.state.listThanhPham.every(r => r.isScaned)) {
            ToastAndroid.show(`Đã scan tất cả sản phẩm cần giao. Vui lòng tạo hành trình giao hàng`, ToastAndroid.LONG);
            Toast.show({
              type: 'success',
              text1: 'SUCCESS',
              text2: `Đã scan tất cả sản phẩm cần giao. Vui lòng submit tạo hành trình giao hàng`,
              position: 'top',
              visibilityTime: 3000,
              autoHide: true,
              // topOffset: 30,
              // bottomOffset: 40,
              onShow: () => {},
              onHide: () => {},
              onPress: () => {}
            });
            // this.setState({
            //   scanStep: ''
            // });
            return;
          }
        }
      );
    }
  };

  submitCreateHanhTrinhGiaoHang = async () => {
    let {
      listThanhPham,
      ngSelectPhieuGiaoHang: { selectedItems: selectPhieuGHIds }
    } = this.state;
    try {
      let params = {
        listBarcodeThanhPham: listThanhPham.filter(r => r.isScaned).map(r => r.barCode),
        listIdPhieuGiaoHang: selectPhieuGHIds,
        ghiChu: ''
      };
      let rs = await apiService.post('/admin/v1/hanh-trinh-giao-hang', params);
      if (rs && rs.data) {
        ToastAndroid.show(`Tạo hành trình giao hàng thành công`, ToastAndroid.LONG);
        Toast.show({
          type: 'success',
          text1: 'SUCCESS',
          text2: `Tạo hành trình giao hàng thành công`,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          // topOffset: 30,
          // bottomOffset: 40,
          onShow: () => {},
          onHide: () => {},
          onPress: () => {}
        });
        this.setState({
          listThanhPham: [],
          ngSelectKhachHang: {
            ...this.state.ngSelectKhachHang,
            selectedItem: null
          },
          ngSelectPhieuGiaoHang: {
            ...this.state.ngSelectPhieuGiaoHang,
            selectedItems: []
          },
          scanStep: ''
        });
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi tạo hành trình giao hàng',
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
      this.setState({
        scanStep: ''
      });
    }
  };

  render() {
    let { ngSelectKhachHang, ngSelectPhieuGiaoHang, listThanhPham } = this.state;
    if (ngSelectKhachHang.items && ngSelectKhachHang.items.length == 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            backgroundColor: '#2299ec'
          }}
        >
          <View>
            <LoadingIndicator color="#ffffff" size="large" />
          </View>
        </View>
      );
    }

    if (this.state.scanStep === STEP_SCAN_SAN_PHAM_CAN_GIAO) {
      let totalScanedItems = listThanhPham.filter(r => r.isScaned).length;
      let totalItemsScan = listThanhPham.length;
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScanBarcodeComponent onScanSuccess={this.onScanSuccess} />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              alignContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Vui lòng scan sản phẩm cần giao</Text>
          </View>

          <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ scanStep: '' });
              }}
              style={[APP_STYLES.button, { width: '45%' }]}
            >
              <Text style={APP_STYLES.buttonTitle}>
                <Icon name="close" color="#ffffff" size={20} /> Thoát camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                return totalItemsScan > 0 && totalItemsScan == totalScanedItems ? this.submitCreateHanhTrinhGiaoHang() : null;
              }}
              style={[APP_STYLES.button, { width: '45%' }]}
            >
              <Text style={APP_STYLES.buttonTitle}>
                <IconFontAwesome name="eye" color="#ffffff" size={20} />{' '}
                {totalItemsScan > 0 && totalItemsScan == totalScanedItems ? 'Tạo hành trình giao hàng' : `Scan được ${totalScanedItems}/${totalItemsScan}`}
              </Text>
            </TouchableOpacity>
          </View>

          <Toast ref={ref => Toast.setRef(ref)} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        
        <Toast ref={ref => Toast.setRef(ref)} />
        <View>
          <Text style={styles.textLabel}>Chọn khách hàng</Text>
          <SearchableDropdown
            onTextChange={text => {}}
            onItemSelect={item => {
              console.log(`select ngSelectKhachHang`, item);
              ngSelectKhachHang.selectedItem = item;
              this.setState({ ngSelectKhachHang }, async () => {
                if (item) {
                  await this.getListPhieuGiaoHang();
                } else {
                  this.resetValuePhieuGiaoHangVaThanhPham();
                }
              });
            }}
            containerStyle={{ padding: 10 }}
            textInputStyle={{
              padding: 10,
              paddingLeft: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              backgroundColor: '#f1f1f1',
              borderRadius: 5
            }}
            itemStyle={{
              padding: 10,
              paddingLeft: 10,
              marginTop: 0,
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              borderWidth: 1,
              size: 12
            }}
            itemTextStyle={{
              color: '#222',
              fontSize: 12
            }}
            itemsContainerStyle={{
              maxHeight: '60%'
            }}
            items={ngSelectKhachHang.items}
            // defaultIndex={2}
            placeholder="Nhập chọn khách hàng"
            underlineColorAndroid="transparent"
            resetValue={true}
          />
          {ngSelectKhachHang.selectedItem ? (
            <Text style={{ textAlign: 'left', paddingLeft: 0, marginLeft: 10, marginTop: 5, color: 'blue' }}>
              {ngSelectKhachHang.selectedItem.code + ' | ' + ngSelectKhachHang.selectedItem.name}
            </Text>
          ) : null}
        </View>
        <ScrollView showsVerticalScrollIndicator={true} persistentScrollbar={true}>
        <View>
          <Text style={{ ...styles.textLabel, marginBottom: 10 }}>Chọn phiếu giao hàng</Text>
          <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            <MultiSelect
              hideTags
              items={ngSelectPhieuGiaoHang.items}
              uniqueKey="id"
              ref={component => {
                if(component)
                  this.multiSelect = component;
              }}
              selectedItems={ngSelectPhieuGiaoHang.selectedItems}
              selectText="Phiếu giao hàng"
              searchInputPlaceholderText="Search phiếu giao hàng"
              onChangeInput={text => console.log(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Chọn"
              onSelectedItemsChange={e => {
                console.log(`onSelectedItemsChange selectedItems e=`, e);
                ngSelectPhieuGiaoHang.selectedItems = e;
                this.setState(
                  {
                    ngSelectPhieuGiaoHang
                  },
                  () => {
                    this.getAllListThanhPham();
                  }
                );
              }}
            />
          </View>
          <View>{this.multiSelect && this.multiSelect.getSelectedItemsExt && ngSelectPhieuGiaoHang.selectedItems && ngSelectPhieuGiaoHang.selectedItems.length > 0 
            ? this.multiSelect.getSelectedItemsExt(ngSelectPhieuGiaoHang.selectedItems) 
            : <Text />}
          </View>
        </View>

        <View style={{paddingBottom: 15}}>
          {listThanhPham && listThanhPham.length > 0 ? (
            <ScrollView horizontal={true} style={{ marginTop: 15 }} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                  <Row
                    data={TABLE_LIST_THANH_PHAM.map(r => r.title)}
                    widthArr={TABLE_LIST_THANH_PHAM.map(r => r.width)}
                    style={{ backgroundColor: '#ffffff' }}
                    textStyle={{ color: 'black', fontWeight: 'bold', fontSize: 12, padding: 5, height: 30 }}
                  />
                </Table>
                <ScrollView style={{}}>
                  <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                    {this.convertListToDataTable().map((
                      item,
                      index //item is array
                    ) => (
                      <Row key={index} data={item} widthArr={TABLE_LIST_THANH_PHAM.map(r => r.width)} style={[index % 2 && { backgroundColor: '#F7F6E7' }]} textStyle={{}} />
                    ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          ) : (
            <View>
              <Text style={{ ...styles.textLabel, textAlign: 'center' }}>Không có item nào</Text>
            </View>
          )}
        </View>

        <View style={{paddingBottom: 50}}>
          {listThanhPham && listThanhPham.length > 0 ? (
            <TouchableOpacity
              onPress={e => {
                if (listThanhPham.every(r => r.isScaned)) {
                  this.submitCreateHanhTrinhGiaoHang();
                } else {
                  this.setState({ scanStep: STEP_SCAN_SAN_PHAM_CAN_GIAO });
                }
              }}
              style={APP_STYLES.button}
            >
              <Text style={APP_STYLES.buttonTitle}>
                <Icon name="qrcode" color="#ffffff" size={20} />
                {listThanhPham.every(r => r.isScaned) ? `Tạo hành trình giao hàng` : `Scan s/phẩm cần giao`}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              Actions.home();
            }}
            style={APP_STYLES.button}
          >
            <Text style={APP_STYLES.buttonTitle}>
              <IconFontAwesome name="arrow-left" color="#ffffff" size={20} /> Quay lại
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View>
          <TouchableOpacity
            onPress={() => {
              Actions.home();
            }}
            style={APP_STYLES.button}
            >
              <Text style={APP_STYLES.buttonTitle}>
                <IconFontAwesome name="arrow-left" color="#ffffff" size={20} /> Quay lại
              </Text>
            </TouchableOpacity>
          </View> */
        }
        </ScrollView>
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
)(GiaoHangComponent);
