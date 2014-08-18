var map = [];

var tileSize = 16;
var numMapTiles = roomSize * 3;



var viewPortX = 0;
var viewPortY = 0;

// var room1 = [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 32, 32, 0, 0, 0, 0, 0, 0, 0, 32, 32, 32, 0, 0, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 0, 32, 32, 0, 32, 32, 32, 32, 32, 0, 0, 32, 32, 32, 32, 32, 32, 32, 0, 0, 0, 32, 32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 32];
// var room2 = [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1];
// var room3 = [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
// var room4 = [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1];
// var room5 = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// var room6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


// roomList.push(room5, room6);
var spareArray = [];





function flip(room, width, height, vertical, horizontal) {
	spareArray.length = room.length;
}

function rotate(room, width, height, times) {
	spareArray.length = 0;
	var startX = 0;
	var startY = 0;
	var endX = width;
	var endY = height;
	var position = 0;
	for (var x = 0; x < width; x++) {
		for (var y = 0; y < height; y++) {
			if (times === 0) {
				position = coordinate(x, y, roomSize);
			}
			if (times === 1) {
				position = coordinate(y, (width - x) - 1, roomSize);
			}
			if (times === 2) {
				position = coordinate(width - x - 1, height - y - 1, roomSize);
			}
			if (times === 3) {
				position = coordinate(height - y - 1, x, roomSize);
			}
			spareArray[coordinate(x, y, roomSize)] = room[position];
		}
	}
	return spareArray.slice(0);
}



var rooms = {};
var path = [0,1];

function makePath() {

}

function createMap() {
	var room;
	for (var y = 0; y < numMapTiles; y++) {
		for (var x = 0; x < numMapTiles; x++) {
			var roomId = Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize);
			if (x % roomSize === 0 || y % roomSize === 0) {
				var rotation = null;
				if (!rooms[roomId]) {
					rotation = random(0, 3);
					// room = cloneRoom(roomList[9]);
					room = cloneRoom(roomList[random(0, usableRooms)]);
					if(Math.floor(x / roomSize) === 1 && Math.floor(y / roomSize) === 1) {
						room = cloneRoom(roomList[9]);
					}
					if(Math.floor(x / roomSize) === 0 && Math.floor(y / roomSize) === 0) {
						room = cloneRoom(roomList[9]);
					}
					if(Math.floor(x / roomSize) === 1 && Math.floor(y / roomSize) === 0) {
						room = cloneRoom(roomList[7]);
					}
					if(Math.floor(x / roomSize) === 1 && Math.floor(y / roomSize) === 1) {
						room = cloneRoom(roomList[5]);
					}
					if(Math.floor(x / roomSize) === 2 && Math.floor(y / roomSize) === 1) {
						room = cloneRoom(roomList[7]);
					}
					if(Math.floor(x / roomSize) === 2 && Math.floor(y / roomSize) === 2) {
						room = cloneRoom(roomList[3]);
					}
					if (room.options & allowRotate) {
						rooms[roomId] = rotate(room, roomSize, roomSize, rotation);
					} else {
						rooms[roomId] = room;
					}

					// console.log(Math.floor(x / roomSize) + "-" + Math.floor(y / roomSize), x, y)
				}
				room = rooms[roomId];
					// console.log(room.type, x, y, room.map)
				// console.log(room)
			}
			// if ((y * numMapTiles + x) % (roomSize * roomSize) === 0) {
			// 	// room = rotate(room1, roomSize, roomSize, random(0, 3));
			// 	room = rotate(room1, roomSize, roomSize, 0);
			// 	console.log(room)
			// }
			// X and Y for room arent being calculated properly
			// console.log("X and Y: ", x, y, "map coord: ", coordinate(x, y, numMapTiles), "room coord: ", coordinate(x % roomSize, y % roomSize, roomSize));
			// console.log("Tile: ", room[coordinate(x % roomSize, y % roomSize, roomSize)], "-", roomId)
			map[coordinate(x, y, numMapTiles)] = room.map[coordinate(x % roomSize, y % roomSize, roomSize)];
			// console.log(x * numMapTiles + y)1
			// console.log((i * 10 + e) % 100,(e + 1) * (i + 1))
			// console.log(i,e,tilePosition(i, e, width),tilePosition(i, e, 10) % 100)
			// console.log(((i ) * width) + (e ))
			// room = rotate(room1, 10, 10, 3);
			// map = map.concat(room);
			// console.log(map, room)
			// for (var x = 0; x < 10; x++) {
			// for (var y = 0; y < 10; y++) {
			// console.log(tilePosition((10 * (i)) + (1 * x), (10 * (e)) + (1 * y)), (10 * (i)) + (1 * x), (10 * (e)) + (1 * y), i, e, (((i)) + (1 * x) * (width)) + (10 * (e)) + (1 * y))
			// console.log
			// map[tilePosition((10 * i) + x, (1 * e) + y)] = room[tilePosition(x, y)];
			// map[(e * width + i) * 10] = room[tilePosition(x, y)];
			// }
			// }
		}
	}
	// console.log(width, height, room1, map.length)
	// console.log(map)
}

// function createMap() {
// 	for (var i = 0; i < width; i++) {
// 		for (var e = 0; e < height; e++) {
// 			map[(i * width) + e] = 0;
// 			if (e > height / 5) {
// 				map[(i * width) + e] = random(0, 1);
// 			}
// 			if (e > height / 4) {
// 				map[(i * width) + e] = random(0, 2);
// 			}
// 			if (e > height / 3) {
// 				map[(i * width) + e] = random(0, 3);
// 			}
// 			if (e > height / 2) {
// 				map[(i * width) + e] = random(0, 4);
// 			}
// 			if (e > height / 1.5) {
// 				map[(i * width) + e] = 0;
// 			}
// 			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
// 				map[(i * width) + e] = 1;
// 			}
// 		}
// 	}
// }

// function randomizeMap() {
// 	for (var i = 0; i < width; i++) {
// 		for (var e = 0; e < height; e++) {
// 			// map[(i * width) + e] = 0;
// 			if (e > height / 5 && e < height / 4) {
// 				if (evenNumber % 8 === 0) {
// 					map[(i * width) + e] = random(0, 1);
// 				}
// 			}
// 			if (e > height / 4 && e < height / 3) {
// 				if (evenNumber % 10 === 0) {
// 					map[(i * width) + e] = random(0, 2);
// 				}
// 			}
// 			if (e > height / 3 && e < height / 2) {
// 				if (evenNumber % 8 === 0) {
// 					map[(i * width) + e] = random(0, 3);
// 				}
// 			}
// 			if (e > height / 2 && e < height / 1.5) {
// 				if (evenNumber % 10 === 0) {
// 					map[(i * width) + e] = random(0, 4);
// 				}
// 			}
// 			if (e > height / 1.5) {
// 				// map[(i * width) + e] = 0;
// 			}
// 			if (i === 0 || i === width - 1 || e === 0 || e === height - 1) {
// 				map[(i * width) + e] = 1;
// 			}
// 		}
// 	}
// }
var tiles = [];
var tile1 = {
	w: 16,
	h: 16,
	img: null,
	angle: 0
}

function tilePosition(x, y, dimention) {
	return (y * dimention || height) + x;
}