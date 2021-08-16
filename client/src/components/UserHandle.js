import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logoutUser } from '../actions/authActions';

class UserHandle extends Component {
   render() {
      const { user, isAuthenticated } = this.props.auth;

      return (
         <div className="header__container">
            { isAuthenticated ? <>
            <p>Hi, <span className="text_bold">{user.name}</span></p>
            <Link to="/settings" className="link link_style-text">Settings</Link>
            <button type="button" 
               onClick={() => this.props.logoutUser()}
               className="button button_style-solid button_style-solid--primary">
                  Log Out
            </button>
            </>
            :
            <Link to="/login" className="link link_style-solid">Log in</Link>
            }
         </div>
      )

   }
   
}

UserHandle.propTypes = {
   logoutUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(withRouter(UserHandle));