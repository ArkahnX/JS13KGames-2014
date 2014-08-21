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
	var startTime = window.performance.now();
	var mapX1 = modulus(viewPortX) - 1;
	var mapY1 = modulus(viewPortY) - 1;
	var mapX2 = modulus(viewPortX) + modulus(playerCanvas.width)+2;
	var mapY2 = modulus(viewPortY) + modulus(playerCanvas.height)+2;
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
		// for (var x = 0; x < currentMapTiles; x++) {
		// 	if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
		// 		rectWidth += 1 * tileSize;
		// 		if (startX === -1) {
		// 			startX = (x * tileSize) - viewPortX;
		// 		}
		// 		if (y - 1 < 0) {
		// 			topTile = -1;
		// 		} else {
		// 			topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
		// 		}
		// 		if (topTile === 0) {
		// 			hasFloor = 1;
		// 		}
		// 		// drawTile(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
		// 	}
		// 	if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === currentMapTiles - 1) {
		// 		drawRect(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
		// 	}
		// 	if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === currentMapTiles - 1) {
		// 		rectWidth = 0;
		// 		startX = -1;
		// 		hasFloor = 0;
		// 	}
		// }
	}
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * tileSize) - viewPortY;
	setStyle(tileContext, "tile", "fillStyle", '#FF9900');
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, tileSize);
	}
	// }
}

function drawTile(x, y, map, mapSize, startX, rectWidth, hasFloor) {
	var canvasX = (x * tileSize) - viewPortX;
	var canvasY = (y * tileSize) - viewPortY;
	var canvasX2 = ((x + 1) * tileSize) - viewPortX;
	var canvasY2 = ((y + 1) * tileSize) - viewPortY;
	var leftTile = map[coordinate(x - 1, y, mapSize)];
	var topTile = map[coordinate(x, y - 1, mapSize)];
	// var middleTile = map[coordinate(x, y, mapSize)];
	var rightTile = map[coordinate(x + 1, y, mapSize)];
	var bottomTile = map[coordinate(x, y + 1, mapSize)];
	var topLeftTile = map[coordinate(x - 1, y - 1, mapSize)];
	var topRightTile = map[coordinate(x + 1, y - 1, mapSize)];
	var bottomLeftTile = map[coordinate(x - 1, y + 1, mapSize)];
	var bottomRightTile = map[coordinate(x + 1, y + 1, mapSize)];
	if (x - 1 < 0) {
		leftTile = -1;
		bottomLeftTile = -1;
		topLeftTile = -1;
	}
	if (y - 1 < 0) {
		topTile = -1;
		topLeftTile = -1;
		topRightTile = -1;

	}
	if (x + 1 > mapSize - 1) {
		rightTile = -1;
		topRightTile = -1;
		bottomRightTile = -1;
	}
	if (y + 1 > mapSize - 1) {
		bottomTile = -1;
		bottomLeftTile = -1;
		bottomRightTile = -1;
	}

	// context.fillStyle = '#FF9900';
	// if (topTile === 0) {
	// 	context.fillRect(canvasX, canvasY - 5, 16, 21);
	// } else {
	// 	context.fillRect(canvasX, canvasY, 16, 16);
	// }
	// borderContext.lineWidth = 2;
	// borderContext.strokeStyle = '#ff0000';
	setStyle(borderContext, "border", "strokeStyle", '#ff0000');
	setStyle(borderContext, "border", "lineWidth", 2);
	borderContext.beginPath();
	if (topTile === 0) {
		drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
		drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
	}
	if (topTile === -1) {
		drawLine(canvasX, canvasY, canvasX2, canvasY);
	}
	if (rightTile < 1) {
		// fills the right "floor" line
		if (topTile === 0) {
			drawLine(canvasX2, canvasY - 5, canvasX2, canvasY2);
		} else {
			drawLine(canvasX2, canvasY, canvasX2, canvasY2);
		}
	}
	if (bottomTile < 1) {
		drawLine(canvasX2, canvasY2, canvasX, canvasY2);
	}
	if (leftTile < 1) {
		// fills the left "floor" line
		if (topTile === 0) {
			drawLine(canvasX, canvasY2, canvasX, canvasY - 5);
		} else {
			drawLine(canvasX, canvasY2, canvasX, canvasY);
		}
	}
	// fills the left floor line if there is a wall
	if (leftTile > 0 && topTile > 0 && topLeftTile < 1) {
		drawLine(canvasX, canvasY - 5, canvasX, canvasY + 3);
	}
	// fills the right floor line if there is a wall
	if (rightTile > 0 && topTile > 0 && topRightTile < 1) {
		drawLine(canvasX2, canvasY - 5, canvasX2, canvasY + 3);
	}
	borderContext.closePath();
	borderContext.stroke();

}
var longestTime = 0;

function drawLine(startX, startY, endX, endY) {
	borderContext.moveTo(startX, startY);
	borderContext.lineTo(endX, endY);
}