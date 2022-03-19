import React, { Component } from 'react';
import { View, Button,  Image, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import Toast from 'react-native-toast-message';
import { logoutUser } from './../../actions/session/actions';
import { StyleSheet } from 'react-native';
import { APP_STYLES } from '../../styles_app';
import apiService from '../../services/apiService';
const VIEW_UPDATE_PASSWORD = 'VIEW_UPDATE_PASSWORD';
const VIEW_UPDATE_PROFILE = 'VIEW_UPDATE_PROFILE';
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#e9f7fd'
  },
  primary: {
    color: 'rgb(116, 70, 195)'
  },
  marginBox: {
    // alignItems: 'center',
    margin: 20
  },
  title: {
    fontSize: 18,
    margin: 20
  },
  btnLogout: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10,
    borderRadius: 5,
    padding: 3,
    backgroundColor: '#88cc88'
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft:20,
    paddingRight:20,
  },
  textLabel:{
    textAlign: 'left', 
    paddingLeft:0, 
    marginLeft:10, 
    marginTop:5,
    color:'black',
    fontSize:14,
    fontWeight:'bold',
  }
});

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewType: VIEW_UPDATE_PASSWORD,
      sourceUpdatePassword:{
        password:'',
        rePassword:'',
      }
    }
  }
  componentDidMount(){
    if(!this.props.user){
      Actions.reset('login');
      return;
    }
  }

  submitlogout = () => {
    this.props.logout();
    // setTimeout(() => {
    //   Actions.reset('login');
    // }, 100);
  };

  componentDidUpdate(){
    if(!this.props.logged){
      Actions.reset('login');
      return;
    }
  }

  submitUpdatePassword = async ()=>{
    let {sourceUpdatePassword} = this.state;
    let {password, rePassword} = sourceUpdatePassword;
    let txtError = '';
    if(!sourceUpdatePassword.password || !sourceUpdatePassword.rePassword){
      txtError = 'Vui lòng nhập đủ thông tin';
    }else if(password.length < 6){
      txtError = 'Mật khẩu ít nhất 6 kí tự';
    }else if(sourceUpdatePassword.password !== sourceUpdatePassword.rePassword){
      txtError = 'Mật khẩu nhập lại chưa đúng';
    }
    
    if(txtError){
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: txtError,
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
    try{
      let r = await apiService.post('/admin/v1/change-password', sourceUpdatePassword);
      if(r){
        Toast.show({
          type: 'success',
          text1: 'Thông báo',
          text2: 'Đổi mật khẩu thành công',
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          // topOffset: 30,
          // bottomOffset: 40,
          onShow: () => { },
          onHide: () => { },
          onPress: () => { }
        });
        this.setState({
          sourceUpdatePassword:{
            password:'',
            rePassword:''
          }
        });
      }
    }catch(e){
      ToastAndroid.show(`ERROR ` + JSON.stringify(e), ToastAndroid.LONG);
      Toast.show({
        type: 'error',
        text1: 'Lỗi update password',
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

  getTabActive = (tab)=>{
    if(tab === this.state.viewType){
      return [APP_STYLES.button, { width: '45%', backgroundColor:'green', color:'white'}];
    }
    return [APP_STYLES.button, { width: '45%', backgroundColor:'white', color:'#000' }];
  }
  getTabTextColor = (tab)=>{
    if(tab === this.state.viewType){
      return APP_STYLES.buttonTitle;
    }
    return [APP_STYLES.buttonTitle,{color:'black'}];
  }
  render() {
    const { container, marginBox, title } = styles;
    const { user } = this.props;
    let {viewType,sourceUpdatePassword} = this.state;
    // if(!user){
    //   Actions.reset('login');
    //   return null;
    // }
    return (
      <View style={container}>
        
        
        <View style={{ flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.setState({viewType: VIEW_UPDATE_PASSWORD})} style={this.getTabActive(VIEW_UPDATE_PASSWORD)} >
            <Text style={this.getTabTextColor(VIEW_UPDATE_PASSWORD)}>
              <MaterialCommunityIcons name="key" color={viewType == VIEW_UPDATE_PASSWORD ? "#ffffff" : "black"} size={20} /> Đổi mật khẩu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>{ this.setState({viewType: VIEW_UPDATE_PROFILE}) }}  style={this.getTabActive(VIEW_UPDATE_PROFILE)}>
            <Text style={this.getTabTextColor(VIEW_UPDATE_PROFILE)}>
              <IconFontAwesome name="edit" color={viewType == VIEW_UPDATE_PROFILE ? "#ffffff" : "black"} size={20} /> Đổi thông tin
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={{margin:10}}>
          <Text style={{color:'black'}}>Chào {user && user.username ? (user.username) : ''}</Text>
        </View> */}

        {viewType === VIEW_UPDATE_PROFILE ? 
          <View>
            <Text style={styles.textLabel}>Tên</Text>
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              secureTextEntry={false}
              placeholder="Tên"
              returnKeyType="next"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
              }}
              editable={false}
              value={user && user.username ? user.username : ''}
              underlineColorAndroid={'transparent'}
            />

            <Text style={styles.textLabel}>Email</Text>
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              secureTextEntry={false}
              placeholder="Tên"
              returnKeyType="next"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
              }}
              editable={false}
              value={user && user.email ? user.email : ''}
              underlineColorAndroid={'transparent'}
            />
          </View>
        : null}

        {viewType === VIEW_UPDATE_PASSWORD ? 
          <View>
            <Text style={styles.textLabel}>Nhập mật khẩu mới</Text>
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              secureTextEntry={true}
              placeholder="Nhập mật khẩu mới"
              returnKeyType="next"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
                sourceUpdatePassword.password = e;
                this.setState({ sourceUpdatePassword });
              }}
              value={sourceUpdatePassword.password}
              underlineColorAndroid={'transparent'}
            />

            <Text style={styles.textLabel}>Nhập lại mật khẩu mới</Text>
            <TextInput
              style={{
                backgroundColor: '#ffffff',
                padding: 10,
                height: 40,
                margin: 10,
                borderRadius: 5
              }}
              secureTextEntry={true}
              placeholder="Nhập lại mật khẩu mới"
              returnKeyType="done"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(e) => {
                sourceUpdatePassword.rePassword = e;
                this.setState({ sourceUpdatePassword });
              }}
              value={sourceUpdatePassword.rePassword}
              underlineColorAndroid={'transparent'}
            />
            <TouchableOpacity style={styles.button} onPress={this.submitUpdatePassword}>
              <Text style={styles.buttonTitle}>
                <MaterialCommunityIcons name="check" size={20} color="#ffffff" /> Đổi mật khẩu
              </Text>
            </TouchableOpacity>
          </View>
        : null}

        <View style={{padding:10, marginTop:50}}>
          <TouchableOpacity style={{...styles.button, backgroundColor:'white'}} onPress={this.submitlogout}>
              <Text style={{...styles.buttonTitle, color:'black', fontSize:14}}>
                <MaterialCommunityIcons name="logout" size={14} color="black" /> Đăng xuất
              </Text>
            </TouchableOpacity>
        </View>
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

const mapDispatchToProps = {
  logout: logoutUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
