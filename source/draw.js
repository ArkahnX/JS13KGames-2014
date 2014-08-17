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
}