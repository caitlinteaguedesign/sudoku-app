const pattern = [
   [0,0,0,1,1,1,2,2,2],
   [0,0,0,1,1,1,2,2,2],
   [0,0,0,1,1,1,2,2,2],
   [3,3,3,4,4,4,5,5,5],
   [3,3,3,4,4,4,5,5,5],
   [3,3,3,4,4,4,5,5,5],
   [6,6,6,7,7,7,8,8,8],
   [6,6,6,7,7,7,8,8,8],
   [6,6,6,7,7,7,8,8,8],
];

const definitions = [
   {
      "block": 0,
      "startRow": 0,
      "startColumn": 0
   },
   {
      "block": 1,
      "startRow": 0,
      "startColumn": 3
   },
   {
      "block": 2,
      "startRow": 0,
      "startColumn": 6
   },
   {
      "block": 3,
      "startRow": 3,
      "startColumn": 0
   },
   {
      "block": 4,
      "startRow": 3,
      "startColumn": 3
   },
   {
      "block": 5,
      "startRow": 3,
      "startColumn": 6
   },
   {
      "block": 6,
      "startRow": 6,
      "startColumn": 0
   },
   {
      "block": 7,
      "startRow": 6,
      "startColumn": 3
   },
   {
      "block": 8,
      "startRow": 6,
      "startColumn": 6
   }
];

const defaultSettings = {
   readonly: {
      color: '',
      family: 'sans',
      weight: 'bold',
      style: 'normal'
   },
   default: {
      color: '',
      family: 'cursive',
      weight: 'normal',
      style: 'normal'
   },
   guess: {
      color: '',
      family: 'cursive',
      weight: 'normal',
      style: 'italic'
   }
};

export {pattern, definitions, defaultSettings};