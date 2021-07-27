import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//import fakeAuth from "../fakeAuth";

// export default function PrivateRoute({children, ...rest}) {
//    return (
//       <Route {...rest} render={({ location }) => {
//          return fakeAuth.isAuthenticated === true
//             ? children
//             : <Redirect to={{
//                pathname: '/login',
//                state: { from: location }
//                }} />
//       }} />
//    )
// }

const PrivateRoute = ({children, auth, ...rest}) => (
   <Route 
      {...rest}
      render= {props => 
      auth.isAuthenticated === true 
      ? children
      : <Redirect to='/login' />
      }
   />
)

PrivateRoute.propTypes = {
   auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);