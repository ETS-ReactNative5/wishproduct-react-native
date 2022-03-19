// import firebaseService from './../../enviroments/firebase';
import apiService from './../../services/apiService';
import * as types from './actionsTypes';
import {
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';
import axios from 'axios';

function notifyMessage(msg) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.LONG)
  } else {
    AlertIOS.alert(msg);
  }
}

// export const restoreSession = () => dispatch => {
//   dispatch(sessionLoading());
//   dispatch(sessionRestoring());

//   firebaseService.auth().onAuthStateChanged(user => {
//     if (user) {
//       dispatch(sessionSuccess(user));
//     } else {
//       dispatch(sessionLogout());
//     }
//   });
// };

export const loginUser = (email, password) => dispatch => {
  dispatch(sessionLoading());
  apiService.post('/public/authenticate', {
      username: email,
      password: password
    })
    .then(r => {
      let user = r.user;
      let Authorization = r.Authorization;
      let permissions = r.permissions;
      user.token = `Bearer ${Authorization}`;
      user.permissions = permissions;
      apiService.defaults.headers['Authorization'] = `Bearer ${Authorization}`;
      apiService.defaults.headers.common['Authorization'] = `Bearer ${Authorization}`;
      // alert(JSON.stringify(Authorization)); 
      // alert(JSON.stringify(permissions)); 
      // alert(JSON.stringify(user));
      dispatch(sessionSuccess(user));
    })
    .catch(e => {
      dispatch(sessionError(e && e.indexOf && e.indexOf('Unauthorized')>-1 ? `Username or password is invalid` : e));
      notifyMessage(JSON.stringify(e));
    });
  // firebaseService
  //   .auth()
  //   .signInWithEmailAndPassword(email, password)
  //   .then(user => {
  //     dispatch(sessionSuccess(user));
  //   })
  //   .catch(error => {
  //     dispatch(sessionError(error.message));
  //   });
};

export const signupUser = (email, password) => dispatch => {
  dispatch(sessionLoading());

  // firebaseService
  //   .auth()
  //   .createUserWithEmailAndPassword(email, password)
  //   .then(user => {
  //     dispatch(signupSuccess(user));
  //   })
  //   .catch(error => {
  //     dispatch(sessionError(error.message));
  //   });
};

export const logoutUser = () => dispatch => {
  // dispatch(sessionLoading());
  dispatch(sessionLogout());
  // firebaseService
  //   .auth()
  //   .signOut()
  //   .then(() => {
  //     dispatch(sessionLogout());
  //   })
  //   .catch(error => {
  //     dispatch(sessionError(error.message));
  //   });
};

// const sessionRestoring = () => ({
//   type: types.SESSION_RESTORING
// });

const sessionLoading = () => ({
  type: types.SESSION_LOADING
});

const sessionSuccess = user => ({
  type: types.SESSION_SUCCESS,
  user
});

const signupSuccess = user => ({
  type: types.SIGNUP_SUCCESS,
  user
});

const sessionError = error => ({
  type: types.SESSION_ERROR,
  error
});

const sessionLogout = () => ({
  type: types.SESSION_LOGOUT
});
