import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Dashboard extends Component {

   render() {
      // const { user } = this.props.auth;

      return (
         <div className="start">
            <p className="start__prompt">{`You don't have any puzzles yet!`}</p>
            <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
         </div>
      )
   }
}

Dashboard.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Dashboard));