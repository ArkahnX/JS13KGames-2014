var currentMapTiles = 0;

var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var blankArray = [];
for (var i = 0; i < roomSize * roomSize; i++) {
	blankArray[i] = 0;
}


var smallRoomArray =
	"1111111111111111111100000000000000000000000000000000000000000000000000000000000011111111111111111111,1100000011111000001111110000111100000011110000001111000000111100000111110000111111000000111100000011,1000000001110000001111100001110001001000000000000000000000000000000000000111100011111111111111111111,1111111111111000011100000000000000000000000011000000011110000000000000000000000011000000111100000111,1111000011110000001111000000111100000011110001111111000000001100000000110000000011111111111111111111,1111111111100000000010000000001000000000100000000010000000001000000000100000000010000011111000000011,1111111111000000000100000000010000000001000000000100000000010000000001000000000110000000011100000001,1111000011110000001111000000111100000011110001111100000111110000111111000011111111111111111111111111,1110000011110000000100000000000000000000000011000000001100000000000000000000000011000000111100000111,1100000011111000001100110000110000000011000000001100000000110000000111000000111111000000111100000011,1100000011111000001111110000001100000000110000000011000000001100000111110000111111000000111100000011".split(",");

function smallRoom(RoomType, array) {
	array = array.split("");
	for (var i = 0; i < array.length; i++) {
		array[i] = parseInt(array[i]);
	}
	return {
		map: array,
		type: RoomType
	};
}

function cloneRoom(room) {
	return {
		map: room.map.slice(0),
		type: room.type
	};
}

roomList.push({
	map: blankArray,
	type: 0
});
for (var i = 0; i < smallRoomArray.length; i++) {
	roomList.push(smallRoom(i + 1, smallRoomArray[i]));
}

function BigRoom(width, height, worldRoom, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,usableRooms);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = {};
	var northDoor, eastDoor, southDoor, westDoor;
	for (var y = 0; y < topSize * roomSize; y++) {
		for (var x = 0; x < topSize * roomSize; x++) {
			var roomX = Math.floor(x / roomSize);
			var roomY = Math.floor(y / roomSize);
			northDoor = getDoor(worldRoom, roomX, roomY, "N");
			eastDoor = getDoor(worldRoom, roomX, roomY, "E");
			southDoor = getDoor(worldRoom, roomX, roomY, "S");
			westDoor = getDoor(worldRoom, roomX, roomY, "W");
			var arrayIndex = coordinate(roomX, roomY, topSize);
			var roomId = roomX + "-" + roomY;
			if (x % roomSize === 0 || y % roomSize === 0) {
				if (!rooms[roomId]) {
					room = cloneRoom(roomList[array[arrayIndex]]);
					rooms[roomId] = room;
				}
				room = rooms[roomId];
			}
			var mapCoord = coordinate(x, y, topSize * roomSize);
			var roomCoord = coordinate(x % roomSize, y % roomSize, roomSize);
			var leftMap = coordinate(x - 1, y, topSize * roomSize);
			var rightMap = coordinate(x + 1, y, topSize * roomSize);
			var aboveMap = coordinate(x, y - 1, topSize * roomSize);
			var aboveAbove = coordinate(x, y - 2, topSize * roomSize);
			if (y - 1 < 0) {
				aboveMap = -1;
			}
			if (x - 1 < 0) {
				leftMap = -1;
			}
			if (y + 1 > (height * roomSize) - 1) {
				belowMap = -1;
			}
			if (x + 1 > (width * roomSize) - 1) {
				rightMap = -1;
			}
			if (worldRoom.region.unlocked && worldRoom.region.id === 0 && room.map[roomCoord] !== 0 && x < width * roomSize && y < height * roomSize && x < width * roomSize && y < height * roomSize) {
				if (random(0, 5) === 1) {
					map[mapCoord] = random(0, regionColors.length - 1) + 2;
				} else {
					map[mapCoord] = 0;
				}
			} else {
				map[mapCoord] = room.map[roomCoord];

			}
			if (worldRoom.region.unlocked && map[mapCoord] === 0 && room.type !== 9 && x < width * roomSize && y < height * roomSize && x < width * roomSize && y < height * roomSize) {
				if (worldRoom.region.id === 1 || worldRoom.region.id === 2 || worldRoom.region.id === 3) {
					map[mapCoord] = worldRoom.region.id + 2;
				}
				if (random(0, 6) < 2 && worldRoom.region.id === 2) {
					map[mapCoord] = 0;
				}
				if (random(0, 6) < 4 && worldRoom.region.id === 3) {
					map[mapCoord] = 0;
				}
				if (random(0, 3) === 1 && worldRoom.region.id === 4) {
					map[mapCoord] = worldRoom.region.id + 2;
				}
				if (random(0, 3) === 1 && worldRoom.region.id === 0) {
					map[mapCoord] = worldRoom.region.id + 2;
				}
			}
			if (worldRoom.region.unlocked && (worldRoom.region.id === 3 || worldRoom.region.id === 4 || worldRoom.region.id === 0) && map[mapCoord] === 1 && room.type !== 9 && x < width * roomSize && y < height * roomSize && x < width * roomSize && y < height * roomSize) {
				if (random(0, 3) === 1) {
					map[mapCoord] = worldRoom.region.id + 2;
				} else if (random(0, 3) === 2) {
					map[mapCoord] = 0;
				}
			}
			var roomTileHeight = height * roomSize;
			var roomTileWidth = width * roomSize;
			var inRoomX = x % roomSize;
			var inRoomY = y % roomSize;
			// top walls
			if ((y === 0 && northDoor === null && x < roomTileWidth)) {
				map[mapCoord] = 1;
			}
			// left walls
			if ((x === 0 && westDoor === null && y < roomTileHeight)) {
				map[mapCoord] = 1;
			}
			// bottom walls
			if ((y === roomTileHeight - 1 && southDoor === null && x < roomTileWidth)) {
				map[mapCoord] = 1;
			}
			// right walls
			if ((x === roomTileWidth - 1 && eastDoor === null && y < roomTileHeight)) {
				map[mapCoord] = 1;
			}

			function test(x, y) {
				if (x > -1 && x < 2 && y > -1 && y < 2) {
					return true;
				}
				if (x > roomSize - 3 && x < roomSize && y > -1 && y < 2) {
					return true;
				}
				if (x > -1 && x < 2 && y > roomSize - 3 && y < roomSize) {
					return true;
				}
				if (x > roomSize - 3 && x < roomSize && y > roomSize - 3 && y < roomSize) {
					return true;
				}
			}
			// if ((inRoomX === 0 && inRoomY === 0) || (inRoomX === roomSize - 1 && inRoomY === 0) || (inRoomX === 0 && inRoomY === roomSize - 1) || (inRoomX === roomSize - 1 && inRoomY === roomSize - 1)) {
			// 	map[mapCoord] = 1;
			// }
			if (test(inRoomX, inRoomY)) {
				map[mapCoord] = 1;
			}
			// top walls
			if (map[mapCoord] === 0) {
				if ((y === 0 && northDoor !== null && x < roomTileWidth && northDoor.doorType > -1)) {
					map[mapCoord] = northDoor.doorType + 2;
				}
				// left walls
				if ((x === 0 && westDoor !== null && y < roomTileHeight && westDoor.doorType > -1)) {
					map[mapCoord] = westDoor.doorType + 2;
				}
				// bottom walls
				if ((y === roomTileHeight - 1 && southDoor !== null && x < roomTileWidth && southDoor.doorType > -1)) {
					map[mapCoord] = southDoor.doorType + 2;
				}
				// right walls
				if ((x === roomTileWidth - 1 && eastDoor !== null && y < roomTileHeight && eastDoor.doorType > -1)) {
					map[mapCoord] = eastDoor.doorType + 2;
				}
			}
		}
	}
	// currentMapTiles = topSize * roomSize;
	// currentMap = map;
	return {
		map: map,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * roomSize
	};
}



// function setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY) {
// 	roomSelection.length = 0;
// 	for (var e = 0; e < roomList.length; e++) {
// 		validRooms[e] = e;
// 	}
// 	var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
// 	var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
// 	var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
// 	var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
// 	if (currentY - 1 < 0) {
// 		aboveRoom = -1;
// 	}
// 	if (currentX - 1 < 0) {
// 		leftRoom = -1;
// 	}
// 	if (currentY + 1 > roomsY - 1) {
// 		belowRoom = -1;
// 	}
// 	if (currentX + 1 > roomsX - 1) {
// 		rightRoom = -1;
// 	}
// 	if (aboveRoom === 4 || aboveRoom === 2 || aboveRoom === 6 || aboveRoom === 7 || aboveRoom === 9 || aboveRoom === 13) {
// 		console.warn("Room for Above")
// 		for (var i = 0; i < validRooms.length; i++) {
// 			validRooms[i] = -1;
// 		}
// 		validRooms[2] = 2;
// 		validRooms[3] = 3;
// 		validRooms[5] = 5;
// 		validRooms[8] = 8;
// 		validRooms[9] = 9;
// 		if (leftRoom !== -1) {
// 			if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
// 				console.warn("Room for Above and Left")
// 				validRooms[2] = -1;
// 				validRooms[5] = -1;
// 				validRooms[3] = 3;
// 				validRooms[8] = 8;
// 				validRooms[9] = 9;
// 				if (rightRoom !== -1) {
// 					if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
// 						validRooms[8] = -1;
// 					}
// 				}
// 			}
// 		}
// 		if (rightRoom !== -1) {
// 			if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
// 				console.warn("Room for Above and Left")
// 				validRooms[2] = -1;
// 				validRooms[8] = -1;
// 				validRooms[3] = 3;
// 				validRooms[5] = 5;
// 				validRooms[9] = 9;
// 				if (leftRoom !== -1) {
// 					if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
// 						validRooms[5] = -1;
// 					}
// 				}
// 			}
// 		}
// 	}
// 	if (currentX === 0) {
// 		console.warn("Left of Map")
// 		validRooms[7] = -1;
// 		validRooms[8] = -1;
// 		validRooms[1] = -1;
// 	}
// 	if (currentX === roomsX - 1) {
// 		console.warn("Right of Map")
// 		validRooms[5] = -1;
// 		validRooms[6] = -1;
// 		validRooms[1] = -1;
// 	}
// 	if (currentY === 0) {
// 		console.warn("Top of Map")
// 		validRooms[3] = -1;
// 		validRooms[5] = -1;
// 		validRooms[8] = -1;
// 		validRooms[2] = -1;
// 	}
// 	if (currentY === roomsY - 1) {
// 		console.warn("Bottom of Map")
// 		validRooms[4] = -1;
// 		validRooms[6] = -1;
// 		validRooms[7] = -1;
// 		validRooms[2] = -1;
// 	}
// 	if (currentX === startX && currentY === startY) {
// 		console.warn("Room for Start")
// 		for (var i = 0; i < validRooms.length; i++) {
// 			validRooms[i] = -1;
// 		}
// 		validRooms[10] = 10;
// 		validRooms[11] = 11;
// 		validRooms[12] = 12;
// 		validRooms[13] = 13;
// 		if (leftRoom === -1) {
// 			validRooms[11] = -1;
// 		}
// 		if (aboveRoom === -1) {
// 			validRooms[12] = -1;
// 		}
// 		if (rightRoom === -1) {
// 			validRooms[10] = -1;
// 		}
// 		if (belowRoom === -1) {
// 			validRooms[13] = -1;
// 		}
// 	} else {
// 		validRooms[10] = -1;
// 		validRooms[11] = -1;
// 		validRooms[12] = -1;
// 		validRooms[13] = -1;
// 	}
// 	validRooms[9] = 9;
// 	for (var i = 0; i < validRooms.length; i++) {
// 		if (validRooms[i] !== -1) {
// 			roomSelection.push(validRooms[i]);
// 		}
// 	}
// 	var selectedRoom = roomSelection[random(0, roomSelection.length - 1)];
// 	if (selectedRoom === 11) {
// 		if ([1, 3, 4, 5, 6, 9].indexOf(leftRoom) === -1) {
// 			setRoom(startX, startY, currentX - 1, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
// 		}
// 	}
// 	if (selectedRoom === 12) {
// 		if ([2, 4, 6, 7, 9].indexOf(aboveRoom) === -1) {
// 			setRoom(startX, startY, currentX, currentY - 1, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
// 		}
// 	}
// 	array[coordinate(currentX, currentY, arraySize)] = selectedRoom;
// }

function playerSizedRoom(room) {
	room.map = BigRoom(room.mapW * segmentsPerRoom, room.mapH * segmentsPerRoom, room, function(array, roomsX, roomsY, arraySize) {
		var currentX = 0;
		var currentY = 0;
		var roomID = 0;
		for (var i = 0; i < arraySize * arraySize; i++) {
			// var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
			// var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
			// var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
			// var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
			// var roomX = Math.floor(currentX / roomSize);
			// var roomY = Math.floor(currentY / roomSize);
			var northDoor = getDoor(room, currentX, currentY, "N");
			var eastDoor = getDoor(room, currentX, currentY, "E");
			var southDoor = getDoor(room, currentX, currentY, "S");
			var westDoor = getDoor(room, currentX, currentY, "W");
			var horizontalRooms = [1, 3, 4, 9];
			var verticalRooms = [2, 9, 10, 11];
			// if (currentY - 1 < 0) {
			// 	aboveRoom = -1;
			// }
			// if (currentX - 1 < 0) {
			// 	leftRoom = -1;
			// }
			// if (currentY + 1 > roomsY - 1) {
			// 	belowRoom = -1;
			// }
			// if (currentX + 1 > roomsX - 1) {
			// 	rightRoom = -1;
			// }
			// setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
			if (currentX === 0 || currentY === 0 || currentX === roomsX - 1 || currentY === roomsY - 1) {
				roomID = random(0, 11);
			}
			if (currentX === 0 || currentX === roomsX - 1) {
				roomID = verticalRooms[random(0, 3)];
			}
			if ((currentY === 0 || currentY === roomsY - 1)) {
				roomID = horizontalRooms[random(0, 3)];
			}
			if ((currentX === 0 && currentY === 0) || (currentX === roomsX - 1 && currentY === 0) || (currentX === roomsX - 1 && currentY === roomsY - 1) || (currentX === 0 && currentY === roomsY - 1)) {
				roomID = 9;
			}
			if (room.mapW === 1) {
				roomID = verticalRooms[random(0, 3)];
			}
			if (room.mapH === 1) {
				roomID = horizontalRooms[random(0, 3)];
			}
			// if (room.mapW === 2 || room.mapH === 2) {
			if (currentX === 0 && currentY === 0) {
				roomID = 6;
			}
			if (currentX === roomsX - 1 && currentY === 0) {
				roomID = 7;
			}
			if (currentX === 0 && currentY === roomsY - 1) {
				roomID = 5;
			}
			if (currentX === roomsX - 1 && currentY === roomsY - 1) {
				roomID = 8;
			}
			// }
			if (northDoor || southDoor || eastDoor || westDoor) {
				roomID = 9;
			}
			array[coordinate(currentX, currentY, arraySize)] = roomID;
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
	if (room.specialType > -1 && player.keys.indexOf(room.specialType) === -1) {
		var attempts = 0;
		var found = false;
		while (found === false && attempts < 5) {
			if (room.startRoom) {
				var randomW = room.startPositionX * segmentsPerRoom;
				var randomH = room.startPositionY * segmentsPerRoom;
				var randomX = random(1, roomSize - 1);
				var randomY = random(1, roomSize - 1);
			} else {
				var randomW = random(1, room.mapW * segmentsPerRoom) - 1;
				var randomH = random(1, room.mapH * segmentsPerRoom) - 1;
				var randomX = random(1, roomSize - 1);
				var randomY = random(1, roomSize - 1);
			}
			var coord = coordinate((randomW * roomSize) + randomX, (randomH * roomSize) + randomY, room.map.tiles);
			var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.region.id + 2;
			if (validPlacement) {
				found = true;
				room.map.map[coordinate((randomW * roomSize) + randomX, (randomH * roomSize) + randomY, room.map.tiles)] = 9;
			}
			attempts++;
		}
		if (!found) {
			if (room.startRoom) {
				var startX = room.startPositionX * segmentsPerRoom * roomSize;
				var startY = room.startPositionY * segmentsPerRoom * roomSize;
				for (var x = startX + 1; x < startX + roomSize - 1; x++) {
					for (var y = startY + 1; y < startY + roomSize - 1; y++) {
						var coord = coordinate(x, y, room.map.tiles);
						var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.region.id + 2;
						if (validPlacement) {
							room.map.map[coord] = 9;
						}
					}
				}
			} else {
				var startX = room.startPositionX * segmentsPerRoom * roomSize;
				var startY = room.startPositionY * segmentsPerRoom * roomSize;
				for (var x = 0 + 1; x < (room.mapW * segmentsPerRoom * roomSize) - 1; x++) {
					for (var y = 0 + 1; y < (room.mapH * segmentsPerRoom * roomSize) - 1; y++) {
						var coord = coordinate(x, y, room.map.tiles);
						var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.region.id + 2;
						if (validPlacement) {
							room.map.map[coord] = 9;
						}
					}
				}
			}
		}
	}
}