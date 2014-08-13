// name: Draw
// filenames: Game

// variables
var stage, renderer;
var context, canvas;
var polyVertices = new Float32Array(8);
var physicsEntity = new Float32Array(PHYSICS_ENTRIES);
// end variables


// functions

function changeState(context, state, value) {
	if(context[state] !== value) {
		context[state] = value;
	}
}

function poly(entity) {
	polyVertices = cleanList(polyVertices)
	context.beginPath();
	var vertices = PHYSICS_GET_VERTICES(getPhysicsEntity(entity, physicsEntity), polyVertices);
	console.log(vertices)
	moveTo(getValue(vertices, X), getValue(vertices, Y));
	for (i = 2; i < vertices.length; i += 2) {
		context.lineTo(getValue(vertices, i + X), getValue(vertices, i + Y));
	}
	context.lineTo(getValue(vertices, X), getValue(vertices, Y));
	// LIST_PUT(vertices);
	context.beginPath();
	changeState(context, "lineWidth", 2);
	changeState(context, "strokeStyle", getValue(entity, COLOR).toString(16));
	context.fill();
	context.stroke();
	context.closePath();
}

function setupDraw(entity, callback) {
	var x = getValue(entity, X);
	var y = getValue(entity, Y);
	var angle = getValue(entity, ANGLE) || 0;
	context.save();
	context.translate(x, y);
	context.rotate(angle * Math.PI / 180);
	callback(entity);
	context.restore();
}

function reposition(graphic, entity) {
	graphic.position.x = getValue(entity, X);
	graphic.position.y = getValue(entity, Y);
	graphic.rotation = getValue(entity, ANGLE) * Math.PI / 180;
}

function drawStage() {
	renderer.render(stage);
}
// end functions

// other
document.addEventListener("DOMContentLoaded", function(event) {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
});
// ENGINE_ONCE("UIReady", function() {
// 	stage = new PIXI.Stage();
// 	renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, true);
// 	// amount = (renderer instanceof PIXI.WebGLRenderer) ? 50 : 5;
// 	// if (amount == 5) {
// 	// 	renderer.context.mozImageSmoothingEnabled = false;
// 	// 	renderer.context.webkitImageSmoothingEnabled = false;
// 	// }

// 	EMIT_EVENT("RenderReady");
// });
document.addEventListener("resize", function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
// end other

// return
// end return