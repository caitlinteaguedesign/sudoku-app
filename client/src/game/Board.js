export default function Board(props) {
   const { player, start } = props;
   console.log('player',player);
   console.log('start', start);

   return (
      <section className="board">
         {player.map( (row, rowIndex) => { 
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  
                  // TO DO: pass color/style classes for the numbers
                  // TO DO: pass background color classes (validation)

                  // If start grid has a non zero, it must be a read-only cell
                  if(startValue !== 0) { 
                     return <div key={`cell_${cellIndex}`} className="board__cell board__cell--readonly">{startValue}</div>
                  }
                  // All other cells the user (or player) fills in
                  else {
                     return <input key={`cell_${cellIndex}`} onFocus={(e) => e.target.select()} onChange={(e) => props.update(e, rowIndex, cellIndex)} type="text" pattern="[1-9]" maxLength="1" className="board__cell" value={value} />
                  }
   
               })}
            </div>
         })}
      </section>
   )
}