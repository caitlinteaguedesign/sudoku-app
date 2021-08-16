import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Settings extends Component {

   render() {

      return (
         <div className="page">
            <h1 className="page-title">Settings</h1>
         </div>
      )

   }
   
}

Settings.propTypes = {
   logoutUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(Settings);