import classnames from 'classnames';

import { pattern } from '../game/constants';

export default function Board(props) {
   const { player, start, validation } = props;
   
   return (
      <section className={`board ${props.className}`}>
         {player.map( (row, rowIndex) => { 
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  
                  // TO DO: pass color/style classes for the numbers

                  // pass background color classes from validation
                  const subgridIndex = pattern[rowIndex][cellIndex];

                  const showTips = validation[`row_${rowIndex}`].tip 
                     || validation[`column_${cellIndex}`].tip 
                     || validation[`subgrid_${subgridIndex}`].tip;

                  const hasDuplicates = validation[`row_${rowIndex}`].duplicates.length > 0 
                     || validation[`column_${cellIndex}`].duplicates.length > 0 
                     || validation[`subgrid_${subgridIndex}`].duplicates.length > 0;

                  const hasRemaining = validation[`row_${rowIndex}`].remaining.length > 0 
                     || validation[`column_${cellIndex}`].remaining.length > 0 
                     || validation[`subgrid_${subgridIndex}`].remaining.length > 0;

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
                     return <input key={`cell_${cellIndex}`} onFocus={(e) => e.target.select()} onChange={(e) => props.update(e, rowIndex, cellIndex)} type="text" pattern="[1-9]" maxLength="1" value={value} 
                        className={classnames('board__cell',
                        {'board__cell--editable' : !showTips },
                        {'board__cell--missing': showTips && hasRemaining },
                        {'board__cell--duplicates': showTips && hasDuplicates && hasRemaining },
                        {'board__cell--complete': showTips && !hasRemaining }
                     )} />
                  }
   
               })}
            </div>
         })}
      </section>
   )
}