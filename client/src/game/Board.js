import classnames from 'classnames';

import { pattern } from '../game/constants';

import ordinal_suffix_of from '../util/ordinal_suffix_of';

import { ReactComponent as Reset } from '../img/reset.svg';


export default function Board(props) {
   const { player, start, validation, history, modes, settings } = props;
   
   return (
      <section className={`board ${props.className}`}>
         {player.map( (row, rowIndex) => { 
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  const posIndex = rowIndex * 9 + cellIndex;
                  
                  // pass custom user settings
                  let readonlyColor = '', defaultColor = '', guessColor = '';
                  
                  if(settings) {
                     readonlyColor = settings.readonly.color;
                     defaultColor = settings.default.color;
                     guessColor = settings.guess.color;
                  }

                  // pass color/style classes for the numbers
                  let thisMode = '';

                  if(modes) {
                     thisMode = modes[posIndex].mode;
                  }

                  // pass history records for mass undo
                  let thisHistory = [], undoStep = -1;

                  if(history) {
                     thisHistory = history[posIndex].history;
                     undoStep = thisHistory[thisHistory.length - 1];
                  }

                  // pass background color classes from validation
                  let showTips = false, hasDuplicates = false, hasRemaining = false;

                  if(validation) {
                     const subgridIndex = pattern[rowIndex][cellIndex];

                     const showRowTips = validation[`row_${rowIndex}`].tip;
                     const showColTips = validation[`column_${cellIndex}`].tip;
                     const showSubTips = validation[`subgrid_${subgridIndex}`].tip;

                     showTips = showRowTips || showColTips || showSubTips;

                     hasDuplicates = (showRowTips && validation[`row_${rowIndex}`].duplicates.length > 0) 
                        || (showColTips && validation[`column_${cellIndex}`].duplicates.length > 0)
                        || (showSubTips && validation[`subgrid_${subgridIndex}`].duplicates.length > 0);

                     hasRemaining = (showRowTips &&validation[`row_${rowIndex}`].remaining.length > 0) 
                        || (showColTips && validation[`column_${cellIndex}`].remaining.length > 0)
                        || (showSubTips && validation[`subgrid_${subgridIndex}`].remaining.length > 0);
                  }

                  // If start grid has a non zero, it must be a read-only cell
                  if(startValue !== 0) { 
                     return <div key={`cell_${cellIndex}`} style={{color: readonlyColor }}
                        className={classnames(
                           'board__cell board__cell--readonly',
                           {'board__cell--missing': showTips && hasRemaining },
                           {'board__cell--duplicates': showTips && hasDuplicates && hasRemaining },
                           {'board__cell--complete': showTips && !hasRemaining }
                        )}>
                           {startValue}
                        </div>
                  }
                  // All other cells the user (or player) fills in
                  else {

                     return (
                        <div key={`cell_${cellIndex}`}
                           className={classnames('board__cell',
                           {'board__cell--default' : !showTips },
                           {'board__cell--missing': showTips && hasRemaining },
                           {'board__cell--duplicates': showTips && hasDuplicates && hasRemaining },
                           {'board__cell--complete': showTips && !hasRemaining }
                        )} >
                           { thisHistory.length > 0 && 
                           <button type="button" className="board__reset" 
                              onClick={(e) => props.changeHistory(undoStep, posIndex)} 
                              title={`Undo moves to the ${ordinal_suffix_of(undoStep)} move`}>
                                 <Reset className="board__reset-icon" width="12" height="12" role="img" aria-label="undo" />
                           </button> 
                           }
                           <input type="text" pattern="[1-9]" maxLength="1" value={value} 
                              style={{ color: thisMode === 'guess' ? guessColor : defaultColor }}
                              className={classnames("board__input",
                              {'board__input--default' : thisMode === 'default'},
                              {'board__input--guess' : thisMode === 'guess'},
                              )}
                              onFocus={(e) => e.target.select()} 
                              onChange={(e) => props.update(e, rowIndex, cellIndex)}
                              title="Enter a number between 1 and 9" />
                        </div>
                     )
                  }
   
               })}
            </div>
         })}
      </section>
   )
}