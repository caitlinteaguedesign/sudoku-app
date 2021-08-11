import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import classnames from 'classnames';

import Loading from '../components/Loading';
import Board from '../game/Board';

import solve from '../game/solve';
import checkset from '../game/checkset';
import { definitions, pattern } from '../game/constants';

import formatDate from '../util/formatDate';

import { ReactComponent as Easy } from '../img/easy.svg';
import { ReactComponent as Medium } from '../img/medium.svg';
import { ReactComponent as Hard } from '../img/hard.svg';
import { ReactComponent as Insane } from '../img/insane.svg';
import { ReactComponent as Completed } from '../img/completed.svg';

const validation_start_entry = {
   tip: false,
   remaining: [],
   duplicates: []
}

const validation_dictionary = {};

for(let i = 0; i < 9; i++) {
   validation_dictionary[`row_${i}`] = validation_start_entry;
   validation_dictionary[`column_${i}`] = validation_start_entry;
   validation_dictionary[`subgrid_${i}`] = validation_start_entry;
}

class Puzzle extends Component {

   constructor(props) {
      super(props);

      this.state = {
         puzzle: null,
         player: null,
         validation: cloneDeep(validation_dictionary),
         loading: true,
         errors: null
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
                  }, () => {

                     // update the validation tips
                     let updateValidation = this.state.validation;

                     for(let i = 0; i < 9; i++) {
                        const rowValid = this.validateSection('row', i);
                        updateValidation[`row_${i}`] = {
                           ...updateValidation[`row_${i}`],
                           remaining: rowValid.remainder,
                           duplicates: rowValid.duplicates
                        }
                        const colValid = this.validateSection('column', i);
                        updateValidation[`column_${i}`] = {
                           ...updateValidation[`column_${i}`],
                           remaining: colValid.remainder,
                           duplicates: colValid.duplicates
                        }
                        const subValid = this.validateSection('subgrid', i);
                        updateValidation[`subgrid_${i}`] = {
                           ...updateValidation[`subgrid_${i}`],
                           remaining: subValid.remainder,
                           duplicates: subValid.duplicates
                        }
                     }

                     this.setState({
                        validation: updateValidation
                     });
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

      // update this cell
      let updateData = [...this.state.player.state];
      updateData[rowIndex][cellIndex] = value;

      // update the validation tips
      let updateValidation = this.state.validation;
      const rowValid = this.validateSection('row', rowIndex);
      updateValidation[`row_${rowIndex}`] = {
         ...updateValidation[`row_${rowIndex}`],
         remaining: rowValid.remainder,
         duplicates: rowValid.duplicates
      }
      const colValid = this.validateSection('column', cellIndex);
      updateValidation[`column_${cellIndex}`] = {
         ...updateValidation[`column_${cellIndex}`],
         remaining: colValid.remainder,
         duplicates: colValid.duplicates
      }
      const subIndex = pattern[rowIndex][cellIndex];
      const subValid = this.validateSection('subgrid', subIndex);
      updateValidation[`subgrid_${subIndex}`] = {
         ...updateValidation[`subgrid_${subIndex}`],
         remaining: subValid.remainder,
         duplicates: subValid.duplicates
      }

      this.setState({
         player: {
            ...this.state.player,
            state: updateData
         },
         validation: updateValidation,
         errors: null
      });
   }

   saveProgress = () => {
      axios.patch('/users/id/'+this.props.auth.user.id+'/updatePuzzle', this.state.player)
         .then( res => {
            //console.log('saved!');
         })
         .catch(err => {
            console.log(err);
         });
   }

   resetPuzzle = () => {
      const ask = window.confirm("Are you sure you want to reset this puzzle? This action cannot be undone.");

      if(ask) {
         let updatePlayer = this.state.player;

         updatePlayer.state = cloneDeep(this.state.puzzle.start);
         updatePlayer.completed = false;

         // update the validation tips
         let updateValidation = cloneDeep(validation_dictionary);

         for(let i = 0; i < 9; i++) {
            const rowValid = this.validateSection('row', i);
            updateValidation[`row_${i}`] = {
               ...updateValidation[`row_${i}`],
               remaining: rowValid.remainder,
               duplicates: rowValid.duplicates
            }
            const colValid = this.validateSection('column', i);
            updateValidation[`column_${i}`] = {
               ...updateValidation[`column_${i}`],
               remaining: colValid.remainder,
               duplicates: colValid.duplicates
            }
            const subValid = this.validateSection('subgrid', i);
            updateValidation[`subgrid_${i}`] = {
               ...updateValidation[`subgrid_${i}`],
               remaining: subValid.remainder,
               duplicates: subValid.duplicates
            }
         }

         axios.patch('/users/id/'+this.props.auth.user.id+'/updatePuzzle', updatePlayer)
            .then( res => {
               this.setState({
                  player: updatePlayer,
                  validation: updateValidation,
                  errors: null
               })
            })
            .catch(err => {
               console.log(err);
            });
      }
   }

   searchValidation = () => {
      const {validation} = this.state;

      for(const section in validation) {
         const remaining = validation[section].remaining;
         const duplicates = validation[section].duplicates;

         if(remaining.length > 0 || duplicates.length > 0) {
            return false
         }
      }

      return true;
   }

   checkAnswer = () => {
      
      if(this.searchValidation()) {

         // update puzzle
         const updatePlayer = this.state.player;
         updatePlayer.completed = true;

         axios.patch('/users/id/'+this.props.auth.user.id+'/updatePuzzle', updatePlayer)
            .then( res => {
               this.setState({
                  player: {
                     ...this.state.player,
                     completed: true
                  }
               })
            })
            .catch(err => {
               console.log(err);
            });

      }
      else {
         this.toggleAllTips(true);
         
         this.setState({
            errors: 'Not quite there! Double check your answer for missing numbers or duplicates.'
         });
      }

      
   }

   toggleTip = (section, int) => {
      let updateValidation = this.state.validation;
      updateValidation[`${section}_${int}`] = {
         ...updateValidation[`${section}_${int}`],
         tip: !updateValidation[`${section}_${int}`].tip
      }

      this.setState({
         validation: updateValidation
      });
   }

   toggleAllTips = (state) => {
      let updateValidation = this.state.validation;

      for(let i = 0; i < 9; i++) {
         updateValidation[`row_${i}`] = {
            ...updateValidation[`row_${i}`],
            tip: state
         }

         updateValidation[`column_${i}`] = {
            ...updateValidation[`column_${i}`],
            tip: state
         }

         updateValidation[`subgrid_${i}`] = {
            ...updateValidation[`subgrid_${i}`],
            tip: state
         }
      }

      this.setState({
         validation: updateValidation
      })
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

      return checkset(puzzleData, playerData);
   }

   autoSolve = () => {
      const answer = solve(cloneDeep(this.state.puzzle.start));

      this.setState({
         player: {
            ...this.state.player,
            state: answer
         },
         validation: cloneDeep(validation_dictionary),
         errors: null
      });
   }

   render() {
      const { loading, puzzle, player, validation, errors } = this.state;

      if(loading) return Loading();
      else {

         let IconName = '';

         switch (puzzle.difficulty) {
            case 'easy':
               IconName = Easy; break;
            case 'medium':
               IconName = Medium; break;
            case 'hard':
               IconName = Hard; break;
            case 'insane':
               IconName = Insane; break;
            default: break;
         }

         const sections = [0,1,2,3,4,5,6,7,8];

         return (
         <div className="page">
            <div className="title-group">
               <h1 className="page-title title-group__big">{puzzle.name}</h1>
               <IconName role="img" aria-label={`this puzzle is ${puzzle.difficulty}`} width="26" height="26" 
                  className={classnames('title-group__icon',
                  {'title-group__icon--easy': puzzle.difficulty === 'easy'},
                  {'title-group__icon--medium': puzzle.difficulty === 'medium'},
                  {'title-group__icon--hard': puzzle.difficulty === 'hard'},
                  {'title-group__icon--insane': puzzle.difficulty === 'insane'})}
               />
               <span className="title-group__small">{`${formatDate(puzzle.date_created, 'Mon D, YYYY')}`}</span>
            </div>

            <div className="view-puzzle">

               <div className="view-puzzle__subgrids">
                  { sections.map( ( (button) => {
                     const thisValidation = validation[`subgrid_${button}`];

                     return <div key={`btn-subgrid_${button}`} className={classnames(
                        'validation validation_style-sub',
                        {'validation_color-default': !thisValidation.tip},
                        {'validation_color-visible': thisValidation.tip && thisValidation.duplicates.length === 0},
                        {'validation_color-error': thisValidation.tip && thisValidation.duplicates.length > 0},
                        {'validation_color-complete': thisValidation.tip && thisValidation.remaining.length === 0}
                     )}>
                        <button type="button" className="validation__button" onClick={(e) => this.toggleTip('subgrid', button)}>
                           { sections.map( (square) => {
                              return (
                              <div key={`subgrid_square_${square}`} 
                                 className={classnames(
                                    'validation__square', 
                                    {'validation__square--current' :button === square}
                                 )}></div>
                              )
                           })}
                        </button>
                        { thisValidation.tip && thisValidation.remaining.length > 0 && 
                        <div className="validation__tip validation__tip--vertical">
                           {thisValidation.remaining.map( (value, index) => <span key={`subgrid_${button}_${index}`}>{value}</span>) }
                        </div> 
                        }
                     </div>
                  })) }
               </div>

               <div className="view-puzzle__main">

                  <Board start={puzzle.start} player={player.state} update={(e, rowIndex, cellIndex) => this.handleGrid(e, rowIndex, cellIndex)} className="view-puzzle__board" validation={validation} />

                  { sections.map( ( (button) => {
                     const thisValidation = validation[`row_${button}`];

                     return <div key={`btn-row_${button}`} className={classnames(
                        'validation validation_style-row',
                        {'validation_color-default': !thisValidation.tip},
                        {'validation_color-visible': thisValidation.tip && thisValidation.duplicates.length === 0},
                        {'validation_color-error': thisValidation.tip && thisValidation.duplicates.length > 0},
                        {'validation_color-complete': thisValidation.tip && thisValidation.remaining.length === 0}
                     )} >
                        <button type="button" className="validation__button" onClick={(e) => this.toggleTip('row', button)}>
                           <div className="validation__square"></div>
                           <div className="validation__square"></div>
                           <div className="validation__square"></div>
                        </button>
                        { thisValidation.tip && thisValidation.remaining.length > 0 && 
                        <div className="validation__tip validation__tip--horizontal">
                           {thisValidation.remaining.map( (value, index) => <span key={`row_${button}_${index}`}>{value}</span>) }
                        </div> 
                        }
                     </div>
                  })) }

                  { sections.map( ( (button) => {
                     const thisValidation = validation[`column_${button}`];

                     return <div key={`btn-column_${button}`} className={classnames(
                        'validation validation_style-col',
                        {'validation_color-default': !thisValidation.tip},
                        {'validation_color-visible': thisValidation.tip && thisValidation.duplicates.length === 0},
                        {'validation_color-error': thisValidation.tip && thisValidation.duplicates.length > 0},
                        {'validation_color-complete': thisValidation.tip && thisValidation.remaining.length === 0}
                     )}>
                        <button type="button" className="validation__button" onClick={ (e) => this.toggleTip('column', button)}>
                           <div className="validation__square"></div>
                           <div className="validation__square"></div>
                           <div className="validation__square"></div>
                        </button>
                        { thisValidation.tip && thisValidation.remaining.length > 0 && 
                        <div className="validation__tip validation__tip--vertical">
                           {thisValidation.remaining.map( (value, index) => <span key={`column_${button}_${index}`}>{value}</span>) }
                        </div> 
                        }
                     </div>
                  })) }
               </div>

               <div className="view-puzzle__actions">

                  {!player.completed &&
                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.saveProgress}>
                     Save Progress
                  </button>
                  }

                  {player.completed &&
                  <div className={`alert alert_color-success alert_layout-icon`}>
                     <Completed role="img" aria-label="check mark" width="26" height="26" className="alert__icon" />    
                     <p>You solved this puzzle!</p>
                  </div>
                  }

                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.resetPuzzle}>
                     {player.completed ? 'Replay' : 'Restart' } Puzzle
                  </button>

                  {!player.completed && <>
                  {/* <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.autoSolve}>
                     Auto Solve
                  </button> */}
                  <button type="button" className="button button_style-solid button_style-solid--primary" onClick={this.checkAnswer}>
                     Check Answer
                  </button>

                  {errors && 
                  <div className={`alert alert_color-error`}>
                     <p>{errors}</p>
                  </div>
                  }

                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={(e) => this.toggleAllTips(true)}>
                     Show all tips
                  </button>
                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={(e) => this.toggleAllTips(false)}>
                     Hide all tips
                  </button>
                  </>}
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