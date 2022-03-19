'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-toast-message';
import { 
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking, View, Button, Alert, ToastAndroid } from 'react-native';

import { RNCamera, RNCameraProps, BarCodeReadEvent, Constants } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e9f7fd'
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  preview: {
    flex: 1,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

class ScanBarcodeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      barcodeType:'',
      barcodeValue:''
    };
    this.timerId = null;
  }
  // onBarCodeRead(scanResult) {
  //   console.warn(scanResult.type);
  //   console.warn(scanResult.data);
  //   if (scanResult.data != null) {
  //     if (!this.barcodeCodes.includes(scanResult.data)) {
  //       this.barcodeCodes.push(scanResult.data);
  //       console.warn('onBarCodeRead call');
  //     }
  //   }
  //   return;
  // }

  
  onBarCodeReaderReady = (e) =>{
    let self=this;
    console.log(`onBarCodeReaderReady`,{type:e.type, data:e.data}, e);
    // ToastAndroid.show(`BarCodeType=${e.type} Value=${e.data}`, ToastAndroid.SHORT);
    this.setState({
      barcodeType: e.type,
      barcodeValue: e.data,
    },()=>{
      if(this.props.onScanSuccess && typeof this.props.onScanSuccess === 'function'){
        this.props.onScanSuccess(e);
      }
      self.timerId = setTimeout(()=>{
        self.setState({
          barcodeType: '',
          barcodeValue: '',
        });
      },2000);
    })
    
    
    
    // ToastAndroid.show(e.data, ToastAndroid.LONG);
    // Toast.show({
    //   type:'error',
    //   text1: 'Error',
    //   text2: e,
    //   position: 'top',
    //   visibilityTime: 3000,
    //   autoHide: true,
    //   // topOffset: 30,
    //   // bottomOffset: 40,
    //   onShow: () => {},
    //   onHide: () => {},
    //   onPress: () => {}
    // });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      let data;
      try{
        data = await this.camera.takePictureAsync(options);
        console.log(`-------------success takePicture uri=`,data.uri);
        ToastAndroid.show(data.uri, ToastAndroid.LONG);
      }catch(e){
        console.log(`-------------error take picture `,e);
        ToastAndroid.show(e.message, ToastAndroid.LONG);
      }
    }
  };

  componentDidMount(){
    console.log(`camera did mount`);
  }
  componentWillUnmount(){
    console.log(`camera will unmount`);
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <View style={styles.container}> 
        {this.state.barcodeType && this.state.barcodeValue 
        ? 
        <View style={{ flex: 0, flexDirection:'column', justifyContent: 'center' }}>
          {this.state.barcodeType ? <View><Text style={{ fontSize: 20, fontWeight:'bold' }}> Barcode Type: {this.state.barcodeType} </Text></View> : null}
          {this.state.barcodeValue ? <View><Text style={{ fontSize: 20, fontWeight:'bold' }}> Barcode Value: {this.state.barcodeValue} </Text></View> : null}
        </View>
        :
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          // onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //   console.log(barcodes);
          //   // Alert.alert(barcodes); 
          // }}
          // barCodeTypes={[RNCamera.Constants.BarCodeType.barcodes]}
          onBarCodeRead={(scanData)=>{this.onBarCodeReaderReady(scanData);}} 
          mirrorImage={false}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          onCameraReady={(ready)=>{console.log('-------------camera ready')}}
          onMountError={(err)=>{console.log('-------------camera onMountError', err)}}
          // onPictureTaken={(picture)=>{console.log('-------------camera picture', picture)}}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={true} outerMaskOpacity={0.6} />
          }}
        </RNCamera>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ScanBarcodeComponent);
