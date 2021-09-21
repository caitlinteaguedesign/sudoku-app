import { SET_CURRENT_USER, CAN_LOGOUT, USER_LOADING } from '../actions/types';

const isEmpty = require('is-empty');

const initialState = {
   isAuthenticated: false,
   user: {},
   loading: false,
   canLogout: true
}

export default function authReducer(state = initialState, action) {
   switch (action.type) {
      case SET_CURRENT_USER:
         return {
            ...state,
            isAuthenticated: !isEmpty(action.payload),
            user: action.payload,
            canLogout: true
         }
      case CAN_LOGOUT:
         return {
            ...state,
            canLogout: action.payload
         }
      case USER_LOADING:
         return {
            ...state,
            loading: true
         }
      default:
         return state;
   }
}