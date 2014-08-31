
function drawMap() {
	var startTime = window.performance.now();
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
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		for (var x = mapX1; x < mapX2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * 16;
				if (startX === -currentMapTiles * 16 * 2) {
					startX = (x * 16) - viewPortX;
				}
				if (y - 1 < 0) {
					topTile = -1;
				} else {
					topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
				}
				if (topTile === 0) {
					hasFloor = 1;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				drawRect(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 1);
	parseVerticalLines(mapX1, mapY1, mapX2, mapY2, 4);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 2);
	parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, 8);
	var time = window.performance.now() - startTime
	if (time > longestTime) {
		longestTime = time;
	}
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - 5, rectWidth, 21);
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
	// }
}

function parseVerticalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var x = mapX1; x < mapX2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = mapY1; y < mapY2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === 1) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === 4) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - 5;
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + 3);
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === mapY2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(mapX1, mapY1, mapX2, mapY2, type) {
	for (var y = mapY1; y < mapY2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = mapX1; x < mapX2; x++) {
			if (type === 2) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === 8) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				borderContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - 5, canvasX2, canvasY - 5);
						drawLine(canvasX, canvasY + 3, canvasX2, canvasY + 3);
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				borderContext.closePath();
				borderContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === mapX2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}


var longestTime = 0;

function drawLine(startX, startY, endX, endY) {
	borderContext.moveTo(startX, startY);
	borderContext.lineTo(endX, endY);
}

var lastPlayerX = 0;
var lastPlayerY = 0;
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;
var lastRoomLength = 0;

function drawWorld() {
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.mapX * 16) + (modulus(modulus(modulus(player.x), 10), 3) * 16) - miniViewPortX;
	miniMapPlayerY = (currentRoom.mapY * 16) + (modulus(modulus(modulus(player.y), 10), 3) * 16) - miniViewPortY;
	if (currentRoom.mapX + modulus(modulus(modulus(player.x), 10), 3) !== lastPlayerX || currentRoom.mapY + modulus(modulus(modulus(player.y), 10), 3) !== lastPlayerY || lastRoomLength !== world.rooms.length) {
		minimapCanvas.width = 150;
		minimapCanvas.height = 150;
		minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
		drawnDoors.length = 0;
		minimapContext.lineWidth = 2;
		forEachRoom("background", "border", function(room, roomX, roomY) {
			minimapContext.beginPath();
			minimapContext.rect(roomX, roomY, room.mapW * 16, room.mapH * 16);
			minimapContext.fill();
			minimapContext.stroke();
			minimapContext.closePath();
		});
		forEachRoom(0, "background", drawDoors);
		forEachRoom(0, 0, drawIcons);
	}
	drawPlayer();
	lastPlayerX = currentRoom.mapX + modulus(modulus(modulus(player.x), 10), 3);
	lastPlayerY = currentRoom.mapY + modulus(modulus(modulus(player.y), 10), 3);
	lastRoomLength = world.rooms.length;
}

function forEachRoom(fillStyle, strokeStyle, fn) {
	for (var r = 0; r < world.regions.length; r++) {
		if (typeof fillStyle === "string") {
			minimapContext.fillStyle = world.regions[r].color[fillStyle];
		}
		if (typeof strokeStyle === "string") {
			minimapContext.strokeStyle = world.regions[r].color[strokeStyle];
		}
		for (var i = 0; i < world.regions[r].rooms.length; i++) {
			room = world.regions[r].rooms[i];
			roomX = (room.mapX * 16) - miniViewPortX;
			roomY = (room.mapY * 16) - miniViewPortY;
			if (roomX + (room.mapW * 16) > 0 && roomY + (room.mapH * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				fn(room, roomX, roomY);
			}
		}
	}
}

var lockColors = []

function drawIcons(room) {
	var door = null;
	for (var i = 0; i < room.doors.length; i++) {
		door = room.doors[i];
		var color = regionColors[door.doorType].lock;
		if (door.doorType > 0) {
			switch (door.dir) {
				case "N":
					drawCircle(16 * door.mapX + 5, 16 * door.mapY, color);
					continue;
				case "S":
					drawCircle(16 * door.mapX + 5, 16 * door.mapY + 16, color);
					continue;
				case "W":
					drawCircle(16 * door.mapX - 3, 16 * door.mapY + 8, color);
					continue;
				case "E":
					drawCircle(16 * door.mapX + 13, 16 * door.mapY + 8, color);
					continue;
				default:
					continue;
			}
		}
	}
	// this.iconStamp.frame = 16 + room.specialType;
	// stamp(this.iconStamp, this.16 * (room.mapX + room.mapW / 2) - 4, this.16 * (room.mapY + room.mapH / 2) - 4);
	var color = regionColors[room.specialType].lock;
	if (room.specialType > 0) {
		drawCircle(16 * (room.mapX + room.mapW / 2) - 3, 16 * (room.mapY + room.mapH / 2), "rgba(0,0,0,0)", color);
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
	var door = null;
	// var color = room.region.color.background;
	// minimapContext.lineWidth = 2;
	// minimapContext.strokeStyle = color;
	// minimapContext.fillStyle = color;
	for (var e = 0; e < room.doors.length; e++) {
		door = room.doors[e];
		var ID = room.mapX + "-" + room.mapY + "-" + door.room2.mapX + "-" + door.room2.mapY;
		var ID2 = door.room2.mapX + "-" + door.room2.mapY + "-" + room.mapX + "-" + room.mapY;
		if (drawnDoors.indexOf(ID2) === -1 && drawnDoors.indexOf(ID) === -1) {
			var doorX = 16 * door.mapX;
			var doorY = 16 * door.mapY;

			if (door.dir === "N") {
				drawLine2(doorX + 4, doorY, doorX + 16 - 4, doorY);
			}
			if (door.dir === "S") {
				drawLine2(doorX + 4, 16 * (door.mapY + 1), doorX + 16 - 4, 16 * (door.mapY + 1));
			}
			if (door.dir === "W") {
				drawLine2(doorX, doorY + 4, doorX, doorY + 16 - 4);
			}
			if (door.dir === "E") {
				drawLine2(16 * (door.mapX + 1), doorY + 4, 16 * (door.mapX + 1), doorY + 16 - 4);
			}
			drawnDoors.push(ID);
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
		miniMapIconsCanvas.width = 150;
		miniMapIconsCanvas.height = 150;
		miniMapIconsContext.lineWidth = 1;
		initPlayerCanvas = true;
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
	miniMapIconsContext.rect(miniMapPlayerX, miniMapPlayerY, 16, 16);
	miniMapIconsContext.fill();
	miniMapIconsContext.stroke();
	miniMapIconsContext.closePath();
	lastFrame = frame;
}
//NameSpace
var EasyStar = EasyStar || {};

/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
EasyStar.Node = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
	this.parent = parent;
	this.x = x;
	this.y = y;
	this.costSoFar = costSoFar;
	this.simpleDistanceToTarget = simpleDistanceToTarget;

	/**
	* @return {Number} Best guess distance of a cost using this node.
	**/
	this.bestGuessDistance = function() {
		return this.costSoFar + this.simpleDistanceToTarget;
	}
};

//Constants
EasyStar.Node.OPEN_LIST = 0;
EasyStar.Node.CLOSED_LIST = 1;
/**
* This is an improved Priority Queue data type implementation that can be used to sort any object type.
* It uses a technique called a binary heap.
*
* For more on binary heaps see: http://en.wikipedia.org/wiki/Binary_heap
*
* @param {String} criteria The criteria by which to sort the objects.
* This should be a property of the objects you're sorting.
*
* @param {Number} heapType either PriorityQueue.MAX_HEAP or PriorityQueue.MIN_HEAP.
**/
EasyStar.PriorityQueue = function(criteria,heapType) {
	this.length = 0; //The current length of heap.
	var queue = [];
	var isMax = false;

	//Constructor
	if (heapType==EasyStar.PriorityQueue.MAX_HEAP) {
		isMax = true;
	} else if (heapType==EasyStar.PriorityQueue.MIN_HEAP) {
		isMax = false;
	} else {
		throw heapType + " not supported.";
	}

	/**
	* Inserts the value into the heap and sorts it.
	*
	* @param value The object to insert into the heap.
	**/
	this.insert = function(value) {
		if (!value.hasOwnProperty(criteria)) {
			throw "Cannot insert " + value + " because it does not have a property by the name of " + criteria + ".";
		}
		queue.push(value);
		this.length++;
		bubbleUp(this.length-1);
	}

	/**
	* Peeks at the highest priority element.
	*
	* @return the highest priority element
	**/
	this.getHighestPriorityElement = function() {
		return queue[0];
	}

	/**
	* Removes and returns the highest priority element from the queue.
	*
	* @return the highest priority element
	**/
	this.shiftHighestPriorityElement = function() {
		if (this.length === 0) {
			throw ("There are no more elements in your priority queue.");
		} else if (this.length === 1) {
			var onlyValue = queue[0];
			queue = [];
                        this.length = 0;
			return onlyValue;
		}
		var oldRoot = queue[0];
		var newRoot = queue.pop();
		this.length--;
		queue[0] = newRoot;
		swapUntilQueueIsCorrect(0);
		return oldRoot;
	}

	var bubbleUp = function(index) {
		if (index===0) {
			return;
		}
		var parent = getParentOf(index);
		if (evaluate(index,parent)) {
			swap(index,parent);
			bubbleUp(parent);
		} else {
			return;
		}
	}

	var swapUntilQueueIsCorrect = function(value) {
		var left = getLeftOf(value);
		var right = getRightOf(value);
		if (evaluate(left,value)) {
			swap(value,left);
			swapUntilQueueIsCorrect(left);
		} else if (evaluate(right,value)) {
			swap(value,right);
			swapUntilQueueIsCorrect(right);
		} else if (value==0) {
			return;
		} else {
			swapUntilQueueIsCorrect(0);
		}
	}

	var swap = function(self,target) {
		var placeHolder = queue[self];
		queue[self] = queue[target];
		queue[target] = placeHolder;
	}

	var evaluate = function(self,target) {
		if (queue[target]===undefined||queue[self]===undefined) {
			return false;
		}

		var selfValue;
		var targetValue;

		//Check if the criteria should be the result of a function call.
		if (typeof queue[self][criteria] === 'function') {
			selfValue = queue[self][criteria]();
			targetValue = queue[target][criteria]();
		} else {
			selfValue = queue[self][criteria];
			targetValue = queue[target][criteria];
		}

		if (isMax) {
			if (selfValue > targetValue) {
				return true;
			} else {
				return false;
			}
		} else {
			if (selfValue < targetValue) {
				return true;
			} else {
				return false;
			}
		}
	}

	var getParentOf = function(index) {
		return Math.floor(index/2)-1;
	}

	var getLeftOf = function(index) {
		return index*2 + 1;
	}

	var getRightOf = function(index) {
		return index*2 + 2;
	}
};

//Constants
EasyStar.PriorityQueue.MAX_HEAP = 0;
EasyStar.PriorityQueue.MIN_HEAP = 1;

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
EasyStar.instance = function() {
	this.isDoneCalculating = true;
	this.pointsToAvoid = {};
	this.startX;
	this.callback;
	this.startY;
	this.endX;
	this.endY;
	this.nodeHash = {};
	this.openList;
};
/**
*	EasyStar.js
*	github.com/prettymuchbryce/EasyStarJS
*	Licensed under the MIT license.
*
*	Implementation By Bryce Neal (@prettymuchbryce)
**/
EasyStar.js = function() {
	var STRAIGHT_COST = 10;
	var DIAGONAL_COST = 14;
	var pointsToAvoid = {};
	var collisionGrid;
	var costMap = {};
	var iterationsSoFar;
	var instances = [];
	var iterationsPerCalculation = Number.MAX_VALUE;
	var acceptableTiles;
	var diagonalsEnabled = false;

	/**
	* Sets the collision grid that EasyStar uses.
	*
	* @param {Array|Number} tiles An array of numbers that represent
	* which tiles in your grid should be considered
	* acceptable, or "walkable".
	**/
	this.setAcceptableTiles = function(tiles) {
		if (tiles instanceof Array) {
			//Array
			acceptableTiles = tiles;
		} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
			//Number
			acceptableTiles = [tiles];
		}
	};

	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals = function() {
		diagonalsEnabled = true;
	}

	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals = function() {
		diagonalsEnabled = false;
	}

	/**
	* Sets the collision grid that EasyStar uses.
	*
	* @param {Array} grid The collision grid that this EasyStar instance will read from.
	* This should be a 2D Array of Numbers.
	**/
	this.setGrid = function(grid) {
		collisionGrid = grid;

		//Setup cost map
		for (var y = 0; y < collisionGrid.length; y++) {
			for (var x = 0; x < collisionGrid[0].length; x++) {
				if (!costMap[collisionGrid[y][x]]) {
					costMap[collisionGrid[y][x]] = 1
				}
			}
		}
	};

	/**
	* Sets the tile cost for a particular tile type.
	*
	* @param {Number} The tile type to set the cost for.
	* @param {Number} The multiplicative cost associated with the given tile.
	**/
	this.setTileCost = function(tileType, cost) {
		costMap[tileType] = cost;
	};

	/**
	* Sets the number of search iterations per calculation.
	* A lower number provides a slower result, but more practical if you
	* have a large tile-map and don't want to block your thread while
	* finding a path.
	*
	* @param {Number} iterations The number of searches to prefrom per calculate() call.
	**/
	this.setIterationsPerCalculation = function(iterations) {
		iterationsPerCalculation = iterations;
	};

	/**
	* Avoid a particular point on the grid,
	* regardless of whether or not it is an acceptable tile.
	*
	* @param {Number} x The x value of the point to avoid.
	* @param {Number} y The y value of the point to avoid.
	**/
	this.avoidAdditionalPoint = function(x, y) {
		pointsToAvoid[x + "_" + y] = 1;
	};

	/**
	* Stop avoiding a particular point on the grid.
	*
	* @param {Number} x The x value of the point to stop avoiding.
	* @param {Number} y The y value of the point to stop avoiding.
	**/
	this.stopAvoidingAdditionalPoint = function(x, y) {
		delete pointsToAvoid[x + "_" + y];
	};

	/**
	* Stop avoiding all additional points on the grid.
	**/
	this.stopAvoidingAllAdditionalPoints = function() {
		pointsToAvoid = {};
	};

	/**
	* Find a path.
	*
	* @param {Number} startX The X position of the starting point.
	* @param {Number} startY The Y position of the starting point.
	* @param {Number} endX The X position of the ending point.
	* @param {Number} endY The Y position of the ending point.
	* @param {Function} callback A function that is called when your path
	* is found, or no path is found.
	*
	**/
	this.findPath = function(startX, startY ,endX, endY, callback) {
		//No acceptable tiles were set
		if (acceptableTiles === undefined) {
			throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
		}
		//No grid was set
		if (collisionGrid === undefined) {
			throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
		}

		//Start or endpoint outside of scope.
		if (startX < 0 || startY < 0 || endX < 0 || endX < 0 ||
		startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 ||
		endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
			throw new Error("Your start or end point is outside the scope of your grid.");
		}

		//Start and end are the same tile.
		if (startX===endX && startY===endY) {
			callback([]);
		}

		//End point is not an acceptable tile.
		var endTile = collisionGrid[endY][endX];
		var isAcceptable = false;
		for (var i = 0; i < acceptableTiles.length; i++) {
			if (endTile === acceptableTiles[i]) {
				isAcceptable = true;
				break;
			}
		}

		if (isAcceptable === false) {
			callback(null);
			return;
		}

		//Create the instance
		var instance = new EasyStar.instance();
		instance.openList = new EasyStar.PriorityQueue("bestGuessDistance",EasyStar.PriorityQueue.MIN_HEAP);
		instance.isDoneCalculating = false;
		instance.nodeHash = {};
		instance.startX = startX;
		instance.startY = startY;
		instance.endX = endX;
		instance.endY = endY;
		instance.callback = callback;

		instance.openList.insert(coordinateToNode(instance, instance.startX,
			instance.startY, null, STRAIGHT_COST));

		instances.push(instance);
	};

	/**
	* This method steps through the A* Algorithm in an attempt to
	* find your path(s). It will search 4 tiles for every calculation.
	* You can change the number of calculations done in a call by using
	* easystar.setIteratonsPerCalculation().
	**/
	this.calculate = function() {
		if (instances.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
			return;
		}
		for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
			if (instances.length === 0) {
				return;
			}

			//Couldn't find a path.
			if (instances[0].openList.length===0) {
				instances[0].callback(null);
				instances.shift();
				continue;
			}

			var searchNode = instances[0].openList.shiftHighestPriorityElement();
			searchNode.list = EasyStar.Node.CLOSED_LIST;

			if (searchNode.y > 0) {
				checkAdjacentNode(instances[0], searchNode, 0, -1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y-1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x < collisionGrid[0].length-1) {
				checkAdjacentNode(instances[0], searchNode, 1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x+1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.y < collisionGrid.length-1) {
				checkAdjacentNode(instances[0], searchNode, 0, 1, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y+1][searchNode.x]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (searchNode.x > 0) {
				checkAdjacentNode(instances[0], searchNode, -1, 0, STRAIGHT_COST *
					costMap[collisionGrid[searchNode.y][searchNode.x-1]]);
				if (instances[0].isDoneCalculating===true) {
					instances.shift();
					continue;
				}
			}
			if (diagonalsEnabled) {
				if (searchNode.x > 0 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, -1, -1,  DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, 1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {
					checkAdjacentNode(instances[0], searchNode, 1, -1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y-1][searchNode.x+1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
				if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {
					checkAdjacentNode(instances[0], searchNode, -1, 1, DIAGONAL_COST *
						costMap[collisionGrid[searchNode.y+1][searchNode.x-1]]);
					if (instances[0].isDoneCalculating===true) {
						instances.shift();
						continue;
					}
				}
			}
		}
	};

	//Private methods follow

	var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
		var adjacentCoordinateX = searchNode.x+x;
		var adjacentCoordinateY = searchNode.y+y;

		if (pointsToAvoid[adjacentCoordinateX + "_" + adjacentCoordinateY] === undefined) {
			if (instance.endX === adjacentCoordinateX && instance.endY === adjacentCoordinateY) {
				instance.isDoneCalculating = true;
				var path = [];
				var pathLen = 0;
				path[pathLen] = {x: adjacentCoordinateX, y: adjacentCoordinateY};
				pathLen++;
				path[pathLen] = {x: searchNode.x, y:searchNode.y};
				pathLen++;
				var parent = searchNode.parent;
				while (parent!=null) {
					path[pathLen] = {x: parent.x, y:parent.y};
					pathLen++;
					parent = parent.parent;
				}
				path.reverse();
				instance.callback(path);
			}

			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[adjacentCoordinateY][adjacentCoordinateX] === acceptableTiles[i]) {

					var node = coordinateToNode(instance, adjacentCoordinateX,
						adjacentCoordinateY, searchNode, cost);

					if (node.list === undefined) {
						node.list = EasyStar.Node.OPEN_LIST;
						instance.openList.insert(node);
					} else if (node.list === EasyStar.Node.OPEN_LIST) {
						if (searchNode.costSoFar + cost < node.costSoFar) {
							node.costSoFar = searchNode.costSoFar + cost;
							node.parent = searchNode;
						}
					}
					break;
				}
			}

		}
	};

	//Helpers

	var coordinateToNode = function(instance, x, y, parent, cost) {
		if (instance.nodeHash[x + "_" + y]!==undefined) {
			return instance.nodeHash[x + "_" + y];
		}
		var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
		if (parent!==null) {
			var costSoFar = parent.costSoFar + cost;
		} else {
			costSoFar = simpleDistanceToTarget;
		}
		var node = new EasyStar.Node(parent,x,y,costSoFar,simpleDistanceToTarget);
		instance.nodeHash[x + "_" + y] = node;
		return node;
	};

	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt(Math.abs(x2-x1)*Math.abs(x2-x1) + Math.abs(y2-y1)*Math.abs(y2-y1)) * STRAIGHT_COST;
	};
}
var playerCanvas, tileCanvas, borderCanvas, playerContext, tileContext, borderContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas;
var getElementById = 0;
var querySelector = 1;
var querySelectorAll = 2;
var runGameLoop = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};

var player = {
	x: 151,
	y: 16 * 3,
	w: 16,
	h: 16 * 2,
	img: null,
	xDirection: 0,
	yDirection: 1,
	xAccel: 0,
	yAccel: 0,
	maxAccel: 5,
	jumpForce: 7,
	jumpHeight: 50,
	jumpStart: 0,
	jumping: 0,
	jumpsUsed: 0,
	heightTraveled: 0,
	maxJumps: 1,
	angle: 0,
	health: 5,
	doorCooldown: window.performance.now(),
	maxHealth: 5
}
var dt = currentTick - lastTick;
var entities = [player];
var keys = {
	a: 65,
	w: 87,
	s: 83,
	d: 68,
	space: 32,
	shift: 16,
	ctrl: 17,
	alt: 18,
	tab: 9,
	debug: 192
};

function listen(eventName, fn) {
	if (!events[eventName]) {
		events[eventName] = [];
	}
	events[eventName].push(fn);
}

// function entity(x, y, w, h, img, moveable) {
// 	var entity = {
// 		x: x,
// 		y: y,
// 		w: w,
// 		h: h,
// 		angle: 0,
// 		img: img
// 	};
// 	if (moveable) {
// 		entity.xDirection = 0;
// 		entity.yDirection = 0;
// 		entity.xAccel = 0;
// 		entity.yAccel = 1;
// 		entity.maxAccel = 5;
// 	}
// 	if (moveable) {
// 		entity.jumpForce = 7;
// 		entity.jumpHeight = 50;
// 		entity.jumpStart = 0;
// 		entity.jumping = 0;
// 		entity.jumpsUsed = 0;
// 		entity.maxJumps = 3;
// 	}
// 	return (entity);
// }

function trigger(event) {
	var eventName = event.type;
	if (events[eventName] && events[eventName].length > 0) {
		for (var i = 0; i < events[eventName].length; i++) {
			events[eventName][i](event);
		}
	}
}

function getByType(id) {
	return document.getElementById(id);
}



function DOMLoaded() {
	playerCanvas = getByType("player");
	borderCanvas = getByType("border");
	tileCanvas = getByType("tile");
	minimapCanvas = getByType("minimap");
	miniMapIconsCanvas = getByType("minimapIcons");
	playerContext = playerCanvas.getContext("2d");
	borderContext = borderCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	miniMapIconsContext = miniMapIconsCanvas.getContext("2d");
	resizeCanvas();
	startWorld();
	for (var r = 0; r < regionColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		addRegion();
	}
	doors();
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = 300;
	} else {
		borderCanvas.width = playerCanvas.width = tileCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = 300;
	} else {
		borderCanvas.height = playerCanvas.height = tileCanvas.height = window.innerHeight;
	}
}



function eachFrame() {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		handleXMovement(entity);
		entity.x = round(entity.x);
		entity.y = round(entity.y);
		testWalking(entity);
		testJumping(entity);
		handleJump(entity);
		testDoors();
		testFalling(entity);
	}
	parseViewPort();
	borderContext.strokeStyle = currentRoom.mapColor.border;
	borderContext.lineWidth = 2;
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	borderContext.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
	tileContext.fillStyle = currentRoom.mapColor.border;
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.mapColor.background;
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	drawMap();
	drawWorld();
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.health / player.maxHealth))).toString(16);
		playerContext.fillStyle = '#' + red + red + '0000';
		playerContext.fillRect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
	}
}



function loop() {
	currentTick = window.performance.now();
	dt = currentTick - lastTick;
	lastTick = currentTick;
	document.dispatchEvent(frameEvent);
	if (runGameLoop) {
		requestAnimationFrame(loop);
	}
}

// canvas.addEventListener("mousedown")
listen("keydown", handleKeyDown);
listen("keyup", handleKeyUp);
listen("resize", resizeCanvas);
listen("DOMContentLoaded", DOMLoaded);
listen("frame", eachFrame);
window.addEventListener("resize", trigger);
document.addEventListener("DOMContentLoaded", trigger);
document.addEventListener("mousedown", trigger);
document.addEventListener("mouseup", trigger);
document.addEventListener("keydown", trigger);
document.addEventListener("keyup", trigger);
document.addEventListener("frame", trigger);
function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulus(num, size) {
	var mod = num % (size || 16);
	return (num - mod) / (size || 16);
}

function coordinate(x, y, size) {
	return (y * size + x);
}

function indexOf(array, searchKey) {
	if(typeof searchKey === "object") {
		for(var i=0;i<array.length;i++) {
			var found = true;
			if(typeof array[i] === "object") {
				for(var attr in searchKey) {
					if(array[i][attr] !== searchKey[attr]) {
						found = false;
						break;
					}
				}
				if(found === true) {
					return i;
				}
			}
		}
		return -1;
	} else {
		return array.indexOf(searchKey);
	}
}

function round(value) {
	return ~~ (0.5 + value);
}
function handleKeyDown(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = 1;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xDirection = 1;
	} else if (event.keyCode === keys.a) {
		player.xDirection = -1;
	}
}

function handleKeyUp(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = 0;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xDirection = 0;
			}
		} else {
			player.xDirection = 0;
		}
	}
}


// function createMap() {
// 	var room;
// 	for (var y = 0; y < numMapTiles; y++) {
// 		for (var x = 0; x < numMapTiles; x++) {
// 			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
// 			if (x % 10 === 0 || y % 10 === 0) {
// 				var rotation = null;
// 				if (!rooms[roomId]) {
// 					rotation = random(0, 3);
// 					// room = cloneRoom(roomList[9]);
// 					room = cloneRoom(roomList[random(0, 9)]);
// 					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 1) {
// 						room = cloneRoom(roomList[9]);
// 					}
// 					if(Math.floor(x / 10) === 0 && Math.floor(y / 10) === 0) {
// 						room = cloneRoom(roomList[9]);
// 					}
// 					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 0) {
// 						room = cloneRoom(roomList[7]);
// 					}
// 					if(Math.floor(x / 10) === 1 && Math.floor(y / 10) === 1) {
// 						room = cloneRoom(roomList[5]);
// 					}
// 					if(Math.floor(x / 10) === 2 && Math.floor(y / 10) === 1) {
// 						room = cloneRoom(roomList[7]);
// 					}
// 					if(Math.floor(x / 10) === 2 && Math.floor(y / 10) === 2) {
// 						room = cloneRoom(roomList[3]);
// 					}
// 					rooms[roomId] = room;
// 					// console.log(Math.floor(x / 10) + "-" + Math.floor(y / 10), x, y)
// 				}
// 				room = rooms[roomId];
// 					// console.log(room.type, x, y, room.map)
// 				// console.log(room)
// 			}
// 			// if ((y * numMapTiles + x) % (10 * 10) === 0) {
// 			// 	// room = rotate(room1, 10, 10, random(0, 3));
// 			// 	room = rotate(room1, 10, 10, 0);
// 			// 	console.log(room)
// 			// }
// 			// X and Y for room arent being calculated properly
// 			// console.log("X and Y: ", x, y, "map coord: ", coordinate(x, y, numMapTiles), "room coord: ", coordinate(x % 10, y % 10, 10));
// 			// console.log("Tile: ", room[coordinate(x % 10, y % 10, 10)], "-", roomId)
// 			map[coordinate(x, y, numMapTiles)] = room.map[coordinate(x % 10, y % 10, 10)];
// 			// console.log(x * numMapTiles + y)1
// 			// console.log((i * 10 + e) % 100,(e + 1) * (i + 1))
// 			// console.log(i,e,tilePosition(i, e, width),tilePosition(i, e, 10) % 100)
// 			// console.log(((i ) * width) + (e ))
// 			// room = rotate(room1, 10, 10, 3);
// 			// map = map.concat(room);
// 			// console.log(map, room)
// 			// for (var x = 0; x < 10; x++) {
// 			// for (var y = 0; y < 10; y++) {
// 			// console.log(tilePosition((10 * (i)) + (1 * x), (10 * (e)) + (1 * y)), (10 * (i)) + (1 * x), (10 * (e)) + (1 * y), i, e, (((i)) + (1 * x) * (width)) + (10 * (e)) + (1 * y))
// 			// console.log
// 			// map[tilePosition((10 * i) + x, (1 * e) + y)] = room[tilePosition(x, y)];
// 			// map[(e * width + i) * 10] = room[tilePosition(x, y)];
// 			// }
// 			// }
// 		}
// 	}
// 	// console.log(width, height, room1, map.length)
// 	// console.log(map)
// }

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

function handleXMovement(entity) {
	entity.xAccel = entity.xAccel + (entity.xDirection / 60 * dt);
	if (entity.xAccel > entity.maxAccel) {
		entity.xAccel = entity.maxAccel;
	}
	if (entity.xAccel < -entity.maxAccel) {
		entity.xAccel = -entity.maxAccel;
	}
	if (entity.xDirection === 0) {
		if (entity.xAccel > 0) {
			entity.xAccel = entity.xAccel + ((-1 * 2 / 60) * dt);
		} else if (entity.xAccel < 0) {
			entity.xAccel = entity.xAccel + ((1 * 2 / 60) * dt);
		}
		if ((entity.xAccel < ((1 / 60) * dt) && entity.xAccel > ((-1 / 60) * dt)) || entity.yDirection === 1 || entity.yDirection === -1) {
			entity.xAccel = 0;
		}
	}
	entity.x = entity.x + entity.xAccel;
}

function handleJump(entity) {
	if (entity.jumping && (entity.yDirection !== -1 && entity.jumpsUsed < entity.maxJumps)) {
		if (entity.maxJumps > 1 && entity.jumpsUsed === 0 && entity.yDirection === 1) {
			entity.jumpsUsed++;
		}
		if ((entity.jumpsUsed === 0 && entity.yDirection === 0) || entity.jumpsUsed > 0 || entity.maxJumps > 1) {
			entity.yDirection = -1;
			entity.yAccel = -entity.jumpForce;
			entity.jumpStart = entity.y;
			entity.jumpsUsed++;
		}
		entity.heightTraveled = 0;

	}
	if (entity.yDirection === 0 || !entity.jumping || entity.heightTraveled > entity.jumpHeight) {
		entity.yDirection = 1;
	}
	if (entity.yDirection === 1) {
		entity.jumping = 0;
		entity.yAccel = entity.yAccel + ((entity.jumpForce / 2) / 60 * dt); // falling
	}

	if (entity.yDirection === 0) {
		if (entity.yAccel > 0) {
			entity.yAccel = entity.yAccel + ((-1 / 60) * dt);
		} else if (entity.yAccel < 0) {
			entity.yAccel = entity.yAccel + ((1 / 60) * dt);
		}
		if (entity.yAccel < ((1 / 60) * dt) && entity.yAccel > ((-1 / 60) * dt)) {
			entity.yAccel = 0;
		}
	}
	if (entity.yAccel > entity.maxAccel) {
		entity.yAccel = 10;
	}
	entity.heightTraveled -= entity.yAccel;
	entity.heightTraveled = round(entity.heightTraveled);
	entity.y = entity.y + entity.yAccel;
}

function testFalling(entity) {
	var xAlignment = entity.x % 16;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = currentMap[bottomLeft];
	} else {
		falling = currentMap[bottomRight] !== 0 || currentMap[bottomLeft] !== 0;
	}
	if ((falling || entity.y + entity.h > mapHeight * 16) && entity.yDirection === 1) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = 0;
		entity.yDirection = 0;
		entity.jumpsUsed = 0;
		entity.jumping = 0;
		entity.heightTraveled = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var jumping = false;
	if (xAlignment === 0) {
		jumping = currentMap[aboveLeft] !== 0;
	} else {
		jumping = currentMap[aboveLeft] !== 0 || currentMap[aboveRight] !== 0;
	}
	if (jumping && entity.jumping === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = -1;
		entity.yDirection = 1;
		entity.jumping = 0;
		entity.heightTraveled = 0;
	}
}

function testWalking(entity) {
	var yAlignment = entity.y % 16;
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var topLeft = coordinate(modulus(entity.x), modulus(entity.y), currentMapTiles);
	var topRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y), currentMapTiles);
	var midLeft = coordinate(modulus(entity.x), modulus(entity.y + (entity.h / 2)), currentMapTiles);
	var midRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + (entity.h / 2)), currentMapTiles);
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var walkLeft = false;
	var walkRight = false;
	if (yAlignment === 0) {
		walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0;
		walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0;
	} else {
		if (modulus(entity.y + entity.h) * 16 > entity.y + entity.h) {
			walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0 || currentMap[aboveLeft] !== 0;
			walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0 || currentMap[aboveRight] !== 0;
		} else {
			walkLeft = currentMap[midLeft] !== 0 || currentMap[topLeft] !== 0 || currentMap[bottomLeft] !== 0;
			walkRight = currentMap[midRight] !== 0 || currentMap[topRight] !== 0 || currentMap[bottomRight] !== 0;
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP -1")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xDirection = 0;
			entity.xAccel = 0;
		}
	}
}
var currentMapTiles = 0;

var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var bigRoomList = [];
var blankArray = [];
for (var i = 0; i < 10 * 10; i++) {
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

function smallRoom(RoomType, array) {
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

roomList.push(smallRoom(0,  blankArray));
roomList.push(smallRoom(1,  room1));
roomList.push(smallRoom(2,  room2));
roomList.push(smallRoom(3,  room3));
roomList.push(smallRoom(4,  room4));
roomList.push(smallRoom(5,  room5));
roomList.push(smallRoom(6,  room6));
roomList.push(smallRoom(7,  room7));
roomList.push(smallRoom(8,  room8));
roomList.push(smallRoom(9,  room9));
roomList.push(smallRoom(10,  room10));
roomList.push(smallRoom(11,  room11));
roomList.push(smallRoom(12,  room12));
roomList.push(smallRoom(13,  room13));

function BigRoom(width, height, worldRoom, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = {};
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var arrayIndex = coordinate(Math.floor(x / 10), Math.floor(y / 10), topSize);
			var roomId = Math.floor(x / 10) + "-" + Math.floor(y / 10);
			if (x % 10 === 0 || y % 10 === 0) {
				if (!rooms[roomId]) {
					room = cloneRoom(roomList[array[arrayIndex]]);
					rooms[roomId] = room;
				}
				room = rooms[roomId];
			}
			var mapCoord = coordinate(x, y, topSize * 10);
			var roomCoord = coordinate(x % 10, y % 10, 10);
			map[mapCoord] = room.map[roomCoord];
		}
	}
	// currentMapTiles = topSize * 10;
	// currentMap = map;
	return {
		map: map,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * 10
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

function playerSizedRoom(room) {
	room.map = BigRoom(room.mapW * 3, room.mapH * 3, room, function(array, roomsX, roomsY, arraySize) {
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
var currentMap = null;
var mapWidth = 0;
var mapHeight = 0;

function movePlayer(room, direction, position) {
	enterRoom(room);
	for (var i = 0; i < room.doors.length; i++) {
		var match = false;
		var door = room.doors[i];
		if (door.dir === direction) {
			if (door.dir === "N" || door.dir === "S") {
				match = position === door.mapX;
			}
			if (door.dir === "E" || door.dir === "W") {
				match = position === door.mapY;
			}
			if (match) {
				var translatedX = ((door.mapX - room.mapX) * 3);
				var translatedY = ((door.mapY - room.mapY) * 3);
				// console.log(player.x, player.y)
				if (door.dir === "N") {
					translatedX += Math.floor(3 / 2);
					player.y = 0;
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "E") {
					translatedY += Math.floor(3 / 2);
					translatedX += 3;
					player.x = (room.mapW * 10 * 16 * 3) - (player.w);
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(3 / 2);
					translatedY += 3;
					player.y = (room.mapH * 10 * 16 * 3) - (player.h);
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(3 / 2);
					player.x = 0;
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
			}
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.doors.length; i++) {
		var door = currentRoom.doors[i];
		var translatedX = ((door.mapX - currentRoom.mapX) * 3);
		var translatedY = ((door.mapY - currentRoom.mapY) * 3);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mapW * 10 * 16 * 3;
		var roomHeight = currentRoom.mapH * 10 * 16 * 3;
		if (door.dir === "N") {
			translatedX += Math.floor(3 / 2);
		}
		if (door.dir === "E") {
			translatedY += Math.floor(3 / 2);
			translatedX += 3;
		}
		if (door.dir === "S") {
			translatedX += Math.floor(3 / 2);
			translatedY += 3;
		}
		if (door.dir === "W") {
			translatedY += Math.floor(3 / 2);
		}
		if (window.performance.now() - player.doorCooldown > 400) {
			if (player.x <= 0 && player.xDirection === -1 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with left door");
				movePlayer(door.room2, "E", door.mapY);
			}
			if (player.y <= 0 && player.yDirection === -1 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with top door");
				movePlayer(door.room2, "S", door.mapX);
			}
			if (player.x + player.w >= roomWidth && player.xDirection === 1 && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
				// console.log("Collision with right door");
				movePlayer(door.room2, "W", door.mapY);
			}
			if (player.y + player.h >= roomHeight && player.yDirection !== 0  && Math.abs(player.yAccel) > 5 && door.dir === "S" && translatedX === playerX && (translatedY === playerY2 || translatedY === playerY)) {
				// console.log(player.yAccel)
			// console.log(window.performance.now() - player.doorCooldown)
				// console.log("Collision with bottom door");
				movePlayer(door.room2, "N", door.mapX);
			}
		}
	}
}

function enterRoom(room) {
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentRoom = room;
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	mapHeight = room.map.height * 10;
	mapWidth = room.map.width * 10;
	realMapHeight = room.map.height * 10 * 16;
	realMapWidth = room.map.width * 10 * 16;
	player.doorCooldown = window.performance.now();
}
var viewPortX = 0;
var viewPortY = 0;
var miniViewPortX = 0;
var miniViewPortY = 0;

function parseViewPort() {
	var canvas = tileContext.canvas;
	var deadZoneX = canvas.width / 2;
	var deadZoneY = canvas.height / 2;
	if (player.x - viewPortX + deadZoneX > canvas.width) {
		viewPortX = player.x - (canvas.width - deadZoneX);
	} else if (player.x - deadZoneX < viewPortX) {
		viewPortX = player.x - deadZoneX;
	}
	if (player.y - viewPortY + deadZoneY > canvas.height) {
		viewPortY = player.y - (canvas.height - deadZoneY);
	} else if (player.y - deadZoneY < viewPortY) {
		viewPortY = player.y - deadZoneY;
	}
	// if (!(0 <= viewPortX &&
	// 	width * 16 >= viewPortX + canvas.width &&
	// 	0 <= viewPortY &&
	// 	height * 16 >= viewPortY + canvas.height)) {
	// 	if (viewPortX < 0) {
	// 		viewPortX = 0;
	// 	}
	// 	if (viewPortY < 0) {
	// 		viewPortY = 0;
	// 	}
	// 	if (viewPortX + canvas.width > width * 16) {
	// 		viewPortX = (width / 2 * 16) - deadZoneX;
	// 	}
	// 	if (viewPortY + canvas.height > height * 16) {
	// 	console.log(true)
	// 		viewPortY = (height / 2 * 16) - deadZoneY;
	// 	}
	// }
	viewPortY = ~~ (0.5 + viewPortY);
	viewPortY = ~~ (0.5 + viewPortY);
	// viewPortX = (window.innerWidth / 2) - (width*16) + player.x;
	// viewPortX = player.x;
	// viewPortY = (window.innerHeight / 2) - (height*16) + player.y;
	// viewPortY = player.y;
	// if(viewPortX < (window.innerWidth-(width*16))/2) {
	// viewPortX = 0;
	// }
	// if(viewPortY < (window.innerHeight-(height*16))/2) {
	// viewPortY = (window.innerHeight-(height*16))/2;
	// }
}
function parseMinimapViewport() {
	var canvas = minimapContext.canvas;
	var deadZoneX = canvas.width / 2;
	var deadZoneY = canvas.height / 2;
	var mapX = ((currentRoom.mapX + (modulus(modulus(modulus(player.x), 10), 3))) * 16);
	var mapY = ((currentRoom.mapY + (modulus(modulus(modulus(player.y), 10), 3))) * 16);
	if (mapX - miniViewPortX + deadZoneX > canvas.width) {
		miniViewPortX = mapX - (canvas.width - deadZoneX);
	} else if (mapX - deadZoneX < miniViewPortX) {
		miniViewPortX = mapX - deadZoneX;
	}
	if (mapY - miniViewPortY + deadZoneY > canvas.height) {
		miniViewPortY = mapY - (canvas.height - deadZoneY);
	} else if (mapY - deadZoneY < miniViewPortY) {
		miniViewPortY = mapY - deadZoneY;
	}
	// if (!(0 <= miniViewPortX &&
	// 	width * 16 >= miniViewPortX + canvas.width &&
	// 	0 <= miniViewPortY &&
	// 	height * 16 >= miniViewPortY + canvas.height)) {
	// 	if (miniViewPortX < 0) {
	// 		miniViewPortX = 0;
	// 	}
	// 	if (miniViewPortY < 0) {
	// 		miniViewPortY = 0;
	// 	}
	// 	if (miniViewPortX + canvas.width > width * 16) {
	// 		miniViewPortX = (width / 2 * 16) - deadZoneX;
	// 	}
	// 	if (miniViewPortY + canvas.height > height * 16) {
	// 	console.log(true)
	// 		miniViewPortY = (height / 2 * 16) - deadZoneY;
	// 	}
	// }
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	// miniViewPortX = (window.innerWidth / 2) - (width*16) + player.x;
	// miniViewPortX = player.x;
	// miniViewPortY = (window.innerHeight / 2) - (height*16) + player.y;
	// miniViewPortY = player.y;
	// if(miniViewPortX < (window.innerWidth-(width*16))/2) {
	// miniViewPortX = 0;
	// }
	// if(miniViewPortY < (window.innerHeight-(height*16))/2) {
	// miniViewPortY = (window.innerHeight-(height*16))/2;
	// }
}
var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var regionColors = [{
	background: "#BBBBBB",
	border: "#A0A0A0",
	other: "#CFCFCF",
	lock: "#FFFFFF"
}, {
	border: "#990000",
	background: "#FF3333",
	other: "#FF0000",
	lock: "#FF6666"
}, {
	border: "#006600",
	background: "#00BB00",
	other: "#00BB00",
	lock: "#66FF66"
}, {
	border: "#000066",
	background: "#3333FF",
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

function getDoor(room, x, y) {
	var door = null;
	var i = 0;
	while (i < room.doors.length) {
		door = world.rooms[i];
		if (door.mapX === x && door.mapY === y) {
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
		mapColor: null,
		region: region,
		specialType: 0,
		startPositionX: 0,
		startPositionY: 0,
		startRoom: false,
		visited:false,
		doors: [],
		map: null
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
	enterRoom(world.rooms[0]);
	currentRoom.startRoom = true;
	currentRoom.startPositionX = random(0, (currentRoom.mapW * 3) - 1);
	currentRoom.startPositionY = random(0, (currentRoom.mapH * 3) - 1);
	player.x = currentRoom.startPositionX * 10 * 16 + (10 / 2 * 16);
	player.y = currentRoom.startPositionY * 10 * 16 + (2*16);
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