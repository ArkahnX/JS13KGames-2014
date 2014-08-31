var currentMap = null;
var mapWidth = 0;
var mapHeight = 0;

function movePlayer(room, direction, position) {
	enterRoom(room);
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
				if (door.dir === "N") {
					translatedX += Math.floor(segmentsPerRoom / 2);
					player.y = 0;
					player.x = (player.x % (roomSize * tileSize)) + (translatedX * roomSize * tileSize);
				}
				if (door.dir === "E") {
					translatedY += Math.floor(segmentsPerRoom / 2);
					translatedX += segmentsPerRoom;
					player.x = (room.mapW * roomSize * tileSize * segmentsPerRoom) - (player.w);
					player.y = (player.y % (roomSize * tileSize)) + (translatedY * roomSize * tileSize);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(segmentsPerRoom / 2);
					translatedY += segmentsPerRoom;
					player.y = (room.mapH * roomSize * tileSize * segmentsPerRoom) - (player.h);
					player.x = (player.x % (roomSize * tileSize)) + (translatedX * roomSize * tileSize);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(segmentsPerRoom / 2);
					player.x = 0;
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
				movePlayer(door.room2, "E", door.mapY);
			}
			if (player.y <= 0 && player.yDirection === JUMPING && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with top door");
				movePlayer(door.room2, "S", door.mapX);
			}
			if (player.x + player.w >= roomWidth && player.xDirection === RIGHT && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
				// console.log("Collision with right door");
				movePlayer(door.room2, "W", door.mapY);
			}
			if (player.y + player.h >= roomHeight && player.yDirection !== IDLE  && Math.abs(player.yAccel) > 5 && door.dir === "S" && translatedX === playerX && (translatedY === playerY2 || translatedY === playerY)) {
				// console.log(player.yAccel)
			// console.log(window.performance.now() - player.doorCooldown)
				// console.log("Collision with bottom door");
				movePlayer(door.room2, "N", door.mapX);
			}
		}
	}
}

function enterRoom(room) {
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentRoom = room;
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	mapHeight = room.map.height * roomSize;
	mapWidth = room.map.width * roomSize;
	realMapHeight = room.map.height * roomSize * tileSize;
	realMapWidth = room.map.width * roomSize * tileSize;
	player.doorCooldown = window.performance.now();
}