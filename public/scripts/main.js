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




var paper = new Raphael(document.getElementById('main'), '765px', '500px');

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
  document.onmouseup = function () {dragging = false;};
  
  var not = new_behavior("not", "purple", 1);
  var and = new_behavior("and", "red", 2);
  var or = new_behavior("or", "blue", 2);
  var rect = new_behavior("rect", "green", 3);
  components = [];
  for (var i = 0; i < 20; i++) {
    components.push(new_component(not, 35, 50), 
      new_component(and, 35, 150), 
      new_component(or, 35, 250),
      new_component(rect, 35, 350)
      );
  }
  
  
  paper.rect(0, 0, 110, 500).attr({fill: "#EEE", stroke: "#DDD"}).toBack(); //component bg
  paper.rect(120, 0, 30, 500).attr({fill: "#38F", stroke: "#38F"}).toBack(); // input bar
  paper.text(135, 225, "INPUT").rotate(90).attr({"font-size": "28"});
  paper.rect(725, 0, 30, 500).attr({fill: "#F83", stroke: "#F83"}).toBack(); // input bar
  paper.text(740, 225, "OUTPUT").rotate(90).attr({"font-size": "28"});
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
  }else if (behavior.shape == "not"){
    var component = paper.set();
    var body = paper.path(
      " M " + (posx)  +" "+  posy + 
      " L " + (posx+40) +" "+ (posy+30) +
      " L " + (posx)  +" "+ (posy+60) + 
      " L " + (posx)  +" "+ posy 
    );  
  }else { // if you want this, use "rect"
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
  var cur_input;
  var drag_point;
  var pin_attr = {stroke: "#CCC", "stroke-width": 5};
  
  for(var i = 0; i < behavior.inputs; i++ ){
    cur_input = null;
    cur_input = paper.path("M "+ posx +" "+ (posy+30+20*i-(behavior.inputs-1)*10) +" L "+ (posx-20)+" "+ (posy+30+20*i-(behavior.inputs-1)*10));
    input.push(cur_input);
    cur_input.draggable();
  	cur_input.dragStart = function(x, y, start_event, event) {
  	  drag_point = paper.circle(x, y, 2);
  	  dragging = true;
      connections.push(paper.connection(this, drag_point, "#888"));
  	  return this;
  	};
  	cur_input.dragUpdate = function(draggingOver, dx, dy, event) {
      drag_point.translate(dx, dy);
    };
  	cur_input.dragFinish = function(dropped_on, x, y, event) {
  	  connections.pop().line.remove();
  	  drag_point.hide();
      if (dropped_on&&dropped_on.raphael){
        connections.push(paper.connection(this, dropped_on, "#000"));
      }
    };
    
    
    cur_input.hover(function (event) {
        this.attr({stroke: "#99F"});
    }, function (event) {
        this.attr(pin_attr);
    });

    
    cur_input.name = "input"+i;
    cur_input.node.name = "input"+i+".node";
    cur_input.attr(pin_attr);
  }

  var output = paper.set();
  var output1 = paper.path("M " + (posx+38) +" "+ (posy+30) +" L "+ (posx+60) +" "+ (posy+30));
  output.push(output1);
  component.push( body, input, output);
  
  body.attr({fill: behavior.color, stroke:"#CCC"});
  
  output.attr(pin_attr);
  
  body.draggable();
  body.dragStart = function(x, y, start_event, event) { 
    dragging = true;
    return component; 
  };
  body.hover(function (event) {
      component.attr({stroke: "#999"});
  }, function (event) {
      component.attr({fill: behavior.color, stroke:"#CCC"});
  });
  
  output1.hover(function (event) {
      output1.attr({stroke: "#99F"});
  }, function (event) {
      output1.attr(pin_attr);
  });


  
	
	output1.draggable();
	output1.dragStart = function(x, y, start_event, event) {
	  drag_point = paper.circle(x, y, 2);
	  dragging = true;
    connections.push(paper.connection(output1, drag_point, "#888"));
	  return output1;
	};
	output1.dragUpdate = function(draggingOver, dx, dy, event) {
    drag_point.translate(dx, dy);
  };
	output1.dragFinish = function(dropped_on, x, y, event) {
	  connections.pop().line.remove();
	  drag_point.hide();
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
  behavior.inputs = inputs;
  behavior.outputs = outputs;
  return behavior;
}