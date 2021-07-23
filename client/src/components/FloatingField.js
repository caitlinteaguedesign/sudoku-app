import { useState } from "react";

export default function FloatingField(props) {

   const [inactive, setInactive] = useState(true);
   const [value, setValue] = useState('');

   const handleChange = (e) => {

      const value = e.target.value;
      setValue(value);

      if(value==='') {
         setInactive(true);
      }
      else {
         setInactive(false);
         props.update(value)
      }
   }

   return (
      <div className={`floating-field ${ inactive ? 'floating-field--inactive' : ''}`}>
         <label className="floating-field__label" htmlFor={props.name}>{props.name}</label>
         <input className="floating-field__input" onChange={handleChange} value={value} type={props.type} id={props.name} />
      </div>
   )
}