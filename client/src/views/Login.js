import { useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';

// import fakeAuth from "../fakeAuth";

import FloatingField from '../components/FloatingField';

import logo from '../img/logo.svg';

export default function Login() {
   const { state } = useLocation();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errors, setErrors] = useState({});

   const handleSubmit = () => {
      const userData = {
         email: email,
         password: password
      }
      console.log(userData);
   }

   // const [redirectToReferrer, setRedirectToReferrer] = useState(false);

   // const login = () =>  {
   //    // pre-validation
   //    if(email!=='' && password !=='') {
   //       fakeAuth.authenticate( () => {
   //          setRedirectToReferrer(true);
   //       });
   //    }
   // }

   // if(redirectToReferrer === true) {
   //    return <Redirect to={state?.from || '/'} />
   // }

   return (
      <main className="main main--public">
         <div className="prompt">

            <div className="prompt__brand">
               <img src={logo} alt="logo" width="36" height="36" />
               Sudoku
            </div>

            <form noValidate className="prompt__form" onSubmit={handleSubmit}>
               <div className="prompt__fields">
                  <FloatingField type="text" name="email" update={ () => setEmail() } />
                  <FloatingField type="password" name="password" update={ () => setPassword() } />
               </div>

               <button type="submit" className="button button_style-solid">Log in</button>
            </form>

            <p>Don't have an account? <Link to="/register" className="link link_style-text">Sign up</Link></p>
         </div>
      </main>
   )
}