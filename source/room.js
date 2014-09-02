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



var roomOne = "1111111111111111111111111111110000000000000000000000000000001111111111111111111111111111111111111111";
var roomTwo = "1110001111111000111111100011111110001111111000111111100011111110001111111000111111100011111110001111";
var roomThree = "1000000001110000001111100001110001001000000000000000000000000000000000000111100011111111111111111111";
var roomFour = "1111111111111000011100000000000000000000000011000000011110000000000000000000000011000000111100000111";
var roomFive = "1100000011110000001111000001111110000001111000000011110000001111100000111111000011111111111111111111";
var roomSix = "1111111111100000000110000000001100000000110001100011100011101110000011111100000111110000011111100001";
var roomSeven = "1111111111100000000100000000010000000011000110001100110001110110000111010000111111000011111000011111";
var roomEight = "1100000011110000001111100000111000000111000000011100000011110000011111000011111111111111111111111111";
var roomNine = "1110000011110000000100000000000000000000000011000000001100000000000000000000000011000000111100000111";
var roomTen = "1111111111111000000011100000001220000000122000000012200000001111100000111110000011111000001111111111";
var roomEleven = "1111111111000000111100000011110000002211000000221100000022110000111111000011111100001111111111111111";
var roomTwelve = "1110000111100000000110000000011000110001100111100110000000011000000001100000000111122221111112222111";
var roomThirteen = "1112222111111222211110000000011000000001100000000110011110011000000001100000000110000000011100000111";

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
roomList.push(smallRoom(1, roomOne));
roomList.push(smallRoom(2, roomTwo));
roomList.push(smallRoom(3, roomThree));
roomList.push(smallRoom(4, roomFour));
roomList.push(smallRoom(5, roomFive));
roomList.push(smallRoom(6, roomSix));
roomList.push(smallRoom(7, roomSeven));
roomList.push(smallRoom(8, roomEight));
roomList.push(smallRoom(9, roomNine));
roomList.push(smallRoom(10, roomTen));
roomList.push(smallRoom(11, roomEleven));
roomList.push(smallRoom(12, roomTwelve));
roomList.push(smallRoom(13, roomThirteen));

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
			map[mapCoord] = room.map[roomCoord];
			if (x === 0) {
				// console.log(roomX, roomY, worldRoom)
			}
			// top walls
			if ((y === 0 && northDoor === null && x < width * roomSize)) {
				map[mapCoord] = 1;
			}
			// left walls
			if ((x === 0 && westDoor === null && y < height * roomSize)) {
				map[mapCoord] = 1;
			}
			// bottom walls
			if ((y === height * roomSize - 1 && southDoor === null && x < width * roomSize)) {
				map[mapCoord] = 1;
			}
			// right walls
			if ((x === width * roomSize - 1 && eastDoor === null && y < height * roomSize)) {
				map[mapCoord] = 1;
			}
			// top walls
			if ((y === 0 && northDoor !== null && x < width * roomSize && northDoor.doorType > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = northDoor.doorType + 1;
			}
			// left walls
			if ((x === 0 && westDoor !== null && y < height * roomSize && westDoor.doorType > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = westDoor.doorType + 1;
			}
			// bottom walls
			if ((y === height * roomSize - 1 && southDoor !== null && x < width * roomSize && southDoor.doorType > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = southDoor.doorType + 1;
			}
			// right walls
			if ((x === width * roomSize - 1 && eastDoor !== null && y < height * roomSize && eastDoor.doorType > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = eastDoor.doorType + 1;
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