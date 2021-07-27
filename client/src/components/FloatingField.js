import { useState } from 'react';
import classnames from 'classnames';

import { ReactComponent as OpenEye } from '../img/open-eye.svg';
import { ReactComponent as CloseEye } from '../img/close-eye.svg';

export default function FloatingField(props) {

   const [inactive, setInactive] = useState(true);
   const [value, setValue] = useState('');

   const handleChange = (e) => {
      const value = e.target.value;
      setValue(value);

      if(value==='') setInactive(true);
      else setInactive(false);

      props.update(e);
   }

   const [type, setType] = useState(props.type);

   const togglePassword = (e) => {
      if(type==='password') setType('text');
      else setType('password');
   }

   return (
      <div className={
         classnames('floating-field', 
            { 'floating-field--inactive': inactive },
            { 'floating-field_color-default': !props.errors },
            { 'floating-field_color-error': props.errors }
         )}
      >
         <label className="floating-field__label" htmlFor={props.name}>{props.name}</label>
         <input 
            className="floating-field__input" 
            onChange={handleChange} 
            value={value} 
            type={type}
            name={props.name} 
            id={props.name} 
         />
         {props.type === 'password' && 
         <button type="button" className="floating-field__togglePassword" onClick={togglePassword}>
            {type==='password' ? 
            <OpenEye className="floating-field__togglePassword-icon" width="24" height="24" role="img" aria-label="Press to show password" />
            :
            <CloseEye className="floating-field__togglePassword-icon" width="24" height="24" role="img" aria-label="Press to hide password" />
            }
         </button>
         }
         {props.errors && 
         <span className="floating-field__error">{props.errors}</span>
         }
      </div>
   )
}