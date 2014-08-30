var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background: "#BBBBBB",
	border: "#A0A0A0",
	other: "#CFCFCF",
	lock: "#FFFFFF"
}, {
	background: "#990000",
	border: "#FF0000",
	other: "#FF0000",
	lock: "#FF6666"
}, {
	background: "#009900",
	border: "#00BB00",
	other: "#00BB00",
	lock: "#66FF66"
}, {
	background: "#000099",
	border: "#0000FF",
	other: "#0000FF",
	lock: "#6666FF"
}, {
	background: "#9F9F9F",
	border: "#555555",
	other: "#555555",
	lock: "#B0B0B0"
}];

function startAt(x, y, region) {
	world.frontiers.length = 0;
	world.frontiers.push({
		x: x,
		y: y
	});
	world.currentRegion = region;
	world.regions.push(region);
}

function startNewRegion(region) {
	var trapped = true;
	var frontiers = getFrontiersForAllRooms();
	var test = [];
	while (trapped) {
		var emptySides = 0;
		var frontier = getRandom(frontiers);
		test.length = 0;
		test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
		for (var i = 0; i < 4; i++) {
			if (test[i] === null) {
				emptySides++;
			}
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	startAt(frontier.x, frontier.y, region);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.mapX;
	while (roomX < room.mapX + room.mapW) {
		if (canPlaceRoom(roomX, room.mapY - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY - 1
			});
		}
		if (canPlaceRoom(roomX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				x: roomX,
				y: room.mapY + room.mapH
			});
		}
		roomX++;
	}
	var roomY = room.mapX;
	while (roomY < room.mapY + room.mapH) {
		if (canPlaceRoom(roomY, room.mapX - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX - 1
			});
		}
		if (canPlaceRoom(roomY, room.mapX + room.mapW, 1, 1)) {
			array.push({
				x: roomY,
				y: room.mapX + room.mapW
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x + width - 1 || room.mapX + room.mapW - 1 < x || room.mapY > y + height - 1 || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var doors = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		doors = 0;
		doors = doors + addDoorsAlongNorthWall(room);
		doors = doors + addDoorsAlongSouthWall(room);
		doors = doors + addDoorsAlongWestWall(room);
		doors = doors + addDoorsAlongEastWall(room);
		if (room.region.rooms.length === 1 && doors > 0) {
			stop = true;
		}
		for (var i = 0; i < room.doors.length; i++) {
			door = room.doors[i];
			if (other(door, room).region === room.region) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY - 1);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y - 1, "S", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		thisRoom = getRoom(mapX, room.mapY + room.mapH);
		if (thisRoom !== null) {
			array.push({
				x: mapX,
				y: room.mapY + room.mapH - 1,
				other: thisRoom
			});
		}
		mapX++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x, object.y + 1, "N", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX - 1, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x - 1, object.y, "E", object.other, room));
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var array = [];
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		thisRoom = getRoom(room.mapX + room.mapW, mapY);
		if (thisRoom !== null) {
			array.push({
				x: room.mapX + room.mapW - 1,
				y: mapY,
				other: thisRoom
			});
		}
		mapY++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.doors.length; t++) {
			if (room.doors[t].room2 === object.other) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.doors, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.other);
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(Door(object.x + 1, object.y, "W", object.other, room));
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.mapX > x || room.mapX + room.mapW - 1 < x || room.mapY > y || room.mapY + room.mapH - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	// if (world.frontiers.length > 0) {
		var frontier = getRandom(world.frontiers);
		try {
			addRoom(growRoom(frontier.x, frontier.y));
		} catch (e) {
			console.log(world, frontier, e)
		}
	// }
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
	if (world.frontiers.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.mapColor = world.currentRegion.color;
	world.rooms.push(room);
	world.currentRegion.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var mapX = room.mapX;
	while (mapX < room.mapX + room.mapW) {
		if (canPlaceRoom(mapX, room.mapY - 1, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY - 1
			});
		}
		if (canPlaceRoom(mapX, room.mapY + room.mapH, 1, 1)) {
			array.push({
				"x": mapX,
				"y": room.mapY + room.mapH
			});
		}
		mapX++;
	}
	var mapY = room.mapY;
	while (mapY < room.mapY + room.mapH) {
		if (canPlaceRoom(room.mapX - 1, mapY, 1, 1)) {
			array.push({
				"x": room.mapX - 1,
				"y": mapY
			});
		}
		if (canPlaceRoom(room.mapX + room.mapW, mapY, 1, 1)) {
			array.push({
				"x": room.mapX + room.mapW,
				"y": mapY
			});
		}
		mapY++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.frontiers.length; i++) {
		if (!(world.frontiers[i].x >= room.mapX - 1 && world.frontiers[i].x <= room.mapX + room.mapW && world.frontiers[i].y >= room.mapY && world.frontiers[i].y <= room.mapY + room.mapH - 1)) {
			if (!(world.frontiers[i].x >= room.mapX && world.frontiers[i].x <= room.mapX + room.mapW - 1 && world.frontiers[i].y >= room.mapY - 1 && world.frontiers[i].y <= room.mapY + room.mapH)) {
				array.push(world.frontiers[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.currentRegion.maxW || height < world.currentRegion.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.currentRegion);
}

function Room(x, y, width, height, region) {
	return {
		mapX: x,
		mapY: y,
		mapW: width,
		mapH: height,
		mapColor: 4.281545727E9,
		region: region,
		specialType: 0,
		startPositionX:0,
		startPositionY:0,
		startRoom:false,
		doors: []
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: 0,
		dir: direction,
		room1: room1,
		room2: room2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = 0;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var array = [];
	var region1 = null;
	var region2 = null;
	var room1 = null;
	var room2 = null;
	var array1 = [];
	var array2 = [];
	var array3 = [];
	array3.push(world.regions[0]);
	var i = 0;
	while (array3.length > 0) {
		i++;
		array.length = 0;
		region1 = array3.shift();
		array2.push(region1);
		room1 = getRandom(region1.rooms);
		room1.specialType = i % regionColors.length;
		for (var e = 0; e < region1.rooms.length; e++) {
			room2 = region1.rooms[e];
			for (var r = 0; r < room2.doors.length; r++) {
				door = room2.doors[r];
				region2 = other(door, room2).region;
				if (region2 !== region1) {
					if (door.doorType <= 0) {
						if (array.indexOf(region2) >= 0) {
							array1.push(door);
						} else {
							door.doorType = i % regionColors.length;
							array.push(region2);
							if (array2.indexOf(region2) === -1 && array3.indexOf(region2) === -1) {
								array3.push(region2);
							}
						}
					}
				}
			}
		}
	}
	for (var t = 0; t < array1.length; t++) {
		door = array1[t];
		if (door.doorType <= 0) {
			door.doorType = parseInt(Math.random() * (i % regionColors.length)) + 1;
		}
	}
}

function other(door, room) {
	return door.room1 === room ? door.room2 : door.room1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		frontiers: [],
		regions: [],
		currentRegion: 0,

	};
	currentRegionColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(1);
	currentRoom = world.rooms[0];
	currentRoom.startRoom = true;
	currentRoom.startPositionX = random(0,currentRoom.mapW-1);
	currentRoom.startPositionY = random(0,currentRoom.mapH-1);
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		rooms: []
	};
}

function startWorld() {
	create();
	drawWorld();
}

function addRoomToWorld() {
	createRoom();
	drawWorld();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function doors() {
	clearDoorTypes();
	assignDoorTypes();
	drawWorld();
}