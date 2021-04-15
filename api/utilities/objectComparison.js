function commonKeys(a, b) {
   let common = {};
   for (const i in a) {
      if(i in b) {
         common[i] = a[i];
      }
   }
   return common;
}

module.exports = { commonKeys };