import { useState } from 'react';

export default function Board(props) {
   const { player, start } = props;

   const [data, setData] = useState(player ? player : start);

   const handleChange = (e, rowIndex, cellIndex) => {
      
      let value = parseInt(e.target.value);
   
      if(!Number.isInteger(value) || (value<1 || value>9)) {
         value = 0;
      }

      let updateData = [...data];
      updateData[rowIndex][cellIndex] = value;
      setData(updateData);

      console.log(data[rowIndex]);
   }

   return (
      <section className="board">
         {console.log('start', start, 'player', player)}
         {data.map( (row, rowIndex) => { 
            return <div key={`row_${rowIndex}`} className="board__row">
               {row.map( (cell, cellIndex) => {
                  const value = cell === 0 ? '' : cell;
                  const startValue = start[rowIndex][cellIndex];
                  

                  // TO DO: pass color/style classes for the numbers
                  // TO DO: pass background color classes (validation)

                  // If start grid has a non zero, it must be a ready only cell (only necessary if there's a player)
                  if(player && startValue !== 0) { 
                     return <div key={`cell_${cellIndex}`} className="board__cell board__cell--readonly">{startValue}</div>
                  }
                  // All other cells the user (or player) fills in
                  else {
                     return <input key={`cell_${cellIndex}`} onChange={(e) => handleChange(e, rowIndex, cellIndex)} type="text" pattern="[1-9]" maxLength="1" className="board__cell" value={value} />
                  }
   
               })}
            </div>
         })}
      </section>
   )
}