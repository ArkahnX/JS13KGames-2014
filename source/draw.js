function drawMap() {
	borderContext.strokeStyle = currentRoom.mapColor.border;
	borderContext.lineWidth = 2;
	parseViewPort();
	tileContext.fillStyle = currentRoom.mapColor.border;
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.mapColor.background;
	// optimize
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
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				drawRect(y, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = mapY1; y < mapY2; y++) {
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] > 1) {
				console.log()
				if (currentMap[coordinate(x, y, currentMapTiles)] === 9 && currentRoom.specialType > -1) {
					console.log(currentRoom.specialType)
					tileContext.fillStyle = regionColors[currentRoom.specialType].lock;
				} else if (currentMap[coordinate(x, y, currentMapTiles)] !== 9) {
					tileContext.fillStyle = regionColors[currentMap[coordinate(x, y, currentMapTiles)] - 2].lock;
					console.log(tileContext.fillStyle)
				}
				drawRect(y, (x * tileSize) - viewPortX, tileSize, true);
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapLeft);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, mapRight);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapTop);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, mapBottom);
}

function drawRect(y, startX, rectWidth, hasFloor) {
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
					startX = canvasX2;
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


function drawLine(startX, startY, endX, endY) {
	borderContext.moveTo(startX, startY);
	borderContext.lineTo(endX, endY);
}

var faviconEl = document.getElementById('f');
var canvas = document.createElement('canvas');
canvas.height = 16;
canvas.width = 16;
var ctx = canvas.getContext('2d');
// (function() {
// 	// faviconEl.rel = 'icon';
// 	// faviconEl.type = 'image/png'; //required for chromium
// 	// document.head.appendChild(faviconEl);
// 	var start = new Date().getTime();
// 	ctx.font = '5pt arial';
// 	(function() {
// 		parseMinimapViewport();
// 		miniMapPlayerX = (currentRoom.mapX * miniMapSize) + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) * miniMapSize);
// 		miniMapPlayerY = (currentRoom.mapY * miniMapSize) + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) * miniMapSize);
// 		minimapCanvas.width = 150;
// 		minimapCanvas.height = 150;
// 		minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
// 		drawnDoors.length = 0;
// 		minimapContext.lineWidth = 2;
// 		minimapContext.fillStyle = "#000";
// 		forEachRoom("background", "border", function(room, roomX, roomY) {
// 			if (room.visited) {
// 				minimapContext.beginPath();
// 				minimapContext.rect(roomX / miniMapSize, roomY / miniMapSize, room.mapW, room.mapH);
// 				minimapContext.fill();
// 				minimapContext.stroke();
// 				minimapContext.closePath();
// 			}
// 		});
// 	})();
// })();
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;

function drawWorld() {
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.mapX * miniMapSize) + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) * miniMapSize);
	miniMapPlayerY = (currentRoom.mapY * miniMapSize) + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) * miniMapSize);
	minimapCanvas.width = 150;
	minimapCanvas.height = 150;
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	drawnDoors.length = 0;
	minimapContext.lineWidth = 2;
	minimapContext.fillStyle = "#000";
	for (var r = 0; r < world.regions.length; r++) {
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			var room = world.regions[r].rooms[i];
			var roomX = (room.mapX * miniMapSize) - miniViewPortX;
			var roomY = (room.mapY * miniMapSize) - miniViewPortY;
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
	}, minimapContext);
	ctx.clearRect(0, 0, 16, 16);
	forEachRoom("background", "border", function(room, roomX, roomY) {
		if (room.visited) {
			ctx.beginPath();
			ctx.rect(roomX / miniMapSize * 2, roomY / miniMapSize * 2, room.mapW * 2, room.mapH * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}, ctx);
	faviconEl.href = canvas.toDataURL();
	forEachRoom(0, "background", drawDoors, minimapContext);
	forEachRoom(0, 0, drawIcons, minimapContext);
	drawPlayer();
}

function forEachRoom(fillStyle, strokeStyle, fn, context) {
	var canvasContext = context || minimapContext;
	for (var r = 0; r < world.regions.length; r++) {
		if (typeof fillStyle === "string") {
			canvasContext.fillStyle = world.regions[r].color[fillStyle];
		}
		if (typeof strokeStyle === "string") {
			canvasContext.strokeStyle = world.regions[r].color[strokeStyle];
		}
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
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (door.doorType > -1) {
				color = regionColors[door.doorType].lock;
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
		if (room.specialType > -1) {
			color = regionColors[room.specialType].lock;
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
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		playerContext.fillStyle = '#' + red + red + '0000';
		playerContext.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
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
	miniMapIconsContext.rect(miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, miniMapSize, miniMapSize);
	miniMapIconsContext.fill();
	miniMapIconsContext.stroke();
	miniMapIconsContext.closePath();
	ctx.beginPath();
	ctx.fillStyle = "rgba(200,200,255,1)";
	ctx.strokeStyle = "rgba(200,200,255,1)";
	ctx.rect((miniMapPlayerX - miniViewPortX) / miniMapSize * 2, (miniMapPlayerY - miniViewPortY) / miniMapSize * 2, 2, 2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	lastFrame = frame;
}