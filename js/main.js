"use strict";

(function () {

	var stage = new Kinetic.Stage({
		container: 'canvas',
		width: 360,
		height: 360
	});

	var layer = new Kinetic.Layer({
  });

  var state = [
    [1, 2, 3, 4],
    [5, 10, 6, 8],
    [0, 9, 7, 12],
    [13, 14, 11, 15]
  ];

  var row = 90;
  var col = 90;

  var drawState = function(state) {

    var i = 0;
    var j = 0;
    var bg = '#ccc';
    var text = '';

    layer.removeChildren();

    for (i = 0; i < N; i++) for (j = 0; j < M; j++) {

      var group = new Kinetic.Group({
        x: j * col,
        y: i * row
      });

      text = state[i][j] == 0 ? '-' : state[i][j];
      bg = state[i][j] == 0 ? '#eee' : '#ccc';

      var rect = new Kinetic.Rect({
        width: 80,
        height: 80,
        fill: bg
      });

      var text = new Kinetic.Text({
        width: 80,
        height: 80,
        padding: 20,
        fontSize: 38,
        text: text,
        fill: '#ffffff',
        align: 'center'
      });

      group.add(rect);
      group.add(text);
      layer.add(group);
    }

    layer.draw();
  };

  stage.add(layer);
  drawState(state);
  layer.draw();

  var go = function(direction) {
    var newState;
    if (newState = window.go(state, direction)) {
      state = newState;
      drawState(state);
    }
  };

  // handle keys
  function keyHadler(event) {

    switch(event.keyCode) {
      case 37: {
        event.preventDefault();
        go('right');
        break;
      }
      case 38: {
        event.preventDefault();
        go('down');
        break;
      }
      case 39: {
        event.preventDefault();
        go('left');
        break;
      }
      case 40: {
        event.preventDefault();
        go('up');
        break;
      }
    }

    played = true;
  }
  $(window).keydown(keyHadler);

  // event listener to user button click
  $('#help-me').on('click', function() {
    $('#columns').addClass('active');
    window.run(state);
  });

  var steps = $('#steps-list');
  var result;

  // function called by solve.js when problem is solved
  window.setResult = function(rslt) {
    // clear previous steps (if any)
    result = rslt;
    steps.empty();
    var text;
    var step;
    for (var i = 0; i < result.length; i++) {
      switch(result[i]) {
        case 'left': text="Right"; break;
        case 'right': text="Left"; break;
        case 'up': text="Down"; break;
        case 'down': text="Up"; break;
      }
      step = $('<li>'+text+'</li>');
      steps.append(step);
    }
    played = false;

    // print something if result si empty
    if (rslt.length == 0) {
      step = $('<span>Way too easy.</span>');
      steps.append(step);
    }
  };

  function animate (index) {
    go(result[index]);
    if (result[index+1]) {
      index++;
      setTimeout(function() {
        animate(index);
      }, 500);
    }
  }

  var played = false;

  $('#play').on('click', function() {
    if (!played && result.length > 0) {
      played = true;
      animate(0);
    }
  });



}) ();
