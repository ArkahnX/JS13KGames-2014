var mapLeft = 1;
var mapTop = 2;
var mapRight = 4;
var mapBottom = 8;
var allowFlipX = 1;
var allowFlipY = 2;
var allowRotate = 4;
var usableRooms = 9;
var roomSize = 10;
var currentMapTiles = 0;
var mapWidth = 0;
var mapHeight = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < roomSize * roomSize; i++) {
	blankArray[i] = 0;
}
var currentMap = null;


var room1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room2 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1];
var room3 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room4 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room5 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1];
var room7 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1];
var room8 = [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room9 = [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1];
var room10 = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
var room11 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
var room12 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var room13 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
	console.log(array);
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
					// room = cloneRoom(roomList[9]);
					room = cloneRoom(roomList[array[arrayIndex]]);
					// console.log(roomId, array[arrayIndex], room.map)
					if (room.options & allowRotate) {
						rooms[roomId] = rotate(room, roomSize, roomSize, rotation);
					} else {
						rooms[roomId] = room;
					}
				}
				room = rooms[roomId];
			}
			console.log(coordinate(x, y, topSize * roomSize), coordinate(x % roomSize, y % roomSize, roomSize))
			map[coordinate(x, y, topSize * roomSize)] = room.map[coordinate(x % roomSize, y % roomSize, roomSize)];

			// 	if (x % roomSize === 0) {
			// 		currentX = currentX + 1;
			// 	}
			// 	if (currentX > width - 1) {
			// 		currentX = 0;
			// 		currentY++;
			// 	}
			// 	var roomCoordinate = coordinate(currentX, currentY, topSize);
			// 	// console.log(x, y, currentX, currentY, roomCoordinate, array[roomCoordinate], width, height)
			// 	}
			// }
		}
	}
	currentMapTiles = topSize * roomSize;
	currentMap = map;
	mapHeight = topSize * roomSize;
	mapWidth = topSize * roomSize;
	console.log(map);
	return {
		map: map,
		doors: doors,
		paths: paths,
		width: width,
		height: height,
		size: topSize,
		options: (flipX * 1) | (flipY * 2) | (rotate * 4),
		type: RoomType
	};
}

bigRoomList.push(BigRoom(2, 2, 0, 0, 0, 0, 0, 1 | 2 | 4 | 8, function(array, roomsX, roomsY, arraySize) {
	var startX = random(0, roomsX - 1);
	var startY = random(0, roomsY - 1);
	var startDirection = random(0, 3);
	var currentX = startX;
	var currentY = startY;
	if (startDirection === 0) { // door is in the left wall
		array[coordinate(startX, startY, arraySize)] = 10;
	}
	if (startDirection === 1) { // door is in the top wall
		array[coordinate(startX, startY, arraySize)] = 13;

	}
	if (startDirection === 2) { // door is in the right wall
		array[coordinate(startX, startY, arraySize)] = 11;
	}
	if (startDirection === 3) { // door is in the bottom wall
		array[coordinate(startX, startY, arraySize)] = 12;
	}
	var path = true;
	var visited = [startX + "-" + startY];
	var previousX = startX;
	var previousY = startY;
	var previousRoom = roomList[array[coordinate(startX, startY, arraySize)]];
	var attempts = 0;
	while (path && attempts < 4) {
		var direction = random(1, 5);
		if (direction === 2 || direction === 1) {
			currentX++;
		}
		if (direction === 4 || direction === 3) {
			currentX--;
		}
		if (direction === 5) {
			currentY++;
		}
		if (currentX > roomsX - 1) {
			currentY++;
			currentX = roomsX - 1;
		}
		if (currentX < 0) {
			currentY++;
			currentX = 0;
		}
		if (currentY > roomsY - 1) {
			currentY = roomsY - 1;
		}
		if (currentY < 0) {
			currentY = 0;
		}
		if (visited.indexOf(currentX + "-" + currentY) === -1) {
			console.log()
			array[coordinate(currentX, currentY, arraySize)] = 9;
			previousRoom = roomList[array[coordinate(currentX, currentY, arraySize)]];
			previousX = currentX;
			previousY = currentY;
			visited.push(currentX + "-" + currentY);
		} else {
			attempts++;
		}

	}

	for (var x = 0; x < roomsX; x++) {
		for (var y = 0; y < roomsY; y++) {
			if (x === 0 && y === 0) {

			}
		}
	}
	return array;
}));