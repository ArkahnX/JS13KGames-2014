var currentMapTiles = 0;

var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < roomSize * roomSize; i++) {
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
		// array[i] = random(0,usableRooms);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = [];
	var currentX = -1;
	var currentY = 0;
	for (var y = 0; y < topSize * roomSize; y++) {
		for (var x = 0; x < topSize * roomSize; x++) {
			var arrayIndex = coordinate(Math.floor(x / roomSize), Math.floor(y / roomSize), topSize);
			var roomId = Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize);
			if (x % roomSize === 0 || y % roomSize === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					room = cloneRoom(roomList[array[arrayIndex]]);
					if (room.options & allowRotate) {
						rooms[roomId] = rotate(room, roomSize, roomSize, rotation);
					} else {
						rooms[roomId] = room;
					}
				}
				room = rooms[roomId];
			}
			map[coordinate(x, y, topSize * roomSize)] = room.map[coordinate(x % roomSize, y % roomSize, roomSize)];
		}
	}
	// currentMapTiles = topSize * roomSize;
	// currentMap = map;
	realMapHeight = height * roomSize * tileSize;
	realMapWidth = width * roomSize * tileSize;
	return {
		map: map,
		doors: doors,
		paths: paths,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * roomSize,
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
	room.map = BigRoom(room.mapW * segmentsPerRoom, room.mapH * segmentsPerRoom, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
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
}