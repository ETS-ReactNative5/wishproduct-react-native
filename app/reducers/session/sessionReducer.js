import * as ACTIONS from './../../actions/session/actionsTypes';

const initialState = {
  restoring: false,
  loading: false,
  user: null,
  error: null,
  logged: null,
  registered: null
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SESSION_RESTORING:
      return { ...state, restoring: true };
    case ACTIONS.SESSION_LOADING:
      return { ...state, restoring: false, loading: true, error: null };
    case ACTIONS.SESSION_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        user: action.user,
        error: null,
        logged: true,
        registered: null
      };
    case ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        user: action.user,
        error: null,
        logged: null,
        registered: true
      };
    case ACTIONS.SESSION_ERROR:
      return {
        ...state,
        restoring: false,
        loading: false,
        user: null,
        error: action.error,
        logged: null,
        registered: null
      };
    case ACTIONS.SESSION_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default sessionReducer;
