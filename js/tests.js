// ------------------------
// jednoduchy test

var M = 4;
var N = 4;
var h = 'h2';

var initState = [
  [1, 2, 4, 8],
  [5, 7, 3, 11],
  [6, 0, 10, 12],
  [9, 13, 14, 15]
];

var finalState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0]
];

// ------------------------
// taky isty, ako hore, ale naopak

var M = 4;
var N = 4;
var h = 'h2';

var M = 4;
var N = 4;
var h = 'h2';

var initState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0]
];

var finalState = [
  [1, 2, 4, 8],
  [5, 7, 3, 11],
  [6, 0, 10, 12],
  [9, 13, 14, 15]
];

// -------------------------
// narocny test, prehlada az 10560 uzlov

var M = 4;
var N = 4;
var h = 'h2';

var M = 4;
var N = 4;
var h = 'h2';

var initState = [
  [2, 7, 4, 8],
  [1, 3, 11, 12],
  [0, 9, 13, 10],
  [5, 6, 14, 15]
];

var finalState = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0]
];

// -------------------------
// test na atypicekj mriezke

var M = 5;
var N = 3;
var h = 'h2';

var initState = [
  [2, 8, 3, 5, 9],
  [1, 13, 12, 4, 0],
  [6, 11, 7, 14, 10]
];

var finalState = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 0]
];