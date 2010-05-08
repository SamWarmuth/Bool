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
  
  for (var i = 0; i < 15; i++) {
    components.push(
      new_component(not, 35, 50),
      new_component(and, 35, 150),
      new_component(or, 35, 250),
      new_component(rect, 35, 350)
      );
  }
  
  inputs = [];
  for (var i = 0; i < 5; i++) {
      inputs.push(paper.rect(150, 100*i+20, 20, 8).attr({fill: "#38F", stroke: "#38F"}));
  }
  outputs = [];
  for (var i = 0; i < 5; i++) {
    outputs.push(paper.rect(705, 100*i+20, 20, 8).attr({fill: "#F83", stroke: "#F83"}));
  }

  
  paper.rect(0, 0, 110, 500).attr({fill: "#EEE", stroke: "#DDD"}).toBack(); //component bg
  paper.rect(120, 0, 30, 500).attr({fill: "#38F", stroke: "#38F"}).toBack(); // input bar
  //input pins

  paper.text(135, 225, "INPUT").rotate(90).attr({"font-size": "28"});
  paper.rect(725, 0, 30, 500).attr({fill: "#F83", stroke: "#F83"}).toBack(); // output bar
  //output pins

  paper.text(740, 225, "OUTPUT").rotate(90).attr({"font-size": "28"});
  
  $('.create').click(function(){
      alert("Yeah. Working on it.");
  });
}

