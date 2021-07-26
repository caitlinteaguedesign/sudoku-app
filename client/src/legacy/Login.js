// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Redirect, useLocation
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { loginUser } from '../actions/authActions';
// import classnames from 'classnames';

// // import fakeAuth from "../fakeAuth";

// import FloatingField from '../components/FloatingField';

// import logo from '../img/logo.svg';

// function Login() {
  
//    const [email, setEmail] = useState('');
//    const [password, setPassword] = useState('');
//    const [errors, setErrors] = useState({});

//    useEffect( (nextProps) => {
//       if(nextProps.auth.isAuthenticated) {
//          this.props.history.push('/');
//       }

//       if(nextProps.errors) {
//          setErrors(nextProps.errors);
//       }
//    }, []);

//    //const { state } = useLocation();

//    const handleSubmit = (e) => {
//       e.preventDefault();

//       const userData = {
//          email: email,
//          password: password
//       }

//       console.log(userData);
//    }

//    // this.props.loginUser(userData);

//    // const [redirectToReferrer, setRedirectToReferrer] = useState(false);

//    // const login = () =>  {
//    //    // pre-validation
//    //    if(email!=='' && password !=='') {
//    //       fakeAuth.authenticate( () => {
//    //          setRedirectToReferrer(true);
//    //       });
//    //    }
//    // }

//    // if(redirectToReferrer === true) {
//    //    return <Redirect to={state?.from || '/'} />
//    // }

//    return (
//       <main className="main main--public">
//          <div className="prompt">

//             <div className="prompt__brand">
//                <img src={logo} alt="logo" width="36" height="36" />
//                Sudoku
//             </div>

//             <form noValidate className="prompt__form" onSubmit={handleSubmit}>
//                <div className="prompt__fields">
//                   <FloatingField type="text" name="email" update={(e) => setEmail(e.value)} />
//                   <FloatingField type="password" name="password" update={(e) => setPassword(e.value)} />
//                </div>

//                <button type="submit" className="button button_style-solid">Log in</button>
//             </form>

//             <p>Don't have an account? <Link to="/register" className="link link_style-text">Sign up</Link></p>
//          </div>
//       </main>
//    )
// }

// Login.propTypes = {
//    loginUser: PropTypes.func.isRequired,
//    auth: PropTypes.object.isRequired,
//    errors: PropTypes.object.isRequired
// }

// const mapStateToProps = state => ({
//    auth: state.auth,
//    errors: state.errors
// });

// export default connect(mapStateToProps, {loginUser})(Login);