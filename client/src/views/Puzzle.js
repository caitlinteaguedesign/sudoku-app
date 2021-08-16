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

import { ReactComponent as OpenEye } from '../img/open-eye.svg';
import { ReactComponent as CloseEye } from '../img/close-eye.svg';

import { ReactComponent as Reset } from '../img/reset.svg';
import { ReactComponent as Save } from '../img/save.svg';
import ordinal_suffix_of from '../util/ordinal_suffix_of';

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

const cell_dictionary = [];
for(let i = 0; i < 81; i++){
   cell_dictionary.push({
      style: 'default',
      history: []
   });
}

class Puzzle extends Component {

   constructor(props) {
      super(props);

      this.state = {
         loading: true,
         puzzle: null,
         player: null,
         history: [],
         current_history: 0,
         validation: cloneDeep(validation_dictionary),
         errors: null,
         mode: 'default',
         cells: cloneDeep(cell_dictionary)
      }
   }

   componentDidMount() {

      // get puzzle
      const puzzleId = this.props.match.params.id;

      axios.get('/puzzles/id/'+puzzleId)
         .then(puzzleRes => {
            // the puzzle
            const puzzle = puzzleRes.data.result;

            const { isAuthenticated } = this.props.auth;
            
            if(isAuthenticated) {
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

                     let startHistory = cloneDeep(this.state.history);
                     startHistory.push({
                        state: cloneDeep(player.state),
                        cell: -1
                     });

                     this.setState({
                        loading: false,
                        puzzle: puzzle,
                        player: player,
                        history: startHistory
                     }, () => {

                        const { history, current_history } = this.state;

                        // update the validation tips
                        this.setState({
                           validation: this.validateEntireGrid(history[current_history].state)
                        });
                     });

                  })
                  .catch( userErr => {
                     console.log(userErr);
                  });
            }
            else {

               // starting board
               let player = {
                  id: puzzleId,
                  state: cloneDeep(puzzle.start),
                  completed: false
               }

               let startHistory = cloneDeep(this.state.history);
               startHistory.push({
                  state: cloneDeep(player.state),
                  cell: -1
               });

               this.setState({
                  loading: false,
                  puzzle: puzzle,
                  player: player,
                  history: startHistory
               }, () => {

                  const { history, current_history } = this.state;

                  // update the validation tips
                  this.setState({
                     validation: this.validateEntireGrid(history[current_history].state)
                  });
               });

            }

         })
         .catch(err => {
            console.log(err);
            this.props.history.push('/browse')
         });
   }

   validateEntireGrid = (puzzle) => {
      let updateValidation = this.state.validation;
      const data = cloneDeep(puzzle);

      for(let i = 0; i < 9; i++) {
         const rowValid = this.validateSection(data, 'row', i);
         updateValidation[`row_${i}`] = {
            ...updateValidation[`row_${i}`],
            remaining: rowValid.remainder,
            duplicates: rowValid.duplicates
         }
         const colValid = this.validateSection(data, 'column', i);
         updateValidation[`column_${i}`] = {
            ...updateValidation[`column_${i}`],
            remaining: colValid.remainder,
            duplicates: colValid.duplicates
         }
         const subValid = this.validateSection(data, 'subgrid', i);
         updateValidation[`subgrid_${i}`] = {
            ...updateValidation[`subgrid_${i}`],
            remaining: subValid.remainder,
            duplicates: subValid.duplicates
         }
      }

      return updateValidation;
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
      const rowValid = this.validateSection(updateData, 'row', rowIndex);
      updateValidation[`row_${rowIndex}`] = {
         ...updateValidation[`row_${rowIndex}`],
         remaining: rowValid.remainder,
         duplicates: rowValid.duplicates
      }
      const colValid = this.validateSection(updateData, 'column', cellIndex);
      updateValidation[`column_${cellIndex}`] = {
         ...updateValidation[`column_${cellIndex}`],
         remaining: colValid.remainder,
         duplicates: colValid.duplicates
      }
      const subIndex = pattern[rowIndex][cellIndex];
      const subValid = this.validateSection(updateData, 'subgrid', subIndex);
      updateValidation[`subgrid_${subIndex}`] = {
         ...updateValidation[`subgrid_${subIndex}`],
         remaining: subValid.remainder,
         duplicates: subValid.duplicates
      }

      // update history
      const currentHistory = cloneDeep(this.state.history);
      const updateHistory = cloneDeep(currentHistory.slice(0, this.state.current_history + 1));
      const newBoard = cloneDeep(updateHistory[updateHistory.length - 1].state);
      newBoard[rowIndex][cellIndex] = value;

      // update the style (if changed)
      const cells = [...this.state.cells];
      const posIndex = rowIndex * 9 + cellIndex;
      if(cells[posIndex].style !== this.state.mode) cells[posIndex].style = this.state.mode;
      cells[posIndex].history.push(updateHistory.length);

      this.setState({
         player: {
            ...this.state.player,
            state: updateData
         },
         history: updateHistory.concat([{
            state: newBoard,
            cell: posIndex
         }]),
         current_history: updateHistory.length,
         validation: updateValidation,
         errors: null,
         cells: cells
      });
   }

   changeHistory = (position, index) => {
      const readPos = ordinal_suffix_of(position);
      const ask = window.confirm(`Are you sure you want to mass undo to the ${readPos} move? This action cannot be undone.`);

      if(ask) {
         const { history } = this.state;

         const updateHistory = cloneDeep(history);
         const removeHistory = updateHistory.slice(position, history.length);
         const newHistory = updateHistory.slice(0, position);

         let cellIndexes = [];

         for(const info in removeHistory) {
            const cell = removeHistory[info].cell;
            cellIndexes.push(cell);
         }

         let updateCells = cloneDeep(this.state.cells);

         for(let i = 0; i < cellIndexes.length; i++) {
            const index = cellIndexes[i];
            updateCells[index].history.splice(-1);
         }

         const updatedPosition = position - 1;

         this.setState({
            player: {
               ...this.state.player,
               state: cloneDeep(history[updatedPosition].state)
            },
            history: newHistory,
            current_history: updatedPosition,
            validation: this.validateEntireGrid(history[updatedPosition].state),
            cells: updateCells
         })
      }

   }

   moveHistory = (method) => {

      const { history, current_history } = this.state;

      let newPosition = 0;

      switch (method) {
         case 'prev':
            newPosition = current_history - 1;
            break;
         case 'next':
            newPosition = current_history + 1;
            break;
         default:
            newPosition = method;
            break;
      }

      this.setState({
         player: {
            ...this.state.player,
            state: cloneDeep(history[newPosition].state)
         },
         current_history: newPosition,
         validation: this.validateEntireGrid(history[newPosition].state)
      })
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

         const { isAuthenticated } = this.props.auth;

         if(isAuthenticated) {
            axios.patch('/users/id/'+this.props.auth.user.id+'/updatePuzzle', updatePlayer)
            .then( res => {
               this.setState({
                  player: updatePlayer,
                  validation: this.validateEntireGrid(updatePlayer.state),
                  errors: null,
                  history: [{state: cloneDeep(updatePlayer.state), cell: -1}],
                  current_history: 0,
               })
            })
            .catch(err => {
               console.log(err);
            });
         }
         else {
            this.setState({
               player: updatePlayer,
               validation: this.validateEntireGrid(updatePlayer.state),
               errors: null,
               history: [{state: cloneDeep(updatePlayer.state), cell: -1}],
               current_history: 0,
            })
         }
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

         const { isAuthenticated } = this.props.auth;

         if(isAuthenticated) {
               
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
            this.setState({
               player: {
                  ...this.state.player,
                  completed: true
               }
            })
         }

      }
      else {
         this.toggleAllTips(true);

         this.setState({
            errors: 'Not quite there! Double check your answer for missing numbers or duplicates.'
         });
      }


   }

   toggleMode = (mode) => {

      if(!mode) {
         if(this.state.mode === 'default') mode = 'guess';
         else mode = 'default';
      }

      if(mode !== this.state.mode) {
         this.setState({
            mode: mode
         })
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

   validateSection = (source, section, int) => {
      //const { puzzle, history, current_history } = this.state;
      //const { state } = this.state.player;
      // const state = cloneDeep(history[current_history].state);
      const { start } = this.state.puzzle;

      let playerData = [];
      let puzzleData = [];

      switch (section) {
         case 'row':
            playerData = source[int];
            puzzleData = start[int];
            break;
         case 'column':
            playerData = [];
            for(const row in source) {
               playerData.push(source[row][int]);
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
                  playerData.push(source[i][j]);
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
         history: [{state: answer, cell: -1}],
         current_history: 0,
         validation: cloneDeep(validation_dictionary),
         errors: null
      });
   }

   render() {
      const { isAuthenticated } = this.props.auth;
      const {
         loading,
         puzzle,
         player,
         history,
         current_history,
         validation,
         errors,
         cells } = this.state;

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
               <IconName role="img" aria-label={`This puzzle is ${puzzle.difficulty} difficulty`} title={`This puzzle is ${puzzle.difficulty}`} width="26" height="26"
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
                        <button type="button" 
                           className="validation__button" onClick={(e) => this.toggleTip('subgrid', button)}
                           title="Press to toggle tips for this quadrant"
                           >
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

                  <Board start={puzzle.start} player={history[current_history].state} update={(e, rowIndex, cellIndex) => this.handleGrid(e, rowIndex, cellIndex)} history={(e, position, index) => this.changeHistory(e, position, index)} validation={validation} cells={cells} className="view-puzzle__board" />

                  { sections.map( ( (button) => {
                     const thisValidation = validation[`row_${button}`];

                     return <div key={`btn-row_${button}`} className={classnames(
                        'validation validation_style-row',
                        {'validation_color-default': !thisValidation.tip},
                        {'validation_color-visible': thisValidation.tip && thisValidation.duplicates.length === 0},
                        {'validation_color-error': thisValidation.tip && thisValidation.duplicates.length > 0},
                        {'validation_color-complete': thisValidation.tip && thisValidation.remaining.length === 0}
                     )} >
                        <button type="button" className="validation__button" 
                           onClick={(e) => this.toggleTip('row', button)}
                           title="Press to toggle tips for this row"
                           >
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
                        <button type="button" className="validation__button" 
                           onClick={ (e) => this.toggleTip('column', button)}
                           title="Press to toggle tips for this column"
                           >
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

                  {!player.completed && isAuthenticated &&
                  <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.saveProgress}>
                     <div className="button__layout button__layout--icon-left">
                        <Save className="button__icon" width="20" height="20" role="img" aria-label="save" />
                        <span className="button__text">Save</span>
                     </div>
                  </button>
                  }

                  {player.completed &&
                  <div className={`alert alert_color-success alert_layout-icon`}>
                     <Completed role="img" aria-label="check mark" width="26" height="26" className="alert__icon" />
                     <p>You solved this puzzle!</p>
                  </div>
                  }

                  <button type="button" className="button button_style-solid button_style-solid--default" 
                     onClick={this.resetPuzzle}
                     title={`Press to ${player.completed ? 'replay' : 'restart'} puzzle`}
                     >
                     <div className="button__layout button__layout--icon-left">
                        <Reset className="button__icon" width="20" height="20" role="img" aria-label="reset" />
                        <span className="button__text">{player.completed ? 'Replay' : 'Restart' }</span>
                     </div>
                  </button>

                  {!player.completed && <>
                  {/* <button type="button" className="button button_style-solid button_style-solid--default" onClick={this.autoSolve}>
                     Auto Solve
                  </button> */}
                  <button type="button" className="button button_style-solid button_style-solid--primary" 
                     onClick={this.checkAnswer}
                     title="Press to submit answer">
                     Submit Answer
                  </button>

                  {errors &&
                  <div className={`alert alert_color-error`}>
                     <p>{errors}</p>
                  </div>
                  }

                  <div>
                     <button type="button" className="button button_style-solid button_style-solid--default"
                        title="Show all tips"
                        onClick={(e) => this.toggleAllTips(true)}
                     >
                        <div className="button__layout button__layout--icon-left">
                           <OpenEye className="button__icon" width="24" height="24" role="img" aria-label="show" />
                           <span className="button__text">all tips</span>
                        </div>
                     </button>
                     <button type="button" className="button button_style-solid button_style-solid--default"
                        title="Hide all tips"
                        onClick={(e) => this.toggleAllTips(false)}
                     >
                        <div className="button__layout button__layout--icon-left">
                           <CloseEye className="button__icon" width="24" height="24" role="img" aria-label="hide" />
                           <span className="button__text">all tips</span>
                        </div>
                     </button>
                  </div>

                  <div className="view-puzzle__mark-mode">
                     <button type="button" onClick={(e) => this.toggleMode('default')}
                        title="Set mode to normal"
                        className={classnames('view-puzzle__mark-button view-puzzle__mark-button--default',
                        {'view-puzzle__mark-button--active': this.state.mode === 'default'},
                        {'view-puzzle__mark-button--press': this.state.mode !== 'default'}
                        )}
                     >
                        123
                     </button>
                     <div className={classnames('indicator',
                        {'indicator--start': this.state.mode === 'default'},
                        {'indicator--end': this.state.mode === 'guess'},
                     )}>
                        <button type="button" onClick={(e) => this.toggleMode()} className="indicator__button" title="Toggle mode"></button>
                     </div>
                     <button type="button"onClick={(e) => this.toggleMode('guess')}
                        title="Set mode to guess"
                        className={classnames('view-puzzle__mark-button view-puzzle__mark-button--guess',
                        {'view-puzzle__mark-button--active': this.state.mode === 'guess'},
                        {'view-puzzle__mark-button--press': this.state.mode !== 'guess'}
                        )}
                     >
                        123
                     </button>
                  </div>

                  <div>
                     {current_history > 0 ?
                     <button type="button" className="button button_style-solid button_style-solid--default" 
                        onClick={(e) => this.moveHistory('prev')}
                        title="Press to undo the most recent move"
                        >
                           Undo
                     </button>
                     :
                     <button type="button" className="button button_style-solid button--disabled">Undo</button>
                     }
                     {current_history < history.length - 1 ?
                     <button type="button" className="button button_style-solid button_style-solid--default" 
                        onClick={(e) => this.moveHistory('next')}
                        title="Press to redo that last move that was previously undone"
                        >
                        Redo
                     </button>
                     :
                     <button type="button" className="button button_style-solid button--disabled">Redo</button>
                     }
                  </div>

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