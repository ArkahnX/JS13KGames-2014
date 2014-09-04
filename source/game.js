var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas;
var getElementById = 0;
var querySelector = 1;
var querySelectorAll = 2;
var runGameLoop = true;
var animate = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};

var player = {
	x: 151,
	y: tileSize * 3,
	w: tileSize,
	h: tileSize * 2,
	img: null,
	xDirection: 0,
	yDirection: 1,
	xAccel: 0,
	yAccel: 0,
	maxAccel: 5,
	jumpForce: 7,
	jumpHeight: 50,
	jumpStart: 0,
	jumping: 0,
	jumpsUsed: 0,
	heightTraveled: 0,
	maxJumps: 1,
	angle: 0,
	health: 5,
	doorCooldown: window.performance.now(),
	maxHealth: 5,
	keys: []
}
var dt = currentTick - lastTick;
var entities = [player];
var keys = {
	a: 65,
	w: 87,
	s: 83,
	d: 68,
	space: 32,
	shift: 16,
	ctrl: 17,
	alt: 18,
	tab: 9,
	debug: 192
};

function listen(eventName, fn) {
	if (!events[eventName]) {
		events[eventName] = [];
	}
	events[eventName].push(fn);
}

// function entity(x, y, w, h, img, moveable) {
// 	var entity = {
// 		x: x,
// 		y: y,
// 		w: w,
// 		h: h,
// 		angle: 0,
// 		img: img
// 	};
// 	if (moveable) {
// 		entity.xDirection = 0;
// 		entity.yDirection = 0;
// 		entity.xAccel = 0;
// 		entity.yAccel = 1;
// 		entity.maxAccel = 5;
// 	}
// 	if (moveable) {
// 		entity.jumpForce = 7;
// 		entity.jumpHeight = 50;
// 		entity.jumpStart = 0;
// 		entity.jumping = 0;
// 		entity.jumpsUsed = 0;
// 		entity.maxJumps = 3;
// 	}
// 	return (entity);
// }

function trigger(event) {
	var eventName = event.type;
	if (events[eventName] && events[eventName].length > 0) {
		for (var i = 0; i < events[eventName].length; i++) {
			events[eventName][i](event);
		}
	}
}

function getByType(id) {
	return document.getElementById(id);
}



function DOMLoaded() {
	playerCanvas = getByType("p");
	borderCanvas = getByType("b");
	tileCanvas = getByType("t");
	minimapCanvas = getByType("m");
	miniMapIconsCanvas = getByType("i");
	playerContext = playerCanvas.getContext("2d");
	borderContext = borderCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	miniMapIconsContext = miniMapIconsCanvas.getContext("2d");
	resizeCanvas();
	startWorld();
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		if (r + 1 < regionColors.length) {
			addRegion();
		}
	}
	doors();
	var direction = "N";
	var door = world.rooms[0].doors[0];
	var position = door.mapX;
	if (door.dir === "N") {
		direction = "S";
	}
	if (door.dir === "E") {
		direction = "W";
		position = door.mapY;
	}
	if (door.dir === "W") {
		direction = "E";
		position = door.mapY;
	}
	enterRoom(world.rooms[0], direction, position);
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = 300;
	} else {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = 300;
	} else {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = window.innerHeight;
	}
}



function eachFrame() {
	if (runGameLoop) {
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			handleXMovement(entity);
			entity.x = round(entity.x);
			entity.y = round(entity.y);
			testWalking(entity);
			testJumping(entity);
			handleJump(entity);
			testDoors();
			testFalling(entity);
		}
		parseViewPort();
		borderContext.strokeStyle = currentRoom.mapColor.border;
		borderContext.lineWidth = 2;
		playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
		borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
		drawMap();
		drawWorld();
	}
}



function loop() {
	currentTick = window.performance.now();
	dt = currentTick - lastTick;
	lastTick = currentTick;
	document.dispatchEvent(frameEvent);
	if (animate) {
		requestAnimationFrame(loop);
	}
}

// canvas.addEventListener("mousedown")
listen("keydown", handleKeyDown);
listen("keyup", handleKeyUp);
listen("resize", resizeCanvas);
listen("DOMContentLoaded", DOMLoaded);
listen("frame", eachFrame);
listen("frame", transition);
window.addEventListener("resize", trigger);
document.addEventListener("DOMContentLoaded", trigger);
document.addEventListener("mousedown", trigger);
document.addEventListener("mouseup", trigger);
document.addEventListener("keydown", trigger);
document.addEventListener("keyup", trigger);
document.addEventListener("frame", trigger);