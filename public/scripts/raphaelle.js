Raphael.el.draggable=function(options){var handle=this;if(!options)options={};var drag_obj=typeof options.drag_obj!=='undefined'?options.drag_obj:handle;var right_button=options.right_button;if(!(handle.node&&handle.node.raphael)){alert(handle+' is not a Raphael object so you can\'t make it draggable');return;}
if(drag_obj&&!(drag_obj.node&&drag_obj.node.raphael)){alert(drag_obj+' is not a Raphael object so you can\'t make it draggable');return;}
var reluctance=options.reluctance;if(typeof reluctance=='undefined')reluctance=3;var skip_click;var mousedown=function(event){if(typeof right_button!='undefined'&&(right_button===false)===(event.button>1))
return true;skip_click=false;var started=false;var start_event=event;var last_x=event.pageX,last_y=event.pageY;var over=function(event){var paper=handle.paper||drag_obj.paper;if(!paper)return null;if(drag_obj)drag_obj.hide();var dragging_over=document.elementFromPoint(event.pageX,event.pageY);if(drag_obj)drag_obj.show();if(!dragging_over)
return null;if(dragging_over.nodeType==3)
return dragging_over.parentNode;if(dragging_over.tagName!='svg'&&dragging_over==paper.canvas.parentNode)
return paper.canvas;if(dragging_over==paper.canvas)
return dragging_over;if(!dragging_over.raphael)
return dragging_over.parentNode;return dragging_over;};var mousemove=function(event){var delta_x=event.pageX-last_x;var delta_y=event.pageY-last_y;if(!started&&(delta_x>reluctance||delta_x<-reluctance||delta_y>reluctance||delta_y<-reluctance)){if(handle.dragStart){var position=$.browser.opera?$(handle.paper.canvas.parentNode).offset():$(handle.paper.canvas).offset();var o=handle.dragStart(event.pageX-delta_x-position.left,event.pageY-delta_y-position.top,start_event,event);if(!o)return false;drag_obj=o;}
started=true;skip_click=true;}
if(!started||!drag_obj)return false;var dragging_over=over(event);var update=drag_obj.dragUpdate?drag_obj.dragUpdate:function(o,dx,dy,e){drag_obj.translate(dx,dy);};update(dragging_over,delta_x,delta_y,event);last_x=event.pageX;last_y=event.pageY;return false;};if(reluctance==0&&handle.dragStart){var o=handle.dragStart(0,0,event,event);if(!o)return false;drag_obj=o;started=true;skip_click=true;}
var revert;var cancel;var keydown=function(event){if(event.keyCode==27){revert(event);if(drag_obj.dragCancel)
drag_obj.dragCancel();cancel();return false;}
return true;};revert=function(event){if(!started)return;if(drag_obj&&drag_obj.dragUpdate)
drag_obj.dragUpdate(null,start_event.pageX-last_x,start_event.pageY-last_y,event);started=false;};var mouseup=function(event){if(started){var dropped_on=over(event);if(drag_obj&&drag_obj.dragFinish){var position=$.browser.opera?$(handle.paper.canvas.parentNode).offset():$(handle.paper.canvas).offset();drag_obj.dragFinish(dropped_on,event.pageX-position.left,event.pageY-position.top,event);}
cancel();return true;}
cancel();return true;};handle.originalDraggableNode=handle.node;cancel=function(){$(document).unbind('mouseup',mouseup);$(document).unbind('mousemove',mousemove);$(document).unbind('keydown',keydown);if($.browser.msie){if(handle.originalDraggableNode!=handle.node)
$(handle.node).bind('mousedown',mousedown);handle.originalDraggableNode=handle.node;}
started=false;};$(document).bind('keydown',keydown);$(document).bind('mousemove',mousemove);$(document).bind('mouseup',mouseup);event.stopImmediatePropagation();return false;};var click=function(event){if(skip_click)
event.stopImmediatePropagation();skip_click=false;return true;};$(handle.node).bind('mousedown',mousedown);$(handle.node).bind('click',click);};