import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { SketchPicker } from 'react-color'; // SliderPicker

import Loading from '../components/Loading';
import SlideIn from '../components/SlideIn';

import { ReactComponent as Completed } from '../img/completed.svg';

const resetModals = {
   color1: false,
   color2: false,
   color3: false,
}


class Settings extends Component {

   constructor(props) {
      super(props);

      this.state = ({
         data: null,
         loading: true,
         modals: { resetModals },
         saved: false
      });

      this.node = null;
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
         });
   }

   toggleColorModal = (modal) => {
      this.setState({
         modals: {
            ...resetModals,
            [modal]: !this.state.modals[modal]
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
         },
         saved: false
      });

   }

   dismissSaved = () => {
      this.setState({
         saved: false
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
            //console.log(res.data);
            this.setState({
               saved: true
            })
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
         const { saved } = this.state;

         return (
            <div className="page">
               <h1 className="page-title">Settings</h1>

               <SlideIn initial={saved} callback={() => this.dismissSaved()}>
                  <div className="alert alert_color-success alert_layout-icon">
                     <Completed role="img" aria-label="check mark" width="26" height="26" className="alert__icon" />
                     <p>Settings saved!</p>
                  </div>
               </SlideIn>

               {verified ?
               <form noValidate onSubmit={this.saveGameSettings} className="settings__form">
                  <h2 className="section-title settings__form-title">Game Settings</h2>

                  <div className="settings__form-section">
                     <label htmlFor="readonly_color">Read-only color</label>
                     <span className="settings__readonly" style={{ color: game.readonly.color }}>123456789</span>

                     <div className="color-picker">
                        <button type="button" className="color-picker__button" onClick={() => this.toggleColorModal('color1')}>
                           <div className="color-picker__sample" style={{ background: game.readonly.color }}></div>
                        </button>

                        {modals.color1 && <>
                           {/* <div className="color-picker__modal color-picker__modal-style">
                              <SliderPicker className="color-picker__picker" id="readonly_color" onChange={(color) => this.handleColorChange(color, 'readonly')} color={game.readonly.color} />
                           </div> */}
                           <SketchPicker id="readonly_color" color={game.readonly.color} onChange={(color) => this.handleColorChange(color, 'readonly')} disableAlpha={true} presetColors={[]}  />
                        </>}
                     </div>
                  </div>

                  <div className="settings__form-section">
                     <label htmlFor="readonly_color">Default entry color</label>
                     <span className="settings__default" style={{ color: game.default.color }}>123456789</span>

                     <div className="color-picker">
                        <button type="button" className="color-picker__button" onClick={() => this.toggleColorModal('color2')}>
                           <div className="color-picker__sample" style={{ background: game.default.color }}></div>
                        </button>

                        {modals.color2 && <>
                           {/* <div className="color-picker__modal color-picker__modal-style">
                              <SliderPicker className="color-picker__picker" id="default_color" onChange={(color) => this.handleColorChange(color, 'default')} color={game.default.color} />
                           </div> */}
                           <SketchPicker id="default_color" color={game.default.color} onChange={(color) => this.handleColorChange(color, 'default')} disableAlpha={true} presetColors={[]}  />
                        </>}
                     </div>
                  </div>

                  <div className="settings__form-section">
                     <label htmlFor="readonly_color">Guess entry color</label>
                     <span className="settings__guess" style={{ color: game.guess.color }}>123456789</span>

                     <div className="color-picker">
                        <button type="button" className="color-picker__button" onClick={() => this.toggleColorModal('color3')}>
                           <div className="color-picker__sample" style={{ background: game.guess.color }}></div>
                        </button>

                        {modals.color3 && <>
                        {/* <div className="color-picker__modal color-picker__modal-style">
                           <SliderPicker className="color-picker__picker" id="guess_color" onChange={(color) => this.handleColorChange(color, 'guess')} color={game.guess.color} />
                        </div> */}

                        <SketchPicker id="guess_color" color={game.guess.color} onChange={(color) => this.handleColorChange(color, 'guess')} disableAlpha={true} presetColors={[]}  />
                        </>}
                     </div>
                  </div>

                  <button type="submit" className="settings__form-button button button_style-solid button_style-solid--primary">Save Settings</button>
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