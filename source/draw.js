var styles = {
	player: {},
	border: {},
	tile: {}
};

function drawImg(entity, x, y) {
	if (entity.img !== null) {
		context.drawImage(entity.img, entity.x || x, entity.y || y, entity.w, entity.h);
	}
}

function setStyle(context, id, style, value) {
	if (!styles[id][style]) {
		context[style] = value;
		styles[id][style] = value;
	}
	if (styles[id][style] !== value) {
		context[style] = value;
		styles[id][style] = value;
	}
}

function drawRoom() {
	var mapWidth = bigRoomList[0].width;
	var mapHeight = bigRoomList[0].height;
	var currentX = 0;
	var currentY = 0;
	var mapSize = bigRoomList[0].size * roomSize;
	for (var y = 0; y < mapSize; y++) {
		for (var x = 0; x < mapSize; x++) {
			if (bigRoomList[0].map[coordinate(x, y, mapSize)] !== 0) {
				drawRect(x, y, bigRoomList[0].map, mapSize, 1, 1);
			}
		}
	}
	for (var y = 0; y < mapSize; y++) {
		for (var x = 0; x < mapSize; x++) {
			if (bigRoomList[0].map[coordinate(x, y, mapSize)] !== 0) {
				drawTile(x, y, bigRoomList[0].map, mapSize, 1, 1);
			}
		}
	}
}

function drawMap() {
	tileContext.fillStyle = "#FF9900";
	setStyle(borderContext, "border", "strokeStyle", '#ff0000');
	setStyle(borderContext, "border", "lineWidth", 2);
	var startTime = window.performance.now();
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
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * tileSize) - viewPortY;
	// setStyle(tileContext, "tile", "fillStyle", '#FF9900');
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, tileSize);
	}
	// }
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
					canvasY = canvasY - 5;
				}
				if (((type === mapRight && topRightTile === 0) || (type === mapLeft && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + 3);
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
						drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
						drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
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


function drawWorld() {
	var room = null;
	playerCanvas.width = world.width * miniMapSize;
	playerCanvas.height = world.height * miniMapSize;
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		playerContext.lineWidth = 2;
		playerContext.strokeStyle = "#555";
		playerContext.fillStyle = room.mapColor;
		playerContext.rect(room.mapX * miniMapSize, room.mapY * miniMapSize, room.mapW * miniMapSize, room.mapH * miniMapSize);
		playerContext.fill();
		playerContext.stroke();
		// drawRectangle(room);
		drawDoors(room);
	}
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		drawIcons(room);
	}
}

var lockColors = []

function drawIcons(room) {
	var door = null;
	for (var i = 0; i < room.doors.length; i++) {
		door = room.doors[i];
		if (door.doorType > 0) {
			switch (door.dir) {
				case "N":
					// this.iconStamp.frame = 32 + door.doorType;
					// stamp(this.iconStamp, this.miniMapSize * door.mapX, this.miniMapSize * door.mapY - 4);
					drawCircle(miniMapSize * door.mapX, miniMapSize * door.mapY - 4, "#FF0000");
					continue;
				case "S":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, miniMapSize * door.mapX, miniMapSize * door.mapY + 4);
					drawCircle(miniMapSize * door.mapX, miniMapSize * door.mapY + 4, "#00FF00");
					continue;
				case "W":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, miniMapSize * door.mapX - 4, miniMapSize * door.mapY);
					drawCircle(miniMapSize * door.mapX - 4, miniMapSize * door.mapY, "#0000FF");
					continue;
				case "E":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, miniMapSize * door.mapX + 4, miniMapSize * door.mapY);
					drawCircle(miniMapSize * door.mapX + 4, miniMapSize * door.mapY, "#000000");
					continue;
				default:
					continue;
			}
		}
	}
	// this.iconStamp.frame = 16 + room.specialType;
	// stamp(this.iconStamp, this.miniMapSize * (room.mapX + room.mapW / 2) - 4, this.miniMapSize * (room.mapY + room.mapH / 2) - 4);
	if (room.specialType > 0) {
		drawCircle(this.miniMapSize * (room.mapX + room.mapW / 2) - 4, this.miniMapSize * (room.mapY + room.mapH / 2) - 4, "rgba(0,0,0,0)", "#FFF");
	}
}

function drawCircle(centerX, centerY, color, border) {
	var radius = 3;

	playerContext.beginPath();
	playerContext.arc(centerX + (radius * 1.5), centerY + (radius * 1.5), radius, 0, 2 * Math.PI, false);
	playerContext.fillStyle = color;
	playerContext.fill();
	if (border) {
		playerContext.lineWidth = 2;
		playerContext.strokeStyle = border;
		playerContext.stroke();
	}
}

function drawDoors(room) {
	var door = null;
	var color = room.mapColor;
	// var color = "#FF0000";
	playerContext.lineWidth = 2;
	playerContext.strokeStyle = color;
	var i = 4;
	for (var e = 0; e < room.doors.length; e++) {
		door = room.doors[e];
		switch (door.dir) {
			case "N":
				drawLine2(miniMapSize * door.mapX + i, miniMapSize * door.mapY, miniMapSize * door.mapX + miniMapSize - i, miniMapSize * door.mapY, color);
				continue;
			case "S":
				drawLine2(miniMapSize * door.mapX + i, miniMapSize * (door.mapY + 1), miniMapSize * door.mapX + miniMapSize - i, miniMapSize * (door.mapY + 1), color);
				continue;
			case "W":
				drawLine2(miniMapSize * door.mapX, miniMapSize * door.mapY + i, miniMapSize * door.mapX, miniMapSize * door.mapY + miniMapSize - i, color);
				continue;
			case "E":
				drawLine2(miniMapSize * (door.mapX + 1), miniMapSize * door.mapY + i, miniMapSize * (door.mapX + 1), miniMapSize * door.mapY + miniMapSize - i, color);
				continue;
			default:
				continue;
		}
	}
}

function drawLine2(startX, startY, endX, endY, color) {
	playerContext.beginPath();
	playerContext.moveTo(startX, startY);
	playerContext.lineTo(endX, endY);
	playerContext.stroke();
	playerContext.closePath();
}

function drawFrontiers() {
	var frontier = null;
	var i = 0;
	playerContext.fillStyle = "rgba(255,255,255,0.3)";
	// var frontiers = world.frontiers;
	var frontiers = getFrontiersForAllRooms();
	while (i < frontiers.length) {
		frontier = frontiers[i];
		playerContext.fillRect(frontier.x * miniMapSize, frontier.y * miniMapSize, miniMapSize, miniMapSize);
		drawRectangle(Room(frontier.x, frontier.y, 1, 1, null));
		i++;
	}
}