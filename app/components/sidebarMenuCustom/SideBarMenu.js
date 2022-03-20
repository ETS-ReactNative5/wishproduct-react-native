import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';

const CardSection = props => {
  const cardstyles = {
    containerStyle: {
      borderBottomWidth: 1,
      padding: 5,
      backgroundColor: '#fff',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderColor: '#ddd',
      position: 'relative'
    }
  };
  return <View style={[cardstyles.containerStyle, props.style]}>{props.children}</View>;
};



const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    padding: 15,
    height: 45,
    overflow: 'hidden',
    alignSelf: 'flex-start'
  },
  textStyle: {
    fontSize: 18,
    color: '#555'
  },
  nameContainer: {
    padding: 15,
    height: 45,
    overflow: 'hidden',
    alignSelf: 'flex-start'
  },
  name: {
    fontSize: 22,
    color: '#555',
    fontWeight: '400'
  }
});

class SideBarMenu extends React.Component {
  render() {
    return (
      <View style={[styles.viewContainer, this.props.sceneStyle]}>
        <CardSection style={{ flexDirection: 'column', padding: 30 }}>
          <Button
            containerStyle={styles.container}
            style={styles.name}
            onPress={() => {
              Actions.profile();
            }}
          >
            User Name
          </Button>
        </CardSection>
        <CardSection style={{ flexDirection: 'column' }}>
          <Button
            containerStyle={styles.container}
            style={styles.textStyle}
            onPress={() => {
              Actions.home();
            }}
          >
            Home Page
          </Button>
        </CardSection>
        <CardSection style={{ flexDirection: 'column', borderBottomWidth: 0 }}>
          <Button containerStyle={styles.container} style={styles.textStyle} onPress={() => Actions.settings()}>
            Settings
          </Button>
          <Button containerStyle={styles.container} style={styles.textStyle} onPress={() => Actions.auth()}>
            Log Out
          </Button>
        </CardSection>
      </View>
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
  // login: loginUser,
  // logout: logoutUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarMenu);