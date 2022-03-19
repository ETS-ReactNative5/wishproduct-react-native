import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

export class BasicFormComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: 'nguyentvk@gmail.com', 
      password: 'nguyentvk',
    };
  }

  handleEmailChange = email => this.setState({ email: (email||'').trim() });

  handlePasswordChange = password => this.setState({ password: (password||'').trim() });

  handleButtonPress = () => {
    const { email, password } = this.state;
    this.props.onButtonPress(email, password);
  };

  showQuenMatKhau = ()=>{
    Alert.alert(
      "Thông báo",
      "Vui lòng liên hệ admin để lấy lại mật khẩu.",
      [
        {
          text: "Đóng",
          onPress: () => {
          },
          style: "cancel"
        }
      ]
    );
    return;
  }
  render() {
    const { email, password } = this.state;
    const { textInput, button, buttonTitle } = styles;
    return (
      <View>
        <View style={{flexDirection:'row', alignContent:'flex-start', marginLeft:10}}>
          <IconFontAwesome name="user" color="#ffffff" size={20} />
          <Text style={{fontSize:14, color:'white'}}>   Tên đăng nhập</Text>
        </View>
        <TextInput
          style={textInput}
          placeholder="Tên đăng nhập"
          returnKeyType="next"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={this.handleEmailChange}
          value={email}
          underlineColorAndroid={'transparent'}
        />

        <View style={{flexDirection:'row', alignContent:'flex-start', marginTop:15, marginLeft:10}}>
          <IconFontAwesome name="unlock" color="#ffffff" size={20} />
          <Text style={{fontSize:14, color:'white'}}>    Mật khẩu</Text>
        </View>
        <TextInput
          style={textInput}
          placeholder="Mật khẩu"
          secureTextEntry={true}
          returnKeyType="done"
          onChangeText={this.handlePasswordChange}
          value={password}
          underlineColorAndroid={'transparent'}
        />

        <TouchableOpacity style={button} onPress={this.handleButtonPress}>
          <Text style={buttonTitle}>
            <Icon name="login" size={20} color="#ffffff" />
            {this.props.buttonTitle}
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection:'column', alignContent:'center', alignItems:'center', marginTop:5}}>
          <TouchableOpacity onPress={()=>this.showQuenMatKhau()}>
            <Text style={{fontSize:12, fontWeight:'bold', color:'#000'}}> Quên mật khẩu ? </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
