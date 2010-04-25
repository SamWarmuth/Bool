Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox();
    var bb2 = obj2.getBBox();
    var p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}];
    var d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        var res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y,
        dx = Math.max(Math.abs(x1 - x4) / 2, 10),
        dy = Math.max(Math.abs(y1 - y4) / 2, 10),
        x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};




var paper = new Raphael(document.getElementById('main'), '100%', 500);

window.onload = function() { 
  connections = [];
  dragging = false;
  
  document.onmousemove = function (e) {
      if (dragging) {
          for (var i = connections.length; i--;) {
              paper.connection(connections[i]);
          }
      }
  };
  document.onmouseup = function () {
      dragging = false;
  };
  
  var or = new_behavior("or", "blue");
  var and = new_behavior("and", "red");
  var rect = new_behavior("rect", "green");
  
  or1 = new_component(or, 50, 50);
  and1 = new_component(and, 50, 200);
  or2 =new_component(or, 50, 350);
  
  rect1 = new_component(rect, 150, 125);
  and2 = new_component(and, 150, 275);
  
  rect2 = new_component(rect, 250, 200);
  
  var status = paper.circle(5, 5, 5);
  status.attr({fill: "#0F0", stroke: "#3F3"})
}

function new_component(behavior, posx, posy, options){
  var component = paper.set();
  
  if (behavior.shape == "and"){
    var body = paper.path("M " + posx +" "+ posy +" C "+ (posx+50) +" "+ posy +" "+ (posx+50) +" "+ (posy+60) +" "+  posx +" "+(posy+60)+" Z");
  }else if (behavior.shape == "or"){
    var component = paper.set();
    var body = paper.path(
      " M " + (posx-7)  +" "+  posy + 
      " S " + (posx+20) +" "+  posy     +" "+ (posx+40) +" "+ (posy+30) + 
      " L " + (posx+40) +" "+ (posy+30) +
      " S " + (posx+30) +" "+ (posy+50) +" "+ (posx-7)  +" "+ (posy+60) +
      " L " + (posx-7)  +" "+ (posy+60) + 
      " S " + (posx+10) +" "+ (posy+30) +" "+ (posx-7)  +" "+ (posy)
    );
  }else if (behavior.shape == "rect"){
    var body = paper.path(
      " M " + posx +" "+ posy +
      " L " + (posx+38) +" "+ posy +
      " L " + (posx+38) +" "+ (posy+60) + 
      " L " + (posx) +" "+ (posy+60) +
      " Z "
    );
  }
  body.node.style.cursor = "move";
  var input = paper.set();
  var input1 = paper.path("M "+ posx +" "+ (posy+20) +" L "+ (posx-20)+" "+ (posy+20));
  var input2 = paper.path("M "+posx +" "+ (posy+40)+ " L "+ (posx-20) +" "+ (posy+40));
  input.push(input1, input2);
  var output = paper.set();
  var output1 = paper.path("M " + (posx+38) +" "+ (posy+30) +" L "+ (posx+60) +" "+ (posy+30));
  output.push(output1);
  component.push( body, input, output);
  
  body.attr({fill: behavior.color, stroke:"#CCC"});
  var pin_attr = {stroke: "#CCC", "stroke-width": 5};
  
  input.attr(pin_attr);
  output.attr(pin_attr);
  
  body.draggable();
  body.dragStart = function(x, y, start_event, event) { 
    dragging = true;
    return component; 
  };
  
  $(body.node).mouseenter(function(){
    component.toFront();
    component.attr({stroke: "#888"});
  });
  $(body.node).mouseleave(function(){
    component.attr({stroke: "#CCC"});
  });
  
  // Create a rubber band line from this point to the start point
	var rubberBand = function(from_x, from_y, to_x, to_y) {
	  var rubber_x = 0, rubber_y = 0;
	  var rubber_band = paper.path("M0 0").attr({stroke: "#000", "stroke-width": 2});
	  rubber_band.dragUpdate = function(draggingOver, dx, dy, event) {
	    rubber_x += dx; rubber_y += dy;
	    rubber_band.attr({path: "M"+from_x+" "+from_y+"L"+rubber_x+" "+rubber_y});
	  };
	  rubber_band.dragUpdate(null, to_x, to_y);
	  rubber_band.dragFinish = function(dropped_on, x, y, event) {
	    if (dropped_on){
	      alert("Dropped on "+(dropped_on.raphael ? dropped_on.raphael.name : dropped_on.tagName));
	      if (dropped_on.raphael){
	        alert("connected.");
	        connections.push(paper.connection(or1, dropped_on, "#000"));
	      }
	    }
	    rubber_band.dragCancel();
	  };
	  rubber_band.dragCancel = function() {
	    rubber_band.remove();
	  };
	  return rubber_band;
	};

	input1.draggable();
	input1.dragStart = function(x, y, start_event, event) {
	  // start_event is the original mousedown, not the current move
	  if (event.metaKey) return null;	// Don't start the drag until the metaKey is lifted
	  if (event.shiftKey) return this;	// A shift-drag moves the handle instead of rubber banding

	  var rubber_band = rubberBand((x), (y), x, y);
	  rubber_band.toBack();	// Drag behind other objects
	  return input1;
	};
	input1.dragUpdate = function(draggingOver, dx, dy, event) {
    paper.connection(connections[i]);
    
    rubber_x += dx; rubber_y += dy;
    rubber_band.attr({path: "M"+from_x+" "+from_y+"L"+rubber_x+" "+rubber_y});
  };
	input1.dragFinish = function(dropped_on, x, y, event) {
    if (dropped_on&&dropped_on.raphael){
      connections.push(paper.connection(input1, dropped_on, "#000"));
    }
  };
	//$(input1.node).bind('click', function(e) { alert("input1 clicked!"); });
	input1.name = "input1";
	input1.node.name = "input1.node";
	
	
	input2.draggable();
	input2.dragStart = function(x, y, start_event, event) {
	  // start_event is the original mousedown, not the current move
	  if (event.metaKey) return null;	// Don't start the drag until the metaKey is lifted
	  if (event.shiftKey) return this;	// A shift-drag moves the handle instead of rubber banding

	  var rubber_band = rubberBand((x), (y), x, y);
	  rubber_band.toBack();	// Drag behind other objects
	  return input2;
	};
	input2.dragUpdate = function(draggingOver, dx, dy, event) {
    paper.connection(connections[i]);
    
    rubber_x += dx; rubber_y += dy;
    rubber_band.attr({path: "M"+from_x+" "+from_y+"L"+rubber_x+" "+rubber_y});
  };
	input2.dragFinish = function(dropped_on, x, y, event) {
    if (dropped_on&&dropped_on.raphael){
      connections.push(paper.connection(input2, dropped_on, "#000"));
    }
  };
	//$(input2.node).bind('click', function(e) { alert("input2 clicked!"); });
	input2.name = "input2";
	input2.node.name = "input2.node";
	
	output1.draggable();
	output1.dragStart = function(x, y, start_event, event) {
	  // start_event is the original mousedown, not the current move
	  if (event.metaKey) return null;	// Don't start the drag until the metaKey is lifted
	  if (event.shiftKey) return this;	// A shift-drag moves the handle instead of rubber banding

	  var rubber_band = rubberBand((x), (y), x, y);
	  rubber_band.toBack();	// Drag behind other objects
	  return output1;
	};
	output1.dragUpdate = function(draggingOver, dx, dy, event) {
    paper.connection(connections[i]);
    
    rubber_x += dx; rubber_y += dy;
    rubber_band.attr({path: "M"+from_x+" "+from_y+"L"+rubber_x+" "+rubber_y});
  };
	output1.dragFinish = function(dropped_on, x, y, event) {
    if (dropped_on&&dropped_on.raphael){
      connections.push(paper.connection(output1, dropped_on, "#000"));
    }
  };
	//$(output1.node).bind('click', function(e) { alert("output1 clicked!"); });
	output1.name = "output1";
	output1.node.name = "output1.node";
  
  
  return component;
}

function new_behavior(shape, color, inputs, outputs, output_equations){
  var behavior = new Object;
  behavior.shape = shape;
  behavior.color = color;
  return behavior;
}