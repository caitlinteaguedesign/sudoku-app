import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; // Redirect, useLocation
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';

import shallowEqual from '../util/shallowEquality';
import FloatingField from '../components/FloatingField';

import logo from '../img/logo.svg';

class Login extends Component {
  
   constructor() {
      super();

      this.state = {
         email: '',
         password: '',
         errors: {}
      };
   }

   componentDidMount() {
      if (this.props.auth.isAuthenticated) {
         console.log('should already be logged in');
         this.props.history.push('/dashboard')
      }
   }

   componentDidUpdate(prevProps) {

      if(prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
         //console.log('prev auth '+prevProps.auth.isAuthenticated);
         //console.log('this auth'+this.props.auth.isAuthenticated);

         if(this.props.auth.isAuthenticated) {
            console.log('login!');
            this.props.history.push('/dashboard');
         }

      }

      if(!shallowEqual(prevProps.errors, this.props.errors)) {
         //console.log('prev ', prevProps.errors);
         //console.log('this ', this.props.errors);

         this.setState({
            errors: this.props.errors
         });

      }
      
   }

   handleChange = (e) => {
      this.setState({ [e.target.name]: e.target.value });
   }
   
   handleSubmit = (e) => {
      e.preventDefault();

      const userData = {
         email: this.state.email,
         password: this.state.password
      }

      //console.log('handle submit: ', userData);
      this.props.loginUser(userData);
   }

   render() {
      
      const { errors } = this.props;

      return (
         <main className="main main--public">
            <div className="prompt">

               <div className="prompt__brand">
                  <img src={logo} alt="logo" width="36" height="36" />
                  Sudoku
               </div>

               <form noValidate className="prompt__form" onSubmit={this.handleSubmit}>
                  <div className="prompt__fields">
                     <FloatingField type="text" name="email" errors={errors.email} update={this.handleChange} />
                     <FloatingField type="password" name="password" errors={errors.password} update={this.handleChange} />
                  </div>

                  <button type="submit" className="button button_style-solid">Log in</button>
               </form>

               <p>Don't have an account? <Link to="/register" className="link link_style-text">Sign up</Link></p>
            </div>
         </main>
      )
   }
}

Login.propTypes = {
   loginUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth,
   errors: state.errors
});

export default connect(mapStateToProps, {loginUser}) (withRouter(Login));