import classnames from 'classnames';

import { pattern } from '../game/constants';

export default function Board(props) {
   const { player, start, validation, cells } = props;
   
   return (
      <section className={`board ${props.className}`}>
         {player.map( (row, rowIndex) => { 
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  
                  // pass color/style classes for the numbers
                  let cellMode = 'default';
                  let cellHistory = -1;

                  if(cells) {
                     const int = rowIndex * 9 + cellIndex;
                     const cell = cells[int];
                     cellMode = cell.style;
                     cellHistory = cell.history[cell.history.length-1];
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
                     return <div key={`cell_${cellIndex}`} 
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
                           {'board__cell_editable-default' : cellMode === 'default' },
                           {'board__cell_editable-guess' : cellMode === 'guess' },
                           {'board__cell--default' : !showTips },
                           {'board__cell--missing': showTips && hasRemaining },
                           {'board__cell--duplicates': showTips && hasDuplicates && hasRemaining },
                           {'board__cell--complete': showTips && !hasRemaining }
                        )} >
                           { cellHistory > -1 && 
                           <button type="button" className="board__reset" onClick={(e) => props.history(cellHistory)}>i</button> 
                           }
                           <input type="text" pattern="[1-9]" maxLength="1" value={value} className="board__input"
                              onFocus={(e) => e.target.select()} 
                              onChange={(e) => props.update(e, rowIndex, cellIndex)} />
                        </div>
                     )
                  }
   
               })}
            </div>
         })}
      </section>
   )
}