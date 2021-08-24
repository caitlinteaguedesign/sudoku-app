import { useState, useEffect } from 'react';
import classnames from 'classnames';

export default function SlideIn(props) {
   
   const [animateIn, setAnimateIn] = useState(false);
   const [animateOut, setAnimateOut] = useState(false);
   const [state, setState] = useState(false);

   useEffect( () => {
      if(props.initial) {
         setAnimateIn(true, setState(true));
      }
   }, [props.initial]);

   const handleDismiss = () => {
      setAnimateIn(false, setAnimateOut(true, setState(false)));
   }

   return (
      <div className={classnames('slidein',
         {'slidein-show': state },
         {'slidein-hide': !state },
         {'slidein-animateIn': animateIn },
         {'slidein-animateOut': animateOut })}
      >
         {props.children}
         <button type="button" className="slidein__dismiss" onClick={() => handleDismiss()}>Dismiss</button>
      </div>
   )
}