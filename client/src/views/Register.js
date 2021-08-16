import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; 
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions';

import shallowEqual from '../util/shallowEquality';
import FloatingField from '../components/FloatingField';

import logo from '../img/wordmark.svg';

class Register extends Component {

   constructor(props) {
      super(props);

      this.state = {
         name: '',
         email: '',
         password: '',
         errors: {}
      };
   }

   componentDidMount() {
      if (this.props.auth.isAuthenticated) {
         this.props.history.push('/')
      }
   }

   componentDidUpdate(prevProps) {

      if(prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {

         if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
         }

      }

      if(!shallowEqual(prevProps.errors, this.props.errors)) {

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

      const newUser = {
         name: this.state.name,
         email: this.state.email,
         password: this.state.password
      }

      this.props.registerUser(newUser, this.props.history);
   }

   render() {

      const { errors } = this.props;

      return (
         <div className="prompt">

            <div className="prompt__brand">
               <Link to="/">
                  <img src={logo} width="180" height="36" alt="Sudoku Maker logo" />
               </Link>
            </div>

            <form noValidate className="prompt__form" onSubmit={this.handleSubmit}>
               <div className="prompt__fields">
                  <FloatingField type="text" name="name" errors={errors.register_name} update={this.handleChange} />               
                  <FloatingField type="text" name="email" errors={errors.register_email} update={this.handleChange} />
                  <FloatingField type="password" name="password" errors={errors.register_password} update={this.handleChange} />
               </div>

               <button type="submit" className="button button_style-solid button_style-solid--primary">Register</button>
            </form>

            <p>Already have an account? <Link to="/login" className="link link_style-text">Log in</Link></p>
         </div>
      )
   }
}

Register.propTypes = {
   registerUser: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth,
   errors: state.errors
});

export default connect(mapStateToProps, {registerUser}) (withRouter(Register));