var mouseX = 0;
var mouseY = 0;
var angleToPlayer = 0;
var bullets = [];
var lastShot = window.performance.now();
var clicking = false;
var placing = false;
var delayBetweenShots = 150;
var blocks = [0, 0, 0, 0, 0];
var mouseCanvasX = -1;
var mouseCanvasY = -1;
var selectedColor = 0;

function mousePosition(event) {
	var rect = playerCanvas.getBoundingClientRect();
	mouseCanvasX = event.clientX - rect.left;
	mouseCanvasY = event.clientY - rect.top;
	mouseX = event.clientX;
	mouseY = event.clientY;
	angleToPlayer = Math.atan2(player.y + (player.h / 2) - viewPortY - mouseCanvasY, player.x + (player.w / 2) - viewPortX - mouseCanvasX) + Math.PI;
}

function click(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = true;
	}
	if (event.which === 2) {
		selectedColor++;
		if (selectedColor > player.keys.length - 1) {
			selectedColor = 0;
		}
	}
	if (event.which === 3) {
		placing = true;
	}
}

function release(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = false;
	}
	if (event.which === 3) {
		placing = false;
	}
}

function processShot() {
	if (clicking) {
		if (window.performance.now() - lastShot > delayBetweenShots && player.keys.length > 0) {
			lastShot = window.performance.now();
			bullets.push(Bullet(player.x + (player.w / 2) + (Math.cos(angleToPlayer) * 10), player.y + (player.h / 2) + (Math.sin(angleToPlayer) * 10), angleToPlayer, player.keys[selectedColor]));
		}
	}
}

function place(event) {
	event.preventDefault();
}

function placeBlock() {
	if (placing) {
		var mapX = mouseCanvasX + viewPortX;
		var mapY = mouseCanvasY + viewPortY;
		if (mapX >= 0 && mapX < mapWidth * tileSize && mapY >= 0 && mapY < mapHeight * tileSize) {
			var coord = coordinate(modulus(mapX), modulus(mapY), currentMapTiles);
			if (currentMap[coord] === 0 && blocks[player.keys[selectedColor]] > 0) {
				currentMap[coord] = player.keys[selectedColor] + 2;
				blocks[player.keys[selectedColor]]--;
			}
		}
	}
}

function Bullet(x, y, angle, key) {
	return {
		x: x,
		y: y,
		angle: angle,
		key: key
	}
}