import classnames from 'classnames';

import { pattern, defaultSettings } from '../game/constants';

import ordinal_suffix_of from '../util/ordinal_suffix_of';

import { ReactComponent as Reset } from '../img/reset.svg';


export default function Board(props) {
   const { player, start, validation, history, modes, settings, completed } = props;

   const getNextPosition = (key, row, column) => {
      let newRow = row;
      let newCol = column;
      let limitReached = false;

      switch(key) {
         case 38: // up
            newRow = newRow - 1;
            if(newRow < 0) {
               newRow = 0;
               limitReached = true;
            }
            break;
         case 40: // down
            newRow = newRow + 1;
            if(newRow > 8) {
               newRow = 8;
               limitReached = true;
            }
            break;
         case 37: // left
            newCol = newCol - 1;
            if(newCol < 0) {
               newCol = 0;
               limitReached = true;
            }
            break;
         case 39: // right
            newCol = newCol + 1;
            if(newCol > 8) {
               newCol = 8;
               limitReached = true;
            }
            break;
         default:
            break;
      }

      return {limitReached, newRow, newCol} ;
   }

   const arrowKeys = (e, row, column) => {
      const key = e.keyCode;

      if(key >= 37 && key <= 40) {
         const { newRow, newCol } = getNextPosition(key, row, column);

         const id = `r${newRow}_c${newCol}`;
         const next = document.getElementById(id);

         if(e.target.id !== id) {
            e.target.blur();
            next.focus();
            if(next.type === 'text') setTimeout( function() {
               next.select();
            }, 0);
         }

         // let foundNext = false;
         // let nextRow = row, nextCol = column;

         // while (!foundNext) {
         //    const { limitReached, newRow, newCol } = getNextPosition(key, nextRow, nextCol);

         //    const id = `r${newRow}_c${newCol}`;
         //    const next = document.getElementById(id);

         //    if(next || limitReached) {

         //       if(next) {
         //          e.target.blur();
         //          next.focus();
         //       }

         //       foundNext = true;
         //       break;
         //    }

         //    nextRow = newRow;
         //    nextCol = newCol;
         // }
      }
   }

   return (
      <section className={`board ${props.className}`}>
         {player.map( (row, rowIndex) => {
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  const posIndex = rowIndex * 9 + cellIndex;

                  // pass user settings
                  var userSettings = settings ? settings : defaultSettings;

                  let
                     readonlyColor = userSettings.readonly.color,
                     defaultColor = userSettings.default.color,
                     guessColor = userSettings.guess.color,

                     readonlyFamily = userSettings.readonly.family,
                     defaultFamily = 'text_family-'+userSettings.default.family,
                     guessFamily = 'text_family-'+userSettings.guess.family,

                     readonlyWeight = userSettings.readonly.weight,
                     defaultWeight = 'text_weight-'+userSettings.default.weight,
                     guessWeight = 'text_weight-'+userSettings.guess.weight,

                     readonlyStyle = userSettings.readonly.style,
                     defaultStyle = 'text_style-'+userSettings.default.style,
                     guessStyle = 'text_style-'+userSettings.guess.style;


                  // pass color/style classes for the numbers
                  let thisMode = 'default';

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
                        id={`r${rowIndex}_c${cellIndex}`}
                        onKeyDown={(e) => arrowKeys(e, rowIndex, cellIndex)}
                        tabIndex="0"
                        className={classnames(
                           'board__cell board__cell--readonly',
                           `text_family-${readonlyFamily}`, `text_weight-${readonlyWeight}`, `text_style-${readonlyStyle}`,
                           {'board__cell--missing': showTips && hasRemaining },
                           {'board__cell--duplicates': showTips && hasDuplicates && hasRemaining },
                           {'board__cell--complete': showTips && !hasRemaining }
                        )}>
                           {startValue}
                        </div>
                  }
                  // All other cells the player fills in
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
                              id={`r${rowIndex}_c${cellIndex}`}
                              style={{ color: thisMode === 'guess' ? guessColor : defaultColor }}
                              className={classnames("board__input",
                              {'board__input--default' : thisMode === 'default'},
                              { [`${defaultFamily}`] : thisMode === 'default'},
                              { [`${defaultWeight}`] : thisMode === 'default'},
                              { [`${defaultStyle}`] : thisMode === 'default'},
                              {'board__input--guess' : thisMode === 'guess'},
                              { [`${guessFamily}`] : thisMode === 'guess'},
                              { [`${guessWeight}`] : thisMode === 'guess'},
                              { [`${guessStyle}`] : thisMode === 'guess'}
                              )}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => props.update(e, rowIndex, cellIndex)}
                              onKeyDown={(e) => arrowKeys(e, rowIndex, cellIndex)}
                              readOnly={completed ? completed : false}
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