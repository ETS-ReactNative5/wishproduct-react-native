import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View,BackHandler, ToastAndroid, Linking } from 'react-native';
import Routes from './app/components/routes';
import {store} from './app/components/routes/routes';
// import asyncStorageService from './app/services/asyncStorageService';
// import apiService from './app/services/apiService';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      clickcount:0,
    }
  }
  componentDidMount(){
    let self=this;
    BackHandler.addEventListener("hardwareBackPress",()=>{
      let authUser = store.getState().sessionReducer.user;
      authUser = authUser && authUser.id ? authUser : null;
      if(!authUser && Actions.currentScene.indexOf('login') >= 0){
        self.check();
        return true;
      }else if(authUser && Actions.currentScene.indexOf('home_nhapKho') >= 0 ){
        return true; // You need to return true, if you want to disable the default back button behavior.
      }
      return false;
    });
  }

  componentWillUnmount() {
  }

  check=()=>{
    let self=this;
    clearTimeout(this.timerId);
    this.setState({
      clickcount: this.state.clickcount+1,
    },()=>{
      if(this.state.clickcount === 1){
        ToastAndroid.show(`Nhấn nút back thêm lần nữa để thoát app`,ToastAndroid.SHORT);
        this.timerId = setTimeout(()=>{
          self.setState({'clickcount':0});
        },2000);
      } else if(this.state.clickcount >= 2) {
        BackHandler.exitApp();
      }
    });
  }
  render() {
    return <Routes />;
  }
}

export default App;
