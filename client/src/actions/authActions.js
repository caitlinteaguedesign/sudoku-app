import axios from 'axios';
import setAuthToken from '../util/setAuthToken';
import jwt_decode from 'jwt-decode';

import {
   GET_ERRORS,
   SET_CURRENT_USER,
   USER_LOADING,
   CAN_LOGOUT
} from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
   axios
      .post('/users/register', userData)
      .then(
         res => {
            // reset errors
            dispatch(resetErrors());

            // redirect to login after successful register
            history.push('/login');
         }
      ) 
      .catch(err => 
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      );
}

// Login
export const loginUser = userData => dispatch => {
   axios
      .post('/users/login', userData)
      .then(res => {
         // save to local storage
         const { token } = res.data;
         localStorage.setItem('jwtToken', token);

         // set token to auth header
         setAuthToken(token);

         // decode to get user data
         const decoded = jwt_decode(token);

         // set current user
         dispatch(setCurrentUser(decoded));

         // reset errors
         dispatch(resetErrors());
      })
      .catch( err => 
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      );
}

// Set logged in user
export const setCurrentUser = decoded => {
   return {
      type: SET_CURRENT_USER,
      payload: decoded
   }
}

// Set if the user can log out
export const setCanLogout = decoded => {
   return {
      type: CAN_LOGOUT,
      payload: decoded
   }
}

// User loading
export const setUserLoading = () => {
   return {
      type: USER_LOADING
   }
}

// Reset Errors 
export const resetErrors = () => {
   return {
      type: GET_ERRORS,
      payload: {}
   }
}

// Log user out
export const logoutUser = (history) => dispatch => {

   // Remove token from local storage
   localStorage.removeItem('jwtToken');

   // Remove auth header for future requests
   setAuthToken(false);

   // reset can logout
   dispatch(setCanLogout(true));

   // Set current user to empty object {} which will set isAuthenticated to false
   dispatch(setCurrentUser({}));

   // redirect to homepage after logout
   history.push('/?logout');
}