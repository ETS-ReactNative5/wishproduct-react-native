import React, { Component } from 'react';
import { View, Alert, Image, Button,ToastAndroid,Linking, Text } from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import { BasicFormComponent } from '../BasicForm/basicForm';
import { LoadingIndicator } from './../../../components/loadingIndicator/loadingIndicator';
import { styles } from '../BasicForm/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import { loginUser, logoutUser } from './../../../actions/session/actions';
import asyncStorageService from './../../../services/asyncStorageService';
import apiService from './../../../services/apiService';
import { APP_VERSION_CONST } from '../../../app_const';

const FIREBASE_LOGO = require('./../../../../assets/icons/firebase.png');

class LoginFormComponent extends Component {
  constructor(props){
    super(props);
    this.state={
      isUpdating: true,
      appVersion:{
        version:null,
        url:'',
        description:''
      }
    }
  }

  componentDidMount() {
    if (this.props.logged) {
      Actions.reset('home');
      return;
    }else{
      this.props.logout();
    }
    this.getAppVersionStorage();
  }

  componentDidUpdate(prevProps) {
    const { error, logged } = this.props;

    if (!prevProps.error && error){
      Toast.show({
        type:'error',
        text1: 'Error',
        text2: `Username or password is invalid`,
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
    if (logged) {
      Actions.reset('home');
      return;
    }
      
  }
  componentWillUnmount() { 
  }

  getAppVersionStorage=async()=>{
    let appVersionNew = null;
    try {
      // let rs = await apiService.get(`/public/v1/app/version`);
      let rs = await apiService.public.getAppVersion({});
      if(rs && rs.data){
        appVersionNew = rs.data;
      }
    } catch (error) {
      ToastAndroid.show(JSON.stringify(error), ToastAndroid.LONG);
      this.setState({isUpdating: false});
      return;
    }

    if(!appVersionNew || !appVersionNew.url || !appVersionNew.version ){
      this.setState({isUpdating: false});
      return;
    }

    if(appVersionNew.url.indexOf('http') !== 0){
      appVersionNew.url = 'http://blueprinter.online/assets/app-release.apk';
    }

    if(appVersionNew && appVersionNew.version && APP_VERSION_CONST < appVersionNew.version ){
      Alert.alert(
        "Thông báo",
        "Có cập nhập mới, vui lòng download và cài đặt lại để sử dụng tốt hơn !",
        [
          {
            text: "Huỷ",
            onPress: () => {
              this.setState({isUpdating: false});
            },
            style: "cancel"
          }, 
          { 
            text: "Cập nhập", 
            onPress: async() => {
              Linking.openURL(appVersionNew.url).then(r=>{
                this.setState({isUpdating: false});
              }).catch(e=>{
                this.setState({isUpdating: false});
                ToastAndroid.show(JSON.stringify(e), ToastAndroid.LONG);
              });
            } 
          }
        ]
      );
      return;
    }else{
      // ToastAndroid.show(`Không có version app mới`, ToastAndroid.LONG);
      this.setState({isUpdating: false});
    }
  }

  render() {
    const { login, loading } = this.props;
    const { scrollView, imageBox, image, loginBox } = styles;
    if(this.state.isUpdating){
      return  <View style={{flex:1, flexDirection:'column', alignItems:'center', alignContent:'center', backgroundColor: '#2299ec'}}>
        <View>
          <LoadingIndicator color="#ffffff" size="large" />
        </View>
      </View>;
    }
    return (
      <KeyboardAwareScrollView style={scrollView}>
        <View style={imageBox}>
          <Image style={image} source={FIREBASE_LOGO} />
        </View>
        <View style={{alignItems:'center'}}>
          <Text style={{color:'#fff',fontSize:10, alignItems:'center'}}>App Version: {APP_VERSION_CONST.toString()}</Text>
        </View>
        <View style={loginBox}>
          {loading ? (
            <LoadingIndicator color="#ffffff" size="large" />
          ) : (
            <BasicFormComponent buttonTitle={'Đăng nhập'} onButtonPress={login} />
          )}
        </View>
        {/* <View>{loading ? null : <Button onPress={Actions.signup} title="Signup" />}</View> */}
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({ routes, sessionReducer: { restoring, loading, user, error, logged } }) => ({
  routes: routes,
  restoring: restoring,
  loading: loading,
  user: user,
  error: error,
  logged: logged
});

const mapDispatchToProps = {
  login: loginUser,
  logout: logoutUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormComponent);
