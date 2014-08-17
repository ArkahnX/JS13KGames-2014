function drawImg(entity, x, y) {
	if (entity.img !== null) {
		context.drawImage(entity.img, entity.x || x, entity.y || y, entity.w, entity.h);
	}
}

function drawMap() {
	var sample = 0;
	for (var y = 0; y < numMapTiles; y++) {
		for (var x = 0; x < numMapTiles; x++) {
			sample++;
			// console.log("X and Y: ", x, y, coordinate(x, y, numMapTiles), coordinate(x, y, roomSize));
			// console.log("Tile: ", map[coordinate(x, y, numMapTiles)], "-", Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize))
			if (map[coordinate(x, y, numMapTiles)] !== 0) {
				// console.log(tilePosition(i, e), (i * width) + e, i, e)
				drawTile(x, y);
				// drawImg(tile1, i * 16, e * 16);
			}
			context.fillStyle = '#000';
			context.font = '5pt Calibri';
			// context.fillText((x % roomSize) + "-" + (y % roomSize), x * 16, (y+0.6) * 16);
			context.fillText(coordinate(x, y, numMapTiles), x * 16, (y + 0.6) * 16);
		}
	}
	// console.log(sample)
}

function drawTile(x, y) {
	context.fillStyle = '#FF9900';
	context.fillRect((x * 16) - viewPortX, (y * 16) - viewPortY, 16, 16);
	var leftTile = map[coordinate(x - 1, y, numMapTiles)];
	var topTile = map[coordinate(x, y - 1, numMapTiles)];
	var middleTile = map[coordinate(x, y, numMapTiles)];
	var rightTile = map[coordinate(x + 1, y, numMapTiles)];
	var bottomTile = map[coordinate(x, y + 1, numMapTiles)];
	if (x - 1 < 0) {
		leftTile = 0;
	}
	if (y - 1 < 0) {
		topTile = 0;
	}
	if (x + 1 > numMapTiles - 1) {
		rightTile = 0;
	}
	if (y + 1 > numMapTiles - 1) {
		bottomTile = 0;
	}

	if (topTile === 0 || isNaN(topTile)) {
		drawLine(x * tileSize, y * tileSize, (x + 1) * tileSize, y * tileSize);
	}
	if (leftTile === 0 || isNaN(leftTile)) {
		drawLine(x * tileSize, y * tileSize, x * tileSize, (y + 1) * tileSize);
	}
	if (bottomTile === 0 || isNaN(bottomTile)) {
		drawLine(x * tileSize, (y + 1) * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
	}
	if (rightTile === 0 || isNaN(rightTile)) {
		drawLine((x + 1) * tileSize, y * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
	}

}

function drawLine(startX, startY, endX, endY) {
	context.beginPath();
	context.lineWidth = 2;
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.strokeStyle = '#ff0000';
	context.stroke();
	context.closePath();
}var canvas, context;
var domtypes = ["getElementById", "querySelector", "querySelectorAll"];
var getElementById = 0;
var querySelector = 1;
var querySelectorAll = 2;
var runGameLoop = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};
var JUMPING = -1;
var FALLING = 1;
var IDLE = 0;
var RIGHT = 1;
var LEFT = -1;

var player = {
	x: 16 * 5,
	y: 16 * 3,
	w: 16,
	h: 32,
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
	maxJumps: 3,
	angle: 0
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
}

function listen(eventName, fn) {
	if (!events[eventName]) {
		events[eventName] = [];
	}
	events[eventName].push(fn);
}

function entity(x, y, w, h, img, moveable, jumpable) {
	var entity = {
		x: x,
		y: y,
		w: w,
		h: h,
		angle: 0,
		img: img
	};
	if (moveable) {
		entity.xDirection = 0;
		entity.yDirection = 0;
		entity.xAccel = 0;
		entity.yAccel = 1;
		entity.maxAccel = 5;
	}
	if (moveable) {
		entity.jumpForce = 7;
		entity.jumpHeight = 50;
		entity.jumpStart = 0;
		entity.jumping = 0;
		entity.jumpsUsed = 0;
		entity.maxJumps = 3;
	}
	return (entity);
}

function trigger(event) {
	var eventName = event.type;
	if (events[eventName] && events[eventName].length > 0) {
		for (var i = 0; i < events[eventName].length; i++) {
			events[eventName][i](event);
		}
	}
}

function getByType(type, id) {
	return document[domtypes[type]](id);
}



function DOMLoaded() {
	canvas = getByType(getElementById, "canvas");
	context = canvas.getContext("2d");
	resizeCanvas();
	createMap();
	loop();
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}





function eachFrame(event) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		handleXMovement(entity);
		entity.x = ~~ (0.5 + entity.x);
		entity.y = ~~ (0.5 + entity.y);
		testWalking(entity);
		testJumping(entity);
		handleJump(entity);
		testFalling(entity);
		// drawImg(entity);
		// Physics.
		// if (map[(((entity.x - entity.x % 16) / 16) * width) + (entity.y / 16)] === 1) {
		// 	context.fillStyle = "#FF0000";
		// } else {
		// 	context.fillStyle = "#FFFFFF";
		// }
		// context.fillRect((entity.x - entity.x % 16) / 16, entity.y, entity.w, entity.h);
		// context.fillStyle = "#000000";
		// context.fillRect(entity.x-viewPortX, entity.y-viewPortY, entity.w, entity.h);
		// testHit(entity);
	}
	parseViewPort();
	drawMap();
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		context.fillStyle = "#000000";
		context.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
	}
}



function loop() {
	currentTick = window.performance.now();
	dt = currentTick - lastTick;
	lastTick = currentTick;
	document.dispatchEvent(frameEvent);
	if (runGameLoop) {
		requestAnimationFrame(loop);
	}
}


var imageObj = new Image();

imageObj.onload = function() {
	player.img = imageObj;
};
imageObj.src = 'img/32x32.png';

var imageObj2 = new Image();

imageObj2.onload = function() {
	tile1.img = imageObj2;
};
imageObj2.src = 'img/16x16.png';

// canvas.addEventListener("mousedown")
listen("keydown", handleKeyDown);
listen("keyup", handleKeyUp);
listen("resize", resizeCanvas);
listen("DOMContentLoaded", DOMLoaded);
listen("frame", eachFrame);
window.addEventListener("resize", trigger);
document.addEventListener("DOMContentLoaded", trigger);
document.addEventListener("mousedown", trigger);
document.addEventListener("mouseup", trigger);
document.addEventListener("keydown", trigger);
document.addEventListener("keyup", trigger);
document.addEventListener("frame", trigger);function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulus(num) {
	var mod = num % 16;
	return (num - mod) / 16;
}function handleKeyDown(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = FALLING;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xDirection = RIGHT;
	} else if (event.keyCode === keys.a) {
		player.xDirection = LEFT;
	}
}

function handleKeyUp(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = IDLE;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xDirection = IDLE;
			}
		} else {
			player.xDirection = IDLE;
		}
	}
}var map = [];
var evenNumber = 0;
var mapSize = 160;
var tileSize = 16;
var numMapTiles = 30;
var width = numMapTiles;
var height = numMapTiles;
var roomSize = 10;
var roomList = [];
var viewPortX = 0;
var viewPortY = 0;
var minViewPortX = 0;
var minViewPortY = 0;
var room1 = [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 0, 0, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 0, 32, 32, 0, 32, 32, 32, 32, 32, 0, 0, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 32];
var room2 = [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1];
roomList.push(room2);
var spareArray = [];
var blankArray = [];
for (var i = 0; i < 100; i++) {
	blankArray[i] = 0;
}

function flip(room, width, height, vertical, horizontal) {
	spareArray.length = room.length;
}

function rotate(room, width, height, times) {
	spareArray.length = 0;
	var startX = 0;
	var startY = 0;
	var endX = width;
	var endY = height;
	var position = 0;
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (times === 0) {
				position = coordinate(x, y, roomSize);
			}
			if (times === 1) {
				position = coordinate(y, (width - x) - 1, roomSize);
			}
			if (times === 2) {
				position = coordinate(width - x - 1, height - y - 1, roomSize);
			}
			if (times === 3) {
				position = coordinate(height - y - 1, x, roomSize);
			}
			spareArray[coordinate(x, y, roomSize)] = room[position];
		}
	}
	return spareArray.slice(0);
}

function coordinate(x, y, size) {
	return (y * size + x);
}

var rooms = {};

function createMap() {
	var room;
	for (var y = 0; y < numMapTiles; y++) {
		for (var x = 0; x < numMapTiles; x++) {
			var roomId = Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize);
			if (x % roomSize === 0 || y % roomSize === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					room = roomList[random(0,roomList.length-1)];
					rooms[roomId] = rotate(room, roomSize, roomSize, rotation);
					// console.log(Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize), x, y)
				}
				room = rooms[roomId];
				// console.log(room)
			}
			// if ((y * numMapTiles + x) % (roomSize * roomSize) === 0) {
			// 	// room = rotate(room1, roomSize, roomSize, random(0, 3));
			// 	room = rotate(room1, roomSize, roomSize, 0);
			// 	console.log(room)
			// }
			// X and Y for room arent being calculated properly
			// console.log("X and Y: ", x, y, "map coord: ", coordinate(x, y, numMapTiles), "room coord: ", coordinate(x % roomSize, y % roomSize, roomSize));
			// console.log("Tile: ", room[coordinate(x % roomSize, y % roomSize, roomSize)], "-", roomId)
			map[coordinate(x, y, numMapTiles)] = room[coordinate(x % roomSize, y % roomSize, roomSize)];
			// console.log(x * numMapTiles + y)1
			// console.log((i * 10 + e) % 100,(e + 1) * (i + 1))
			// console.log(i,e,tilePosition(i, e, width),tilePosition(i, e, 10) % 100)
			// console.log(((i ) * width) + (e ))
			// room = rotate(room1, 10, 10, 3);
			// map = map.concat(room);
			// console.log(map, room)
			// for (var x = 0; x < 10; x++) {
			// for (var y = 0; y < 10; y++) {
			// console.log(tilePosition((10 * (i)) + (1 * x), (10 * (e)) + (1 * y)), (10 * (i)) + (1 * x), (10 * (e)) + (1 * y), i, e, (((i)) + (1 * x) * (width)) + (10 * (e)) + (1 * y))
			// console.log
			// map[tilePosition((10 * i) + x, (1 * e) + y)] = room[tilePosition(x, y)];
			// map[(e * width + i) * 10] = room[tilePosition(x, y)];
			// }
			// }
		}
	}
	// console.log(width, height, room1, map.length)
	// console.log(map)
}

// function createMap() {
// 	for (var i = 0; i < width; i++) {
// 		for (var e = 0; e < height; e++) {
// 			map[(i * width) + e] = 0;
// 			if (e > height / 5) {
// 				map[(i * width) + e] = random(0, 1);
// 			}
// 			if (e > height / 4) {
// 				map[(i * width) + e] = random(0, 2);
// 			}
// 			if (e > height / 3) {
// 				map[(i * width) + e] = random(0, 3);
// 			}
// 			if (e > height / 2) {
// 				map[(i * width) + e] = random(0, 4);
// 			}
// 			if (e > height / 1.5) {
// 				map[(i * width) + e] = 0;
// 			}
// 			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
// 				map[(i * width) + e] = 1;
// 			}
// 		}
// 	}
// }

// function randomizeMap() {
// 	for (var i = 0; i < width; i++) {
// 		for (var e = 0; e < height; e++) {
// 			// map[(i * width) + e] = 0;
// 			if (e > height / 5 && e < height / 4) {
// 				if (evenNumber % 8 === 0) {
// 					map[(i * width) + e] = random(0, 1);
// 				}
// 			}
// 			if (e > height / 4 && e < height / 3) {
// 				if (evenNumber % 10 === 0) {
// 					map[(i * width) + e] = random(0, 2);
// 				}
// 			}
// 			if (e > height / 3 && e < height / 2) {
// 				if (evenNumber % 8 === 0) {
// 					map[(i * width) + e] = random(0, 3);
// 				}
// 			}
// 			if (e > height / 2 && e < height / 1.5) {
// 				if (evenNumber % 10 === 0) {
// 					map[(i * width) + e] = random(0, 4);
// 				}
// 			}
// 			if (e > height / 1.5) {
// 				// map[(i * width) + e] = 0;
// 			}
// 			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
// 				map[(i * width) + e] = 1;
// 			}
// 		}
// 	}
// }
var tiles = [];
var tile1 = {
	w: 16,
	h: 16,
	img: null,
	angle: 0
}

function tilePosition(x, y, dimention) {
	return (y * dimention || height) + x;
}




function handleXMovement(entity) {
	entity.xAccel = entity.xAccel + (entity.xDirection / 60 * dt);
	if (entity.xAccel > entity.maxAccel) {
		entity.xAccel = entity.maxAccel;
	}
	if (entity.xAccel < -entity.maxAccel) {
		entity.xAccel = -entity.maxAccel;
	}
	if (entity.xDirection === 0) {
		if (entity.xAccel > 0) {
			entity.xAccel = entity.xAccel + ((LEFT * 2 / 60) * dt);
		} else if (entity.xAccel < 0) {
			entity.xAccel = entity.xAccel + ((RIGHT * 2 / 60) * dt);
		}
		if (entity.xAccel < ((RIGHT / 60) * dt) && entity.xAccel > ((LEFT / 60) * dt)) {
			entity.xAccel = 0;
		}
	}
	entity.x = entity.x + entity.xAccel;
}

function handleJump(entity) {
	if (entity.jumping && (entity.yDirection !== JUMPING && entity.jumpsUsed < entity.maxJumps)) {
		entity.yDirection = JUMPING;
		entity.yAccel = -entity.jumpForce;
		entity.jumpStart = entity.y;
		entity.jumpsUsed++;
	}
	if (entity.yDirection === IDLE || !entity.jumping || entity.jumpStart - entity.y > entity.jumpHeight) {
		entity.yDirection = FALLING;
	}
	if (entity.yDirection === FALLING) {
		entity.jumping = IDLE;
		entity.yAccel = entity.yAccel + ((entity.jumpForce / 2) / 60 * dt); // falling
	}

	if (entity.yDirection === IDLE) {
		if (entity.yAccel > 0) {
			entity.yAccel = entity.yAccel + ((JUMPING / 60) * dt);
		} else if (entity.yAccel < 0) {
			entity.yAccel = entity.yAccel + ((FALLING / 60) * dt);
		}
		if (entity.yAccel < ((FALLING / 60) * dt) && entity.yAccel > ((JUMPING / 60) * dt)) {
			entity.yAccel = 0;
		}
	}
	if (entity.yAccel > entity.maxAccel) {
		entity.yAccel = 10;
	}
	entity.y = entity.y + entity.yAccel;
	// if (entity.y > 400) {
	// 	entity.y = 400;
	// 	entity.yAccel = 0;
	// 	entity.yDirection = 0;
	// 	entity.jumpsUsed = 0;
	// 	entity.jumping = 0;
	// }
}

function testFalling(entity) {
	var xAlignment = entity.x % 16;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), numMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), numMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = map[bottomLeft];
	} else {
		falling = map[bottomRight] !== 0 || map[bottomLeft] !== 0;
	}
	if ((falling || entity.y + entity.h > height * 16) && entity.yDirection === FALLING) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = 0;
		entity.yDirection = 0;
		entity.jumpsUsed = 0;
		entity.jumping = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var jumping = false;
	if (xAlignment === 0) {
		jumping = map[aboveLeft];
	} else {
		jumping = map[aboveLeft] !== 0 || map[aboveRight] !== 0;
	}
	if (jumping && entity.jumping === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = 0;
		entity.yDirection = FALLING;
		entity.jumping = 0;
	}
}

function testWalking(entity) {
	var yAlignment = entity.y % 16;
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var topLeft = coordinate(modulus(entity.x), modulus(entity.y), numMapTiles);
	var topRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y), numMapTiles);
	var midLeft = coordinate(modulus(entity.x), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var midRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), numMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), numMapTiles);
	var walkLeft = false;
	var walkRight = false;
	if (yAlignment === 0) {
		walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0;
		walkRight = map[midRight] !== 0 || map[topRight] !== 0;
	} else {
		if (modulus(entity.y + entity.h) * 16 > entity.y + entity.h) {
			walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0 || map[aboveLeft] !== 0;
			walkRight = map[midRight] !== 0 || map[topRight] !== 0 || map[aboveRight] !== 0;
		} else {
			walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0 || map[bottomLeft] !== 0;
			walkRight = map[midRight] !== 0 || map[topRight] !== 0 || map[bottomRight] !== 0;
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP LEFT")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	}
}function parseViewPort() {
	var deadZoneX = canvas.width / 2;
	var deadZoneY = canvas.height / 2;
	if (player.x - viewPortX + deadZoneX > canvas.width) {
		viewPortX = player.x - (canvas.width - deadZoneX);
	} else if (player.x - deadZoneX < viewPortX) {
		viewPortX = player.x - deadZoneX;
	}
	if (player.y - viewPortY + deadZoneY > canvas.height) {
		viewPortY = player.y - (canvas.height - deadZoneY);
	} else if (player.y - deadZoneY < viewPortY) {
		viewPortY = player.y - deadZoneY;
	}
	// if (!(0 <= viewPortX &&
	// 	width * 16 >= viewPortX + canvas.width &&
	// 	0 <= viewPortY &&
	// 	height * 16 >= viewPortY + canvas.height)) {
	// 	if (viewPortX < 0) {
	// 		viewPortX = 0;
	// 	}
	// 	if (viewPortY < 0) {
	// 		viewPortY = 0;
	// 	}
	// 	if (viewPortX + canvas.width > width * 16) {
	// 		viewPortX = (width / 2 * 16) - deadZoneX;
	// 	}
	// 	if (viewPortY + canvas.height > height * 16) {
	// 	console.log(true)
	// 		viewPortY = (height / 2 * 16) - deadZoneY;
	// 	}
	// }
	viewPortY = ~~ (0.5 + viewPortY);
	viewPortY = ~~ (0.5 + viewPortY);
	// viewPortX = (window.innerWidth / 2) - (width*16) + player.x;
	// viewPortX = player.x;
	// viewPortY = (window.innerHeight / 2) - (height*16) + player.y;
	// viewPortY = player.y;
	// if(viewPortX < (window.innerWidth-(width*16))/2) {
	// viewPortX = 0;
	// }
	// if(viewPortY < (window.innerHeight-(height*16))/2) {
	// viewPortY = (window.innerHeight-(height*16))/2;
	// }
}