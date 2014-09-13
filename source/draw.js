var miniMapPixelSize = 150;

function drawMap() {
	parseViewPort();
	colorize(tileContext, currentRoom.mapColor.border, currentRoom.mapColor.border, 2);
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.mapColor.background;
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
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
	var checkedRoom = {};

	for (var y = mapY1; y < mapY2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * tileSize * 2;
		var hasFloor = 0;
		var topTile;
		colorize(tileContext, currentRoom.mapColor.background, false, false);
		for (var x = mapX1; x < mapX2; x++) {
			var coord = coordinate(x, y, currentMapTiles);
			if (currentMap[coord] === 1) {
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
			}
			if (currentMap[coord] !== 1 || x === mapX2 - 1) {
				var canvasX = startX;
				var canvasY = (y * tileSize) - viewPortY;
				if (hasFloor) {
					drawCanvasRectangle(tileContext, true, false, canvasX, canvasY - (tileSize * 0.3125), rectWidth, tileSize + (tileSize * 0.3125));
				} else {
					drawCanvasRectangle(tileContext, true, false, canvasX, canvasY, rectWidth, tileSize);
				}
			}
			if (currentMap[coord] !== 1 || x === mapX2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = mapY1; y < mapY2; y++) {
		for (var x = mapX1; x < mapX2; x++) {
			var coord = coordinate(x, y, currentMapTiles);
			var tile = currentMap[coord];
			if (tile > 1) {
				if (tile === 9 && currentRoom.specialType > -1) {
					colorize(tileContext, regionColors[currentRoom.specialType].lock, regionColors[currentRoom.specialType].border, 2);
					drawCircle(tileContext, (x * tileSize) + (tileSize / 2) - viewPortX-8, (y * tileSize) + (tileSize / 2) - viewPortY, 8, true);
				} else if (tile !== 9 && tile !== 10) {
					colorize(tileContext, regionColors[tile - 2].lock, false, false);
					drawCanvasRectangle(tileContext, true, false, (x * tileSize) - viewPortX, (y * tileSize) - viewPortY - (tileSize * 0.3125), tileSize, tileSize + (tileSize * 0.3125));
				}
			}
		}
	}

	for (var x = 0; x < mapWidth / roomSize; x++) {
		for (var y = 0; y < mapHeight / roomSize; y++) {
			var northDoor = getDoor(currentRoom, x, y, "N");
			var eastDoor = getDoor(currentRoom, x, y, "E");
			var southDoor = getDoor(currentRoom, x, y, "S");
			var westDoor = getDoor(currentRoom, x, y, "W");
			if (northDoor) {
				drawDoorArrow(northDoor, x, y);
			}
			if (eastDoor) {
				drawDoorArrow(eastDoor, x, y);
			}
			if (southDoor) {
				drawDoorArrow(southDoor, x, y);
			}
			if (westDoor) {
				drawDoorArrow(westDoor, x, y);
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapLeft);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapRight);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapTop);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapBottom);
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
			if ((currentMap[coordinate(x, y, currentMapTiles)] !== 0 && currentMap[coordinate(x, y, currentMapTiles)] !== 9) && mainTile < 1) {
				rectSize += 1 * tileSize;
				if (startPosition === -currentMapTiles * tileSize * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * tileSize) - viewPortY;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || y === mapY2 - 1 || mainTile > 0) {
				var canvasY = startPosition;
				var canvasX = (x * tileSize) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * tileSize) - viewPortX;
				var startX = canvasX;
				if (type === mapRight) {
					startX = canvasX2;
				}
				if (hasFloor) {
					canvasY = canvasY - (tileSize * 0.3125);
				}
				if (((type === mapRight && topRightTile === 0) || (type === mapLeft && topLeftTile === 0)) && mainTile > 0) {
					drawCanvasLine(borderContext, false, true, startX, canvasY, startX, canvasY2 + (tileSize * 0.1875));
				} else {
					drawCanvasLine(borderContext, false, true, startX, canvasY, startX, canvasY2);
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || y === mapY2 - 1 || mainTile > 0) {
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
			if ((currentMap[coordinate(x, y, currentMapTiles)] !== 0 && currentMap[coordinate(x, y, currentMapTiles)] !== 9) && mainTile < 1) {
				rectSize += 1 * tileSize;
				if (startPosition === -currentMapTiles * tileSize * 2) {
					startPosition = (x * tileSize) - viewPortX;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === mapX2 - 1 || mainTile > 0) {
				var canvasX = startPosition;
				var canvasY = (y * tileSize) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * tileSize) - viewPortY;
				if (type === mapTop) {
					if (hasFloor === 1) {
						drawCanvasLine(borderContext, false, true, canvasX, canvasY - (tileSize * 0.3125), canvasX2, canvasY - (tileSize * 0.3125));
						drawCanvasLine(borderContext, false, true, canvasX, canvasY + (tileSize * 0.1875), canvasX2, canvasY + (tileSize * 0.1875));
					} else {
						drawCanvasLine(borderContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
					}
				} else if (type === mapBottom) {
					drawCanvasLine(borderContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}
}

// var faviconEl = document.getElementById('f');
// var canvas = document.createElement('canvas');
// canvas.height = 16;
// canvas.width = 16;
// var ctx = canvas.getContext('2d');
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;

function drawWorld() {
	minimapCanvas.width = miniMapPixelSize;
	minimapCanvas.height = miniMapPixelSize;
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.mapX * miniMapSize) + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) * miniMapSize);
	miniMapPlayerY = (currentRoom.mapY * miniMapSize) + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) * miniMapSize);
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	drawnDoors.length = 0;
	colorize(minimapContext, "#000", false, 2);
	for (var r = 0; r < world.regions.length; r++) {
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			var room = world.regions[r].rooms[i];
			var roomX = (room.mapX * miniMapSize) - miniViewPortX;
			var roomY = (room.mapY * miniMapSize) - miniViewPortY;
			if (roomX + (room.mapW * miniMapSize) > 0 && roomY + (room.mapH * miniMapSize) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				drawCanvasRectangle(minimapContext, true, false, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
			}
		}
	}
	forEachRoom("background", "border", function(room, roomX, roomY) {
		if (room.visited) {
			drawCanvasRectangle(minimapContext, true, true, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
		}
	}, minimapContext);
	forEachRoom("border", 0, function(room, roomX, roomY) {
		if (room.region.unlocked && !room.visited) {
			drawCanvasRectangle(minimapContext, true, false, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
		}
	}, minimapContext);
	// ctx.clearRect(0, 0, 16, 16);
	// forEachRoom("background", "border", function(room, roomX, roomY) {
		// if (room.visited) {
			// drawCanvasRectangle(ctx, true, true, roomX / miniMapSize * 2, roomY / miniMapSize * 2, room.mapW * 2, room.mapH * 2);
		// }
	// }, ctx);
	// faviconEl.href = canvas.toDataURL();
	forEachRoom(0, "background", drawDoors, minimapContext);
	forEachRoom(0, 0, drawIcons, minimapContext);
	drawPlayer();
}

function forEachRoom(fillStyle, strokeStyle, fn, context) {
	var canvasContext = context || minimapContext;
	for (var r = 0; r < world.regions.length; r++) {
		colorize(canvasContext, world.regions[r].color[fillStyle] || "rgba(0,0,0,0)", world.regions[r].color[strokeStyle] || "rgba(0,0,0,0)", false);
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			var room = world.regions[r].rooms[i];
			var roomX = (room.mapX * miniMapSize) - miniViewPortX;
			var roomY = (room.mapY * miniMapSize) - miniViewPortY;
			if (roomX + (room.mapW * miniMapSize) > 0 && roomY + (room.mapH * miniMapSize) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				fn(room, roomX, roomY, canvasContext);
			}
		}
	}
}

function drawIcons(room) {
	if (room.visited) {
		var door = null;
		var color = null;
		var color2 = null;
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (door.doorType > -1) {
				var xModifier = 0;
				var yModifier = 0;
				if (door.dir === "N") {
					xModifier = 5;
				}
				if (door.dir === "S") {
					xModifier = 5;
					yModifier = 16;
				}
				if (door.dir === "W") {
					xModifier = -3;
					yModifier = 8;
				}
				if (door.dir === "E") {
					xModifier = 13;
					yModifier = 8;
				}
				colorize(minimapContext, regionColors[door.doorType].lock, regionColors[door.doorType].border, 2);
				drawCircle(minimapContext, (miniMapSize * door.mapX) + xModifier - miniViewPortX, (miniMapSize * door.mapY) + yModifier - miniViewPortY, 3, true);
			}
		}
		if (room.specialType > -1) {
			colorize(minimapContext, regionColors[room.specialType].border, regionColors[room.specialType].lock, 2);
			drawCircle(minimapContext, (miniMapSize * (room.mapX + room.mapW / 2)) - 3 - miniViewPortX, (miniMapSize * (room.mapY + room.mapH / 2)) - miniViewPortY, 3, true);
		}
	}
}

function drawCircle(context, centerX, centerY, radius, border) {
	context.beginPath();
	context.arc(centerX + radius, centerY, radius, 0, 2 * Math.PI, false);
	context.fill();
	if (border) {
		context.stroke();
	}
	context.closePath();
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
				var doorX = (miniMapSize * door.mapX) - miniViewPortX;
				var doorY = (miniMapSize * door.mapY) - miniViewPortY;

				if (door.dir === "N") {
					drawCanvasLine(minimapContext, true, true, doorX + 4, doorY, doorX + miniMapSize - 4, doorY);
				}
				if (door.dir === "S") {
					drawCanvasLine(minimapContext, true, true, doorX + 4, (miniMapSize * (door.mapY + 1)) - miniViewPortY, doorX + miniMapSize - 4, (miniMapSize * (door.mapY + 1)) - miniViewPortY);
				}
				if (door.dir === "W") {
					drawCanvasLine(minimapContext, true, true, doorX, doorY + 4, doorX, doorY + miniMapSize - 4);
				}
				if (door.dir === "E") {
					drawCanvasLine(minimapContext, true, true, (miniMapSize * (door.mapX + 1)) - miniViewPortX, doorY + 4, (miniMapSize * (door.mapX + 1)) - miniViewPortX, doorY + miniMapSize - 4);
				}
				drawnDoors.push(ID);
			}
		}
	}
}

var animationLoopProgress = 0;
var initPlayerCanvas = false;
var lastFrame = 0;


function fillKeys() {
	for (var i = 0; i < player.keys.length; i++) {
		colorize(playerContext, regionColors[player.keys[i]].lock, false, false);
		drawCanvasRectangle(playerContext, true, false, player.x - viewPortX + 1, player.y - viewPortY + ((4 - i) * player.h / 5), player.w - 2, (player.h / 5) - 1);
	}
}

function drawPlayer() {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		colorize(playerContext, 'rgba(0,0,0,0.1)', '#' + red + red + '0000', 1);
		drawCanvasRectangle(playerContext, true, true, entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		fillKeys();
	}
	animationLoopProgress += 2 * (dt / 1000);
	animationLoopProgress = animationLoopProgress % 2;
	var frame = 1;
	if (animationLoopProgress > 1) {
		frame = 0;
	}
	if (lastFrame !== frame) {
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (miniMapIconsCanvas.width !== minimapCanvas.width) {
		miniMapIconsCanvas.width = minimapCanvas.width;
		miniMapIconsCanvas.height = minimapCanvas.height;
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (!initPlayerCanvas) {
		colorize(miniMapIconsContext, false, false, 1);
		initPlayerCanvas = true;
	}
	miniMapIconsContext.clearRect(0, 0, miniMapIconsCanvas.width, miniMapIconsCanvas.height);
	drawCanvasRectangle(miniMapIconsContext, true, true, miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, miniMapSize, miniMapSize);
	// colorize(ctx, "rgba(200,200,255,1)", "rgba(200,200,255,1)", false);
	// drawCanvasRectangle(ctx, true, true, (miniMapPlayerX - miniViewPortX) / miniMapSize * 2, (miniMapPlayerY - miniViewPortY) / miniMapSize * 2, 2, 2);
	lastFrame = frame;
}

function drawArrow() {
	if (player.keys.length > 0) {
		colorize(playerContext, regionColors[player.keys[selectedColor]].lock, '#000000', false);
		moveContext(playerContext, player.x - viewPortX + (player.w / 2), player.y - viewPortY + (player.h / 2), angleToPlayer, function() {
			drawCanvasLine(playerContext, true, true, 10 + player.w, 0, 0 + player.w, -10, 0 + player.w, 10, 10 + player.w, 0);
		});
	}
}

function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		colorize(playerContext, regionColors[bullet.key].lock, regionColors[bullet.key].border, 1);
		moveContext(playerContext, bullet.x - viewPortX, bullet.y - viewPortY, bullet.angle, function() {
			drawCanvasRectangle(playerContext, true, true, 0, 0, 10, 2);
		});
	}
}

function drawDoorArrow(door, doorX, doorY) {
	var strokeStyle = '#FFFFFF';
	var fillStyle = '#000000';
	if (door.doorType > -1) {
		fillStyle = regionColors[door.doorType].lock;
	}
	colorize(tileContext, fillStyle, strokeStyle, false);
	var xOffset = tileSize * roomSize;
	var yOffset = (tileSize * roomSize) / 2;
	if (door.dir === "N") {
		xOffset = yOffset;
		yOffset = 0;
	}
	if (door.dir === "W") {
		xOffset = 0;
	}
	if (door.dir === "S") {
		xOffset = yOffset;
		yOffset = tileSize * roomSize;
	}
	moveContext(tileContext, (doorX * tileSize * roomSize) - viewPortX + xOffset, (doorY * tileSize * roomSize) - viewPortY + yOffset, false, function() {

		if (door.dir === "N") {
			drawCanvasLine(tileContext, true, true, 0, -20, 10, -10, -10, -10, 0, -20);
		}
		if (door.dir === "W") {
			drawCanvasLine(tileContext, true, true, -20, 0, -10, -10, -10, 10, -20, 0);
		}
		if (door.dir === "S") {
			drawCanvasLine(tileContext, true, true, 0, 20, 10, 10, -10, 10, 0, 20);
		}
		if (door.dir === "E") {
			drawCanvasLine(tileContext, true, true, 20, 0, 10, -10, 10, 10, 20, 0);
		}
	})
}

function colorize(context, fillStyle, strokeStyle, lineWidth) {
	if (fillStyle !== false) {
		context.fillStyle = fillStyle;
	}
	if (strokeStyle !== false) {
		context.strokeStyle = strokeStyle;
	}
	if (lineWidth !== false) {
		context.lineWidth = lineWidth;
	}
}

function drawCanvasRectangle(context, fill, stroke, x, y, w, h) {
	context.beginPath();
	context.rect(x, y, w, h);
	if (fill) {
		context.fill();
	}
	if (stroke) {
		context.stroke();
	}
	context.closePath();
}

function drawCanvasLine(context, fill, stroke, x, y) {
	context.beginPath();
	context.moveTo(x, y);
	for (var i = 3; i < arguments.length; i += 2) {
		context.lineTo(arguments[i], arguments[i + 1]);
	}
	if (fill) {
		context.fill();
	}
	if (stroke) {
		context.stroke();
	}
	context.closePath();
}

function moveContext(context, x, y, angle, callback) {
	context.save();
	context.translate(x, y);
	if (angle !== false) {
		context.rotate(angle /* * 180 / Math.PI*/ );
	}
	callback();
	context.restore();
}