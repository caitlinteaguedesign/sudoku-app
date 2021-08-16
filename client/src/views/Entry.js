
import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Login from './Login';
import Register from './Register';

export default function Entry() {
   let location = useLocation();
   const nodeRef = React.useRef(null);

   return (
      <main className="main main--public">
         <div className="transition" role="presentation">
            <SwitchTransition mode="out-in">
               <CSSTransition
                  nodeRef={nodeRef}
                  in={true}
                  key={location.key}
                  classNames="swipe"
                  timeout={400}
               >
                  
                  <div ref={nodeRef} role="presentation" className="transition__wrapper">
                     <Switch location={location}>
                        <Route path="/register">
                           <Register />
                        </Route>

                        <Route path="/login">
                           <Login />
                        </Route>
                     </Switch>
                  </div>
               </CSSTransition>
            </SwitchTransition>
         </div>
      </main>
   )
}