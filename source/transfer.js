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
				var bufferY = 0;
				var bufferX = 0;
				var translatedX = ((door.mapX - room.mapX) * segmentsPerRoom);
				var translatedY = ((door.mapY - room.mapY) * segmentsPerRoom);
				// console.log(player.x, player.y)
				if (door.dir === "N") {
					translatedX += Math.floor(segmentsPerRoom/2);
					bufferY = player.h*1.2;
					player.y = player.h;
					player.x = (player.x % (roomSize  * tileSize)) + (translatedX * tileSize);
				}
				if (door.dir === "E") {
					console.log(translatedY, room.mapY, door.mapY)
					translatedY += Math.floor(segmentsPerRoom/2);
					translatedX += segmentsPerRoom;
					bufferY = -player.w;
					player.x = (room.mapW * roomSize * tileSize * segmentsPerRoom) - (player.w*2);
					player.y = (player.y % (roomSize  * tileSize)) + (translatedY * tileSize);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(segmentsPerRoom/2);
					translatedY += segmentsPerRoom;
					bufferY = -player.h*1.2;
					player.y = (room.mapH * roomSize * tileSize * segmentsPerRoom) - (player.h*2);
					player.x = (player.x % (roomSize  * tileSize)) + (translatedX * tileSize);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(segmentsPerRoom/2);
					console.log(room.mapY, door.mapY)
					bufferY = player.w;
					player.x = player.w;
					player.y = (player.y % (roomSize  * tileSize)) + (translatedY * tileSize);
				}
				// player.x = (((door.mapX - room.mapX) * segmentsPerRoom) * roomSize * tileSize) + bufferX;
				// player.y = (((door.mapY - room.mapY) * segmentsPerRoom) * roomSize * tileSize) + bufferY;
				// console.log(player.x, player.y)
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
			translatedX += Math.floor(segmentsPerRoom/2);
		}
		if (door.dir === "E") {
			translatedY += Math.floor(segmentsPerRoom/2);
			translatedX += segmentsPerRoom;
		}
		if (door.dir === "S") {
			translatedX += Math.floor(segmentsPerRoom/2);
			translatedY += segmentsPerRoom;
		}
		if (door.dir === "W") {
			translatedY += Math.floor(segmentsPerRoom/2);
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
			movePlayer(door.room2, "E", door.mapY);
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
			movePlayer(door.room2, "S", door.mapX);
		}
		if (player.x + player.w >= roomWidth && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
			console.log("Collision with right door");
			movePlayer(door.room2, "W", door.mapY);
		}
		if (player.y + player.h >= roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY2) {
			console.log("Collision with bottom door");
			movePlayer(door.room2, "N", door.mapX);
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
}