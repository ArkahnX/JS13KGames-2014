var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas, colorCircles;
var runGameLoop = true;
var animate = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};
var BEGINPATH = "beginPath";
var player = {
	x: -1,
	y: -1,
	w: tileSize,
	h: tileSize * 2,
	img: null,
	xDirection: 0,
	yDirection: 1,
	xAccel: 0,
	yAccel: 0,
	maxAccel: 5,
	jumpForce: 7,
	jumpHeight: tileSize * 3.125,
	jumpStart: 0,
	jumping: 0,
	jumpsUsed: 0,
	heightTraveled: 0,
	maxJumps: 1,
	angle: 0,
	health: 5,
	doorCooldown: window.performance.now(),
	maxHealth: 5,
	// keys: [0,1,2,3,4]
	keys: []
};
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
	colorCircles = getByType("clr");
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
	create();
	var previousRegion = null;
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(5, 10);
		// var rooms = random(1, 2);
		for (var i = 0; i < rooms; i++) {
			createRoom();
		}
		// if (previousRegion) {
		// 	while (world.regions[world.regions.length - 1].borders.indexOf(previousRegion) === -1) {
		// 		createRoom();
		// 	}
		// }
		if (r + 1 < regionColors.length) {
			previousRegion = world.regions[world.regions.length - 1];
			startNewRegion(nextRegion(), previousRegion);
			// startNewRegion(nextRegion());
		}
	}
	startNewRegion(nextRegion(), world.regions[0]);
	var rooms = random(5, 10);
	// var rooms = random(1, 2);
	for (var i = 0; i < rooms; i++) {
		createRoom();
	}
	var room = world.regions[0].rooms[0];
	var door = room.doors[0];
	var direction = door.dir;
	var position = door.mapX;
	room.startRoom = true;
	room.startPositionX = position - room.mapX;
	room.startPositionY = door.mapY - room.mapY;
	if (door.dir === "E" || door.dir === "W") {
		position = door.mapY;
	}
	clearDoorTypes();
	assignDoorTypes();
	enterRoom(room, direction, position);
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
		processShot();
		placeBlock();
		for (var i = 0; i < bullets.length; i++) {
			bulletPhysics(bullets[i]);
		}
		playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
		borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
		drawMap();
		drawWorld();
		drawArrow();
		drawBullets();
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
listen("mousemove", mousePosition);
listen("mousedown", click);
listen("mouseup", release);
listen("contextmenu", place);
window.addEventListener("resize", trigger);
document.addEventListener("DOMContentLoaded", trigger);
document.addEventListener("mousedown", trigger);
document.addEventListener("mouseup", trigger);
document.addEventListener("keydown", trigger);
document.addEventListener("keyup", trigger);
document.addEventListener("frame", trigger);
document.addEventListener("mousemove", trigger);
document.addEventListener("contextmenu", trigger);