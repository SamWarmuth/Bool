var paper = new Raphael(document.getElementById('main'), '100%', 500);

window.onload = function() { 
  var and = new Object;
  and.shape = "and";
  and.color = "red";
  var or = new Object;
  or.shape = "or";
  or.color = "blue";
  
  var square = new Object;
  square.name = "square"
  
  new_component(and, 50, 50);
  new_component(or, 50, 125);
  new_component(or, 50, 200);
  
  
  var status = paper.circle(5, 5, 5);
  status.attr({fill: "#0F0", stroke: "#3F3"})
}

function new_component(behavior, posx, posy, options){
  //if (behavior.inputs.length == 2) 5 + 5;
  //if (behavior.outputs.length == 1)6 + 6;
  if (behavior.shape == "and"){
    var component = paper.set();
    var body = paper.path("M " + posx +" "+ posy +" C "+ (posx+50) +" "+ posy +" "+ (posx+50) +" "+ (posy+60) +" "+  posx +" "+(posy+60)+" Z");
  }else if (behavior.shape == "or"){
    var component = paper.set();
    var body = paper.path(
    " M " + (posx-7)    +" "+  posy + 
    " S " + (posx+20) +" "+  posy     +" "+ (posx+40) +" "+ (posy+30) + 
    " L " + (posx+40) +" "+ (posy+30) +
    " S " + (posx+30) +" "+ (posy+50) +" "+ (posx-7)    +" "+ (posy+60) +
    " L " + (posx-7)    +" "+ (posy+60) + 
    " S " + (posx+10) +" "+ (posy+30) +" "+ (posx-7)    +" "+ (posy) );
  }
  
  var input = paper.set();
  input.push(
    paper.path("M "+ posx +" "+ (posy+20) +" L "+ (posx-20)+" "+ (posy+20)),
    paper.path("M "+posx +" "+ (posy+40)+ " L "+ (posx-20) +" "+ (posy+40))
    );
  var output = paper.set();
  output.push(
    paper.path("M " + (posx+38) +" "+ (posy+30) +" L "+ (posx+60) +" "+ (posy+30))
  );
  component.push( body, input, output);
  
  body.attr({fill: behavior.color, stroke:"#CCC"});
  var pin_attr = {stroke: "#CCC", "stroke-width": 3};
  
  input.attr(pin_attr);
  output.attr(pin_attr);
  
  

  body.draggable();
  body.dragStart = function(x, y, start_event, event) { return component; };
  body.dragFinish = function(droppedOn, x, y, event) {
    component.attr({fill: "red"});
  };
  $(body.node).mouseenter(function(){
    component.toFront();
    component.attr({stroke: "#888"});
  });
  $(body.node).mouseleave(function(){
    component.attr({stroke: "#CCC"});
  });
  return component;
}

function new_behavior(inputs, outputs, output_equations){
  
  
}