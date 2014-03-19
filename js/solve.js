/**
 * Našou úlohou je nájsť riešenie 8-hlavolamu.
 * Hlavolam je zložený z 8 očíslovaných políčok a jedného prázdneho miesta.
 * Políčka je možné presúvať hore, dole, vľavo alebo vpravo, ale len ak je tým smerom medzera.
 * Je vždy daná nejaká východisková a nejaká cieľová pozícia a je potrebné nájsť postupnosť krokov,
 * ktoré vedú z jednej pozície do druhej.
 *
 * @author Patrik Gallik
 */


"use strict";

// global config
var M = 4;     // columns
var N = 4;     // rows
var h = 'h1';  // heuristic, can be h1|h2

// detects if browser or console
var platform = typeof window === 'undefined' ? 'console' : 'browser';
var debug = false;

(function () {

  //var initState = [
  //  [4, 1, 3],
  //  [2, 0, 6],
  //  [7, 5, 8]
  //];

  //var finalState = [
  //  [1, 2, 3],
  //  [4, 5, 6],
  //  [7, 8, 9]

  var initState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 0],
    [13, 14, 15, 12]
  ];

  var finalState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  // node class
  var Node = function() {};
  Node.prototype.parent = 'none';       // parent of the node
  Node.prototype.state = undefined;     // actual state in the node
  Node.prototype.lastOperand = 'none';  // operand used to get in the state
  Node.prototype.h = undefined;         // value of heuristic function of the state in the node

  var queue;

  // queue sorted by value heuristic function
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
      arr.splice(0,1);
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

  var heuristicList = {
    'h1': heuristic1,
    'h2': heuristic2
  };

  var heuristic = function() {
    return heuristicList[h];
  };

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
  // 1 2 3
  // 4 5 6
  // 7 8 0
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

  // step counter
  var stepCounter = 0;

  // A* algorithm step for one node
  function step() {
    var node;
    stepCounter++;

    if (debug) console.log("");
    if (debug) console.log("Step:");

    // takes node from node queue
    if(node = queue.pop()) {
      if (debug) console.log("Vyberam uzol s heuristikou: " + node.h);

      if (node.h == 0) {
        if (debug) console.log("Nasiel som riesenie.");
        endSearch(node);
        return;
      }

      var state;
      if ((node.lastOperand != 'down') && (state = go(node.state, 'up'))) {
        var newNode = new Node(state);
        newNode.state = state;
        newNode.h = heuristic()(state, finalState);
        newNode.parent = node;
        newNode.lastOperand = 'up';
        if (debug) console.log("UP:");
        if (debug) console.log("heuristika: " + newNode.h);
        if (debug) printState(newNode.state);
        queue.push(newNode);
      }
      if ((node.lastOperand != 'up') && (state = go(node.state, 'down'))) {
        var newNode = new Node(state);
        newNode.state = state;
        newNode.h = heuristic()(state, finalState);
        newNode.parent = node;
        newNode.lastOperand = 'down';
        if (debug) console.log("DOWN:");
        if (debug) console.log("heuristika: " + newNode.h);
        if (debug) printState(newNode.state);;
        queue.push(newNode);
      }
      if ((node.lastOperand != 'right') && (state = go(node.state, 'left'))) {
        var newNode = new Node(state);
        newNode.state = state;
        newNode.h = heuristic()(state, finalState);
        newNode.parent = node;
        newNode.lastOperand = 'left';
        if (debug) console.log("LEFT:");
        if (debug) console.log("heuristika: " + newNode.h);
        if (debug) printState(newNode.state);
        queue.push(newNode);
      }
      if ((node.lastOperand != 'left') && (state = go(node.state, 'right'))) {
        var newNode = new Node(state);
        newNode.state = state;
        newNode.h = heuristic()(state, finalState);
        newNode.parent = node;
        newNode.lastOperand = 'right';
        if (debug) console.log("RIGHT:");
        if (debug) console.log("heuristika: " + newNode.h);
        if (debug) printState(newNode.state);
        queue.push(newNode);
      }

      step();

    } else {
      if (debug) console.log("Rad uzlov je prazdny. Neexistuje riesenie.");
    }
  }

  // runs problem solving
  // @param state of problem
  function run(state) {
    queue = new Queue();
    var node = new Node();
    node.state = copy(state);
    node.h = heuristic1(node.state, finalState);
    node.h1 = heuristic1(node.state, finalState);
    node.h2 = heuristic2(node.state, finalState);
    node.price = 1;
    queue.push(node);
    step();
  }

  // prints results
  function endSearch(node) {

    // create list of directions
    var result = [];
    while(1) {
      if (node.parent == 'none') {
        break;
      }
      result.push(node.lastOperand);
      node = node.parent;
    }
    result.reverse();

    if (platform == 'console') {
      if (debug) console.log("Vysledok: ");
      for (var i = 0; i < result.length; i++) {
        if (debug) console.log(result[i].toUpperCase() + ", ");
      }
      if (debug) console.log("Pocet vykonanych krokov s danou heuristikou: " + stepCounter);
    }

    else {
      window.setResult(result);
    }

  }

  // if run in browser, access funcions to GUI via window object,
  // otherwise run simulation
  if (platform == 'console') {
    run(initState);
  } else {
    window.run = run;
    window.go = go;
  }

}) ();

