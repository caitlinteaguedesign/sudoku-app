import { useState } from 'react';
import { Redirect, useLocation } from 'react-router';

import fakeAuth from "../fakeAuth";

export default function Login() {

   const [redirectToReferrer, setRedirectToReferrer] = useState(false);
   const { state } = useLocation();

   const login = () => fakeAuth.authenticate( () => {
      console.log('clicked')
      setRedirectToReferrer(true);
   });

   if(redirectToReferrer === true) {
      return <Redirect to={state?.from || '/'} />
   }

   return (
      <div>
         Login
         <button onClick={login}>Log in</button>
      </div>
   )
}