import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class Settings extends Component {

   constructor(props) {
      super(props);

      this.state = ({
         data: null
      });
   }

   componentDidMount() {
      const userId = this.props.auth.user.id;

      axios.get('/users/id/'+userId+'/settings')
         .then( res => {
            const user = res.data.result;
            console.log(user);
         })
         .catch( err => {
            console.log(err)
         })
   }

   render() {

      return (
         <div className="page">
            <h1 className="page-title">Settings</h1>
         </div>
      )

   }
   
}

Settings.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(Settings);