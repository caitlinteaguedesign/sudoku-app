import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Redirect, useLocation
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
//import classnames from 'classnames';

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

   componentDidUpdate(nextProps) {

      if(nextProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {

         console.log('a change!');
         
         if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/');
         }

         if(nextProps.errors) {
            this.setState({
               errors: nextProps.errors
            })
         }

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

      console.log(userData);
      this.props.loginUser(userData);
   }

   render() {
      const { errors } = this.state;

      return (
         <main className="main main--public">
            <div className="prompt">

               <div className="prompt__brand">
                  <img src={logo} alt="logo" width="36" height="36" />
                  Sudoku
               </div>

               <form noValidate className="prompt__form" onSubmit={this.handleSubmit}>
                  <div className="prompt__fields">
                     <FloatingField type="text" name="email" hasError={errors.email} update={this.handleChange} />
                     <FloatingField type="password" name="password" hasError={errors.password} update={this.handleChange} />
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

export default connect(mapStateToProps, {loginUser})(Login);