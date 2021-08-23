import { useState } from 'react';
import { useHistory } from 'react-router';
import classnames from 'classnames';
import axios from 'axios';
import { isEqual, isEmpty } from 'lodash';

import Board from '../game/Board';
import validate from '../game/validate';

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

      if(!isEqual(start, grid) && errors.grid) {
         const updateErrors = errors;
         delete updateErrors['grid'];
         setErrors(updateErrors);
      }
   }

   const [name, setName] = useState('');

   const handleInput = (e) => {
      const value = e.target.value;
      setName(value);

      if(value !== '' && errors.name) {
         const updateErrors = errors;
         delete updateErrors['name'];
         setErrors(updateErrors);
      }
   }


   const [difficulty, setDifficulty] = useState('');

   const handleSelect = (e) => {
      const value = e.target.value;
      setDifficulty(value);

      if(value !== '' && errors.difficulty) {
         const updateErrors = errors;
         delete updateErrors['difficulty'];
         setErrors(updateErrors);
      }
   }


   const handleSubmit = (e) => {
      e.preventDefault();

      let checkErrors = {};

      if(name === '') checkErrors.name = 'Name cannot be blank.';
      if(difficulty === '') checkErrors.difficulty = 'Choose a difficulty.';
      if(isEqual(start, grid)) checkErrors.grid = 'Board cannot be empty.';
      else if(!validate(grid)) checkErrors.grid = 'This board is invalid. Double check for duplicate entries.';

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
            <div className="create-puzzle__fields form_layout-grid form_color-default">

               <div className="form__field">
                  <label className="label">Name</label>
                  <input type="text" onChange={handleInput} value={name} 
                     className={
                        classnames('field', 
                           { 'field_color-default': !errors.name },
                           { 'field_color-error': errors.name }
                        )} 
                  />
                  <p className="field__error">{errors.name}</p>
               </div>

               <div className="form__field">
                  <label className="label">Difficulty</label>
                  <select onChange={handleSelect} value={difficulty}
                     className={
                        classnames('select', 
                           { 'select_color-default': !errors.difficulty },
                           { 'select_color-error': errors.difficulty }
                        )} 
                  >
                     <option value="">Select</option>
                     <option value="easy">Easy</option>
                     <option value="medium">Medium</option>
                     <option value="hard">Hard</option>
                     <option value="expert">Expert</option>
                  </select>
                  <p className="field__error">{errors.difficulty}</p>
               </div>

            </div>

            <Board start={start} player={grid} update={handleGrid} className="create-puzzle__board" />

            <button type="submit" className="button button_style-solid button_style-solid--primary">Create</button>

            {!isEmpty(errors) && <div className="create-puzzle__errors alert alert_color-error">
               {Object.keys(errors).map( (err, i) => <p key={`error_${i}`}>{errors[err]}</p>) }
            </div>}
         </form>
         
      </div>
   )
}