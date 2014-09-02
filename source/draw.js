function drawMap() {
	var mapX1 = modulus(viewPortX) - 1;
	var mapY1 = modulus(viewPortY) - 1;
	var mapX2 = modulus(viewPortX) + modulus(playerCanvas.width) + 2;
	var mapY2 = modulus(viewPortY) + modulus(playerCanvas.height) + 2;
	if (mapX1 < 0) {
		mapX1 = 0;
	}
	if (mapY1 < 0) {
		mapY1 = 0;
	}
	if (mapX2 > currentMapTiles) {
		mapX2 = currentMapTiles;
	}
	if (mapY2 > currentMapTiles) {
		mapY2 = currentMapTiles;
	}
	for (var y = mapY1; y < mapY2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * tileSize * 2;
		var hasFloor = 0;
		var topTile;
		tileContext.fillStyle = currentRoom.mapColor.background;
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * tileSize;
				if (startX === -currentMapTiles * tileSize * 2) {
					startX = (x * tileSize) - viewPortX;
				}
				if (y - 1 < 0) {
					topTile = -1;
				} else {
					topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
				}
				if (topTile === 0) {
					hasFloor = 1;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				drawRect(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapLeft);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapRight);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapTop);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapBottom);
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * tileSize) - viewPortY;
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - (tileSize * 0.3125), rectWidth, tileSize + (tileSize * 0.3125));
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, tileSize);
	}
}

function parseVerticalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var x = mapX1; x < mapX2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * tileSize * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = mapY1; y < mapY2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === mapLeft) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === mapRight) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * tileSize;
				if (startPosition === -currentMapTiles * tileSize * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * tileSize) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * tileSize) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * tileSize) - viewPortX;
				var startX = canvasX;
				if (type === mapRight) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - (tileSize * 0.3125);
				}
				if (((type === mapRight && topRightTile === 0) || (type === mapLeft && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + (tileSize * 0.1875));
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var y = mapY1; y < mapY2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * tileSize * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = mapX1; x < mapX2; x++) {
			if (type === mapTop) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === mapBottom) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * tileSize;
				if (startPosition === -currentMapTiles * tileSize * 2) {
					startPosition = (x * tileSize) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * tileSize) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * tileSize) - viewPortY;
				if (type === mapTop) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - (tileSize * 0.3125), canvasX2, canvasY - (tileSize * 0.3125));
						drawLine(canvasX, canvasY + (tileSize * 0.1875), canvasX2, canvasY + (tileSize * 0.1875));
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === mapBottom) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}
}


var longestTime = 0;

function drawLine(startX, startY, endX, endY) {
	borderContext.moveTo(startX, startY);
	borderContext.lineTo(endX, endY);
}

var lastPlayerX = 0;
var lastPlayerY = 0;
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;
var lastRoomLength = 0;

function drawWorld() {
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.mapX * miniMapSize) + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) * miniMapSize) - miniViewPortX;
	miniMapPlayerY = (currentRoom.mapY * miniMapSize) + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) * miniMapSize) - miniViewPortY;
	if (currentRoom.mapX + modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) !== lastPlayerX || currentRoom.mapY + modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) !== lastPlayerY || lastRoomLength !== world.rooms.length) {
		minimapCanvas.width = 500;
		minimapCanvas.height = 500;
		minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
		drawnDoors.length = 0;
		minimapContext.lineWidth = 2;
		minimapContext.fillStyle = "#000";
		for (var r = 0; r < world.regions.length; r++) {
			for (var i = 0; i < world.regions[r].rooms.length; i++) {
				room = world.regions[r].rooms[i];
				roomX = (room.mapX * miniMapSize) - miniViewPortX;
				roomY = (room.mapY * miniMapSize) - miniViewPortY;
				if (roomX + (room.mapW * miniMapSize) > 0 && roomY + (room.mapH * miniMapSize) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
					minimapContext.beginPath();
					minimapContext.rect(roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
					minimapContext.fill();
					minimapContext.closePath();
				}
			}
		}
		forEachRoom("background", "border", function(room, roomX, roomY) {
			if (room.visited) {
				minimapContext.beginPath();
				minimapContext.rect(roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
				minimapContext.fill();
				minimapContext.stroke();
				minimapContext.closePath();
			}
		});
		forEachRoom(0, "background", drawDoors);
		forEachRoom(0, 0, drawIcons);
	}
	drawPlayer();
	lastPlayerX = currentRoom.mapX + modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom);
	lastPlayerY = currentRoom.mapY + modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom);
	lastRoomLength = world.rooms.length;
}

function forEachRoom(fillStyle, strokeStyle, fn) {
	for (var r = 0; r < world.regions.length; r++) {
		if (typeof fillStyle === "string") {
			minimapContext.fillStyle = world.regions[r].color[fillStyle];
		}
		if (typeof strokeStyle === "string") {
			minimapContext.strokeStyle = world.regions[r].color[strokeStyle];
		}
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			room = world.regions[r].rooms[i];
			roomX = (room.mapX * miniMapSize) - miniViewPortX;
			roomY = (room.mapY * miniMapSize) - miniViewPortY;
			if (roomX + (room.mapW * miniMapSize) > 0 && roomY + (room.mapH * miniMapSize) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				fn(room, roomX, roomY);
			}
		}
	}
}

var lockColors = []

function drawIcons(room) {
	if (room.visited) {
		var door = null;
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			var color = regionColors[door.doorType].lock;
			if (door.doorType > 0) {
				switch (door.dir) {
					case "N":
						drawCircle(miniMapSize * door.mapX + 5, miniMapSize * door.mapY, color);
						continue;
					case "S":
						drawCircle(miniMapSize * door.mapX + 5, miniMapSize * door.mapY + 16, color);
						continue;
					case "W":
						drawCircle(miniMapSize * door.mapX - 3, miniMapSize * door.mapY + 8, color);
						continue;
					case "E":
						drawCircle(miniMapSize * door.mapX + 13, miniMapSize * door.mapY + 8, color);
						continue;
					default:
						continue;
				}
			}
		}
		var color = regionColors[room.specialType].lock;
		if (room.specialType > 0) {
			drawCircle(miniMapSize * (room.mapX + room.mapW / 2) - 3, miniMapSize * (room.mapY + room.mapH / 2), "rgba(0,0,0,0)", color);
		}
	}
}

function drawCircle(centerX, centerY, color, border) {
	var radius = 3;
	minimapContext.beginPath();
	minimapContext.arc(centerX + radius - miniViewPortX, centerY - miniViewPortY, radius, 0, 2 * Math.PI, false);
	minimapContext.fillStyle = color;
	minimapContext.fill();
	if (border) {
		minimapContext.lineWidth = 2;
		minimapContext.strokeStyle = border;
		minimapContext.stroke();
	}
	minimapContext.closePath();
}

var drawnDoors = [];

function drawDoors(room) {
	if (room.visited) {
		var door = null;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			var ID = room.mapX + "-" + room.mapY + "-" + door.room2.mapX + "-" + door.room2.mapY;
			var ID2 = door.room2.mapX + "-" + door.room2.mapY + "-" + room.mapX + "-" + room.mapY;
			if (drawnDoors.indexOf(ID2) === -1 && drawnDoors.indexOf(ID) === -1) {
				var doorX = miniMapSize * door.mapX;
				var doorY = miniMapSize * door.mapY;

				if (door.dir === "N") {
					drawLine2(doorX + 4, doorY, doorX + miniMapSize - 4, doorY);
				}
				if (door.dir === "S") {
					drawLine2(doorX + 4, miniMapSize * (door.mapY + 1), doorX + miniMapSize - 4, miniMapSize * (door.mapY + 1));
				}
				if (door.dir === "W") {
					drawLine2(doorX, doorY + 4, doorX, doorY + miniMapSize - 4);
				}
				if (door.dir === "E") {
					drawLine2(miniMapSize * (door.mapX + 1), doorY + 4, miniMapSize * (door.mapX + 1), doorY + miniMapSize - 4);
				}
				drawnDoors.push(ID);
			}
		}
	}
}

function drawLine2(startX, startY, endX, endY) {
	minimapContext.beginPath();
	minimapContext.moveTo(startX - miniViewPortX, startY - miniViewPortY);
	minimapContext.lineTo(endX - miniViewPortX, endY - miniViewPortY);
	minimapContext.stroke();
	minimapContext.closePath();
}

var animationLoopProgress = 0;
var initPlayerCanvas = false;
var lastFrame = 0;

function drawPlayer() {
	if (!initPlayerCanvas) {
		miniMapIconsCanvas.width = minimapCanvas.width;
		miniMapIconsCanvas.height = minimapCanvas.height;
		miniMapIconsContext.lineWidth = 1;
		initPlayerCanvas = true;
	}
	miniMapIconsContext.clearRect(0, 0, miniMapIconsCanvas.width, miniMapIconsCanvas.height);
	animationLoopProgress += 2 * (dt / 1000);
	animationLoopProgress = animationLoopProgress % 2;
	var frame = 1;
	if (animationLoopProgress > 1) {
		frame = 0;
	}
	if (lastFrame !== frame) {
		miniMapIconsContext.fillStyle = "rgba(200,200,255," + (0.6 * frame) + ")";
		miniMapIconsContext.strokeStyle = "rgba(200,200,255," + (0.8 * frame) + ")";
	}
	miniMapIconsContext.beginPath();
	miniMapIconsContext.rect(miniMapPlayerX, miniMapPlayerY, miniMapSize, miniMapSize);
	miniMapIconsContext.fill();
	miniMapIconsContext.stroke();
	miniMapIconsContext.closePath();
	lastFrame = frame;
}