import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames';
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

   handleFontChange = (name, setting, value) => {
      this.setState({
         data: {
            ...this.state.data,
            game: {
               ...this.state.data.game,
               [name]: {
                  ...this.state.data.game[name],
                  [setting]: value
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
                     <h3 className="settings__form-subtitle">Read Only Text</h3>
                     <span
                        className={`settings__preview
                           text_family-${game.readonly.family}
                           text_weight-${game.readonly.weight}
                           text_style-${game.readonly.style}`}
                        style={{ color: game.readonly.color }}>
                        123456789
                     </span>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font family</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.family === 'sans'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'family', 'sans')}>Sans-serif</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.family === 'cursive'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'family', 'cursive')}>Cursive</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font weight</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.weight === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'weight', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.weight === 'bold'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'weight', 'bold')}>Bold</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font style</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.style === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'style', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.readonly.style === 'italic'}
                           )}
                           onClick={() => this.handleFontChange('readonly', 'style', 'italic')}>Italic</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label" htmlFor="readonly_color">Color</label>
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

                  </div>

                  <div className="settings__form-section">
                     <h3 className="settings__form-subtitle">Default Text</h3>
                     <span
                        className={`settings__preview
                           text_family-${game.default.family}
                           text_weight-${game.default.weight}
                           text_style-${game.default.style}`}
                        style={{ color: game.default.color }}>
                           123456789
                     </span>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font family</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.family === 'sans'}
                           )}
                           onClick={() => this.handleFontChange('default', 'family', 'sans')}>Sans-serif</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.family === 'cursive'}
                           )}
                           onClick={() => this.handleFontChange('default', 'family', 'cursive')}>Cursive</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font weight</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.weight === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('default', 'weight', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.weight === 'bold'}
                           )}
                           onClick={() => this.handleFontChange('default', 'weight', 'bold')}>Bold</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font style</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.style === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('default', 'style', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.default.style === 'italic'}
                           )}
                           onClick={() => this.handleFontChange('default', 'style', 'italic')}>Italic</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label" htmlFor="default_color">Color</label>
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
                  </div>

                  <div className="settings__form-section">
                     <h3 className="settings__form-subtitle">Guess Text</h3>
                     <span
                        className={`settings__preview
                           text_family-${game.guess.family}
                           text_weight-${game.guess.weight}
                           text_style-${game.guess.style}`}
                        style={{ color: game.guess.color }}>
                        123456789
                     </span>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font family</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.family === 'sans'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'family', 'sans')}>Sans-serif</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.family === 'cursive'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'family', 'cursive')}>Cursive</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font weight</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.weight === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'weight', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.weight === 'bold'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'weight', 'bold')}>Bold</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label">Font style</label>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.style === 'normal'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'style', 'normal')}>Normal</button>
                        <button type="button"
                           className={classnames("settings__form-toggle",
                              {'settings__form-toggle--selected' : game.guess.style === 'italic'}
                           )}
                           onClick={() => this.handleFontChange('guess', 'style', 'italic')}>Italic</button>
                     </div>

                     <div className="settings__form-subsection">
                        <label className="settings__form-label" htmlFor="guess_color">Color</label>
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