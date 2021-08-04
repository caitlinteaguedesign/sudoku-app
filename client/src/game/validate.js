import { pattern } from './constants';

function checkSection(data) {

   let section = new Set();

   for(let i = 0; i < data.length; i++) {
      const value  = data[i];
      if(value !== 0) {
         if(!section.has(value)) section.add(value);
         else return false;
      }
   }

   return true;
   
}

export default function validate(board) {

   let columns = [
      [],[],[],
      [],[],[],
      [],[],[]
   ];
   
   let subGrids = [
      [],[],[],
      [],[],[],
      [],[],[]
   ];
   
   for(let i = 0; i < board.length; i++) {
      const row = board[i];

      if(!checkSection(row)) return false;

      for(let j = 0; j < row.length; j++) {
         const value = row[j];
         columns[j].push(value);

         const subGrid = pattern[i][j];
         subGrids[subGrid].push(value);
      }
   }

   for(let i = 0; i < columns.length; i++) {
      const column =  columns[i];

      if(!checkSection(column)) return false;
   }

   for(let i = 0; i < subGrids.length; i++) {
      const subGrid =  subGrids[i];

      if(!checkSection(subGrid)) return false;
   }

   return true;
}