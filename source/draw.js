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
			// context.fillStyle = '#000';
			// context.font = '5pt Calibri';
			// context.fillText((x % roomSize) + "-" + (y % roomSize), x * 16, (y+0.6) * 16);
			// context.fillText(coordinate(x, y, numMapTiles), x * 16, (y + 0.6) * 16);
		}
	}
	// console.log(sample)
}

function drawTile(x, y) {
	var canvasX = (x * 16) - viewPortX;
	var canvasY = (y * 16) - viewPortY;
	context.fillStyle = '#FF9900';
	context.fillRect(canvasX, canvasY, 16, 16);
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

	context.lineWidth = 2;
	context.strokeStyle = '#ff0000';
	context.beginPath();
	if (topTile === 0 || isNaN(topTile)) {
		drawLine(canvasX, canvasY, ((x + 1) * tileSize) - viewPortX, canvasY);
	}
	if (leftTile === 0 || isNaN(leftTile)) {
		drawLine(canvasX, canvasY, canvasX, ((y + 1) * tileSize) - viewPortY);
	}
	if (bottomTile === 0 || isNaN(bottomTile)) {
		drawLine(canvasX, ((y + 1) * tileSize) - viewPortY, ((x + 1) * tileSize) - viewPortX, ((y + 1) * tileSize) - viewPortY);
	}
	if (rightTile === 0 || isNaN(rightTile)) {
		drawLine(((x + 1) * tileSize) - viewPortX, canvasY, ((x + 1) * tileSize) - viewPortX, ((y + 1) * tileSize) - viewPortY);
	}
	context.closePath();
	context.stroke();
}

function drawLine(startX, startY, endX, endY) {
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
}