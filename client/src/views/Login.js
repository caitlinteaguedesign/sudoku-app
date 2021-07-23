import { useState } from 'react';
import { Redirect, useLocation } from 'react-router';

import fakeAuth from "../fakeAuth";

import FloatingField from '../components/FloatingField';

import logo from '../img/logo.svg';

export default function Login() {

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [redirectToReferrer, setRedirectToReferrer] = useState(false);
   const { state } = useLocation();

   const updateEmail = (value) => {
      setEmail(value);
   }

   const updatePassword = (value) => {
      setPassword(value);
   }

   const login = () =>  {
      // pre-validation
      if(email!=='' && password !=='') {
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

            <FloatingField type="text" name="email" update={updateEmail} />

            <FloatingField type="password" name="password" update={updatePassword} />

            <button onClick={login} className="button button_style-solid">Log in</button>
         </div>
      </main>
   )
}