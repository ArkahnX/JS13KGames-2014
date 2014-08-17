var canvas, context;
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

function drawImg(entity, x, y) {
	if (entity.img !== null) {
		context.drawImage(entity.img, entity.x || x, entity.y || y, entity.w, entity.h);
	}
}

function DOMLoaded() {
	canvas = getByType(getElementById, "canvas");
	context = canvas.getContext("2d");
	resizeCanvas();
	createMap();
	loop();
}

function parseViewPort() {
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

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function handleKeyDown(event) {
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
}

function testHit(entity) {
	var xAlignment = entity.x % 16;
	var yAlignment = entity.y % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var topLeft = coordinate(modulus(entity.x), modulus(entity.y), numMapTiles);
	var topRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y), numMapTiles);
	var midLeft = coordinate(modulus(entity.x), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var midRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), numMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), numMapTiles);
	context.fillStyle = "#FFFFFF";
	if (map[aboveLeft] === 0) {
		context.fillStyle = "#FF0000";
	}
	// context.fillRect(modulus(entity.x) * 16 - 2, modulus(entity.y - (entity.h / 2)) * 16 - 2, 16 + 4, 16 + 4);
	if (map[topLeft] === 0) {

	}
	if (map[midLeft] === 0) {

	}
	if (map[bottomLeft] === 0) {}
	if (xAlignment !== 0) {
		context.fillStyle = "#FFFFFF";
		if (map[aboveRight] === 0) {
			context.fillStyle = "#0000FF";
		}
		// context.fillRect(modulus(entity.x + entity.w) * 16 - 2, modulus(entity.y - (entity.h / 2)) * 16 - 2, 16 + 4, 16 + 4);
		if (map[topRight] === 0) {

		}
		if (map[midRight] === 0) {

		}
		if (map[bottomRight] === 0) {}
	}



	// console.log(map[bottomLeft], modulus(entity.x), modulus(entity.y + entity.h), "-", map[bottomRight], modulus(entity.x + entity.w), modulus(entity.y + entity.h))
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
document.addEventListener("frame", trigger);