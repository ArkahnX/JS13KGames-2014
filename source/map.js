var map = [];
var evenNumber = 0;
var width = random(window.innerWidth / 16 / 2, window.innerWidth / 16);
var height = random(window.innerHeight / 16 / 2, window.innerHeight / 16);


function createMap() {
	for (var i = 0; i < width; i++) {
		for (var e = 0; e < height; e++) {
			map[(i * width) + e] = 0;
			if (e > height / 5) {
				map[(i * width) + e] = random(0, 1);
			}
			if (e > height / 4) {
				map[(i * width) + e] = random(0, 2);
			}
			if (e > height / 3) {
				map[(i * width) + e] = random(0, 3);
			}
			if (e > height / 2) {
				map[(i * width) + e] = random(0, 4);
			}
			if (e > height / 1.5) {
				map[(i * width) + e] = 0;
			}
			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
				map[(i * width) + e] = 1;
			}
		}
	}
}

function randomizeMap() {
	for (var i = 0; i < width; i++) {
		for (var e = 0; e < height; e++) {
			// map[(i * width) + e] = 0;
			if (e > height / 5 && e < height / 4) {
				if (evenNumber % 8 === 0) {
					map[(i * width) + e] = random(0, 1);
				}
			}
			if (e > height / 4 && e < height / 3) {
				if (evenNumber % 10 === 0) {
					map[(i * width) + e] = random(0, 2);
				}
			}
			if (e > height / 3 && e < height / 2) {
				if (evenNumber % 8 === 0) {
					map[(i * width) + e] = random(0, 3);
				}
			}
			if (e > height / 2 && e < height / 1.5) {
				if (evenNumber % 10 === 0) {
					map[(i * width) + e] = random(0, 4);
				}
			}
			if (e > height / 1.5) {
				// map[(i * width) + e] = 0;
			}
			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
				map[(i * width) + e] = 1;
			}
		}
	}

}
var tiles = [];
var tile1 = {
	w: 16,
	h: 16,
	img: null,
	angle: 0
}

function tilePosition(x, y) {
	return (x * width) + y;
}

function drawLine(startX, startY, endX, endY) {

	context.moveTo(startX, startY);
	context.lineTo(endX, endY);

}

function drawTile(x, y) {
	var leftTile = map[tilePosition(x - 1, y)];
	var topTile = map[tilePosition(x, y - 1)];
	var middleTile = map[tilePosition(x, y)];
	var rightTile = map[tilePosition(x + 1, y)];
	var bottomTile = map[tilePosition(x, y + 1)];
	context.beginPath();
	context.lineWidth = 2;
	if (topTile === 0 || isNaN(topTile)) {
		drawLine(x * 16, y * 16, (x + 1) * 16, y * 16);
	}
	if (leftTile === 0 || isNaN(leftTile)) {
		drawLine(x * 16, y * 16, x * 16, (y + 1) * 16);
	}
	if (bottomTile === 0 || isNaN(bottomTile)) {
		drawLine(x * 16, (y + 1) * 16, (x + 1) * 16, (y + 1) * 16);
	}
	if (rightTile === 0 || isNaN(rightTile)) {
		drawLine((x + 1) * 16, y * 16, (x + 1) * 16, (y + 1) * 16);
	}
	context.strokeStyle = '#ff0000';
	context.stroke();
	context.closePath();
	// context.fillStyle = '#FF9900';
	// context.fillRect(x * 16, y * 16, 16, 16);
}

function drawMap() {
	for (var i = 0; i < width; i++) {
		for (var e = 0; e < height; e++) {
			if (map[(i * width) + e] !== 0) {
				drawTile(i, e);
				// drawImg(tile1, i * 16, e * 16);
			}
		}
	}
}