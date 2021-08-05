import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authActions';

class UserHandle extends Component {
   render() {
      const { user } = this.props.auth;

      return (
         <div className="header__container">
            <p>Hi, <span className="text_bold">{user.name}</span></p>
            <button type="button" 
               onClick={() => this.props.logoutUser()}
               className="button button_style-solid button_style-solid--primary">
                  Log Out
            </button>
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

export default connect(mapStateToProps, {logoutUser})(UserHandle);