import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import Loading from '../components/Loading';

class Settings extends Component {

   constructor(props) {
      super(props);

      this.state = ({
         data: null,
         loading: true
      });
   }

   componentDidMount() {
      const userId = this.props.auth.user.id;

      axios.get('/users/id/'+userId+'/settings')
         .then( res => {
            const user = res.data.result;
            console.log(user);

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

   handleColorChange = (e) => {
      const value = e.target.value;
      const name = e.target.name;

      this.setState({
         data: {
            ...this.state.data,
            game: {
               ...this.state.data.game,
               [name]: {
                  ...this.state.data.game[name],
                  color: value
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

      const { loading } = this.state;

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
                  <input type="text" id="readonly_color" name="readonly" value={game.readonly.color} onChange={(e) => this.handleColorChange(e)} />
                  <div className="settings__color-sample" style={{ background: game.readonly.color }}></div>

                  <label htmlFor="readonly_color">Default entry color</label>
                  <input type="text" id="default_color" name="default" value={game.default.color} onChange={(e) => this.handleColorChange(e)} />
                  <div className="settings__color-sample" style={{ background: game.default.color }}></div>

                  <label htmlFor="readonly_color">Guess entry color</label>
                  <input type="text" id="guess_color" name="guess" value={game.guess.color} onChange={(e) => this.handleColorChange(e)} />
                  <div className="settings__color-sample" style={{ background: game.guess.color }}></div>

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