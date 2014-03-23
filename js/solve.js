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
var M = 5;     // columns
var N = 3;     // rows
var h = 'h2';  // heuristic, can be h1|h2

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

// detects if browser or console
var platform = typeof window === 'undefined' ? 'console' : 'browser';
var debug = true;

(function () {

  // Node class
  // Node is used to tend the state in the current iteration of the algorithm
  var Node = function(parent, state, operand) {
    nodeCounter++;
    this.state = state;
    this.h = heuristic()(state);
    this.parent = parent;
    this.lastOperand = operand;
    this.price = parent == 'none' ? 0 : parent.price + 1;
    // sum heuristic value and price is used as sorting value in queue
    this.hprice = this.price + this.h;
    // debug
    if (debug) console.log(operand);
    if (debug) console.log("heuristika: " + this.h);
    if (debug) console.log("ehuristika+cena: " + this.hprice);
    if (debug) printState(this.state);
  };
  Node.prototype.parent = 'none';       // parent of the node
  Node.prototype.state = undefined;     // actual state in the node
  Node.prototype.price = 0;             // numbers of steps taken to this node
  Node.prototype.lastOperand = 'none';  // operand used to get in the state
  Node.prototype.h = undefined;         // value of heuristic function of the state in the node

  // holds number of nodes created
  var nodeCounter = 0;

  // global reference to queue
  var queue;

  // queue of nodes sorted by value of heuristic function in the node + price of the node
  var Queue = function() {
    // queue is a simple sorted array, stored here
    var arr = [];
    // push node to queue
    function push(obj) {
      arr.push(obj);
      sort();
    }
    // get node from queue
    function pop() {
      if (!arr[0])
        return false;
      var task = arr[0];
      arr.splice(0,1);
      return task;
    }
    // sort function
    function sortFn(a,b) {
      if (a.hprice < b.hprice)
        return -1;
      if (a.hprice > b.hprice)
        return 1;
      return 0;
    }
    // sort the array
    function sort() {
      arr.sort(sortFn);
    }
    // public methods of the queue
    this.push = push;
    this.pop = pop;
    this.length = function() {
      return arr.length;
    }
  };

  // heuristic function n.1
  // - number of items, that are not at final position
  function heuristic1(now) {
    var sum = 0;
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < M; j++) {
        // compare values in current (now) and desired state
        if (now[i][j] != finalState[i][j]) {
          sum++;
        }
      }
    }
    return sum;
  }

  // heuristic function v.2
  // - sum of distances from item in current position to desired position
  // count the space too
  // uses hashed array of items position in desired state
  function heuristic2(now) {
    var sum = 0;
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < M; j++) {
        // pre kazde policko zisti vzdialenost od vytuzenej pozicie
        var length = Math.abs(i - h2list[now[i][j]].i) +
                     Math.abs(j - h2list[now[i][j]].j);
        sum += length;
      }
    }
    return sum;
  }

  // hasled list of positions of items
  var h2list = {};
  // generate has list of item positions from final state
  function generateHeuristic2List() {
    var hashed = {};
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < M; j++) {
        hashed[finalState[i][j]] = {
          'i': i,
          'j': j
        };
      }
    }
    h2list = hashed;
  }

  // list of available heuristic
  var heuristicList = {
    'h1': heuristic1,
    'h2': heuristic2
  };

  // returns selected heuristic (can be changed in global config at the top)
  var heuristic = function() {
    return heuristicList[h];
  };

  // creates a simple pseudo hash from state (unchangeable)
  function hashState(state) {
    var hash = '';
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < M; j++) {
        hash += '|'+state[i][j];
      }
    }
    return hash;
  }

  // hashed list of already visited states, with pointer to node in the state
  // if the price of the current node is lower than the node in the list (with same states),
  // we replace the state node with current node
  var visitedStates = {};

  // print visited state for debug purposes
  visitedStates.print = function() {
    for (var key in visitedStates) {
      if (visitedStates.hasOwnProperty(key)) {
        console.log(key);
      }
    }
  };

  // get number of already visited states
  function getVisitedStatesLength() {
    var count = 0;
    for (var key in visitedStates) {
      if (visitedStates.hasOwnProperty(key)) {
        count++;
      }
    }
    return count;
  };

  // create a deep copy of state and returns it
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

  // checks if the given state is already visited,
  // if no, it adds the node to the queue
  // otherwise, remove the node.
  function checkHashAndPushNode(node, state) {
    var hash = hashState(state);
    if (!visitedStates[hash]) {
      visitedStates[hash] = {
        'state': state,
        'node': node
      };
      queue.push(node);
    } else {
      if (debug) console.log("Rovnaky stav");
      node = null;
    }
  }

  // runs problem solving
  // @param state of the problem
  function run(state, heuristic) {

    if (heuristic) {
      h = heuristic;
    }

    // create has list for heuristic n.2
    generateHeuristic2List();
    // init queue
    queue = new Queue();
    // clear visited states
    visitedStates = {};
    // clear counter
    nodeCounter = 0;

    // create first node from actual state
    var initNode = new Node('none', copy(state), 'none');
    queue.push(initNode);

    var node;

    // one step(iteration) in the algorithm
    function iteration() {
      // takes node from queue
      if (node = queue.pop()) {

        if (debug) console.log("");
        if (debug) console.log("Step:");
        if (debug) console.log("Vyberam uzol s heuristikou: " + node.h);

        // if heuristic is eq to 0, the solution is found
        if (node.h == 0) {
          if (debug) console.log("Nasiel som riesenie.");
          // end the algorithm
          clearInterval(interval);
          endSearch(node);
          return;
        }

        var state;

        if ((node.lastOperand != 'down') && (state = go(node.state, 'up'))) {
          var newNode = new Node(node, state, 'up');
          checkHashAndPushNode(newNode, state);
        }

        if ((node.lastOperand != 'up') && (state = go(node.state, 'down'))) {
          var newNode = new Node(node, state, 'down');
          checkHashAndPushNode(newNode, state);
        }

        if ((node.lastOperand != 'right') && (state = go(node.state, 'left'))) {
          var newNode = new Node(node, state, 'left');
          checkHashAndPushNode(newNode, state);
        }

        if ((node.lastOperand != 'left') && (state = go(node.state, 'right'))) {
          var newNode = new Node(node, state, 'right');
          checkHashAndPushNode(newNode, state);
        }

      } else {
        // if queue is empty, there is no solution
        console.log("Rad je prazdny. Neexistuje riesenie.");
        console.log("Pocet navstivenych stavov: " + visitedStates.length());
        clearInterval(interval);
        return;
      }
    }

    // run algoritm step each x ms
    var interval = setInterval(iteration, 0);
  }

  // prints results
  function endSearch(node) {

    var price = node.price;

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
      if (debug) console.log("Pocet vykonanych krokov vo vysledku: " + price);
      if (debug) console.log("Pocet preskumanych uzlov:: " + nodeCounter);
    }

    else {
      window.setResult(result, nodeCounter, getVisitedStatesLength());
    }

  }

  // if run in browser, access functions to GUI via window object,
  // otherwise run simulation
  if (platform == 'console') {
    run(initState);
  } else {
    debug = false;
    window.run = run;
    window.go = go;
  }

}) ();

