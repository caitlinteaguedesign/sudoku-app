import { useState } from 'react';
import Board from '../game/Board';

export default function CreatePuzzle() {
   const start = [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
   ];

   const [grid, setGrid] = useState(start);

   const handleGrid = (e, rowIndex, cellIndex) => {
      
      let value = parseInt(e.target.value);
   
      if(!Number.isInteger(value) || (value<1 || value>9)) {
         value = 0;
      }

      let updateData = [...grid];
      updateData[rowIndex][cellIndex] = value;
      setGrid(updateData);
   }

   const [name, setName] = useState('');

   const handleInput = (e) => {
      const value = e.target.value;
      setName(value);
   }


   const [difficulty, setDifficulty] = useState('');

   const handleSelect = (e) => {
      const value = e.target.value;
      setDifficulty(value);
   }


   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('submit');
   }

   return (
      <div className="page">
         <h1 className="page-title">Create a Puzzle</h1>
         <form noValidate onSubmit={handleSubmit} className="create-puzzle">
            <div className="form_layout-grid form_color-default">
               <div className="form__field">
                  <label className="label">Name</label>
                  <input type="text" className="field" onChange={handleInput} value={name} />
               </div>
               <div className="form__field">
                  <label className="label">Difficulty</label>
                  <select className="select" onChange={handleSelect} value={difficulty}>
                     <option value="">Select</option>
                     <option value="easy">Easy</option>
                     <option value="medium">Medium</option>
                     <option value="hard">Hard</option>
                     <option value="insane">Insane</option>
                  </select>
               </div>
            </div>
            <Board start={start} player={grid} update={handleGrid} />
            <button type="submit" className="button button_style-solid">Create</button>
         </form>
         
      </div>
   )
}