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
	var mapSize = bigRoomList[0].size * 10;
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
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * 16;
				if (startX === -currentMapTiles * 16 * 2) {
					startX = (x * 16) - viewPortX;
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
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 1);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 4);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 2);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 8);
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	// setStyle(tileContext, "tile", "fillStyle", '#FF9900');
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
	// }
}

function parseVerticalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var x = mapX1; x < mapX2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = mapY1; y < mapY2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === 1) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === 4) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - 5;
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + 3);
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var y = mapY1; y < mapY2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = mapX1; x < mapX2; x++) {
			if (type === 2) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === 8) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
						drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
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
	minimapCanvas.width = 300;
	minimapCanvas.height = 300;
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	parseMinimapViewport();
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		minimapContext.lineWidth = 2;
		minimapContext.strokeStyle = room.region.color.border;
		minimapContext.fillStyle = room.region.color.background;
		minimapContext.rect((room.mapX * 16) - miniViewPortX, (room.mapY * 16) - miniViewPortY, room.mapW * 16, room.mapH * 16);
		minimapContext.fill();
		minimapContext.stroke();
		// drawRectangle(room);
		drawDoors(room);
	}
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		// minimapContext.lineWidth = 2;
		// minimapContext.strokeStyle = world.currentRegion.color.border;
		// minimapContext.fillStyle = world.currentRegion.color.background;
		// minimapContext.rect(room.mapX * 16, room.mapY * 16, room.mapW * 16, room.mapH * 16);
		// minimapContext.fill();
		// minimapContext.stroke();
		// drawRectangle(room);
		drawDoors(room);
	}
	drawPlayer();
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
		var color = regionColors[door.doorType].lock;
		if (door.doorType > 0) {
			switch (door.dir) {
				case "N":
					// this.iconStamp.frame = 32 + door.doorType;
					// stamp(this.iconStamp, this.16 * door.mapX, this.16 * door.mapY - 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY, color);
					continue;
				case "S":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX, 16 * door.mapY + 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY + 16, color);
					continue;
				case "W":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX - 4, 16 * door.mapY);
					drawCircle(16 * door.mapX - 3, 16 * door.mapY + 8, color);
					continue;
				case "E":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX + 4, 16 * door.mapY);
					drawCircle(16 * door.mapX + 13, 16 * door.mapY + 8, color);
					continue;
				default:
					continue;
			}
		}
	}
	// this.iconStamp.frame = 16 + room.specialType;
	// stamp(this.iconStamp, this.16 * (room.mapX + room.mapW / 2) - 4, this.16 * (room.mapY + room.mapH / 2) - 4);
	var color = regionColors[room.specialType].lock;
	if (room.specialType > 0) {
		drawCircle(16 * (room.mapX + room.mapW / 2) - 3, 16 * (room.mapY + room.mapH / 2), "rgba(0,0,0,0)", color);
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
}

function drawDoors(room) {
	var door = null;
	// var color = room.region.color.background;
	minimapContext.lineWidth = 1;
	// minimapContext.strokeStyle = color;
	var i = 4;
	for (var e = 0; e < room.doors.length; e++) {
		door = room.doors[e];
		switch (door.dir) {
			case "N":
				var color = "#FF0000";
				minimapContext.strokeStyle = color;
				drawLine2(16 * door.mapX + i, 16 * door.mapY + 2, 16 * door.mapX + 16 - i, 16 * door.mapY + 2, color);
				continue;
			case "S":
				var color = "#00FF00";
				minimapContext.strokeStyle = color;
				drawLine2(16 * door.mapX + i, 16 * (door.mapY + 1), 16 * door.mapX + 16 - i, 16 * (door.mapY + 1), color);
				continue;
			case "W":
				var color = "#0000FF";
				minimapContext.strokeStyle = color;
				drawLine2(16 * door.mapX + 2, 16 * door.mapY + i, 16 * door.mapX + 2, 16 * door.mapY + 16 - i, color);
				continue;
			case "E":
				var color = "#FFFF00";
				minimapContext.strokeStyle = color;
				drawLine2(16 * (door.mapX + 1), 16 * door.mapY + i, 16 * (door.mapX + 1), 16 * door.mapY + 16 - i, color);
				continue;
			default:
				continue;
		}
	}
}

function drawLine2(startX, startY, endX, endY, color) {
	minimapContext.beginPath();
	minimapContext.moveTo(startX - miniViewPortX, startY - miniViewPortY);
	minimapContext.lineTo(endX - miniViewPortX, endY - miniViewPortY);
	minimapContext.stroke();
	minimapContext.closePath();
}

function drawPlayer() {
	minimapContext.fillStyle = "rgba(200,200,255,0.6)";
	minimapContext.strokeStyle = "rgba(200,200,255,0.8)";
	minimapContext.rect((currentRoom.mapX * 16) + (currentRoom.startPositionX * 16) - miniViewPortX, (currentRoom.mapY * 16) + (currentRoom.startPositionY * 16) - miniViewPortY, 16, 16);
	minimapContext.fill();
	minimapContext.stroke();
}var styles = {
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
	var mapSize = bigRoomList[0].size * 10;
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
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * 16;
				if (startX === -currentMapTiles * 16 * 2) {
					startX = (x * 16) - viewPortX;
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
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 1);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 4);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 2);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 8);
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	// setStyle(tileContext, "tile", "fillStyle", '#FF9900');
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
	// }
}

function parseVerticalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var x = mapX1; x < mapX2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = mapY1; y < mapY2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === 1) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === 4) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - 5;
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + 3);
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var y = mapY1; y < mapY2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = mapX1; x < mapX2; x++) {
			if (type === 2) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === 8) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
						drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
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
	playerCanvas.width = world.width * 16;
	playerCanvas.height = world.height * 16;
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		playerContext.lineWidth = 3;
		playerContext.strokeStyle = room.region.color.border;
		playerContext.fillStyle = room.region.color.background;
		playerContext.rect(room.mapX * 16, room.mapY * 16, room.mapW * 16, room.mapH * 16);
		playerContext.fill();
		playerContext.stroke();
		// drawRectangle(room);
		drawDoors(room);
	}
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		// playerContext.lineWidth = 2;
		// playerContext.strokeStyle = world.currentRegion.color.border;
		// playerContext.fillStyle = world.currentRegion.color.background;
		// playerContext.rect(room.mapX * 16, room.mapY * 16, room.mapW * 16, room.mapH * 16);
		// playerContext.fill();
		// playerContext.stroke();
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
		var color = regionColors[door.doorType].lock;
		if (door.doorType > 0) {
			switch (door.dir) {
				case "N":
					// this.iconStamp.frame = 32 + door.doorType;
					// stamp(this.iconStamp, this.16 * door.mapX, this.16 * door.mapY - 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY , color);
					continue;
				case "S":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX, 16 * door.mapY + 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY + 16, color);
					continue;
				case "W":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX - 4, 16 * door.mapY);
					drawCircle(16 * door.mapX -3, 16 * door.mapY + 8, color);
					continue;
				case "E":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX + 4, 16 * door.mapY);
					drawCircle(16 * door.mapX + 13, 16 * door.mapY + 8, color);
					continue;
				default:
					continue;
			}
		}
	}
	// this.iconStamp.frame = 16 + room.specialType;
	// stamp(this.iconStamp, this.16 * (room.mapX + room.mapW / 2) - 4, this.16 * (room.mapY + room.mapH / 2) - 4);
	var color = regionColors[room.specialType].lock;
	if (room.specialType > 0) {
		drawCircle(16 * (room.mapX + room.mapW / 2) - 3, 16 * (room.mapY + room.mapH / 2) , "rgba(0,0,0,0)", color);
	}
}

function drawCircle(centerX, centerY, color, border) {
	var radius = 3;

	playerContext.beginPath();
	playerContext.arc(centerX + radius, centerY, radius, 0, 2 * Math.PI, false);
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
	var color = room.region.color.background;
	// var color = "#FF0000";
	playerContext.lineWidth = 1;
	playerContext.strokeStyle = color;
	var i = 4;
	for (var e = 0; e < room.doors.length; e++) {
		door = room.doors[e];
		switch (door.dir) {
			case "N":
				drawLine2(16 * door.mapX + i, 16 * door.mapY - 2, 16 * door.mapX + 16 - i, 16 * door.mapY - 2, color);
				continue;
			case "S":
				drawLine2(16 * door.mapX + i, 16 * (door.mapY + 1), 16 * door.mapX + 16 - i, 16 * (door.mapY + 1), color);
				continue;
			case "W":
				drawLine2(16 * door.mapX, 16 * door.mapY + i, 16 * door.mapX, 16 * door.mapY + 16 - i, color);
				continue;
			case "E":
				drawLine2(16 * (door.mapX + 1), 16 * door.mapY + i, 16 * (door.mapX + 1), 16 * door.mapY + 16 - i, color);
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
		playerContext.fillRect(frontier.x * 16, frontier.y * 16, 16, 16);
		drawRectangle(Room(frontier.x, frontier.y, 1, 1, null));
		i++;
	}
}var styles = {
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
	var mapSize = bigRoomList[0].size * 10;
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
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * 16;
				if (startX === -currentMapTiles * 16 * 2) {
					startX = (x * 16) - viewPortX;
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
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 1);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 4);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 2);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 8);
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	// setStyle(tileContext, "tile", "fillStyle", '#FF9900');
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
	// }
}

function parseVerticalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var x = mapX1; x < mapX2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = mapY1; y < mapY2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === 1) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === 4) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - 5;
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + 3);
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var y = mapY1; y < mapY2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = mapX1; x < mapX2; x++) {
			if (type === 2) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === 8) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
						drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
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
	playerCanvas.width = world.width * 16;
	playerCanvas.height = world.height * 16;
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		playerContext.lineWidth = 3;
		playerContext.strokeStyle = room.region.color.border;
		playerContext.fillStyle = room.region.color.background;
		playerContext.rect(room.mapX * 16, room.mapY * 16, room.mapW * 16, room.mapH * 16);
		playerContext.fill();
		playerContext.stroke();
		// drawRectangle(room);
		drawDoors(room);
	}
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		// playerContext.lineWidth = 2;
		// playerContext.strokeStyle = world.currentRegion.color.border;
		// playerContext.fillStyle = world.currentRegion.color.background;
		// playerContext.rect(room.mapX * 16, room.mapY * 16, room.mapW * 16, room.mapH * 16);
		// playerContext.fill();
		// playerContext.stroke();
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
		var color = regionColors[door.doorType].lock;
		if (door.doorType > 0) {
			switch (door.dir) {
				case "N":
					// this.iconStamp.frame = 32 + door.doorType;
					// stamp(this.iconStamp, this.16 * door.mapX, this.16 * door.mapY - 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY, color);
					continue;
				case "S":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX, 16 * door.mapY + 4);
					drawCircle(16 * door.mapX + 5, 16 * door.mapY + 16, color);
					continue;
				case "W":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX - 4, 16 * door.mapY);
					drawCircle(16 * door.mapX - 3, 16 * door.mapY + 8, color);
					continue;
				case "E":
					// iconStamp.frame = 32 + door.doorType;
					// stamp(iconStamp, 16 * door.mapX + 4, 16 * door.mapY);
					drawCircle(16 * door.mapX + 13, 16 * door.mapY + 8, color);
					continue;
				default:
					continue;
			}
		}
	}
	// this.iconStamp.frame = 16 + room.specialType;
	// stamp(this.iconStamp, this.16 * (room.mapX + room.mapW / 2) - 4, this.16 * (room.mapY + room.mapH / 2) - 4);
	var color = regionColors[room.specialType].lock;
	if (room.specialType > 0) {
		drawCircle(16 * (room.mapX + room.mapW / 2) - 3, 16 * (room.mapY + room.mapH / 2), "rgba(0,0,0,0)", color);
	}
}

function drawCircle(centerX, centerY, color, border) {
	var radius = 3;

	playerContext.beginPath();
	playerContext.arc(centerX + radius, centerY, radius, 0, 2 * Math.PI, false);
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
	// var color = room.region.color.background;
	playerContext.lineWidth = 1;
	// playerContext.strokeStyle = color;
	var i = 4;
	for (var e = 0; e < room.doors.length; e++) {
		door = room.doors[e];
		switch (door.dir) {
			case "N":
				var color = "#FF0000";
	playerContext.strokeStyle = color;
				drawLine2(16 * door.mapX + i, 16 * door.mapY + 2, 16 * door.mapX + 16 - i, 16 * door.mapY + 2, color);
				continue;
			case "S":
				var color = "#00FF00";
	playerContext.strokeStyle = color;
				drawLine2(16 * door.mapX + i, 16 * (door.mapY + 1), 16 * door.mapX + 16 - i, 16 * (door.mapY + 1), color);
				continue;
			case "W":
				var color = "#0000FF";
	playerContext.strokeStyle = color;
				drawLine2(16 * door.mapX+2, 16 * door.mapY + i, 16 * door.mapX+2, 16 * door.mapY + 16 - i, color);
				continue;
			case "E":
				var color = "#000000";
	playerContext.strokeStyle = color;
				drawLine2(16 * (door.mapX + 1), 16 * door.mapY + i, 16 * (door.mapX + 1), 16 * door.mapY + 16 - i, color);
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
		playerContext.fillRect(frontier.x * 16, frontier.y * 16, 16, 16);
		drawRectangle(Room(frontier.x, frontier.y, 1, 1, null));
		i++;
	}
}var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas;
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

var player = {
	x: 151,
	y: 16 * 3,
	w: 16,
	h: 16 * 2,
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
	maxJumps: 1,
	angle: 0,
	health: 5,
	maxHealth: 5
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
	playerCanvas = getByType(getElementById, "player");
	borderCanvas = getByType(getElementById, "border");
	tileCanvas = getByType(getElementById, "tile");
	minimapCanvas = getByType(getElementById, "minimap");
	playerContext = playerCanvas.getContext("2d");
	borderContext = borderCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	resizeCanvas();
	// createMap();
	startWorld();
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		addRegion();
	}
	doors();
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = 300;
	} else {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = 300;
	} else {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = window.innerHeight;
	}
}



function eachFrame(event) {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		handleXMovement(entity);
		entity.x = round(entity.x);
		entity.y = round(entity.y);
		testDoors();
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
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
	setStyle(tileContext, "tile", "fillStyle", '#000000');
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	drawMap();

	// drawRoom();
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		// setStyle(playerContext, "player", "fillStyle", '#' + red + red + '0000');
		playerContext.fillStyle = '#' + red + red + '0000';
		playerContext.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
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
document.addEventListener("frame", trigger);var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas;
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

var player = {
	x: 151,
	y: 16 * 3,
	w: 16,
	h: 16 * 2,
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
	maxJumps: 1,
	angle: 0,
	health: 5,
	maxHealth: 5
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
	playerCanvas = getByType(getElementById, "player");
	borderCanvas = getByType(getElementById, "border");
	tileCanvas = getByType(getElementById, "tile");
	minimapCanvas = getByType(getElementById, "minimap");
	playerContext = playerCanvas.getContext("2d");
	borderContext = borderCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	resizeCanvas();
	// createMap();
	startWorld();
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		addRegion();
	}
	doors();
	drawWorld();
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = 300;
	} else {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = 300;
	} else {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = window.innerHeight;
	}
}



function eachFrame(event) {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		handleXMovement(entity);
		entity.x = round(entity.x);
		entity.y = round(entity.y);
		testDoors()
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
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
	setStyle(tileContext, "tile", "fillStyle", '#000000');
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	drawMap();
	// drawRoom();
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		// setStyle(playerContext, "player", "fillStyle", '#' + red + red + '0000');
		playerContext.fillStyle = '#' + red + red + '0000';
		playerContext.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
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
document.addEventListener("frame", trigger);var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas;
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

var player = {
	x: 151,
	y: 16 * 3,
	w: 16,
	h: 16 * 2,
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
	maxJumps: 1,
	angle: 0,
	health: 5,
	maxHealth: 5
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
	playerCanvas = getByType(getElementById, "player");
	borderCanvas = getByType(getElementById, "border");
	tileCanvas = getByType(getElementById, "tile");
	minimapCanvas = getByType(getElementById, "minimap");
	playerContext = playerCanvas.getContext("2d");
	borderContext = borderCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	resizeCanvas();
	// createMap();
	startWorld();
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		addRegion();
	}
	doors();
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = 300;
	} else {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = minimapCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = 300;
	} else {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = minimapCanvas.width = window.innerHeight;
	}
}



function eachFrame(event) {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		handleXMovement(entity);
		entity.x = round(entity.x);
		entity.y = round(entity.y);
		testDoors();
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
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
	setStyle(tileContext, "tile", "fillStyle", '#000000');
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	drawMap();
	// drawRoom();
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		// setStyle(playerContext, "player", "fillStyle", '#' + red + red + '0000');
		playerContext.fillStyle = '#' + red + red + '0000';
		playerContext.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
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

function modulus(num, size) {
	var mod = num % (size || 16);
	return (num - mod) / (size || 16);
}

function coordinate(x, y, size) {
	return (y * size + x);
}

function indexOf(array, searchKey) {
	if(typeof searchKey === "object") {
		for(var i=0;i<array.length;i++) {
			var found = true;
			if(typeof array[i] === "object") {
				for(var attr in searchKey) {
					if(array[i][attr] !== searchKey[attr]) {
						found = false;
						break;
					}
				}
				if(found === true) {
					return i;
				}
			}
		}
		return -1;
	} else {
		return array.indexOf(searchKey);
	}
}

function round(value) {
	return ~~ (0.5 + value);
}function handleKeyDown(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = 1;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xDirection = 1;
	} else if (event.keyCode === keys.a) {
		player.xDirection = -1;
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
			player.jumping = 0;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xDirection = 0;
			}
		} else {
			player.xDirection = 0;
		}
	}
}var map = [];

var numMapTiles = 10 * 3;



var viewPortX = 0;
var viewPortY = 0;
var miniViewPortX = 0;
var miniViewPortY = 0;

// var room1 = [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 0, 0, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 0, 32, 32, 0, 32, 32, 32, 32, 32, 0, 0, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 32];
// var room2 = [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1];
// var room3 = [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
// var room4 = [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1];
// var room5 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


// roomList.push(room5, room6);
var spareArray = [];





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
				position = coordinate(x, y, 10);
			}
			if (times === 1) {
				position = coordinate(y, (width - x) - 1, 10);
			}
			if (times === 2) {
				position = coordinate(width - x - 1, height - y - 1, 10);
			}
			if (times === 3) {
				position = coordinate(height - y - 1, x, 10);
			}
			spareArray[coordinate(x, y, 10)] = room[position];
		}
	}
	return spareArray.slice(0);
}



var rooms = {};
var path = [0,1];

function makePath() {

}

function createMap() {
	var room;
	for (var y = 0; y < numMapTiles; y++) {
		for (var x = 0; x < numMapTiles; x++) {
			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
			if (x % 10 === 0 || y % 10 === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					// room = cloneRoom(roomList[9]);
					room = cloneRoom(roomList[random(0, 9)]);
					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 1) {
						room = cloneRoom(roomList[9]);
					}
					if(Math.floor(x / 10) === 0 && Math.floor(y / 10) === 0) {
						room = cloneRoom(roomList[9]);
					}
					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 0) {
						room = cloneRoom(roomList[7]);
					}
					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 1) {
						room = cloneRoom(roomList[5]);
					}
					if(Math.floor(x / 10) === 2 && Math.floor(y / 10) === 1) {
						room = cloneRoom(roomList[7]);
					}
					if(Math.floor(x / 10) === 2 && Math.floor(y / 10) === 2) {
						room = cloneRoom(roomList[3]);
					}
					if (room.options & 4) {
						rooms[roomId] = rotate(room, 10, 10, rotation);
					} else {
						rooms[roomId] = room;
					}

					// console.log(Math.floor(x / 10) + "-" + Math.floor(y / 10), x, y)
				}
				room = rooms[roomId];
					// console.log(room.type, x, y, room.map)
				// console.log(room)
			}
			// if ((y * numMapTiles + x) % (10 * 10) === 0) {
			// 	// room = rotate(room1, 10, 10, random(0, 3));
			// 	room = rotate(room1, 10, 10, 0);
			// 	console.log(room)
			// }
			// X and Y for room arent being calculated properly
			// console.log("X and Y: ", x, y, "map coord: ", coordinate(x, y, numMapTiles), "room coord: ", coordinate(x % 10, y % 10, 10));
			// console.log("Tile: ", room[coordinate(x % 10, y % 10, 10)], "-", roomId)
			map[coordinate(x, y, numMapTiles)] = room.map[coordinate(x % 10, y % 10, 10)];
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
}function handleXMovement(entity) {
	entity.xAccel = entity.xAccel + (entity.xDirection / 60 * dt);
	if (entity.xAccel > entity.maxAccel) {
		entity.xAccel = entity.maxAccel;
	}
	if (entity.xAccel < -entity.maxAccel) {
		entity.xAccel = -entity.maxAccel;
	}
	if (entity.xDirection === 0) {
		if (entity.xAccel > 0) {
			entity.xAccel = entity.xAccel + ((-1 * 2 / 60) * dt);
		} else if (entity.xAccel < 0) {
			entity.xAccel = entity.xAccel + ((1 * 2 / 60) * dt);
		}
		if ((entity.xAccel < ((1 / 60) * dt) && entity.xAccel > ((-1 / 60) * dt)) || entity.yDirection === 1 || entity.yDirection === -1) {
			entity.xAccel = 0;
		}
	}
	entity.x = entity.x + entity.xAccel;
}

function handleJump(entity) {
	if (entity.jumping && (entity.yDirection !== -1 && entity.jumpsUsed < entity.maxJumps)) {
		if (entity.maxJumps > 1 && entity.jumpsUsed === 0 && entity.yDirection === 1) {
			entity.jumpsUsed++;
		}
		if ((entity.jumpsUsed === 0 && entity.yDirection === 0) || entity.jumpsUsed > 0 || entity.maxJumps > 1) {
			entity.yDirection = -1;
			entity.yAccel = -entity.jumpForce;
			entity.jumpStart = entity.y;
			entity.jumpsUsed++;
		}

	}
	if (entity.yDirection === 0 || !entity.jumping || entity.jumpStart - entity.y > entity.jumpHeight) {
		entity.yDirection = 1;
	}
	if (entity.yDirection === 1) {
		entity.jumping = 0;
		entity.yAccel = entity.yAccel + ((entity.jumpForce / 2) / 60 * dt); // falling
	}

	if (entity.yDirection === 0) {
		if (entity.yAccel > 0) {
			entity.yAccel = entity.yAccel + ((-1 / 60) * dt);
		} else if (entity.yAccel < 0) {
			entity.yAccel = entity.yAccel + ((1 / 60) * dt);
		}
		if (entity.yAccel < ((1 / 60) * dt) && entity.yAccel > ((-1 / 60) * dt)) {
			entity.yAccel = 0;
		}
	}
	if (entity.yAccel > entity.maxAccel) {
		entity.yAccel = 10;
	}
	entity.y = entity.y + entity.yAccel;
}

function testFalling(entity) {
	var xAlignment = entity.x % 16;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = currentMap[bottomLeft];
	} else {
		falling = currentMap[bottomRight] !== 0 || currentMap[bottomLeft] !== 0;
	}
	if ((falling || entity.y + entity.h > mapHeight * 16) && entity.yDirection === 1) {
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
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var jumping = false;
	if (xAlignment === 0) {
		jumping = currentMap[aboveLeft] !== 0;
	} else {
		jumping = currentMap[aboveLeft] !== 0 || currentMap[aboveRight] !== 0;
	}
	if (jumping && entity.jumping === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = -1;
		entity.yDirection = 1;
		entity.jumping = 0;
	}
}

function testWalking(entity) {
	var yAlignment = entity.y % 16;
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var topLeft = coordinate(modulus(entity.x), modulus(entity.y), currentMapTiles);
	var topRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y), currentMapTiles);
	var midLeft = coordinate(modulus(entity.x), modulus(entity.y + (entity.h / 2)), currentMapTiles);
	var midRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + (entity.h / 2)), currentMapTiles);
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var walkLeft = false;
	var walkRight = false;
	if (yAlignment === 0) {
		walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0;
		walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0;
	} else {
		if (modulus(entity.y + entity.h) * 16 > entity.y + entity.h) {
			walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0 || currentMap[aboveLeft] !== 0;
			walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0 || currentMap[aboveRight] !== 0;
		} else {
			walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0 || currentMap[bottomLeft] !== 0;
			walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0 || currentMap[bottomRight] !== 0;
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP -1")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		}
	}
}var currentMapTiles = 0;

var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < 10 * 10; i++) {
	blankArray[i] = 0;
}



var room1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room2 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1];
var room3 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room4 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room5 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1];
var room7 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
var room8 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room9 = [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room10 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room11 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room12 = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1];
var room13 = [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];

function Room(flipX, flipY, rotate, RoomType, doors, paths, array) {
	return {
		map: array,
		doors: doors,
		paths: paths,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

function cloneRoom(room) {
	return {
		map: room.map.slice(0),
		doors: room.doors,
		paths: room.paths,
		options: room.options,
		type: room.type
	};
}

roomList.push(Room(0, 0, 0, 0, 0, 1 | 2 | 4 | 8, blankArray));
roomList.push(Room(0, 0, 0, 1, 0, 1 | 0 | 4 | 0, room1));
roomList.push(Room(0, 0, 0, 2, 0, 0 | 2 | 0 | 8, room2));
roomList.push(Room(0, 0, 0, 3, 0, 1 | 2 | 0 | 8, room3));
roomList.push(Room(0, 0, 0, 4, 0, 1 | 0 | 4 | 8, room4));
roomList.push(Room(0, 0, 0, 5, 0, 0 | 2 | 4 | 0, room5));
roomList.push(Room(0, 0, 0, 6, 0, 0 | 0 | 4 | 8, room6));
roomList.push(Room(0, 0, 0, 7, 0, 1 | 0 | 0 | 8, room7));
roomList.push(Room(0, 0, 0, 8, 0, 1 | 2 | 0 | 0, room8));
roomList.push(Room(0, 0, 0, 9, 0, 1 | 2 | 4 | 8, room9));
roomList.push(Room(0, 0, 0, 10, 1, 0 | 2 | 4 | 8, room10));
roomList.push(Room(0, 0, 0, 11, 4, 1 | 2 | 0 | 8, room11));
roomList.push(Room(0, 0, 0, 12, 8, 1 | 2 | 4 | 0, room12));
roomList.push(Room(0, 0, 0, 13, 2, 1 | 0 | 4 | 8, room13));

function BigRoom(width, height, flipX, flipY, rotate, RoomType, doors, paths, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = [];
	var currentX = -1;
	var currentY = 0;
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var arrayIndex = coordinate(Math.floor(x / 10), Math.floor(y / 10), topSize);
			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
			if (x % 10 === 0 || y % 10 === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					room = cloneRoom(roomList[array[arrayIndex]]);
					if (room.options & 4) {
						rooms[roomId] = rotate(room, 10, 10, rotation);
					} else {
						rooms[roomId] = room;
					}
				}
				room = rooms[roomId];
			}
			map[coordinate(x, y, topSize * 10)] = room.map[coordinate(x % 10, y % 10, 10)];
		}
	}
	// currentMapTiles = topSize * 10;
	// currentMap = map;
	realMapHeight = height * 10 * 16;
	realMapWidth = width * 10 * 16;
	return {
		map: map,
		doors: doors,
		paths: paths,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * 10,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}



function setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY) {
	roomSelection.length = 0;
	for (var e = 0; e < roomList.length; e++) {
		validRooms[e] = e;
	}
	var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
	var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
	var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
	var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
	if (currentY - 1 < 0) {
		aboveRoom = -1;
	}
	if (currentX - 1 < 0) {
		leftRoom = -1;
	}
	if (currentY + 1 > roomsY - 1) {
		belowRoom = -1;
	}
	if (currentX + 1 > roomsX - 1) {
		rightRoom = -1;
	}
	if (aboveRoom === 4 || aboveRoom === 2 || aboveRoom === 6 || aboveRoom === 7 || aboveRoom === 9 || aboveRoom === 13) {
		console.warn("Room for Above")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[2] = 2;
		validRooms[3] = 3;
		validRooms[5] = 5;
		validRooms[8] = 8;
		validRooms[9] = 9;
		if (leftRoom !== -1) {
			if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[5] = -1;
				validRooms[3] = 3;
				validRooms[8] = 8;
				validRooms[9] = 9;
				if (rightRoom !== -1) {
					if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
						validRooms[8] = -1;
					}
				}
			}
		}
		if (rightRoom !== -1) {
			if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[8] = -1;
				validRooms[3] = 3;
				validRooms[5] = 5;
				validRooms[9] = 9;
				if (leftRoom !== -1) {
					if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
						validRooms[5] = -1;
					}
				}
			}
		}
	}
	if (currentX === 0) {
		console.warn("Left of Map")
		validRooms[7] = -1;
		validRooms[8] = -1;
		validRooms[1] = -1;
	}
	if (currentX === roomsX - 1) {
		console.warn("Right of Map")
		validRooms[5] = -1;
		validRooms[6] = -1;
		validRooms[1] = -1;
	}
	if (currentY === 0) {
		console.warn("Top of Map")
		validRooms[3] = -1;
		validRooms[5] = -1;
		validRooms[8] = -1;
		validRooms[2] = -1;
	}
	if (currentY === roomsY - 1) {
		console.warn("Bottom of Map")
		validRooms[4] = -1;
		validRooms[6] = -1;
		validRooms[7] = -1;
		validRooms[2] = -1;
	}
	if (currentX === startX && currentY === startY) {
		console.warn("Room for Start")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[10] = 10;
		validRooms[11] = 11;
		validRooms[12] = 12;
		validRooms[13] = 13;
		if (leftRoom === -1) {
			validRooms[11] = -1;
		}
		if (aboveRoom === -1) {
			validRooms[12] = -1;
		}
		if (rightRoom === -1) {
			validRooms[10] = -1;
		}
		if (belowRoom === -1) {
			validRooms[13] = -1;
		}
	} else {
		validRooms[10] = -1;
		validRooms[11] = -1;
		validRooms[12] = -1;
		validRooms[13] = -1;
	}
	validRooms[9] = 9;
	for (var i = 0; i < validRooms.length; i++) {
		if (validRooms[i] !== -1) {
			roomSelection.push(validRooms[i]);
		}
	}
	var selectedRoom = roomSelection[random(0, roomSelection.length - 1)];
	if (selectedRoom === 11) {
		if ([1, 3, 4, 5, 6, 9].indexOf(leftRoom) === -1) {
			setRoom(startX, startY, currentX - 1, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	if (selectedRoom === 12) {
		if ([2, 4, 6, 7, 9].indexOf(aboveRoom) === -1) {
			setRoom(startX, startY, currentX, currentY - 1, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	array[coordinate(currentX, currentY, arraySize)] = selectedRoom;
}

bigRoomList.push(BigRoom(4, 1, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = 0;
	var currentY = 0;
	var validRooms = [];
	var roomSelection = [];
	for (var i = 0; i < arraySize * arraySize; i++) {
		setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		currentX++;
		if (currentX > roomsX - 1) {
			currentX = 0;
			currentY++;
		}
		if (currentY > roomsY - 1) {
			i = arraySize * arraySize;
		}
	}
	return array;
}));

function playerSizedRoom(room) {
	room.map = BigRoom(room.mapW * 3, room.mapH * 3, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
		var startX = random(0, roomsX - 1);
		var startY = random(0, roomsY - 1);
		var startDirection = random(0, 3);
		var currentX = 0;
		var currentY = 0;
		var validRooms = [];
		var roomSelection = [];
		for (var i = 0; i < arraySize * arraySize; i++) {
			// setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
			array[coordinate(currentX, currentY, arraySize)] = 9;
			currentX++;
			if (currentX > roomsX - 1) {
				currentX = 0;
				currentY++;
			}
			if (currentY > roomsY - 1) {
				i = arraySize * arraySize;
			}
		}
		return array;
	});
}var currentMapTiles = 0;
var mapWidth = 0;
var mapHeight = 0;
var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < 10 * 10; i++) {
	blankArray[i] = 0;
}
var currentMap = null;


var room1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room2 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1];
var room3 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room4 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room5 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1];
var room7 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
var room8 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room9 = [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room10 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room11 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room12 = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1];
var room13 = [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];

function Room(flipX, flipY, rotate, RoomType, doors, paths, array) {
	return {
		map: array,
		doors: doors,
		paths: paths,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

function cloneRoom(room) {
	return {
		map: room.map.slice(0),
		doors: room.doors,
		paths: room.paths,
		options: room.options,
		type: room.type
	};
}

roomList.push(Room(0, 0, 0, 0, 0, 1 | 2 | 4 | 8, blankArray));
roomList.push(Room(0, 0, 0, 1, 0, 1 | 0 | 4 | 0, room1));
roomList.push(Room(0, 0, 0, 2, 0, 0 | 2 | 0 | 8, room2));
roomList.push(Room(0, 0, 0, 3, 0, 1 | 2 | 0 | 8, room3));
roomList.push(Room(0, 0, 0, 4, 0, 1 | 0 | 4 | 8, room4));
roomList.push(Room(0, 0, 0, 5, 0, 0 | 2 | 4 | 0, room5));
roomList.push(Room(0, 0, 0, 6, 0, 0 | 0 | 4 | 8, room6));
roomList.push(Room(0, 0, 0, 7, 0, 1 | 0 | 0 | 8, room7));
roomList.push(Room(0, 0, 0, 8, 0, 1 | 2 | 0 | 0, room8));
roomList.push(Room(0, 0, 0, 9, 0, 1 | 2 | 4 | 8, room9));
roomList.push(Room(0, 0, 0, 10, 1, 0 | 2 | 4 | 8, room10));
roomList.push(Room(0, 0, 0, 11, 4, 1 | 2 | 0 | 8, room11));
roomList.push(Room(0, 0, 0, 12, 8, 1 | 2 | 4 | 0, room12));
roomList.push(Room(0, 0, 0, 13, 2, 1 | 0 | 4 | 8, room13));

function BigRoom(width, height, flipX, flipY, rotate, RoomType, doors, paths, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = [];
	var currentX = -1;
	var currentY = 0;
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var arrayIndex = coordinate(Math.floor(x / 10), Math.floor(y / 10), topSize);
			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
			if (x % 10 === 0 || y % 10 === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					room = cloneRoom(roomList[array[arrayIndex]]);
					if (room.options & 4) {
						rooms[roomId] = rotate(room, 10, 10, rotation);
					} else {
						rooms[roomId] = room;
					}
				}
				room = rooms[roomId];
			}
			map[coordinate(x, y, topSize * 10)] = room.map[coordinate(x % 10, y % 10, 10)];
		}
	}
	// currentMapTiles = topSize * 10;
	// currentMap = map;
	mapHeight = topSize * 10;
	mapWidth = topSize * 10;
	realMapHeight = height * 10 * 16;
	realMapWidth = width * 10 * 16;
	return {
		map: map,
		doors: doors,
		paths: paths,
		width: width,
		height: height,
		size: topSize,
		tiles:topSize * 10,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

function enterRoom(room) {
	if(!room)
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
}

function setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY) {
	roomSelection.length = 0;
	for (var e = 0; e < roomList.length; e++) {
		validRooms[e] = e;
	}
	var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
	var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
	var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
	var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
	if (currentY - 1 < 0) {
		aboveRoom = -1;
	}
	if (currentX - 1 < 0) {
		leftRoom = -1;
	}
	if (currentY + 1 > roomsY - 1) {
		belowRoom = -1;
	}
	if (currentX + 1 > roomsX - 1) {
		rightRoom = -1;
	}
	if (aboveRoom === 4 || aboveRoom === 2 || aboveRoom === 6 || aboveRoom === 7 || aboveRoom === 9 || aboveRoom === 13) {
		console.warn("Room for Above")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[2] = 2;
		validRooms[3] = 3;
		validRooms[5] = 5;
		validRooms[8] = 8;
		validRooms[9] = 9;
		if (leftRoom !== -1) {
			if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[5] = -1;
				validRooms[3] = 3;
				validRooms[8] = 8;
				validRooms[9] = 9;
				if (rightRoom !== -1) {
					if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
						validRooms[8] = -1;
					}
				}
			}
		}
		if (rightRoom !== -1) {
			if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[8] = -1;
				validRooms[3] = 3;
				validRooms[5] = 5;
				validRooms[9] = 9;
				if (leftRoom !== -1) {
					if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
						validRooms[5] = -1;
					}
				}
			}
		}
	}
	if (currentX === 0) {
		console.warn("Left of Map")
		validRooms[7] = -1;
		validRooms[8] = -1;
		validRooms[1] = -1;
	}
	if (currentX === roomsX - 1) {
		console.warn("Right of Map")
		validRooms[5] = -1;
		validRooms[6] = -1;
		validRooms[1] = -1;
	}
	if (currentY === 0) {
		console.warn("Top of Map")
		validRooms[3] = -1;
		validRooms[5] = -1;
		validRooms[8] = -1;
		validRooms[2] = -1;
	}
	if (currentY === roomsY - 1) {
		console.warn("Bottom of Map")
		validRooms[4] = -1;
		validRooms[6] = -1;
		validRooms[7] = -1;
		validRooms[2] = -1;
	}
	if (currentX === startX && currentY === startY) {
		console.warn("Room for Start")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[10] = 10;
		validRooms[11] = 11;
		validRooms[12] = 12;
		validRooms[13] = 13;
		if (leftRoom === -1) {
			validRooms[11] = -1;
		}
		if (aboveRoom === -1) {
			validRooms[12] = -1;
		}
		if (rightRoom === -1) {
			validRooms[10] = -1;
		}
		if (belowRoom === -1) {
			validRooms[13] = -1;
		}
	} else {
		validRooms[10] = -1;
		validRooms[11] = -1;
		validRooms[12] = -1;
		validRooms[13] = -1;
	}
	validRooms[9] = 9;
	for (var i = 0; i < validRooms.length; i++) {
		if (validRooms[i] !== -1) {
			roomSelection.push(validRooms[i]);
		}
	}
	var selectedRoom = roomSelection[random(0, roomSelection.length - 1)];
	if (selectedRoom === 11) {
		if ([1, 3, 4, 5, 6, 9].indexOf(leftRoom) === -1) {
			setRoom(startX, startY, currentX - 1, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	if (selectedRoom === 12) {
		if ([2, 4, 6, 7, 9].indexOf(aboveRoom) === -1) {
			setRoom(startX, startY, currentX, currentY - 1, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	array[coordinate(currentX, currentY, arraySize)] = selectedRoom;
}

bigRoomList.push(BigRoom(4, 1, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = 0;
	var currentY = 0;
	var validRooms = [];
	var roomSelection = [];
	for (var i = 0; i < arraySize * arraySize; i++) {
		setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		currentX++;
		if (currentX > roomsX - 1) {
			currentX = 0;
			currentY++;
		}
		if (currentY > roomsY - 1) {
			i = arraySize * arraySize;
		}
	}
	return array;
}));

function playerSizedRoom(room) {
	room.map = BigRoom(room.mapW * 3, room.mapH * 3, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = 0;
	var currentY = 0;
	var validRooms = [];
	var roomSelection = [];
	for (var i = 0; i < arraySize * arraySize; i++) {
		setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		currentX++;
		if (currentX > roomsX - 1) {
			currentX = 0;
			currentY++;
		}
		if (currentY > roomsY - 1) {
			i = arraySize * arraySize;
		}
	}
	return array;
});
}var currentMapTiles = 0;
var mapWidth = 0;
var mapHeight = 0;
var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < 10 * 10; i++) {
	blankArray[i] = 0;
}
var currentMap = null;


var room1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room2 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1];
var room3 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room4 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room5 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1];
var room7 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
var room8 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room9 = [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room10 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room11 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room12 = [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1];
var room13 = [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];

function Room(flipX, flipY, rotate, RoomType, doors, paths, array) {
	return {
		map: array,
		doors: doors,
		paths: paths,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

function cloneRoom(room) {
	return {
		map: room.map.slice(0),
		doors: room.doors,
		paths: room.paths,
		options: room.options,
		type: room.type
	};
}

roomList.push(Room(0, 0, 0, 0, 0, 1 | 2 | 4 | 8, blankArray));
roomList.push(Room(0, 0, 0, 1, 0, 1 | 0 | 4 | 0, room1));
roomList.push(Room(0, 0, 0, 2, 0, 0 | 2 | 0 | 8, room2));
roomList.push(Room(0, 0, 0, 3, 0, 1 | 2 | 0 | 8, room3));
roomList.push(Room(0, 0, 0, 4, 0, 1 | 0 | 4 | 8, room4));
roomList.push(Room(0, 0, 0, 5, 0, 0 | 2 | 4 | 0, room5));
roomList.push(Room(0, 0, 0, 6, 0, 0 | 0 | 4 | 8, room6));
roomList.push(Room(0, 0, 0, 7, 0, 1 | 0 | 0 | 8, room7));
roomList.push(Room(0, 0, 0, 8, 0, 1 | 2 | 0 | 0, room8));
roomList.push(Room(0, 0, 0, 9, 0, 1 | 2 | 4 | 8, room9));
roomList.push(Room(0, 0, 0, 10, 1, 0 | 2 | 4 | 8, room10));
roomList.push(Room(0, 0, 0, 11, 4, 1 | 2 | 0 | 8, room11));
roomList.push(Room(0, 0, 0, 12, 8, 1 | 2 | 4 | 0, room12));
roomList.push(Room(0, 0, 0, 13, 2, 1 | 0 | 4 | 8, room13));

function BigRoom(width, height, flipX, flipY, rotate, RoomType, doors, paths, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = [];
	var currentX = -1;
	var currentY = 0;
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var arrayIndex = coordinate(Math.floor(x / 10), Math.floor(y / 10), topSize);
			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
			if (x % 10 === 0 || y % 10 === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					room = cloneRoom(roomList[array[arrayIndex]]);
					if (room.options & 4) {
						rooms[roomId] = rotate(room, 10, 10, rotation);
					} else {
						rooms[roomId] = room;
					}
				}
				room = rooms[roomId];
			}
			map[coordinate(x, y, topSize * 10)] = room.map[coordinate(x % 10, y % 10, 10)];
		}
	}
	// currentMapTiles = topSize * 10;
	// currentMap = map;
	mapHeight = topSize * 10;
	mapWidth = topSize * 10;
	realMapHeight = height * 10 * 16;
	realMapWidth = width * 10 * 16;
	return {
		map: map,
		doors: doors,
		paths: paths,
		width: width,
		height: height,
		size: topSize,
		tiles:topSize * 10,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

function enterRoom(room) {
	if(room.map.length === 0) {
		playerSizedRoom(room);
	}
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
}

function setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY) {
	roomSelection.length = 0;
	for (var e = 0; e < roomList.length; e++) {
		validRooms[e] = e;
	}
	var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
	var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
	var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
	var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
	if (currentY - 1 < 0) {
		aboveRoom = -1;
	}
	if (currentX - 1 < 0) {
		leftRoom = -1;
	}
	if (currentY + 1 > roomsY - 1) {
		belowRoom = -1;
	}
	if (currentX + 1 > roomsX - 1) {
		rightRoom = -1;
	}
	if (aboveRoom === 4 || aboveRoom === 2 || aboveRoom === 6 || aboveRoom === 7 || aboveRoom === 9 || aboveRoom === 13) {
		console.warn("Room for Above")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[2] = 2;
		validRooms[3] = 3;
		validRooms[5] = 5;
		validRooms[8] = 8;
		validRooms[9] = 9;
		if (leftRoom !== -1) {
			if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[5] = -1;
				validRooms[3] = 3;
				validRooms[8] = 8;
				validRooms[9] = 9;
				if (rightRoom !== -1) {
					if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
						validRooms[8] = -1;
					}
				}
			}
		}
		if (rightRoom !== -1) {
			if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
				console.warn("Room for Above and Left")
				validRooms[2] = -1;
				validRooms[8] = -1;
				validRooms[3] = 3;
				validRooms[5] = 5;
				validRooms[9] = 9;
				if (leftRoom !== -1) {
					if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
						validRooms[5] = -1;
					}
				}
			}
		}
	}
	if (currentX === 0) {
		console.warn("Left of Map")
		validRooms[7] = -1;
		validRooms[8] = -1;
		validRooms[1] = -1;
	}
	if (currentX === roomsX - 1) {
		console.warn("Right of Map")
		validRooms[5] = -1;
		validRooms[6] = -1;
		validRooms[1] = -1;
	}
	if (currentY === 0) {
		console.warn("Top of Map")
		validRooms[3] = -1;
		validRooms[5] = -1;
		validRooms[8] = -1;
		validRooms[2] = -1;
	}
	if (currentY === roomsY - 1) {
		console.warn("Bottom of Map")
		validRooms[4] = -1;
		validRooms[6] = -1;
		validRooms[7] = -1;
		validRooms[2] = -1;
	}
	if (currentX === startX && currentY === startY) {
		console.warn("Room for Start")
		for (var i = 0; i < validRooms.length; i++) {
			validRooms[i] = -1;
		}
		validRooms[10] = 10;
		validRooms[11] = 11;
		validRooms[12] = 12;
		validRooms[13] = 13;
		if (leftRoom === -1) {
			validRooms[11] = -1;
		}
		if (aboveRoom === -1) {
			validRooms[12] = -1;
		}
		if (rightRoom === -1) {
			validRooms[10] = -1;
		}
		if (belowRoom === -1) {
			validRooms[13] = -1;
		}
	} else {
		validRooms[10] = -1;
		validRooms[11] = -1;
		validRooms[12] = -1;
		validRooms[13] = -1;
	}
	validRooms[9] = 9;
	for (var i = 0; i < validRooms.length; i++) {
		if (validRooms[i] !== -1) {
			roomSelection.push(validRooms[i]);
		}
	}
	var selectedRoom = roomSelection[random(0, roomSelection.length - 1)];
	if (selectedRoom === 11) {
		if ([1, 3, 4, 5, 6, 9].indexOf(leftRoom) === -1) {
			setRoom(startX, startY, currentX - 1, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	if (selectedRoom === 12) {
		if ([2, 4, 6, 7, 9].indexOf(aboveRoom) === -1) {
			setRoom(startX, startY, currentX, currentY - 1, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		}
	}
	array[coordinate(currentX, currentY, arraySize)] = selectedRoom;
}

bigRoomList.push(BigRoom(4, 1, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = 0;
	var currentY = 0;
	var validRooms = [];
	var roomSelection = [];
	for (var i = 0; i < arraySize * arraySize; i++) {
		setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		currentX++;
		if (currentX > roomsX - 1) {
			currentX = 0;
			currentY++;
		}
		if (currentY > roomsY - 1) {
			i = arraySize * arraySize;
		}
	}
	return array;
}));

function playerSizedRoom(room) {
	room.map = BigRoom(room.mapW * 3, room.mapH * 3, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = 0;
	var currentY = 0;
	var validRooms = [];
	var roomSelection = [];
	for (var i = 0; i < arraySize * arraySize; i++) {
		setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
		currentX++;
		if (currentX > roomsX - 1) {
			currentX = 0;
			currentY++;
		}
		if (currentY > roomsY - 1) {
			i = arraySize * arraySize;
		}
	}
	return array;
});
}var currentMap = null;
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
				var translatedX = ((door.mapX - currentRoom.mapX) * 3);
				var translatedY = ((door.mapY - currentRoom.mapY) * 3);
				if (door.dir === "N") {
					translatedX++;
				}
				if (door.dir === "E") {
					translatedY++;
					translatedX += 3;
				}
				if (door.dir === "S") {
					translatedX++;
					translatedY += 3;
				}
				if (door.dir === "W") {
					translatedY++;
				}
				console.log(player.x, player.y)
				player.x = (translatedX * 10 * 16) + (10 / 2 * 16);
				player.y = (translatedY * 10 * 16) + (10 / 2 * 16);
				console.log(player.x, player.y)
			}
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX++;
		}
		if (door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY++;
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
	console.log(room)
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentRoom = room;
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	mapHeight = room.map.height * 10;
	mapWidth = room.map.width * 10;
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		if(door.dir === "N") {
			translatedX + 1;
		}
		if(door.dir === "E") {
			translatedY + 1;
		}
		if(door.dir === "S") {
			translatedX + 1;
		}
		if(door.dir === "W") {
			translatedY + 1;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if(player.x < 0 && door.dir === "W") {
			console.log(translatedX, playerX, translatedY)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x > currentRoom.mapW * 10 * 16 && door.dir === "E" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y > currentRoom.mapH * 10 * 16 && door.dir === "S" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		if(door.dir === "N") {
			translatedX++;
		}
		if(door.dir === "E") {
			translatedY++;
		}
		if(door.dir === "S") {
			translatedX++;
		}
		if(door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if(player.x > currentRoom.mapW * 10 * 16 && door.dir === "W") {
			console.log(translatedX, playerX, translatedY, playerY)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x > currentRoom.mapW * 10 * 16 && door.dir === "E" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y > currentRoom.mapH * 10 * 16 && door.dir === "S" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3
		if(door.dir === "N") {
			translatedX++;
		}
		if(door.dir === "E") {
			translatedY++;
		}
		if(door.dir === "S") {
			translatedX++;
		}
		if(door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if(player.x > currentRoom.mapW * 10 * 16 && door.dir === "E") {
			console.log(translatedX, playerX, translatedY, playerY)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x > currentRoom.mapW * 10 * 16 && door.dir === "E" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y > currentRoom.mapH * 10 * 16 && door.dir === "S" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if(door.dir === "N") {
			translatedX++;
		}
		if(door.dir === "E") {
			translatedY++;
		}
		if(door.dir === "S") {
			translatedX++;
		}
		if(door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if(player.x >= roomWidth && door.dir === "E") {
			console.log(translatedX, playerX, translatedY, playerY)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x > roomWidth && door.dir === "E" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y > roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if(door.dir === "N") {
			translatedX++;
		}
		if(door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if(door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if(door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if(player.x + player.w > roomWidth && door.dir === "E") {
			console.log(translatedX, playerX2, translatedY, playerY, door.mapX - currentRoom.mapX)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x + player.w > roomWidth && door.dir === "E" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y + player.h > roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX++;
		}
		if (door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if (door.dir === "S") {
			console.log(playerY,playerY2,  translatedY);
		}
		if (playerY2 === translatedY && door.dir === "S") {
			console.log(translatedY, playerY2, translatedX, playerX)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (playerY2 === translatedY && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (playerX2 === translatedX && door.dir === "S" && translatedX === playerX && translatedY === playerY2) {
			console.log("Collision with bottom door");
		}
	}
}function movePlayer() {

}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX++;
		}
		if (door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
		}
		if (door.dir === "S") {
			console.log(playerY,playerY2,  translatedY);
		}
		if (playerY2 === translatedY && door.dir === "S") {
			console.log(translatedY, playerY2, translatedX, playerX)
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
		}
		if (player.x + player.w >= roomWidth && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
			console.log("Collision with right door");
		}
		if (player.y + player.h >= roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY2) {
			console.log("Collision with bottom door");
		}
	}
}var currentMap = null;

function movePlayer(room, x, y) {
	for (var i = 0; i < room.doors.length; i++) {
		var door = room.doors[i];
		if(door.mapX === x && door.mapY === y) {

		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX++;
		}
		if (door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.x + player.w >= roomWidth && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
			console.log("Collision with right door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.y + player.h >= roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY2) {
			console.log("Collision with bottom door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
	}
}

function enterRoom(room) {
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	mapHeight = room.map.height * 10;
	mapWidth = room.map.width * 10;
}var currentMap = null;
var mapWidth = 0;
var mapHeight = 0;

function movePlayer(room, x, y) {
	for (var i = 0; i < room.doors.length; i++) {
		var door = room.doors[i];
		if(door.dir === "N") {
			y += 1;
		}
		if(door.dir === "E") {
			x += 1;
		}
		if(door.dir === "S") {
			y -= 1;
		}
		if(door.dir === "W") {
			x -= 1;
		}
		console.log(door.mapX, door.mapY, x, y)
		if (door.mapX === x && door.mapY === y) {
			var translatedX = ((door.mapX - currentRoom.mapX) * 3);
			var translatedY = ((door.mapY - currentRoom.mapY) * 3);
			if (door.dir === "N") {
				translatedX++;
			}
			if (door.dir === "E") {
				translatedY++;
				translatedX += 3;
			}
			if (door.dir === "S") {
				translatedX++;
				translatedY += 3;
			}
			if (door.dir === "W") {
				translatedY++;
			}
			enterRoom(room);
			player.x = (translatedX * 10 * 16) + (10 / 2 * 16);
			player.y = (translatedY * 10 * 16) + (10 / 2 * 16);
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX++;
		}
		if (door.dir === "E") {
			translatedY++;
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX++;
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY++;
		}
		if (player.x < 0 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with left door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.y < 0 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
			console.log("Collision with top door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.x + player.w >= roomWidth && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
			console.log("Collision with right door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
		if (player.y + player.h >= roomHeight && door.dir === "S" && translatedX === playerX && translatedY === playerY2) {
			console.log("Collision with bottom door");
			movePlayer(door.room2, door.mapX, door.mapY);
		}
	}
}

function enterRoom(room) {
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	mapHeight = room.map.height * 10;
	mapWidth = room.map.width * 10;
}function parseViewPort() {
	var canvas = tileContext.canvas;
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
function parseMinimapViewport() {
	var canvas = minimapContext.canvas;
	var deadZoneX = canvas.width / 2;
	var deadZoneY = canvas.height / 2;
	var mapX = (currentRoom.mapX * 16);
	var mapY = (currentRoom.mapY * 16);
	if (mapX - miniViewPortX + deadZoneX > canvas.width) {
		miniViewPortX = mapX - (canvas.width - deadZoneX);
	} else if (mapX - deadZoneX < miniViewPortX) {
		miniViewPortX = mapX - deadZoneX;
	}
	if (mapY - miniViewPortY + deadZoneY > canvas.height) {
		miniViewPortY = mapY - (canvas.height - deadZoneY);
	} else if (mapY - deadZoneY < miniViewPortY) {
		miniViewPortY = mapY - deadZoneY;
	}
	// if (!(0 <= miniViewPortX &&
	// 	width * 16 >= miniViewPortX + canvas.width &&
	// 	0 <= miniViewPortY &&
	// 	height * 16 >= miniViewPortY + canvas.height)) {
	// 	if (miniViewPortX < 0) {
	// 		miniViewPortX = 0;
	// 	}
	// 	if (miniViewPortY < 0) {
	// 		miniViewPortY = 0;
	// 	}
	// 	if (miniViewPortX + canvas.width > width * 16) {
	// 		miniViewPortX = (width / 2 * 16) - deadZoneX;
	// 	}
	// 	if (miniViewPortY + canvas.height > height * 16) {
	// 	console.log(true)
	// 		miniViewPortY = (height / 2 * 16) - deadZoneY;
	// 	}
	// }
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	// miniViewPortX = (window.innerWidth / 2) - (width*16) + player.x;
	// miniViewPortX = player.x;
	// miniViewPortY = (window.innerHeight / 2) - (height*16) + player.y;
	// miniViewPortY = player.y;
	// if(miniViewPortX < (window.innerWidth-(width*16))/2) {
	// miniViewPortX = 0;
	// }
	// if(miniViewPortY < (window.innerHeight-(height*16))/2) {
	// miniViewPortY = (window.innerHeight-(height*16))/2;
	// }
}var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background: "#BBBBBB",
	border: "#A0A0A0",
	other: "#CFCFCF",
	lock: "#FFFFFF"
}, {
	background: "#990000",
	border: "#FF0000",
	other: "#FF0000",
	lock: "#FF6666"
}, {
	background: "#009900",
	border: "#00BB00",
	other: "#00BB00",
	lock: "#66FF66"
}, {
	background: "#000099",
	border: "#0000FF",
	other: "#0000FF",
	lock: "#6666FF"
}, {
	background: "#9F9F9F",
	border: "#555555",
	other: "#555555",
	lock: "#B0B0B0"
}];

function startAt(x, y, region) {
	world.frontiers.length = 0;
	world.frontiers.push({
		x: x,
		y: y
	});
	world.currentRegion = region;
	world.regions.push(region);
}

function startNewRegion(region) {
	var trapped = true;
	var frontiers = getFrontiersForAllRooms();
	var test = [];
	while (trapped) {
		var emptySides = 0;
		var frontier = getRandom(frontiers);
		test.length = 0;
		test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
		for (var i = 0; i < 4; i++) {
			if (test[i] === null) {
				emptySides++;
			}
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	startAt(frontier.x, frontier.y, region);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.mapX;
	while (roomX < room.mapX + room.mapW) {
		if (canPlaceRoom(roomX, room.mapY - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY - 1
			});
		}
		if (canPlaceRoom(roomX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY + room.mapH
			});
		}
		roomX++;
	}
	var roomY = room.mapX;
	while (roomY < room.mapY + room.mapH) {
		if (canPlaceRoom(roomY, room.mapX - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX - 1
			});
		}
		if (canPlaceRoom(roomY, room.mapX + room.mapW, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX + room.mapW
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x + width - 1 || room.mapX + room.mapW - 1 < x || room.mapY > y + height - 1 || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var doors = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		doors = 0;
		doors = doors + addDoorsAlongNorthWall(room);
		doors = doors + addDoorsAlongSouthWall(room);
		doors = doors + addDoorsAlongWestWall(room);
		doors = doors + addDoorsAlongEastWall(room);
		if (room.region.rooms.length === 1 && doors > 0) {
			stop = true;
		}
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (other(door, room).region === room.region) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY - 1);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y - 1, "S", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY + room.mapH);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY + room.mapH - 1,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y + 1, "N", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX - 1, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x - 1, object.y, "E", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX + room.mapW, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX + room.mapW - 1,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x + 1, object.y, "W", object.other, room));
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x || room.mapX + room.mapW - 1 < x || room.mapY > y || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	// if (world.frontiers.length > 0) {
		var frontier = getRandom(world.frontiers);
		try {
			addRoom(growRoom(frontier.x, frontier.y));
		} catch (e) {
			console.log(world, frontier, e)
		}
	// }
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
	if (world.frontiers.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.mapColor = world.currentRegion.color;
	world.rooms.push(room);
	world.currentRegion.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		if (canPlaceRoom(mapX, room.mapY - 1, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY - 1
			});
		}
		if (canPlaceRoom(mapX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY + room.mapH
			});
		}
		mapX++;
	}
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		if (canPlaceRoom(room.mapX - 1, mapY, 1, 1)) {
			array.push({
				"x": room.mapX - 1,
				"y": mapY
			});
		}
		if (canPlaceRoom(room.mapX + room.mapW, mapY, 1, 1)) {
			array.push({
				"x": room.mapX + room.mapW,
				"y": mapY
			});
		}
		mapY++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.frontiers.length; i++) {
		if (!(world.frontiers[i].x >= room.mapX - 1 && world.frontiers[i].x <= room.mapX + room.mapW && world.frontiers[i].y >= room.mapY && world.frontiers[i].y <= room.mapY + room.mapH - 1)) {
			if (!(world.frontiers[i].x >= room.mapX && world.frontiers[i].x <= room.mapX + room.mapW - 1 && world.frontiers[i].y >= room.mapY - 1 && world.frontiers[i].y <= room.mapY + room.mapH)) {
				array.push(world.frontiers[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.currentRegion.maxW || height < world.currentRegion.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.currentRegion);
}

function Room(x, y, width, height, region) {
	return {
		mapX: x,
		mapY: y,
		mapW: width,
		mapH: height,
		mapColor: 4.281545727E9,
		region: region,
		specialType: 0,
		startPositionX:0,
		startPositionY:0,
		startRoom:false,
		doors: [],
		map:null
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: 0,
		dir: direction,
		room1: room1,
		room2: room2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = 0;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var array = [];
	var region1 = null;
	var region2 = null;
	var room1 = null;
	var room2 = null;
	var array1 = [];
	var array2 = [];
	var array3 = [];
	array3.push(world.regions[0]);
	var i = 0;
	while (array3.length > 0) {
		i++;
		array.length = 0;
		region1 = array3.shift();
		array2.push(region1);
		room1 = getRandom(region1.rooms);
		room1.specialType = i % regionColors.length;
		for (var e = 0; e < region1.rooms.length; e++) {
			room2 = region1.rooms[e];
			for (var r = 0; r < room2.doors.length; r++) {
				door = room2.doors[r];
				region2 = other(door, room2).region;
				if (region2 !== region1) {
					if (door.doorType <= 0) {
						if (array.indexOf(region2) >= 0) {
							array1.push(door);
						} else {
							door.doorType = i % regionColors.length;
							array.push(region2);
							if (array2.indexOf(region2) === -1 && array3.indexOf(region2) === -1) {
								array3.push(region2);
							}
						}
					}
				}
			}
		}
	}
	for (var t = 0; t < array1.length; t++) {
		door = array1[t];
		if (door.doorType <= 0) {
			door.doorType = parseInt(Math.random() * (i % regionColors.length)) + 1;
		}
	}
}

function other(door, room) {
	return door.room1 === room ? door.room2 : door.room1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		frontiers: [],
		regions: [],
		currentRegion: 0,

	};
	currentRegionColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(1);
	enterRoom(world.rooms[0]);
	currentRoom.startRoom = true;
	currentRoom.startPositionX = random(0,currentRoom.mapW-1);
	currentRoom.startPositionY = random(0,currentRoom.mapH-1);
	player.x = currentRoom.startPositionX * 10 * 16 + (10 / 2 * 16);
	player.y = currentRoom.startPositionY * 10 * 16 + (10 / 2 * 16);
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		rooms: []
	};
}

function startWorld() {
	create();
	drawWorld();
}

function addRoomToWorld() {
	createRoom();
	drawWorld();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function doors() {
	clearDoorTypes();
	assignDoorTypes();
	drawWorld();
}var world;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background:"#BBBBBB",
	border:"#A0A0A0",
	other:"#CFCFCF",
	lock:"#FFFFFF"
},{
	background:"#990000",
	border:"#FF0000",
	other:"#FF0000",
	lock:"#FF6666"
},{
	background:"#009900",
	border:"#00BB00",
	other:"#00BB00",
	lock:"#66FF66"
},{
	background:"#000099",
	border:"#0000FF",
	other:"#0000FF",
	lock:"#6666FF"
},{
	background:"#9F9F9F",
	border:"#555555",
	other:"#555555",
	lock:"#B0B0B0"
}];

function startAt(x, y, region) {
	world.frontiers.length = 0;
	world.frontiers.push({
		x: x,
		y: y
	});
	world.currentRegion = region;
	world.regions.push(region);
}

function startNewRegion(region) {
	var frontier = getRandom(getFrontiersForAllRooms());
	startAt(frontier.x, frontier.y, region);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.mapX;
	while (roomX < room.mapX + room.mapW) {
		if (canPlaceRoom(roomX, room.mapY - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY - 1
			});
		}
		if (canPlaceRoom(roomX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY + room.mapH
			});
		}
		roomX++;
	}
	var roomY = room.mapX;
	while (roomY < room.mapY + room.mapH) {
		if (canPlaceRoom(roomY, room.mapX - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX - 1
			});
		}
		if (canPlaceRoom(roomY, room.mapX + room.mapW, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX + room.mapW
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x + width - 1 || room.mapX + room.mapW - 1 < x || room.mapY > y + height - 1 || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var doors = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		doors = 0;
		doors = doors + addDoorsAlongNorthWall(room);
		doors = doors + addDoorsAlongSouthWall(room);
		doors = doors + addDoorsAlongWestWall(room);
		doors = doors + addDoorsAlongEastWall(room);
		if (room.region.rooms.length === 1 && doors > 0) {
			stop = true;
		}
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (other(door, room).region === room.region) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY - 1);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y-1, "S", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY + room.mapH);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY + room.mapH - 1,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y+1, "N", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX - 1, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x-1, object.y, "E", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX + room.mapW, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX + room.mapW - 1,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x+1, object.y, "W", object.other, room));
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x || room.mapX + room.mapW - 1 < x || room.mapY > y || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	var frontier = getRandom(world.frontiers);
	try {
	addRoom(growRoom(frontier.x, frontier.y));
} catch(e) {
	console.log(world,frontier, e)
}
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
	if(world.frontiers.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.mapColor = world.currentRegion.color;
	world.rooms.push(room);
	world.currentRegion.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		if (canPlaceRoom(mapX, room.mapY - 1, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY - 1
			});
		}
		if (canPlaceRoom(mapX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY + room.mapH
			});
		}
		mapX++;
	}
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		if (canPlaceRoom(room.mapX - 1, mapY, 1, 1)) {
			array.push({
				"x": room.mapX - 1,
				"y": mapY
			});
		}
		if (canPlaceRoom(room.mapX + room.mapW, mapY, 1, 1)) {
			array.push({
				"x": room.mapX + room.mapW,
				"y": mapY
			});
		}
		mapY++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.frontiers.length; i++) {
		if (!(world.frontiers[i].x >= room.mapX - 1 && world.frontiers[i].x <= room.mapX + room.mapW && world.frontiers[i].y >= room.mapY && world.frontiers[i].y <= room.mapY + room.mapH - 1)) {
			if (!(world.frontiers[i].x >= room.mapX && world.frontiers[i].x <= room.mapX + room.mapW - 1 && world.frontiers[i].y >= room.mapY - 1 && world.frontiers[i].y <= room.mapY + room.mapH)) {
				array.push(world.frontiers[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.currentRegion.maxW || height < world.currentRegion.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.currentRegion);
}

function Room(x, y, width, height, region) {
	return {
		mapX: x,
		mapY: y,
		mapW: width,
		mapH: height,
		mapColor: 4.281545727E9,
		region: region,
		specialType: 0,
		doors: []
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: 0,
		dir: direction,
		room1: room1,
		room2: room2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = 0;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var array = [];
	var region1 = null;
	var region2 = null;
	var room1 = null;
	var room2 = null;
	var array1 = [];
	var array2 = [];
	var array3 = [];
	array3.push(world.regions[0]);
	var i = 0;
	while (array3.length > 0) {
		i++;
		array.length = 0;
		region1 = array3.shift();
		array2.push(region1);
		room1 = getRandom(region1.rooms);
		room1.specialType = i % regionColors.length;
		for (var e = 0; e < region1.rooms.length; e++) {
			room2 = region1.rooms[e];
			for (var r = 0; r < room2.doors.length; r++) {
				door = room2.doors[r];
				region2 = other(door, room2).region;
				if (region2 !== region1) {
					if (door.doorType <= 0) {
						if (array.indexOf(region2) >= 0) {
							array1.push(door);
						} else {
							door.doorType = i % regionColors.length;
							array.push(region2);
							if (array2.indexOf(region2) === -1 && array3.indexOf(region2) === -1) {
								array3.push(region2);
							}
						}
					}
				}
			}
		}
	}
	for (var t = 0; t < array1.length; t++) {
		door = array1[t];
		if (door.doorType <= 0) {
			door.doorType = parseInt(Math.random() * (i % regionColors.length)) + 1;
		}
	}
}

function other(door, room) {
	return door.room1 === room ? door.room2 : door.room1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		frontiers: [],
		regions: [],
		currentRegion: 0,

	};
	currentRegionColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(2);
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		rooms: []
	};
}

function startWorld() {
	create();
	drawWorld();
}

function addRoomToWorld() {
	createRoom();
	drawWorld();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function doors() {
	clearDoorTypes();
	assignDoorTypes();
	drawWorld();
}var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background:"#BBBBBB",
	border:"#A0A0A0",
	other:"#CFCFCF",
	lock:"#FFFFFF"
},{
	background:"#990000",
	border:"#FF0000",
	other:"#FF0000",
	lock:"#FF6666"
},{
	background:"#009900",
	border:"#00BB00",
	other:"#00BB00",
	lock:"#66FF66"
},{
	background:"#000099",
	border:"#0000FF",
	other:"#0000FF",
	lock:"#6666FF"
},{
	background:"#9F9F9F",
	border:"#555555",
	other:"#555555",
	lock:"#B0B0B0"
}];

function startAt(x, y, region) {
	world.frontiers.length = 0;
	world.frontiers.push({
		x: x,
		y: y
	});
	world.currentRegion = region;
	world.regions.push(region);
}

function startNewRegion(region) {
	var frontier = getRandom(getFrontiersForAllRooms());
	startAt(frontier.x, frontier.y, region);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.mapX;
	while (roomX < room.mapX + room.mapW) {
		if (canPlaceRoom(roomX, room.mapY - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY - 1
			});
		}
		if (canPlaceRoom(roomX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY + room.mapH
			});
		}
		roomX++;
	}
	var roomY = room.mapX;
	while (roomY < room.mapY + room.mapH) {
		if (canPlaceRoom(roomY, room.mapX - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX - 1
			});
		}
		if (canPlaceRoom(roomY, room.mapX + room.mapW, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX + room.mapW
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x + width - 1 || room.mapX + room.mapW - 1 < x || room.mapY > y + height - 1 || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var doors = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		doors = 0;
		doors = doors + addDoorsAlongNorthWall(room);
		doors = doors + addDoorsAlongSouthWall(room);
		doors = doors + addDoorsAlongWestWall(room);
		doors = doors + addDoorsAlongEastWall(room);
		if (room.region.rooms.length === 1 && doors > 0) {
			stop = true;
		}
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (other(door, room).region === room.region) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY - 1);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y-1, "S", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY + room.mapH);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY + room.mapH - 1,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y+1, "N", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX - 1, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x-1, object.y, "E", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX + room.mapW, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX + room.mapW - 1,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for(var t=0;t<room.doors.length;t++) {
			if(room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x+1, object.y, "W", object.other, room));
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x || room.mapX + room.mapW - 1 < x || room.mapY > y || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	var frontier = getRandom(world.frontiers);
	try {
	addRoom(growRoom(frontier.x, frontier.y));
} catch(e) {
	console.log(world,frontier, e)
}
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
	if(world.frontiers.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.mapColor = world.currentRegion.color;
	world.rooms.push(room);
	world.currentRegion.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		if (canPlaceRoom(mapX, room.mapY - 1, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY - 1
			});
		}
		if (canPlaceRoom(mapX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY + room.mapH
			});
		}
		mapX++;
	}
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		if (canPlaceRoom(room.mapX - 1, mapY, 1, 1)) {
			array.push({
				"x": room.mapX - 1,
				"y": mapY
			});
		}
		if (canPlaceRoom(room.mapX + room.mapW, mapY, 1, 1)) {
			array.push({
				"x": room.mapX + room.mapW,
				"y": mapY
			});
		}
		mapY++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.frontiers.length; i++) {
		if (!(world.frontiers[i].x >= room.mapX - 1 && world.frontiers[i].x <= room.mapX + room.mapW && world.frontiers[i].y >= room.mapY && world.frontiers[i].y <= room.mapY + room.mapH - 1)) {
			if (!(world.frontiers[i].x >= room.mapX && world.frontiers[i].x <= room.mapX + room.mapW - 1 && world.frontiers[i].y >= room.mapY - 1 && world.frontiers[i].y <= room.mapY + room.mapH)) {
				array.push(world.frontiers[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.currentRegion.maxW || height < world.currentRegion.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.currentRegion);
}

function Room(x, y, width, height, region) {
	return {
		mapX: x,
		mapY: y,
		mapW: width,
		mapH: height,
		mapColor: 4.281545727E9,
		region: region,
		specialType: 0,
		doors: []
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: 0,
		dir: direction,
		room1: room1,
		room2: room2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = 0;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var array = [];
	var region1 = null;
	var region2 = null;
	var room1 = null;
	var room2 = null;
	var array1 = [];
	var array2 = [];
	var array3 = [];
	array3.push(world.regions[0]);
	var i = 0;
	while (array3.length > 0) {
		i++;
		array.length = 0;
		region1 = array3.shift();
		array2.push(region1);
		room1 = getRandom(region1.rooms);
		room1.specialType = i % regionColors.length;
		for (var e = 0; e < region1.rooms.length; e++) {
			room2 = region1.rooms[e];
			for (var r = 0; r < room2.doors.length; r++) {
				door = room2.doors[r];
				region2 = other(door, room2).region;
				if (region2 !== region1) {
					if (door.doorType <= 0) {
						if (array.indexOf(region2) >= 0) {
							array1.push(door);
						} else {
							door.doorType = i % regionColors.length;
							array.push(region2);
							if (array2.indexOf(region2) === -1 && array3.indexOf(region2) === -1) {
								array3.push(region2);
							}
						}
					}
				}
			}
		}
	}
	for (var t = 0; t < array1.length; t++) {
		door = array1[t];
		if (door.doorType <= 0) {
			door.doorType = parseInt(Math.random() * (i % regionColors.length)) + 1;
		}
	}
}

function other(door, room) {
	return door.room1 === room ? door.room2 : door.room1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		frontiers: [],
		regions: [],
		currentRegion: 0,

	};
	currentRegionColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(2);
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		rooms: []
	};
}

function startWorld() {
	create();
	drawWorld();
}

function addRoomToWorld() {
	createRoom();
	drawWorld();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function doors() {
	clearDoorTypes();
	assignDoorTypes();
	drawWorld();
}var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background: "#BBBBBB",
	border: "#A0A0A0",
	other: "#CFCFCF",
	lock: "#FFFFFF"
}, {
	background: "#990000",
	border: "#FF0000",
	other: "#FF0000",
	lock: "#FF6666"
}, {
	background: "#009900",
	border: "#00BB00",
	other: "#00BB00",
	lock: "#66FF66"
}, {
	background: "#000099",
	border: "#0000FF",
	other: "#0000FF",
	lock: "#6666FF"
}, {
	background: "#9F9F9F",
	border: "#555555",
	other: "#555555",
	lock: "#B0B0B0"
}];

function startAt(x, y, region) {
	world.frontiers.length = 0;
	world.frontiers.push({
		x: x,
		y: y
	});
	world.currentRegion = region;
	world.regions.push(region);
}

function startNewRegion(region) {
	var trapped = true;
	var frontiers = getFrontiersForAllRooms();
	var frontier;
	var test = [];
	while (trapped) {
		var emptySides = 0;
		frontier = getRandom(frontiers);
		test.length = 0;
		test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
		for (var i = 0; i < 4; i++) {
			if (test[i] === null) {
				emptySides++;
			}
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	startAt(frontier.x, frontier.y, region);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.mapX;
	while (roomX < room.mapX + room.mapW) {
		if (canPlaceRoom(roomX, room.mapY - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY - 1
			});
		}
		if (canPlaceRoom(roomX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY + room.mapH
			});
		}
		roomX++;
	}
	var roomY = room.mapX;
	while (roomY < room.mapY + room.mapH) {
		if (canPlaceRoom(roomY, room.mapX - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX - 1
			});
		}
		if (canPlaceRoom(roomY, room.mapX + room.mapW, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX + room.mapW
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x + width - 1 || room.mapX + room.mapW - 1 < x || room.mapY > y + height - 1 || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var doors = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		doors = 0;
		doors = doors + addDoorsAlongNorthWall(room);
		doors = doors + addDoorsAlongSouthWall(room);
		doors = doors + addDoorsAlongWestWall(room);
		doors = doors + addDoorsAlongEastWall(room);
		if (room.region.rooms.length === 1 && doors > 0) {
			stop = true;
		}
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (other(door, room).region === room.region) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY - 1);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y - 1, "S", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY + room.mapH);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY + room.mapH - 1,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y + 1, "N", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX - 1, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x - 1, object.y, "E", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX + room.mapW, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX + room.mapW - 1,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].x === object.x && room.doors[t].y === object.y) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x + 1, object.y, "W", object.other, room));
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x || room.mapX + room.mapW - 1 < x || room.mapY > y || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	if (world.frontiers.length > 0) {
		var frontier = getRandom(world.frontiers);
		try {
			addRoom(growRoom(frontier.x, frontier.y));
		} catch (e) {
			console.log(world, frontier, e)
		}
	}
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
	if (world.frontiers.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.mapColor = world.currentRegion.color;
	world.rooms.push(room);
	world.currentRegion.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		if (canPlaceRoom(mapX, room.mapY - 1, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY - 1
			});
		}
		if (canPlaceRoom(mapX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY + room.mapH
			});
		}
		mapX++;
	}
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		if (canPlaceRoom(room.mapX - 1, mapY, 1, 1)) {
			array.push({
				"x": room.mapX - 1,
				"y": mapY
			});
		}
		if (canPlaceRoom(room.mapX + room.mapW, mapY, 1, 1)) {
			array.push({
				"x": room.mapX + room.mapW,
				"y": mapY
			});
		}
		mapY++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.frontiers.length; i++) {
		if (!(world.frontiers[i].x >= room.mapX - 1 && world.frontiers[i].x <= room.mapX + room.mapW && world.frontiers[i].y >= room.mapY && world.frontiers[i].y <= room.mapY + room.mapH - 1)) {
			if (!(world.frontiers[i].x >= room.mapX && world.frontiers[i].x <= room.mapX + room.mapW - 1 && world.frontiers[i].y >= room.mapY - 1 && world.frontiers[i].y <= room.mapY + room.mapH)) {
				array.push(world.frontiers[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.currentRegion.maxW || height < world.currentRegion.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.currentRegion);
}

function Room(x, y, width, height, region) {
	return {
		mapX: x,
		mapY: y,
		mapW: width,
		mapH: height,
		mapColor: 4.281545727E9,
		region: region,
		specialType: 0,
		doors: []
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: 0,
		dir: direction,
		room1: room1,
		room2: room2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = 0;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var array = [];
	var region1 = null;
	var region2 = null;
	var room1 = null;
	var room2 = null;
	var array1 = [];
	var array2 = [];
	var array3 = [];
	array3.push(world.regions[0]);
	var i = 0;
	while (array3.length > 0) {
		i++;
		array.length = 0;
		region1 = array3.shift();
		array2.push(region1);
		room1 = getRandom(region1.rooms);
		room1.specialType = i % regionColors.length;
		for (var e = 0; e < region1.rooms.length; e++) {
			room2 = region1.rooms[e];
			for (var r = 0; r < room2.doors.length; r++) {
				door = room2.doors[r];
				region2 = other(door, room2).region;
				if (region2 !== region1) {
					if (door.doorType <= 0) {
						if (array.indexOf(region2) >= 0) {
							array1.push(door);
						} else {
							door.doorType = i % regionColors.length;
							array.push(region2);
							if (array2.indexOf(region2) === -1 && array3.indexOf(region2) === -1) {
								array3.push(region2);
							}
						}
					}
				}
			}
		}
	}
	for (var t = 0; t < array1.length; t++) {
		door = array1[t];
		if (door.doorType <= 0) {
			door.doorType = parseInt(Math.random() * (i % regionColors.length)) + 1;
		}
	}
}

function other(door, room) {
	return door.room1 === room ? door.room2 : door.room1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		frontiers: [],
		regions: [],
		currentRegion: 0,

	};
	currentRegionColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(2);
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		rooms: []
	};
}

function startWorld() {
	create();
	drawWorld();
}

function addRoomToWorld() {
	createRoom();
	drawWorld();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function doors() {
	clearDoorTypes();
	assignDoorTypes();
	drawWorld();
}