import { useState } from 'react';
import { Redirect, useLocation } from 'react-router';

import fakeAuth from "../fakeAuth";

import FloatingField from '../components/FloatingField';

export default function Login() {

   const [redirectToReferrer, setRedirectToReferrer] = useState(false);
   const { state } = useLocation();

   const login = () => fakeAuth.authenticate( () => {
      setRedirectToReferrer(true);
   });

   if(redirectToReferrer === true) {
      return <Redirect to={state?.from || '/'} />
   }

   return (
      <main className="main main--public">
         <div className="prompt">
            Sudoku

            <FloatingField type="text" name="email" />
            
            <FloatingField type="password" name="password" />

            <button onClick={login} className="button button_style-solid">Log in</button>
         </div>
      </main>
   )
}