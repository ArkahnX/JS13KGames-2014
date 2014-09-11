var miniMapPixelSize = 150;

function drawMap() {
	parseViewPort();
	// borderContext.strokeStyle = currentRoom.mapColor.border;
	// borderContext.lineWidth = 2;
	// tileContext.fillStyle = currentRoom.mapColor.border;
	colorize(tileContext, currentRoom.mapColor.border, currentRoom.mapColor.border, 2);
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
	var checkedRoom = {};

	for (var y = mapY1; y < mapY2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * tileSize * 2;
		var hasFloor = 0;
		var topTile;
		// tileContext.fillStyle = currentRoom.mapColor.background;
		colorize(tileContext, currentRoom.mapColor.background, false, false);
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] === 1) {
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
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 1 || x === mapX2 - 1) {
				// drawRect(y, startX, rectWidth, hasFloor);
				var canvasX = startX;
				var canvasY = (y * tileSize) - viewPortY;
				if (hasFloor) {
					// tileContext.fillRect(canvasX, canvasY - (tileSize * 0.3125), rectWidth, tileSize + (tileSize * 0.3125));
					drawCanvasRectangle(tileContext, true, false, canvasX, canvasY - (tileSize * 0.3125), rectWidth, tileSize + (tileSize * 0.3125));
				} else {
					// tileContext.fillRect(canvasX, canvasY, rectWidth, tileSize);
					drawCanvasRectangle(tileContext, true, false, canvasX, canvasY, rectWidth, tileSize);
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 1 || x === mapX2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * tileSize * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = mapY1; y < mapY2; y++) {
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] > 1) {
				if (currentMap[coordinate(x, y, currentMapTiles)] === 9 && currentRoom.specialType > -1) {
					// tileContext.fillStyle = regionColors[currentRoom.specialType].lock;
					// tileContext.strokeStyle = regionColors[currentRoom.specialType].border;
					colorize(tileContext, regionColors[currentRoom.specialType].lock, regionColors[currentRoom.specialType].border, 2);
					var radius = 8;
					tileContext.beginPath();
					tileContext.arc((x * tileSize) + (tileSize / 2) - viewPortX, (y * tileSize) + (tileSize / 2) - viewPortY, radius, 0, 2 * Math.PI, false);
					tileContext.fill();
					// tileContext.lineWidth = 2;
					tileContext.stroke();
					tileContext.closePath();
				} else if (currentMap[coordinate(x, y, currentMapTiles)] !== 9 && currentMap[coordinate(x, y, currentMapTiles)] !== 10) {
					// tileContext.fillStyle = regionColors[currentMap[coordinate(x, y, currentMapTiles)] - 2].lock;
					// console.log(regionColors[currentMap[coordinate(x, y, currentMapTiles)] - 2].lock)
					colorize(tileContext, regionColors[currentMap[coordinate(x, y, currentMapTiles)] - 2].lock, false, false);
					var canvasX = (x * tileSize) - viewPortX;
					var canvasY = (y * tileSize) - viewPortY;
					// tileContext.fillRect(canvasX, canvasY - (tileSize * 0.3125), rectWidth, tileSize + (tileSize * 0.3125));
					drawCanvasRectangle(tileContext, true, false, canvasX, canvasY - (tileSize * 0.3125), tileSize, tileSize + (tileSize * 0.3125));
					// drawRect(y, (x * tileSize) - viewPortX, tileSize, true);
					// drawCanvasRectangle(context, fill, stroke, x, y, w, h)
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

function drawRect(y, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * tileSize) - viewPortY;
	if (hasFloor) {
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
			if ((currentMap[coordinate(x, y, currentMapTiles)] !== 0 && currentMap[coordinate(x, y, currentMapTiles)] !== 9) && mainTile < 1) {
				rectSize += 1 * tileSize;
				if (startPosition === -currentMapTiles * tileSize * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * tileSize) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || y === mapY2 - 1 || mainTile > 0) {
				// borderContext.beginPath();
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
					// drawLine(startX, canvasY, startX, canvasY2 + (tileSize * 0.1875));
					drawCanvasLine(borderContext, false, true, startX, canvasY, startX, canvasY2 + (tileSize * 0.1875));
				} else {
					// drawLine(startX, canvasY, startX, canvasY2);
					drawCanvasLine(borderContext, false, true, startX, canvasY, startX, canvasY2);
				}
				// borderContext.closePath();
				// borderContext.stroke();
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
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === mapX2 - 1 || mainTile > 0) {
				// borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * tileSize) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * tileSize) - viewPortY;
				if (type === mapTop) {
					if (hasFloor === 1) {
						// drawLine(canvasX, canvasY - (tileSize * 0.3125), canvasX2, canvasY - (tileSize * 0.3125));
						// drawLine(canvasX, canvasY + (tileSize * 0.1875), canvasX2, canvasY + (tileSize * 0.1875));
						drawCanvasLine(borderContext, false, true, canvasX, canvasY - (tileSize * 0.3125), canvasX2, canvasY - (tileSize * 0.3125));
						drawCanvasLine(borderContext, false, true, canvasX, canvasY + (tileSize * 0.1875), canvasX2, canvasY + (tileSize * 0.1875));
					} else {
						// drawLine(canvasX, canvasY, canvasX2, canvasY);
						drawCanvasLine(borderContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
					}
				} else if (type === mapBottom) {
					drawCanvasLine(borderContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
					// drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				// borderContext.closePath();
				// borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === mapX2 - 1 || mainTile > 0) {
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
	minimapCanvas.width = miniMapPixelSize;
	minimapCanvas.height = miniMapPixelSize;
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.mapX * miniMapSize) + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom) * miniMapSize);
	miniMapPlayerY = (currentRoom.mapY * miniMapSize) + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom) * miniMapSize);
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	drawnDoors.length = 0;
	// minimapContext.lineWidth = 2;
	// minimapContext.fillStyle = "#000";
	colorize(minimapContext, "#000", false, 2);
	for (var r = 0; r < world.regions.length; r++) {
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			var room = world.regions[r].rooms[i];
			var roomX = (room.mapX * miniMapSize) - miniViewPortX;
			var roomY = (room.mapY * miniMapSize) - miniViewPortY;
			if (roomX + (room.mapW * miniMapSize) > 0 && roomY + (room.mapH * miniMapSize) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				// minimapContext.beginPath();
				// minimapContext.rect(roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
				// minimapContext.fill();
				// minimapContext.closePath();
				drawCanvasRectangle(minimapContext, true, false, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
			}
		}
	}
	forEachRoom("background", "border", function(room, roomX, roomY) {
		if (room.visited) {
			// minimapContext.beginPath();
			// minimapContext.rect(roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
			// minimapContext.fill();
			// minimapContext.stroke();
			// minimapContext.closePath();
			drawCanvasRectangle(minimapContext, true, true, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
		}
	}, minimapContext);
	forEachRoom("border", 0, function(room, roomX, roomY) {
		if (room.region.unlocked && !room.visited) {
			// minimapContext.beginPath();
			// minimapContext.rect(roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
			// minimapContext.fill();
			// minimapContext.stroke();
			// minimapContext.closePath();
			drawCanvasRectangle(minimapContext, true, false, roomX, roomY, room.mapW * miniMapSize, room.mapH * miniMapSize);
		}
	}, minimapContext);
	ctx.clearRect(0, 0, 16, 16);
	forEachRoom("background", "border", function(room, roomX, roomY) {
		if (room.visited) {
			// roomX = roomX - (canvas.width/2);
			// roomY = roomY - (canvas.height/2);
			// ctx.beginPath();
			// ctx.rect(roomX / miniMapSize * 2, roomY / miniMapSize * 2, room.mapW * 2, room.mapH * 2);
			// ctx.fill();
			// ctx.stroke();
			// ctx.closePath();
			drawCanvasRectangle(ctx, true, true, roomX / miniMapSize * 2, roomY / miniMapSize * 2, room.mapW * 2, room.mapH * 2);
		}
	}, ctx);
	faviconEl.href = canvas.toDataURL();
	forEachRoom(0, "background", drawDoors, minimapContext);
	forEachRoom(0, 0, drawIcons, minimapContext);
	drawPlayer();
}

function forEachRoom(fillStyle, strokeStyle, fn, context) {
	var canvasContext = context || minimapContext;
	// fillStyle = fillStyle || "rgba(0,0,0,0)";
	// strokeStyle = strokeStyle || "rgba(0,0,0,0)";
	for (var r = 0; r < world.regions.length; r++) {
		// if (typeof fillStyle === "string") {
		// 	canvasContext.fillStyle = world.regions[r].color[fillStyle];
		// } else {
		// 	canvasContext.fillStyle = "rgba(0,0,0,0)";
		// }
		// if (typeof strokeStyle === "string") {
		// 	canvasContext.strokeStyle = world.regions[r].color[strokeStyle];
		// } else {
		// 	canvasContext.strokeStyle = "rgba(0,0,0,0)";
		// }
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
				color = regionColors[door.doorType].lock;
				color2 = regionColors[door.doorType].border;
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
				drawCircle(miniMapSize * door.mapX + xModifier, miniMapSize * door.mapY + yModifier, color, color2);
			}
		}
		if (room.specialType > -1) {
			color = regionColors[room.specialType].lock;
			color2 = regionColors[room.specialType].border;
			drawCircle(miniMapSize * (room.mapX + room.mapW / 2) - 3, miniMapSize * (room.mapY + room.mapH / 2), color2, color);
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
				var doorX = (miniMapSize * door.mapX) - miniViewPortX;
				var doorY = (miniMapSize * door.mapY) - miniViewPortY;

				if (door.dir === "N") {
					// drawLine2(doorX + 4, doorY, doorX + miniMapSize - 4, doorY);
					drawCanvasLine(minimapContext, true, true, doorX + 4, doorY, doorX + miniMapSize - 4, doorY);
				}
				if (door.dir === "S") {
					// drawLine2(doorX + 4, miniMapSize * (door.mapY + 1), doorX + miniMapSize - 4, miniMapSize * (door.mapY + 1));
					drawCanvasLine(minimapContext, true, true, doorX + 4, (miniMapSize * (door.mapY + 1)) - miniViewPortY, doorX + miniMapSize - 4, (miniMapSize * (door.mapY + 1)) - miniViewPortY);
				}
				if (door.dir === "W") {
					// drawLine2(doorX, doorY + 4, doorX, doorY + miniMapSize - 4);
					drawCanvasLine(minimapContext, true, true, doorX, doorY + 4, doorX, doorY + miniMapSize - 4);
				}
				if (door.dir === "E") {
					// drawLine2(miniMapSize * (door.mapX + 1), doorY + 4, miniMapSize * (door.mapX + 1), doorY + miniMapSize - 4);
					drawCanvasLine(minimapContext, true, true, (miniMapSize * (door.mapX + 1)) - miniViewPortX, doorY + 4, (miniMapSize * (door.mapX + 1)) - miniViewPortX, doorY + miniMapSize - 4);
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


function fillKeys() {
	for (var i = 0; i < player.keys.length; i++) {
		// playerContext.beginPath();
		// playerContext.fillStyle = regionColors[player.keys[i]].lock;
		// playerContext.rect(player.x - viewPortX+1, player.y - viewPortY + ((4 - i) * player.h / 5), player.w-2, (player.h / 5)-1);
		// playerContext.fill();
		// playerContext.closePath();
		colorize(playerContext, regionColors[player.keys[i]].lock, false, false);
		drawCanvasRectangle(playerContext, true, false, player.x - viewPortX + 1, player.y - viewPortY + ((4 - i) * player.h / 5), player.w - 2, (player.h / 5) - 1);
	}
}

function drawPlayer() {
	// playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		// playerContext.beginPath();
		// playerContext.fillStyle = 'rgba(0,0,0,0.1)';
		// colorize(miniMapIconsContext, 'rgba(0,0,0,0.1)', false, 1);
		// playerContext.rect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		// playerContext.fill();
		// playerContext.closePath();
		colorize(playerContext, 'rgba(0,0,0,0.1)', '#' + red + red + '0000', 1);
		drawCanvasRectangle(playerContext, true, true, entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		fillKeys();
		// playerContext.beginPath();
		// playerContext.lineWidth = 1;
		// playerContext.strokeStyle = '#' + red + red + '0000';
		// playerContext.fillStyle = 'rgba(0,0,0,0)';
		// playerContext.rect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		// playerContext.stroke();
		// playerContext.closePath();
	}
	animationLoopProgress += 2 * (dt / 1000);
	animationLoopProgress = animationLoopProgress % 2;
	var frame = 1;
	if (animationLoopProgress > 1) {
		frame = 0;
	}
	if (lastFrame !== frame) {
		// miniMapIconsContext.fillStyle = "rgba(255,255,0," + (0.6 * frame) + ")";
		// miniMapIconsContext.strokeStyle = "rgba(255,255,0," + (0.8 * frame) + ")";
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (miniMapIconsCanvas.width !== minimapCanvas.width) {
		miniMapIconsCanvas.width = minimapCanvas.width;
		miniMapIconsCanvas.height = minimapCanvas.height;
		// miniMapIconsContext.fillStyle = "rgba(255,255,0," + (0.6 * frame) + ")";
		// miniMapIconsContext.strokeStyle = "rgba(255,255,0," + (0.8 * frame) + ")";
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (!initPlayerCanvas) {
		colorize(miniMapIconsContext, false, false, 1);
		// miniMapIconsContext.lineWidth = 1;
		initPlayerCanvas = true;
	}
	miniMapIconsContext.clearRect(0, 0, miniMapIconsCanvas.width, miniMapIconsCanvas.height);
	// miniMapIconsContext.beginPath();
	// miniMapIconsContext.rect(miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, miniMapSize, miniMapSize);
	// miniMapIconsContext.fill();
	// miniMapIconsContext.stroke();
	// miniMapIconsContext.closePath();
	drawCanvasRectangle(miniMapIconsContext, true, true, miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, miniMapSize, miniMapSize);
	// ctx.beginPath();
	// ctx.fillStyle = "rgba(200,200,255,1)";
	// ctx.strokeStyle = "rgba(200,200,255,1)";
	colorize(ctx, "rgba(200,200,255,1)", "rgba(200,200,255,1)", false);
	drawCanvasRectangle(ctx, true, true, (miniMapPlayerX - miniViewPortX) / miniMapSize * 2, (miniMapPlayerY - miniViewPortY) / miniMapSize * 2, 2, 2);
	// ctx.rect((miniMapPlayerX - miniViewPortX) / miniMapSize * 2, (miniMapPlayerY - miniViewPortY) / miniMapSize * 2, 2, 2);
	// ctx.fill();
	// ctx.stroke();
	// ctx.closePath();
	lastFrame = frame;
	// drawFrontiers();
}

function drawArrow() {
	if (player.keys.length > 0) {
		colorize(playerContext, regionColors[player.keys[selectedColor]].lock, '#000000', false);
		// playerContext.fillStyle = regionColors[player.keys[selectedColor]].lock;
		// playerContext.strokeStyle = '#000000';
		// playerContext.save();
		// playerContext.translate(player.x - viewPortX + (player.w / 2), player.y - viewPortY + (player.h / 2));
		// playerContext.rotate(angleToPlayer);
		// playerContext.beginPath();
		// playerContext.moveTo(10 + player.w, 0);
		// playerContext.lineTo(0 + player.w, -10);
		// playerContext.lineTo(0 + player.w, 10);
		// playerContext.lineTo(10 + player.w, 0);
		// playerContext.fill();
		// playerContext.stroke();
		// playerContext.closePath();
		// playerContext.restore();
		moveContext(playerContext, player.x - viewPortX + (player.w / 2), player.y - viewPortY + (player.h / 2), angleToPlayer, function() {
			drawCanvasLine(playerContext, true, true, 10 + player.w, 0, 0 + player.w, -10, 0 + player.w, 10, 10 + player.w, 0);
		});
	}
}

function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		// playerContext.fillStyle = regionColors[bullet.key].lock;
		// playerContext.strokeStyle = regionColors[bullet.key].border;
		colorize(playerContext, regionColors[bullet.key].lock, regionColors[bullet.key].border, 1);
		// playerContext.lineWidth = 1;
		moveContext(playerContext, bullet.x - viewPortX, bullet.y - viewPortY, bullet.angle, function() {
			drawCanvasRectangle(playerContext, true, true, 0, 0, 10, 2);
		});
		// playerContext.save();
		// playerContext.translate(bullet.x - viewPortX, bullet.y - viewPortY);
		// playerContext.rotate(bullet.angle);
		// playerContext.beginPath();
		// playerContext.rect(0, 0, 10, 2);
		// playerContext.fill();
		// playerContext.moveTo(0, 0);
		// playerContext.lineTo(-10, 0);
		// playerContext.stroke();
		// playerContext.closePath();
		// playerContext.restore();
	}
}

function drawDoorArrow(door, doorX, doorY) {
	var strokeStyle = '#FFFFFF';
	var fillStyle = '#000000';
	if (door.doorType > -1) {
		fillStyle = regionColors[door.doorType].lock;
	}
	colorize(tileContext, fillStyle, strokeStyle, false);
	// tileContext.save();
	var rotation = 0;
	var xOffset = tileSize * roomSize;
	var yOffset = (tileSize * roomSize) / 2;
	if (door.dir === "N") {
		rotation = 90;
		yOffset = 0;
		xOffset = (tileSize * roomSize) / 2;
	}
	if (door.dir === "W") {
		rotation = 180;
		xOffset = 0;
		yOffset = (tileSize * roomSize) / 2;
	}
	if (door.dir === "S") {
		rotation = 270;
		xOffset = (tileSize * roomSize) / 2;
		yOffset = tileSize * roomSize;
	}
	// tileContext.translate((doorX * tileSize * roomSize) - viewPortX + xOffset, (doorY * tileSize * roomSize) - viewPortY + yOffset);
	// tileContext.rotate(rotation * 180 / Math.PI);
	// tileContext.beginPath();
	moveContext(tileContext, (doorX * tileSize * roomSize) - viewPortX + xOffset, (doorY * tileSize * roomSize) - viewPortY + yOffset, false, function() {

		if (door.dir === "N") {
			// tileContext.moveTo(0, -20);
			// tileContext.lineTo(10, -10);
			// tileContext.lineTo(-10, -10);
			// tileContext.lineTo(0, -20);
			drawCanvasLine(tileContext, true, true, 0, -20, 10, -10, -10, -10, 0, -20);
		}
		if (door.dir === "W") {
			// tileContext.moveTo(-20, 0);
			// tileContext.lineTo(-10, -10);
			// tileContext.lineTo(-10, 10);
			// tileContext.lineTo(-20, 0);
			drawCanvasLine(tileContext, true, true, -20, 0, -10, -10, -10, 10, -20, 0);
		}
		if (door.dir === "S") {
			// tileContext.moveTo(0, 20);
			// tileContext.lineTo(10, 10);
			// tileContext.lineTo(-10, 10);
			// tileContext.lineTo(0, 20);
			drawCanvasLine(tileContext, true, true, 0, 20, 10, 10, -10, 10, 0, 20);
		}
		if (door.dir === "E") {
			// tileContext.moveTo(20, 0);
			// tileContext.lineTo(10, -10);
			// tileContext.lineTo(10, 10);
			// tileContext.lineTo(20, 0);
			drawCanvasLine(tileContext, true, true, 20, 0, 10, -10, 10, 10, 20, 0);
		}
	})
	// tileContext.moveTo(10, 0);
	// tileContext.lineTo(0, -10);
	// tileContext.lineTo(0, 10);
	// tileContext.lineTo(10, 0);
	// tileContext.fill();
	// tileContext.stroke();
	// tileContext.closePath();
	// tileContext.restore();
}

function drawFrontiers() {
	var frontier = null;
	var i = 0;
	// miniMapIconsContext.fillStyle = "rgba(255,255,255,0.3)";
	colorize(miniMapIconsContext, "rgba(255,255,255,0.3)", false, false);
	// var frontiers = world.frontiers;
	var frontiers = getFrontiersForAllRooms(world.regions[2]);
	while (i < frontiers.length) {
		frontier = frontiers[i];
		miniMapIconsContext.fillRect(frontier.x * miniMapSize, frontier.y * miniMapSize, miniMapSize, miniMapSize);
		// drawRectangle(Room(frontier.x, frontier.y, 1, 1, null));
		// miniMapIconsContext.beginPath();
		// // miniMapIconsContext.fillStyle = regionColors[player.keys[i]].lock;
		// miniMapIconsContext.rect((frontier.x * miniMapSize) - miniViewPortX, (frontier.y * miniMapSize) - miniViewPortY, miniMapSize, miniMapSize);
		// miniMapIconsContext.fill();
		// miniMapIconsContext.stroke();
		// miniMapIconsContext.closePath();
		drawCanvasRectangle(miniMapIconsContext, fill, stroke, (frontier.x * miniMapSize) - miniViewPortX, (frontier.y * miniMapSize) - miniViewPortY, miniMapSize, miniMapSize);
		i++;
	}
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