import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { ICON_FONT_SIZE } from '../../app_const';
const LOGO_GIATHUCPHAM = require('./../../../assets/icons/logo-giathucpham.png');
const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    paddingTop: 5
    // flex: 1,
  },
  navBarItem: {
    flex: 1,
    flexDirection: 'row'
    // justifyContent: 'center',
  }
});

class NavBarCustom extends Component {
  constructor(props) {
    super(props);
  }

  isLoggedUser(){
    // return this.props.logged || true;
    return true;
  }
  clickHome() {
    if (Actions.currentScene.indexOf('home') >= 0) {
      return null;
    }
    return Actions.home();
  }
  _renderLeft() {
    // if (Actions.currentScene === 'customNavBar1') {
    //     return (
    //         <TouchableOpacity onPress={() => console.log('Hamburger button pressed')} style={[]}>
    //             {/* <Image
    //             style={{ width: 30, height: 50 }}
    //             resizeMode="contain"
    //             source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png' }}
    //             /> */}
    //             <Icon name="home" size={ICON_FONT_SIZE} color="#ffffff" />
    //         </TouchableOpacity>
    //     );
    // }
    // if (!this.props.user) {
    //   return <View />;
    // }
    return (
      <TouchableOpacity onPress={this.clickHome} style={[styles.navBarItem, { paddingLeft: 10 }]}>
        {this.isLoggedUser() ? <Icon name="format-align-justify" size={ICON_FONT_SIZE} color="#ffffff" /> : null}
      </TouchableOpacity>
    );
  }

  _renderMiddle() {
    let styleMid = {
      flexDirection: 'row',
      justifyContent: 'center',
      color: 'white'
    };
    let styleText = {
      color: 'white',
      fontSize: 14,
      paddingTop: 6
    };
    return (
      <View style={[styles.navBarItem, styleMid]}>
        {/* <Text style={styleText}>
          {this.props.title}
          </Text> */}
        <Image resizeMode="contain" style={{ width: 100, height: 30 }} source={LOGO_GIATHUCPHAM} />
      </View>
    );
  }

  clickProfile() {
    if (Actions.currentScene === 'profile') {
      return null;
    }
    return Actions.profile();
  }
  _renderRight() {
    let styleRight = {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: 10
    };
    // if (!this.props.user) {
    //   return <View />;
    // }
    return (
      <TouchableOpacity onPress={this.clickProfile} style={[styles.navBarItem, styleRight]}>
        {/* <TouchableOpacity onPress={() => console.log('Share')} style={{ paddingRight: 10 }}>
            <Image style={{ width: 30, height: 50 }} resizeMode="contain" source={{ uri: 'https://cdn3.iconfinder.com/data/icons/glypho-free/64/share-512.png' }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Search')} style={{ paddingRight: 10 }}>
            <Image style={{ width: 30, height: 50 }} resizeMode="contain" source={{ uri: 'https://maxcdn.icons8.com/Share/icon/p1em/Very_Basic//search1600.png' }} />
        </TouchableOpacity> */}
        {this.isLoggedUser() ? <Icon name="account" size={ICON_FONT_SIZE} color="#ffffff" /> : null}
      </TouchableOpacity>
    );
  }

  render() {
    let dinamicStyle = {};
    // if (Actions.currentScene === 'customNavBar1') {
    //     dinamicStyle = { backgroundColor: 'red' };
    // } else {
    //     dinamicStyle = { backgroundColor: '#1f5845' };
    // }
    dinamicStyle = { backgroundColor: '#1f5845' };

    return (
      <View style={[styles.container, dinamicStyle]}>
        {this._renderLeft()}
        {this._renderMiddle()}
        {this._renderRight()}
      </View>
    );
  }
}

const mapStateToProps = ({ routes, sessionReducer }) => ({
  routes: routes,
  user: sessionReducer.user,
  logged: sessionReducer.logged
});

const mapDispatchToProps = {
  // logout: logoutUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarCustom);
