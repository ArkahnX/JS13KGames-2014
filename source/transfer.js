var currentMap = null;
var mapWidth = 0;
var mapHeight = 0;
var transitionDirection = 0;
var transitionPosition = 0;

function movePlayer(room, direction, position) {
	for (var i = 0; i < room.doors.length; i++) {
		var match = false;
		var door = room.doors[i];
		if (door.dir === direction) {
			if (door.dir === "N" || door.dir === "S") {
				match = position === door.mapX;
			}
			if (door.dir === "E" || door.dir === "W") {
				match = position === door.mapY;
			}
			if (match) {
				var translatedX = ((door.mapX - room.mapX) * segmentsPerRoom);
				var translatedY = ((door.mapY - room.mapY) * segmentsPerRoom);
				// console.log(player.x, player.y)
				if (player.y === -1) {
					player.y = translatedY * roomSize * tileSize + (roomSize / 2 * tileSize);
				}
				if (player.x === -1) {
					player.x = translatedX * roomSize * tileSize + (roomSize / 2 * tileSize);
				}
				if (door.dir === "N") {
					translatedX += Math.floor(segmentsPerRoom / 2);
					player.y = 0;
					if (door.doorType !== 0) {
						player.y = tileSize;
					}
					player.x = (player.x % (roomSize * tileSize)) + (translatedX * roomSize * tileSize);
				}
				if (door.dir === "E") {
					translatedY += Math.floor(segmentsPerRoom / 2);
					translatedX += segmentsPerRoom;
					player.x = (room.mapW * roomSize * tileSize * segmentsPerRoom) - (player.w);
					if (door.doorType !== 0) {
						player.x -= tileSize;
					}
					player.y = (player.y % (roomSize * tileSize)) + (translatedY * roomSize * tileSize);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(segmentsPerRoom / 2);
					translatedY += segmentsPerRoom;
					player.y = (room.mapH * roomSize * tileSize * segmentsPerRoom) - (player.h);
					if (door.doorType !== 0) {
						player.y -= tileSize;
					}
					player.x = (player.x % (roomSize * tileSize)) + (translatedX * roomSize * tileSize);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(segmentsPerRoom / 2);
					player.x = 0;
					if (door.doorType !== 0) {
						player.x = tileSize;
					}
					player.y = (player.y % (roomSize * tileSize)) + (translatedY * roomSize * tileSize);
				}
			}
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * segmentsPerRoom);
		var translatedY = ((door.mapY - currentRoom.mapY) * segmentsPerRoom);
		var playerX = modulus(modulus(player.x), roomSize);
		var playerX2 = modulus(modulus(player.x + player.w), roomSize);
		var playerY = modulus(modulus(player.y), roomSize);
		var playerY2 = modulus(modulus(player.y + player.h), roomSize);
		var roomWidth = currentRoom.mapW * roomSize * tileSize * segmentsPerRoom;
		var roomHeight = currentRoom.mapH * roomSize * tileSize * segmentsPerRoom;
		if (door.dir === "N") {
			translatedX += Math.floor(segmentsPerRoom / 2);
		}
		if (door.dir === "E") {
			translatedY += Math.floor(segmentsPerRoom / 2);
			translatedX += segmentsPerRoom;
		}
		if (door.dir === "S") {
			translatedX += Math.floor(segmentsPerRoom / 2);
			translatedY += segmentsPerRoom;
		}
		if (door.dir === "W") {
			translatedY += Math.floor(segmentsPerRoom / 2);
		}
		if (window.performance.now() - player.doorCooldown > 400) {
			if (player.x <= 0 && player.xDirection === LEFT && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with left door");
				enterRoom(door.room2, "E", door.mapY);
			}
			if (player.y <= 0 && player.yDirection === JUMPING && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with top door");
				enterRoom(door.room2, "S", door.mapX);
			}
			if (player.x + player.w >= roomWidth && player.xDirection === RIGHT && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
				// console.log("Collision with right door");
				enterRoom(door.room2, "W", door.mapY);
			}
			if (player.y + player.h >= roomHeight && player.yDirection !== IDLE && Math.abs(player.yAccel) > 5 && door.dir === "S" && translatedX === playerX && (translatedY === playerY2 || translatedY === playerY)) {
				// console.log(player.yAccel)
				// console.log(window.performance.now() - player.doorCooldown)
				// console.log("Collision with bottom door");
				enterRoom(door.room2, "N", door.mapX);
			}
		}
	}
}

var transitionRoom = null;
var transitionBetweenRooms = false;
var transitionCanvas = document.createElement("canvas");
var transitionContext = transitionCanvas.getContext("2d");
document.body.appendChild(transitionCanvas);
transitionCanvas.style.right = "initial";
transitionCanvas.style.border = "1px solid black";
var stage = 0;
var FPS = 1;

function transition() {
	if (transitionBetweenRooms) {
		if (currentRoom === null) {
			stage = FPS;
		}
		var width = playerCanvas.width;
		var height = playerCanvas.height;
		if (stage < FPS) {

			var canvasWidth = width * stage / FPS;
			canvasWidth = width - canvasWidth;
			var canvasHeight = height * stage / FPS;
			canvasHeight = height - canvasHeight;

		}
		if (stage >= FPS) {
			if (currentRoom !== transitionRoom) {
				borderContext.clearRect(0, 0, width, height);
				tileContext.clearRect(0, 0, width, height);
				currentRoom = transitionRoom;
				// collectKey(transitionRoom);
				currentRoom.visited = true;
				currentMapTiles = transitionRoom.map.tiles;
				currentMap = transitionRoom.map.map;
				mapHeight = transitionRoom.map.height * roomSize;
				mapWidth = transitionRoom.map.width * roomSize;
				realMapHeight = transitionRoom.map.height * roomSize * tileSize;
				realMapWidth = transitionRoom.map.width * roomSize * tileSize;
				movePlayer(transitionRoom, transitionDirection, transitionPosition);
			}
			var canvasWidth = width * (stage - FPS) / FPS;
			var canvasHeight = height * (stage - FPS) / FPS;
		}
		transitionCanvas.width = width;
		transitionCanvas.height = height;
		transitionContext.clearRect(0, 0, width, height);
		drawWorld();
		drawMap();
		transitionContext.drawImage(tileCanvas, 0, 0);
		transitionContext.drawImage(borderCanvas, 0, 0);
		transitionContext.drawImage(playerCanvas, 0, 0);
		// if(stage > 3) {
		// console.log(tileCanvas.toDataURL(), width, height);
		// transitionBetweenRooms = false;
		// }
		playerContext.clearRect(0, 0, width, height);
		borderCanvas.style.display = "none";
		tileCanvas.style.display = "none";
		// borderContext.clearRect(0, 0, width, height);
		// tileContext.clearRect(0, 0, width, height);
		transitionContext.globalCompositeOperation = "destination-in";
		// var startX = ((width - canvasWidth) / 2);
		// var startY = ((height - canvasHeight) / 2);
		var startX = ((player.x + (player.w / 2)) - viewPortX) - ((canvasWidth) / 2);
		var startY = ((player.y + (player.h / 2)) - viewPortY) - ((canvasHeight) / 2);
		transitionContext.beginPath();
		transitionContext.rect(startX, startY, canvasWidth, canvasHeight);
		transitionContext.fillStyle = "black";
		transitionContext.fill();
		playerContext.drawImage(transitionCanvas, 0, 0);

		stage += (FPS * 2) * (dt / 1000);
		if (stage > FPS * 2) {
			stage = 0;
			runGameLoop = true;
			transitionRoom = null;
			transitionBetweenRooms = false;
			borderCanvas.style.display = "block";
			tileCanvas.style.display = "block";
			player.doorCooldown = window.performance.now();
			document.title = currentRoom.mapColor.name;
			history.pushState(null, null, "#" + document.title);
		}
	}
}

function enterRoom(room, direction, position) {
	transitionDirection = direction;
	transitionPosition = position;
	transitionBetweenRooms = true;
	transitionRoom = room;
	runGameLoop = false;
	if (room.map === null) {
		playerSizedRoom(room);
	}
}