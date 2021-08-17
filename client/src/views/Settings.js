import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { SketchPicker } from 'react-color';

import Loading from '../components/Loading';

class Settings extends Component {

   constructor(props) {
      super(props);

      this.state = ({
         data: null,
         loading: true,
         modals: {
            color1: false,
            color2: false,
            color3: false,
         }
      });
   }

   componentDidMount() {
      const userId = this.props.auth.user.id;

      axios.get('/users/id/'+userId+'/settings')
         .then( res => {
            const user = res.data.result;

            if(user.game.readonly.color === '') user.game.readonly.color = '#454545';
            if(user.game.default.color === '') user.game.default.color = '#333333';
            if(user.game.guess.color === '') user.game.guess.color = '#1160c2';

            this.setState({
               data: user,
               loading: false
            })
         })
         .catch( err => {
            console.log(err)
         })

      
   }

   toggleColor = (modal) => {
      const resetModals = {
         color1: false,
         color2: false,
         color3: false,
      }

      this.setState({
         modals: {
            ...resetModals,
            [modal]: !this.state.modals[modal]
         }
      });
   }

   closeModals = () => {
      this.setState({
         modals: {
            color1: false,
            color2: false,
            color3: false,
         }
      });
   }

   handleColorChange = (color, name) => {

      this.setState({
         data: {
            ...this.state.data,
            game: {
               ...this.state.data.game,
               [name]: {
                  ...this.state.data.game[name],
                  color: color.hex
               }
            }
         }
      });

   }

   saveGameSettings = (e) => {
      e.preventDefault();

      const userId = this.props.auth.user.id;

      const saveData = {
         game: this.state.data.game
      };

      axios.patch('/users/id/'+userId, saveData)
         .then(res => {
            console.log(res.data);
         })
         .catch(err => {
            console.log(err);
         });
   }

   render() {

      const { loading, modals } = this.state;

      if(loading) {
         return <Loading />
      }      
      else {

         const { verified, game } = this.state.data;         

         return (
            <div className="page">
               <h1 className="page-title">Settings</h1>

               {verified ? 
               <form noValidate onSubmit={this.saveGameSettings}>
                  <label htmlFor="readonly_color">Readonly color</label>
                  <div className="settings__color-sample" style={{ background: game.readonly.color }} onClick={() => this.toggleColor('color1')}></div>

                  {modals.color1 && 
                     <SketchPicker id="readonly_color" onChange={(color) => this.handleColorChange(color, 'readonly')} color={game.readonly.color} />
                  }

                  <label htmlFor="readonly_color">Default entry color</label>
                  <div className="settings__color-sample" style={{ background: game.default.color }} onClick={() => this.toggleColor('color2')}></div>
                  
                  {modals.color2 && 
                     <SketchPicker id="default_color" onChange={(color) => this.handleColorChange(color, 'default')} color={game.default.color} />
                  }

                  <label htmlFor="readonly_color">Guess entry color</label>
                  <div className="settings__color-sample" style={{ background: game.guess.color }} onClick={() => this.toggleColor('color3')}></div>
                  
                  {modals.color3 && 
                     <SketchPicker id="guess_color" onChange={(color) => this.handleColorChange(color, 'guess')} color={game.guess.color} />
                  }

                  <button type="submit" className="button button_style-solid button_style-solid--primary">Save Settings</button>
               </form>
               :
               <div>You must be verified by the site administrator to modify your user settings.</div>
               }
            </div>
         )
      }

   }
   
}

Settings.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(Settings);