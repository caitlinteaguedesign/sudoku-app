import { useHistory } from "react-router-dom";

import fakeAuth from "../fakeAuth";

export default function UserHandle() {
   const history = useHistory();

   return (
      <div className="header__container">
         <p>Hi, <span className="text_bold">Tom</span></p>
         <button type="button" 
            onClick={() => { fakeAuth.signout(() => history.push('/')) }} 
            className="button button_style-solid">
               Log Out
         </button>
      </div>
   )
}