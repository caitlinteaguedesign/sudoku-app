import { useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';

import fakeAuth from "../fakeAuth";

import FloatingField from '../components/FloatingField';

import logo from '../img/logo.svg';

export default function Login() {

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [redirectToReferrer, setRedirectToReferrer] = useState(false);
   const { state } = useLocation();

   const register = () =>  {
      // pre-validation
      if(name !=='' && email!=='' && password !=='') {
         fakeAuth.authenticate( () => {
            setRedirectToReferrer(true);
         });
      }
   }

   if(redirectToReferrer === true) {
      return <Redirect to={state?.from || '/'} />
   }

   return (
      <main className="main main--public">
         <div className="prompt">

            <div className="prompt__brand">
               <img src={logo} alt="logo" width="36" height="36" />
               Sudoku
            </div>

            <div className="prompt__fields">
               <FloatingField type="text" name="name" update={ () => setName() } />               
               <FloatingField type="text" name="email" update={ () => setEmail() } />
               <FloatingField type="password" name="password" update={ () => setPassword() } />
            </div>

            <button onClick={register} className="button button_style-solid">Register</button>

            <p>Already have an account? <Link to="/login" className="link link_style-text">Log in</Link></p>
         </div>
      </main>
   )
}