"use strict";

(function () {

	var stage = new Kinetic.Stage({
		container: 'canvas',
		width: 360,
		height: 360
	});

	var layer = new Kinetic.Layer({
  });

  var initState = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  var row = 90;
  var col = 90;

  var drawState = function(state) {

    console.log(state)
    var i = 0;
    var j = 0;
    var bg = '#ccc';
    var text = '';
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

  drawState(initState);
  layer.draw();

//
//	setInterval(function(){
//		animate();
//	},1000/60);


  var go = function(direction) {
    var state;
    if (state = window.go(initState, direction)) {
      console.log('drawing');
      initState = state;
      drawState(initState);
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
  }
  $(window).keydown(keyHadler);
}) ();
