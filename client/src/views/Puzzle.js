import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { cloneDeep } from 'lodash';

import Loading from '../components/Loading';
import Board from '../game/Board';

import formatDate from '../util/formatDate';

class Puzzle extends Component {

   constructor(props) {
      super(props);

      this.state = {
         puzzle: null,
         player: null,
         loading: true
      }
   }

   componentDidMount() {
      // get puzzle

      const puzzleId = this.props.match.params.id;
      
      axios.get('/puzzles/id/'+puzzleId)
         .then(puzzleRes => {
            // the puzzle
            const puzzle = puzzleRes.data.result;
            // get player state
            const userId = this.props.auth.user.id;

            axios.get('/users/id/'+userId)
               .then( userRes => {
                  const user = userRes.data.result;

                  // starting board
                  let player = {
                     id: puzzleId,
                     state: cloneDeep(puzzle.start),
                     completed: false
                  }

                  // check if player has started this puzzle
                  const index = user.puzzles.findIndex(obj => obj.id === puzzleId);

                  // update player board to user's version
                  if(index !== -1) {                     
                     player = cloneDeep(user.puzzles[index]);
                  }
                  // if new, add to players list of puzzles
                  else {
                     // add this puzzle to user's list
                     axios.post('/users/id/'+userId+'/addPuzzle', player)
                        .then( saveRes => {
                           console.log(saveRes.data);
                        })
                        .catch( saveErr => {
                           console.log(saveErr);
                        });
                  }

                  this.setState({
                     puzzle: puzzle,
                     player: player,
                     loading: false
                  });

               })
               .catch( userErr => {
                  console.log(userErr);
               });
            
         }) 
         .catch(err => {
            console.log(err);
            this.props.history.push('/browse')
         });
   }

   handleGrid = (e, rowIndex, cellIndex) => {
      
      let value = parseInt(e.target.value);
   
      if(!Number.isInteger(value) || (value<1 || value>9)) {
         value = 0;
      }

      let updateData = [...this.state.player];
      updateData[rowIndex][cellIndex] = value;
      this.setState({
         player: updateData
      });
   }

   saveProgress = () => {
      console.log('save!');
   }

   render() {
      const { loading, puzzle, player } = this.state;

      if(loading) return Loading();
      else {
         return (
         <div className="page">
            <div className="title-group">
               <h1 className="page-title">{puzzle.name}</h1>
               <span className="title-group__small">{`${puzzle.difficulty} | ${formatDate(puzzle.date_created, 'Mon D, YYYY')}`}</span>
            </div>

            <Board start={puzzle.start} player={player.state} update={(e, rowIndex, cellIndex) => this.handleGrid(e, rowIndex, cellIndex)} className='' />

            <button type="button" onClick={this.saveProgress}>Save</button>
         </div>
         );
      }
   }
}


Puzzle.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Puzzle));