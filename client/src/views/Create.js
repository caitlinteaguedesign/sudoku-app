import { useState } from 'react';
import { useHistory } from 'react-router';
import Board from '../game/Board';
import axios from 'axios';
import { isEqual, isEmpty } from 'lodash';

export default function CreatePuzzle() {
   const history = useHistory();
   const [errors, setErrors] = useState({});

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

      let checkErrors = {};

      if(name === '') checkErrors.name = 'Name cannot be blank.';
      if(difficulty === '') checkErrors.difficulty = 'Choose a difficulty.';
      if(isEqual(start, grid)) checkErrors.grid = 'Board cannot be empty.';

      if(isEmpty(checkErrors)) {
         const puzzle = {
            name: name,
            difficulty: difficulty,
            start: grid
         }

         axios.post('/puzzles', puzzle)
            .then(res => {
               history.push('/browse');
            }) 
            .catch(err => console.log(err));
      }
      else setErrors(checkErrors);
      
   }

   return (
      <div className="page">
         <h1 className="page-title">Create a Puzzle</h1>

         <form noValidate onSubmit={handleSubmit} className="create-puzzle">
            <div className="form_layout-grid form_color-default">

               <div className="form__field">
                  <label className="label">Name</label>
                  <input type="text" className="field" onChange={handleInput} value={name} />
                  {errors.name && <p>{errors.name}</p>}
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
                  {errors.difficulty && <p>{errors.difficulty}</p>}
               </div>

            </div>

            <Board start={start} player={grid} update={handleGrid} />

            <div role="presentation">
               <button type="submit" className="button button_style-solid">Create</button>

               {!isEmpty(errors) && <div className="alert alert_color-error">
                  {Object.keys(errors).map( (err, i) => <p key={`error_${i}`}>{errors[err]}</p>) }
               </div>}
            </div>
         </form>
         
      </div>
   )
}