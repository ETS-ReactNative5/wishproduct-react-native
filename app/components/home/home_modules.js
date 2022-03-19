import React, { Component } from 'react';
import { View, Button, Image, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { styles } from './styles';
import { Actions } from 'react-native-router-flux';
import { LoadingIndicator } from '../loadingIndicator/loadingIndicator';
import { logoutUser } from '../../actions/session/actions';
import apiService from './../../services/apiService';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { APP_STYLES } from '../../styles_app';
import { MODULE_DEFINE } from '../../app_const';
import * as _ from 'lodash';

class HomeModules extends Component {
  constructor(props){
    super(props);
    this.state = {
      listModules: []
    }
  }
  componentDidMount(){
    if(!this.props.user){
      Actions.reset('login');
      return;
    }
  }

  componentDidMount(){
    this.getDataModules();
  }
  getDataModules = ()=>{
    apiService.app.listModule({}).then(r=>{
    // apiService.get('/app/v1/modules').then(r=>{
      if(r && r.data && Array.isArray(r.data.items)){
        this.setState({
          listModules : r.data.items,
        })
      }
    }).catch(e=>{
      console.error(e);
      ToastAndroid.show(`ERROR get list modules`+ JSON.stringify(e), ToastAndroid.LONG);
    })
  }

  render() {
    let {listModules} = this.state;
    // if(listModules.length > 0){
    //   let find = _.find(listModules,{key:'mobile.kho.kho-thanh-pham'});
    //   if(!find){
    //     listModules.push({
    //       key:'mobile.kho.kho-thanh-pham',
    //       title: 'Nhập kho thành phẩm',
    //       value: 'Nhập kho thành phẩm',
    //     })
    //   }
    // }
    return (
      <View style={{...styles.container,justifyContent: 'center'}}>
          {listModules.length > 0
          ? 
          listModules.map((item,index)=>{
            let defineItem = item.key && MODULE_DEFINE[item.key] ? MODULE_DEFINE[item.key] : {};
            item = {
              ...item,
              screen: defineItem.screen,
              icon: defineItem.icon,
              title: item ? (item.title || item.value || 'N/A') : 'N/A',
            }
            return <TouchableOpacity key={index+'_'+item.screen} style={{...APP_STYLES.button, width:'90%'}} onPress={Actions[item.screen]}>
              <Text style={{...APP_STYLES.buttonTitle}}>
                  <IconFontAwesome name={item.icon} size={20} color="#ffffff" style={{marginRight:15}} />
                  <Text style={{marginLeft:15, paddingLeft:15}} >{'   '+item.title}</Text>
              </Text>
            </TouchableOpacity>
          })
          : 
          <LoadingIndicator color="#ffffff" size="large" />
          }
      </View>
    );
  }
}

const mapStateToProps = ({ routes, sessionReducer }) => ({
  routes: routes,
  user: sessionReducer.user,
});

const mapDispatchToProps = {
  logout: logoutUser
};

export default connect( mapStateToProps, mapDispatchToProps)(HomeModules);
