var world = null;
var currentRoom = null;

var chanceOfAddingDoor = 0.2;
var currentRegionColorIndex = 0;
var regionColors = [{
	background: "#BBBBBB",
	border: "#A0A0A0",
	other: "#CFCFCF",
	lock: "#FFFFFF",
	name: "Dungeon"
}, {
	background: "#FF3333",
	border: "#990000",
	other: "#FF0000",
	lock: "#FFAAAA",
	name: "Fire"
}, {
	background: "#00BB00",
	border: "#006600",
	other: "#00BB00",
	lock: "#AAFFAA",
	name: "Air"
}, {
	background: "#3333FF",
	border: "#000066",
	other: "#0000FF",
	lock: "#AAAAFF",
	name: "Water"
}, {
	background: "#9F9F9F",
	border: "#555555",
	other: "#555555",
	lock: "#000000",
	name: "Earth"
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

function startNewRegion(region, previousRegion) {
	var trapped = true;
	var frontiers = getFrontiersForAllRooms(previousRegion);
	var test = [];
	var frontier = null;
	var used = [];
	while (trapped) {
		var emptySides = 0;
		frontier = getRandom(frontiers, used);
		test.length = 0;
		if (frontier) {
			test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
			for (var i = 0; i < 4; i++) {
				if (test[i] === null) {
					emptySides++;
				}
			}
		} else {
			trapped = false;
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	if (frontier) {
		startAt(frontier.x, frontier.y, region);
	}
}

function getRandom(array, used) {
	if (used.length === array.length) {
		return false;
	}
	var index = random(0, array.length - 1);
	while (used.indexOf(index) > -1) {
		index = random(0, array.length - 1);
	}
	used.push(index);
	return array[index];
}

function getFrontiersForAllRooms(previousRegion) {
	var results = [];
	var rooms = world.rooms;
	if (previousRegion) {
		rooms = previousRegion.rooms;
	}
	for (var i = 0; i < rooms.length; i++) {
		results = addBorderingFrontiers(results, rooms[i]);
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
	for (var i = 0; i < room.doors.length; i++) {
		var region1 = room.region;
		var region2 = other(door, room).region;
		if (region1 !== region2) {
			if (region1.borders.indexOf(region2) === -1) {
				region1.borders.push(region2);
			}
			if (region2.borders.indexOf(region1) === -1) {
				region2.borders.push(region1);
			}
		}
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
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
			door2 = Door(object.x, object.y - 1, "S", object.other, room);
			room.doors.push(door);
			door.other = door2;
			door2.other = door;
			// object.other.doors.push(door);
			object.other.doors.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
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
			door2 = Door(object.x, object.y + 1, "N", object.other, room);
			room.doors.push(door);
			door.other = door2;
			door2.other = door;
			// object.other.doors.push(door);
			object.other.doors.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
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
			door2 = Door(object.x - 1, object.y, "E", object.other, room);
			room.doors.push(door);
			door.other = door2;
			door2.other = door;
			// object.other.doors.push(door);
			object.other.doors.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
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
			door2 = Door(object.x + 1, object.y, "W", object.other, room);
			door.other = door2;
			door2.other = door;
			room.doors.push(door);
			// object.other.doors.push(door);
			object.other.doors.push(door2);
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

function getDoor(room, x, y, dir) {
	var door = null;
	for (var i = 0; i < room.doors.length; i++) {
		door = room.doors[i];
		if (door.dir === dir && door.mapX === room.mapX + x && door.mapY === room.mapY + y) {
			return door;
		}
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
	var used = [];
	var frontier = getRandom(world.frontiers, used);
	if (frontier) {
		addRoom(growRoom(frontier.x, frontier.y));
	}
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.mapX, room.mapY, room.mapW, room.mapH)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.frontiers = addBorderingFrontiers(array, room);
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
		var growth = parseInt(Math.random() * 4);
		if (growth === 0) {
			if (height < world.currentRegion.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
				y--;
				height++;
			}
		}
		if (growth === 1) {
			if (height < world.currentRegion.maxH && (canPlaceRoom(x, y, width, height + 1))) {
				height++;
			}
		}
		if (growth === 2) {
			if (width < world.currentRegion.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
				x--;
				width++;
			}
		}
		if (growth === 3) {
			if (width < world.currentRegion.maxW && (canPlaceRoom(x, y, width + 1, height))) {
				width++;
			}
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
		mapColor: null,
		region: region,
		specialType: -1,
		startPositionX: 0,
		startPositionY: 0,
		startRoom: false,
		visited: false,
		doors: [],
		map: null
	};
}

function Door(x, y, direction, room1, room2) {
	return {
		mapX: x,
		mapY: y,
		doorType: -1,
		dir: direction,
		room1: room1,
		room2: room2,
		other: null,
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.specialType = -1;
		for (var e = 0; e < room.doors.length; e++) {
			door = room.doors[e];
			door.doorType = -1;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var region1 = null;
	var region2 = null;
	var room = null;
	for (var i = 0; i < world.regions.length; i++) {
		var used = [];
		region1 = world.regions[i];
		if (i !== 0) {
			room = getRandom(region1.rooms, used);
			room.specialType = (i + 1) % regionColors.length;
		}
		for (var e = 0; e < region1.rooms.length; e++) {
			room = region1.rooms[e];
			if (i === 0 && room.startRoom) {
				room.specialType = (i + 1) % regionColors.length;
			}
			for (var r = 0; r < room.doors.length; r++) {
				door = room.doors[r];
				region2 = other(door, room).region;
				if (region2 !== region1) {
					if (door.other.doorType === -1) {
						door.other.doorType = (i) % regionColors.length;
					}
				}
			}
		}
	}
}

function collectKey(room) {
	if (player.keys.indexOf(room.specialType) === -1 && room.specialType > -1) {
		player.keys.push(room.specialType);
		unlockRooms();
	}
}

function unlockRooms() {
	colorCircles.innerHTML = "find " + (5 - player.keys.length) + " color circles";
	if((5 - player.keys.length) === 0) {
		colorCircles.innerHTML = "find the exit";
	}
	for (var e = 0; e < world.regions.length; e++) {
		if (player.keys.indexOf(world.regions[e].id) > -1) {
			world.regions[e].unlocked = true;
		}
	}
	for (var i = 0; i < world.rooms.length; i++) {
		// var hasDoor = false;
		var room = world.rooms[i];
		if (player.keys.indexOf(room.specialType) > -1) {
			room.specialType = -1;
			if (room.map !== null) {
				var index = room.map.map.indexOf(9);
				if (index > -1) {
					room.map.map[index] = 0;
				}
			}
		}
		for (var e = 0; e < room.doors.length; e++) {
			var door = room.doors[e];
			if (player.keys.indexOf(door.doorType) > -1) {
				door.doorType = -1;
				// hasDoor = true;
			}
		}
		// if (hasDoor && room.map !== null) {
		// 	if (room.specialType === -1) {}
		// 	// for (var r = 0; r < player.keys.length; r++) {
		// 	// 	var index = room.map.map.indexOf(player.keys[r] + 1);
		// 	// 	while (index > 0) {
		// 	// 		room.map.map[index] = 0;
		// 	// 	}
		// 	// }
		// 	// for (var r = 0; r < room.map.map.length; r++) {
		// 	// 	if (room.map.map[r] > 1) {
		// 	// 		if (player.keys.indexOf(room.map.map[r] - 1) > -1) {
		// 	// 			room.map.map[r] = 0;
		// 	// 		}
		// 	// 	}
		// 	// }
		// }
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
}

function nextRegion() {
	var region = Region(regionColors[currentRegionColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, currentRegionColorIndex);
	currentRegionColorIndex = (currentRegionColorIndex + 1) % regionColors.length;
	return region;
}

function Region(color, maxWidth, maxHeight, id) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		id: id,
		unlocked: false,
		borders: [],
		rooms: []
	};
}