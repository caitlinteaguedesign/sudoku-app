import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { cloneDeep } from 'lodash';

import Loading from '../components/Loading';
import Board from '../game/Board';

import checkset from '../game/checkset';
import { definitions } from '../game/constants';

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

      let updateData = [...this.state.player.state];
      updateData[rowIndex][cellIndex] = value;
      this.setState({
         player: {
            ...this.state.player,
            state: updateData
         }
      });
   }

   saveProgress = () => {
      axios.patch('/users/id/'+this.props.auth.user.id+'/updatePuzzle', this.state.player)
         .then( res => {
            console.log('saved!');
         })
         .catch(err => {
            console.log(err);
         });
   }

   checkAnswer = () => {
      console.log('check answer');
   }

   validateSection = (section, int) => {
      const { state } = this.state.player;
      const { start } = this.state.puzzle;

      let playerData = [];
      let puzzleData = [];

      switch (section) {
         case 'row':
            playerData = state[int];
            puzzleData = start[int];
            break;
         case 'column':
            playerData = [];
            for(const row in state) {
               playerData.push(state[row][int]);
            }
            puzzleData = [];
            for(const row in start) {
               puzzleData.push(start[row][int]);
            }
            break;
         case 'subgrid':
            const blockIndex = definitions.findIndex(x => x.block === int);
            const startRow = definitions[blockIndex]["startRow"];
            const startColumn = definitions[blockIndex]["startColumn"];

            playerData = [];
            for(let i = startRow; i < startRow+3; i++ ) {
               for(let j = startColumn; j < startColumn+3; j++) {
                  playerData.push(state[i][j]);
               }
            }
            puzzleData = [];
            for(let i = startRow; i < startRow+3; i++ ) {
               for(let j = startColumn; j < startColumn+3; j++) {
                  puzzleData.push(start[i][j]);
               }
            }
            break;
         default:
            break;
      }

      const { remainder, duplicates } = checkset(puzzleData, playerData);
      console.log('remainder: ', remainder, 'duplicates: ', duplicates);
   }

   render() {
      const { loading, puzzle, player } = this.state;

      if(loading) return Loading();
      else {

         const sections = [0,1,2,3,4,5,6,7,8];

         return (
         <div className="page">
            <div className="title-group">
               <h1 className="page-title">{puzzle.name}</h1>
               <span className="title-group__small">{`${puzzle.difficulty} | ${formatDate(puzzle.date_created, 'Mon D, YYYY')}`}</span>
            </div>

            <div className="view-puzzle">

               <div className="view-puzzle__subgrids">
                  { sections.map( ( (button) => {
                     return <button key={`btn-row_${button}`} type="button" onClick={(e) => this.validateSection('subgrid', button)}>
                        [{ button === 0 && '='}][{ button === 1 && '='}][{ button === 2 && '='}]<br/>
                        [{ button === 3 && '='}][{ button === 4 && '='}][{ button === 5 && '='}]<br/>
                        [{ button === 6 && '='}][{ button === 7 && '='}][{ button === 8 && '='}]
                     </button>
                  })) }
               </div>

               <div className="view-puzzle__main">

                  <Board start={puzzle.start} player={player.state} update={(e, rowIndex, cellIndex) => this.handleGrid(e, rowIndex, cellIndex)} className="view-puzzle__board" />

                  { sections.map( ( (button) => {
                     return <button key={`btn-row_${button}`} type="button" className="view-puzzle__btn-col" onClick={(e) => this.validateSection('row', button)}>
                        [][][]
                     </button>
                  })) }

                  { sections.map( ( (button) => {
                     return <button key={`btn-column_${button}`} type="button" onClick={ (e) => this.validateSection('column', button)}>
                        []<br/>[]<br/>[]
                     </button>
                  })) }
               </div>

               <div className="view-puzzle__actions">
                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.saveProgress}>Save Progress</button>
                  <button type="button" className="button button_style-solid button_style-solid--primary" onClick={this.checkAnswer}>Check Answer</button>
               </div>

            </div>
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