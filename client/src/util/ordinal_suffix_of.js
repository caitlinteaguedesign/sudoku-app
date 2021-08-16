export default function ordinal_suffix_of(i) {
   var j = i % 10;

   if(j === 1 && i !== 11) {
      return i + 'st';
   }
   else if(j === 2 && i !== 12) {
      return i + 'nd';
   }
   else if(j === 3 && i !== 13) {
      return i + 'rd';
   }
   else {
      return i + 'th';
   }
}