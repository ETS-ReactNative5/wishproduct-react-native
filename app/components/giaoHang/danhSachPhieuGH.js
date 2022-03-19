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
const VIEW_FORM_SEARCH = 'VIEW_FORM_SEARCH';
const STEP_SCAN_SAN_PHAM_CAN_GIAO = 'STEP_SCAN_SAN_PHAM_CAN_GIAO';
const TABLE_LIST_THANH_PHAM = [
  { title: 'Đã Scan', key: 'isScanedText', width: 70, order: 1 },
  { title: 'Sản phẩm', key: 'maSanPhamTenSanPham', width: 150, order: 1 },
  // { title: 'Tên Sản phẩm', key: 'tenSanPham', width: 100, order: 1 },
  { title: 'Phiếu g/Hàng', key: 'idPhieuGiaoHang', width: 100, order: 4 },
  { title: 'Loại', key: 'loai', width: 70, order: 5 },
  { title: 'Số lượng', key: 'soLuongText', width: 100, order: 5 }

  // { title: 'Mã Vật Tư', key: 'maVatTu', width: 100, order: 1 },
  // { title: 'Đơn vị', key: 'donVi', width: 100, order: 5 },
  // { title: 'Trạng thái', key: 'trangThai', width: 100, order: 5 },
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

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let dsListPhieuGH = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
const screenWidth = Dimensions.get('window').width;
const VIEW_TYPE_LIST = 'VIEW_TYPE_LIST';
const VIEW_TYPE_DETAIL = 'VIEW_TYPE_DETAIL';
export class DanhSachPhieuGiaoHangComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      sources: ds, //list phieu giao hang
      searchCondition: {},
      currentSource: {},
      viewType: VIEW_TYPE_LIST
    };
  }

  componentDidMount() {
    this.getListHanhTrinhGiaoHang();
  }
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

  getListHanhTrinhGiaoHang = async () => {
    try {
      let params = {
        page: 0,
        limit: 1000
      };

      let rs = await apiService.get('/admin/v1/hanh-trinh-giao-hang/filter', { params });
      if (rs && rs.data && Array.isArray(rs.data.items)) {
        rs.data.items = [
          {
            id: 'ID',
            ngayGiaoHang: 'Ngày g/hàng ',
            createdBy: 'Người tạo',
            trangThai: 'Trạng Thái'
          },
          ...rs.data.items
        ];
        let dataSource = ds.cloneWithRows(
          rs.data.items.map(item => {
            if (item && item.id == 'ID') return item;
            return {
              ...item,
              // trangThai: PHIEU_GIAO_HANG_STATE_LABEL(item.trangThai),
              ngayGiaoHang: (item.ngayGiaoHang || item.createdAt).substring(0, 10),
              createdAt: (item.ngayGiaoHang || item.createdAt).substring(0, 10),
              id: (item.id || '').toString()
            };
          })
        );
        this.setState({
          sources: dataSource
        });
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi get list hanh trinh giao hang',
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

  getDetailHanhTrinhGH = async item => {
    let currentSource = _.cloneDeep(item);
    try {
      let rs = await apiService.get('/admin/v1/hanh-trinh-giao-hang/' + currentSource.id);
      if (rs && rs.data) {
        currentSource = {
          ...currentSource,
          ...rs.data
        };
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi getDetailHanhTrinhGH',
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
    return currentSource;
  };

  submitHoanTatHanhTrinh = item => {
    Alert.alert(`Hoàn tất hành trình giao hàng ${item.id}`, 'Xác nhận hoàn tất hành trình giao hàng ?', [
      {
        text: 'Đóng',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Hoàn tất',
        onPress: async () => {
          try {
            let rs = await apiService.put(`/admin/v1/hanh-trinh-giao-hang/${item.id}/delivered`, {
              id: parseInt(item.id),
              trangThai: 'DELIVERED'
            });
            if (rs && rs.data) {
              Toast.show({
                type: 'success',
                text1: 'Success ',
                text2: `Hoàn tất hành trình giao hàng ${item.id} thành công`,
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                // topOffset: 30,
                // bottomOffset: 40,
                onShow: () => {},
                onHide: () => {},
                onPress: () => {}
              });
              this.getListHanhTrinhGiaoHang();
            }
          } catch (e) {
            console.log(e);
            ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
            Toast.show({
              type: 'error',
              text1: 'Lỗi submit hành trình giao hàng',
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
      }
    ]);
  };

  submitHoanTatPhieuGH = async item => {
    Alert.alert('Hoàn tất phiếu giao hàng ' + item.id, `Xác nhận hoàn tất phiếu giao hàng ${item.id} ?`, [
      {
        text: 'Đóng',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Hoàn tất',
        onPress: async () => {
          try {
            let rs = await apiService.put(`/admin/v1/phieu-giao-hang/${item.id}/delivered`, {
              id: item.id,
              trangThai: 'DELIVERED'
            });
            if (rs && rs.data) {
              Toast.show({
                type: 'success',
                text1: 'Success ',
                text2: `Hoàn tất phiếu giao hàng ${item.id} thành công`,
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
                // topOffset: 30,
                // bottomOffset: 40,
                onShow: () => {},
                onHide: () => {},
                onPress: () => {}
              });
              //reload lai hanh trinh giao hang
              this.viewDetailHanhTrinh(this.state.currentSource);
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
        }
      }
    ]);
  };

  viewDetailHanhTrinh = async item => {
    let currentSource = await this.getDetailHanhTrinhGH(_.cloneDeep(item));
    let newList = [
      {
        id: 'ID',
        ngayGiaoHang: 'Ngày g/hàng',
        tongSoThanhPham: 'S/lượng',
        trangThai: 'Trạng Thái'
      },
      ...(currentSource.listPhieuGiaoHang || [])
    ];
    let listPhieuGiaoHang = dsListPhieuGH.cloneWithRows(
      newList.map(item => {
        if (item && item.id == 'ID') return item;
        return {
          ...item,
          // trangThai: PHIEU_GIAO_HANG_STATE_LABEL(item.trangThai),
          tongSoThanhPham: item.tongSoThanhPham,
          ngayGiaoHang: item.ngayGiaoHang.substring(0, 10),
          createdAt: item.createdAt.substring(0, 10),
          id: item.id.toString()
        };
      })
    );
    currentSource.listPhieuGiaoHang = listPhieuGiaoHang;
    this.setState({
      viewType: VIEW_TYPE_DETAIL,
      currentSource: currentSource
    });
  };

  render() {
    let { viewType, currentSource } = this.state;
    if (viewType == VIEW_TYPE_DETAIL && currentSource && currentSource.id && currentSource.listPhieuGiaoHang) {
      return (
        <View style={styles.container}>
          <View>
            <Text style={{ ...styles.textLabel, marginBottom: 10, textAlign: 'center' }}>Xem chi tiết hành trình {currentSource.id}</Text>
            <ScrollView horizontal={true} style={{ width: screenWidth, display: 'flex' }}>
              <ListView
                style={{
                  width: screenWidth
                }}
                dataSource={currentSource.listPhieuGiaoHang}
                renderRow={rowData => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      width: '100%',
                      alignSelf: 'stretch',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      borderColor: '#cccccc',
                      borderTopWidth: 1
                    }}
                  >
                    <Text style={{ flex: 0.1 }}>{rowData.id} </Text>
                    <Text style={{ flex: 0.25 }}>{rowData.ngayGiaoHang || rowData.createdAt} </Text>
                    <Text style={{ flex: 0.25 }}>{rowData.tongSoThanhPham || 0}</Text>
                    <Text style={{ flex: 0.2 }}>{PHIEU_GIAO_HANG_STATE_LABEL(rowData.trangThai)} </Text>
                    <View style={{ flex: 0.2 }}>
                      {rowData.id != 'ID' && rowData.trangThai != 'DELIVERED' ? (
                        <TouchableOpacity
                          style={{ ...styles.btnHoanTat }}
                          onPress={() => {
                            this.submitHoanTatPhieuGH(rowData);
                          }}
                        >
                          <Text style={{ color: 'white' }}>Hoàn tất</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                )}
              />
            </ScrollView>
          </View>

          <View style={{ paddingBottom: 50 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ viewType: VIEW_TYPE_LIST, currentSource: {} });
              }}
              style={APP_STYLES.button}
            >
              <Text style={APP_STYLES.buttonTitle}>
                <IconFontAwesome name="arrow-left" color="#ffffff" size={20} /> Quay lại danh sách
              </Text>
            </TouchableOpacity>
          </View>

          <Toast ref={ref => Toast.setRef(ref)} />
        </View>
      );
    }
    return (
      <View style={{ ...styles.container, paddingBottom: 80 }}>
        <View>
          <Text style={{ ...styles.textLabel, marginBottom: 10, textAlign: 'center' }}>Hành trình của tôi</Text>

          <ScrollView horizontal={true} style={{ width: screenWidth, display: 'flex' }}>
            <ListView
              style={{
                width: screenWidth
              }}
              dataSource={this.state.sources}
              renderRow={rowData => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    alignSelf: 'stretch',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderColor: '#cccccc',
                    borderTopWidth: 1
                  }}
                >
                  <Text style={{ flex: 0.1 }}>{rowData.id} </Text>
                  <Text style={{ flex: 0.25 }}>{rowData.ngayGiaoHang || rowData.createdAt} </Text>
                  <Text style={{ flex: 0.25 }}>{rowData.createdBy}</Text>
                  <Text style={{ flex: 0.2 }}>{PHIEU_GIAO_HANG_STATE_LABEL(rowData.trangThai)} </Text>
                  <View style={{ flex: 0.2 }}>
                    {rowData.id != 'ID' && rowData.trangThai != 'DELIVERED' ? (
                      <TouchableOpacity
                        style={{ ...styles.btnHoanTat }}
                        onPress={() => {
                          this.submitHoanTatHanhTrinh(rowData);
                        }}
                      >
                        <Text style={{ color: 'white' }}>Hoàn tất</Text>
                      </TouchableOpacity>
                    ) : null}

                    {rowData.id != 'ID' ? (
                      <TouchableOpacity
                        style={{ ...styles.btnChiTiet }}
                        onPress={() => {
                          this.viewDetailHanhTrinh(rowData);
                        }}
                      >
                        <Text style={{ color: 'white' }}>Chi tiết</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </View>

        <View style={{ paddingBottom: 50 }}>
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
)(DanhSachPhieuGiaoHangComponent);
