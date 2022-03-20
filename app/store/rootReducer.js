import { combineReducers } from 'redux';

import routesReducer from './../reducers/routes/routesReducer';
import sessionReducer from './../reducers/session/sessionReducer';

export default combineReducers({
  routesReducer,
  sessionReducer,
});
