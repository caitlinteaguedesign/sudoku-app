import { pattern, definitions } from './constants';

function checkPossible(board, row, column, guess) {
   let possible = new Set([1,2,3,4,5,6,7,8,9]);

   // check row and column
   for(let i = 0; i < 9; i++) {
      // we have the row, check all 9 in row
      possible.delete(board[row][i]);
      // check all 9 rows at the same column
      possible.delete(board[i][column]);
   }

   // check subgrid
   const blockType = pattern[row][column];
   const blockIndex = definitions.findIndex(x => x.block === blockType);
   const startRow = definitions[blockIndex]["startRow"];
   const startColumn = definitions[blockIndex]["startColumn"];

   for(let i = startRow; i < startRow+3; i++ ) {
      for(let j = startColumn; j < startColumn+3; j++) {
         possible.delete(board[i][j]);
      }
   }

   // results
   if (possible.has(guess)) return true;
   return false;
}

function nextEmptySpot(board) {
   for(let i = 0; i < board.length; i++) {

      for(let j = 0; j < board[i].length; j++) {
         if(board[i][j] === 0) {
            // return row, column
            return [i, j];
         }
      }
       
   }
   // if there are no 0s, the board is solved
   return [-1, -1]; 
}

export default function solve(board) {
   let emptySpot = nextEmptySpot(board);
   let row = emptySpot[0];
   let column = emptySpot[1];

   // there is no more empty spots
   if (row === -1) {
      return board;
   }

   for (let i = 1; i<=9; i++){
      if (checkPossible(board, row, column, i)) {
         board[row][column] = i;
         solve(board);
      }
   }

   if(nextEmptySpot(board)[0] !== -1) {
      board[row][column] = 0;
   }

   return board;
}