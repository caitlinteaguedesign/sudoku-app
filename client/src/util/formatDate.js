const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December'
];

const mons = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dec'
];

function ordinal_suffix_of(i) {
   var j = i % 10;

   if(j === 1 && i !== 11) {
      return i + 'st';
   }
   else if(i === 2 && i !== 12) {
      return i = 'nd';
   }
   else if(i === 3 && i !== 13) {
      return i + 'rd';
   }
   else {
      return i + 'th';
   }
}

export default function formatDate(raw, style) {
   const date = new Date(raw);

   const m = date.getMonth();
   const d = date.getDate();
   const y = date.getFullYear();

   switch(style) {
      case 'Month Dn, YYYY':
         return months[m]+' '+ordinal_suffix_of(d)+', '+y;

      case 'Mon D, YYYY':
         return mons[m]+' '+d+', '+y;

      case 'M/D/YYYY':
         return (m+1)+'/'+d+'/'+y;

      default:
         return (m+1)+'/'+d+'/'+y;
   }

}