import ordinal_suffix_of from "./ordinal_suffix_of";

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