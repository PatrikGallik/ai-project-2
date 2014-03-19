
// global
var M         = 3;
var N         = 3;
var operands  = ['right', 'down', 'left', 'up'];
var finalState = [];

// node class
var Node = function() {};
Node.prototype.parent = undefined;
Node.prototype.state = undefined;
Node.prototype.lastOperand = undefined;
Node.prototype.price = undefined;
Node.prototype.h1 = undefined;
Node.prototype.h2 = undefined;

// queue sorted by heuristic function
var Queue = function() {

  var arr = [];

  function push(obj) {
    arr.push(obj);
    sort();
  }

  function pop() {
    if (!arr[0])
      return false;
    var task = arr[0];
    arr.slice(0,1);
    return task;
  }

  function sortFn(a,b) {
    if (a.h < b.h)
      return -1;
    if (a.h > b.h)
      return 1;
    return 0;
  }

  function sort() {
    arr.sort(sortFn);
  }

  this.push = push;
  this.pop = pop;
  this.length = function() {
    return arr.length;
  }
};

// heuristicka funkcia 1.
// - pocet policok, ktore nie su na svojom mieste
function heuristic1(now, final) {
  var sum = 0;
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < M; j++) {
      // porovna hodnoty v terajsom (now) stave a v cielovom stave (final)
      if (now[i][j] != final[i][j]) {
        sum++;
      }
    }
  }
  return sum;
}

// heuristicka funkcia 2.
// - sucet vzdialenosti jednotlivych policok od ich cielovej pozicie
// zapocitava aj medzeru
function heuristic2(now, final) {
  var sum = 0;
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < M; j++) {
      // pre kazde policko zisti vzdialenost od vytuzenej pozicie
      if (now[i][j] == 0) {
        var number = M*N-1;
      } else {
        var number = now[i][j] - 1;
      }
      var col = number % M;
      var row = Math.floor(number / N);
      var length = Math.abs(i - row) + Math.abs(j - col);
      sum += length;
    }
  }
  return sum;
}

function copy(state) {
  var newState = [];

  for (var i = 0; i < N; i++) {
    newState.push([]);
    for (var j = 0; j < M; j++) {
      newState[i].push(state[i][j]);
    }
  }

  return newState;
}

// move piece in our state with given direction
function go(state, direction) {
  var newState;

  // todo:  we are running 4 iteration in array to found out the "space",
  //        one for each direction, optimize it to one
  for (var i = 0; i < N; i++) {
    for (var j = 0; j < M; j++) {

      // when "space" is found, make a decision
      if (state[i][j] == 0) {
        // switch on direction
        switch(direction) {
          // up
          case 'up': {
            if (state[i-1] && state[i-1][j]) {
              // create a new state and switch values
              newState = copy(state);
              var h = newState[i][j];
              newState[i][j] = newState[i-1][j];
              newState[i-1][j] = h;
              return newState;
            } else {
              return false;
            }
          }
          // down
          case 'down': {
            if (state[i+1] && state[i+1][j]) {
              // create a new state and switch values
              newState = copy(state);
              var h = newState[i][j];
              newState[i][j] = newState[i+1][j];
              newState[i+1][j] = h;
              return newState;
            } else {
              return false;
            }
          }
          // left
          case 'left': {
            if (state[i] && state[i][j-1]) {
              // create a new state and switch values
              newState = copy(state);
              var h = newState[i][j];
              newState[i][j] = newState[i][j-1];
              newState[i][j-1] = h;
              return newState;
            } else {
              return false;
            }
          }
          // right
          case 'right': {
            if (state[i] && state[i][j+1]) {
              // create a new state and switch values
              newState = copy(state);
              var h = newState[i][j];
              newState[i][j] = newState[i][j+1];
              newState[i][j+1] = h;
              return newState;
            } else {
              return false;
            }
          }

        } //- switch
      } // -if
    } // -for
  } // -for
  return false;
}

// generate final desired state
// e.g for 3x3
// 123
// 456
// 780
function generateFinalState() {
  var state= [];
  for (var i = 0; i < N; i++) {
    state.push([]);
    for (var j = 0; j < M; j++) {
      if (i == (N-1) && j == (M-1)) {
        state[i].push(0);
      } else {
        state[i].push((i*M)+j+1);
      }
    }
  }
  return state;
}

// print state in readable format in console
function printState(state) {
  for (var i = 0; i < state.length; i++) {
    console.log(state[i]);
  }
  console.log("");
}

// A* algorithm step for one node
function step() {
  var node;

  console.log("")
  console.log("Step:");

  // takes node from node queue
  if(node = queue.pop()) {
    console.log("Vyberam uzol s heuristikou: " + node.h);

    if (node.h == 0) {
      console.log("Nasiel som riesenie.");
      printResult(node);
      return;
    }

    var state;
    if ((node.lastOperand != 'down') && (state = go(node.state, 'up'))) {
      var newNode = new Node(state);
      newNode.state = state;
      newNode.h = heuristic1(state, finalState);
      newNode.parent = node;
      newNode.lastOperand = 'up';
      console.log("UP:");
      console.log("heuristika: " + newNode.h);
      printState(newNode.state);
      queue.push(newNode);
    }
    if ((node.lastOperand != 'up') && (state = go(node.state, 'down'))) {
      var newNode = new Node(state);
      newNode.state = state;
      newNode.h = heuristic1(state, finalState);
      newNode.parent = node;
      newNode.lastOperand = 'down';
      console.log("DOWN:");
      console.log("heuristika: " + newNode.h);
      printState(newNode.state);;
      queue.push(newNode);
    }
    if ((node.lastOperand != 'right') && (state = go(node.state, 'left'))) {
      var newNode = new Node(state);
      newNode.state = state;
      newNode.h = heuristic1(state, finalState);
      newNode.parent = node;
      newNode.lastOperand = 'left';
      console.log("LEFT:");
      console.log("heuristika: " + newNode.h);
      printState(newNode.state);
      queue.push(newNode);
    }
    if ((node.lastOperand != 'left') && (state = go(node.state, 'right'))) {
      var newNode = new Node(state);
      newNode.state = state;
      newNode.h = heuristic1(state, finalState);
      newNode.parent = node;
      newNode.lastOperand = 'right';
      console.log("RIGHT:");
      console.log("heuristika: " + newNode.h);
      printState(newNode.state);
      queue.push(newNode);
    }

    setTimeout(step,500);

  } else {
    console.log("Rad uzlov je prazdny. Neexistuje riesenie.");
  }
}

// runs problem solving
// @param state of problem
function run(state) {
  finalState = generateFinalState();
  queue = new Queue();
  var node = new Node();
  node.state = copy(state);
  node.h = heuristic1(node.state, finalState);
  node.h1 = heuristic1(node.state, finalState);
  node.h2 = heuristic2(node.state, finalState);
  node.price = 1;
  node.lastOperand = 'none';
  node.parent = 'none';
  queue.push(node);
  step();

}

function printResult(node) {
  console.log("Vysledok: ");
  var result = [];
  while(1) {
    if (node.parent == 'none') {
      break;
    }
    result.push(node.lastOperand);
    node = node.parent;
  }
  result.reverse();
  for (var i = 0; i < result.length; i++) {
    console.log(result[i].toUpperCase() + ", ");
  }
}

var initState = [
  [0, 1, 3],
  [4, 2, 6],
  [7, 5, 8]
];


// run
run(initState);

//console.log(result);

