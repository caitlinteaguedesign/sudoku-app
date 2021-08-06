export default function checkset(puzzleData, playerData) {
   let remainder = new Set([1,2,3,4,5,6,7,8,9]);
   let duplicates = [];

   for(let i = 0; i < puzzleData.length; i++) {
      const value  = puzzleData[i];
      if(value !== 0) {
         remainder.delete(value);
      }
   }

   for(let i = 0; i < playerData.length; i++) {
      const value  = playerData[i];
      const start = puzzleData[i];

      if(value !== 0 && start === 0) {
         if(remainder.has(value)) {
            remainder.delete(value);
         }
         else {
            duplicates.push(value);
         }
      }
   }

   remainder = [...remainder];

   return { remainder, duplicates };
}