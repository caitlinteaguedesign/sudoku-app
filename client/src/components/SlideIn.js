import { useState, useEffect } from 'react';
import classnames from 'classnames';

import { ReactComponent as Exmark } from '../img/exmark.svg';

export default function SlideIn(props) {
   
   const [animateIn, setAnimateIn] = useState(false);
   const [animateOut, setAnimateOut] = useState(false);
   const [state, setState] = useState(false);

   const dismiss = () => {
      setAnimateIn(false);
      setAnimateOut(true);
      setState(false);

   }

   useEffect( () => {
      if(props.initial) {
         setAnimateIn(true);
         setAnimateOut(false);
         setState(true);
      }
      else {
         dismiss();
      }
   }, [props.initial]);

   const handleDismiss = () => {
      dismiss();
      if(props.callback) props.callback();
   }

   return (
      <div className={classnames('slidein',
         {'slidein-show': state },
         {'slidein-hide': !state },
         {'slidein-animateIn': animateIn },
         {'slidein-animateOut': animateOut })}
      >
         {props.children}
         <button type="button" title="Press to dismiss this notification" className="slidein__dismiss" onClick={() => handleDismiss()}>
            <Exmark role="img" aria-label="ex mark" width="18" height="18" className="slidein__icon" />
         </button>
      </div>
   )
}