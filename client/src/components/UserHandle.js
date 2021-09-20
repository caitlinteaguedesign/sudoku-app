import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logoutUser } from '../actions/authActions';

class UserHandle extends Component {

   checkCanLogout = () => {
      if(!this.props.auth.canLogout) {
         const confirm = window.confirm(`Are you sure you want to log out? You will lose unsaved changes.`);
         if(confirm) {
            this.props.logoutUser(this.props.history);
         }
      }
      else {
         this.props.logoutUser(this.props.history)
      }
   }

   render() {
      const { user, isAuthenticated } = this.props.auth;

      return (
         <div className="header__container">
            { isAuthenticated ? <>
            <p>Hi, <span className="text_bold">{user.name}</span></p>
            <Link to="/dashboard" className="link link_style-text">Dashboard</Link>
            <Link to="/settings" className="link link_style-text">Settings</Link>
            <button type="button" 
               onClick={() => this.checkCanLogout()}
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