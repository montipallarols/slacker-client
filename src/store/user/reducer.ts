import {
  UserState,
  UserActionTypes,
  LOADING_USER,
  LOGIN_SUCCESS,
  TOKEN_STILL_VALID,
} from "./types";

const initialState: UserState = {
  loading: false,
  message: null,
  token: localStorage.getItem("token"),
  firstName: null,
  lastName: null,
  email: null,
  profile: null,
};

const userReducer = (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case LOADING_USER:
      return { ...state, loading: true };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return { ...state, loading: false, ...action.payload };

    case TOKEN_STILL_VALID:
      return { ...state, loading: false, ...action.payload };

    default:
      return state;
  }
};

export default userReducer;
