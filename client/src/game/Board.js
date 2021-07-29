export default function Board(data) {

   return (
      <section className="board">
         {data.map( (row, i) => Row(row, i) )}
      </section>
   )
}


function Row(row, i) {
   return (
      <div key={`row_${i}`} className="board__row">{row.map( (cell, i) => Cell(cell, i) )}</div>
   )
}

function Cell(cell, i) {
   // TO DO: pass color/style classes down by cell level

   if(cell !== 0) {
      return <div key={`cell_${i}`} className="board__cell board__cell--readonly">{cell}</div>
   }
   else {
      // TO DO: replace non 1-9 with empty spaces
      return <input key={`cell_${i}`} type="text" pattern="[1-9]" maxLength="1" className="board__cell" />
   }
   
}