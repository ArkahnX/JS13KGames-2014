
/*// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.
var astar = {
	init: function(grid) {
		for (var x = 0, xl = grid[LENGTH]; x < xl; x++) {
			for (var y = 0, yl = grid[x][LENGTH]; y < yl; y++) {
				var node = grid[x][y];
				node.f = 0;
				node.g = 0;
				node.h = 0;
				node[COST] = node[SPEED];
				node.v = false;
				node.closed = false;
				node.parent = NULL;
			}
		}
	},
	heap: function() {
		return new BinaryHeap(function(node) {
			return node.f;
		});
	},
	search: function(grid, start, end) {
		astar.init(grid);
		heuristic = astar.manhattan;

		var openHeap = astar.heap();

		openHeap[PUSH](start);

		while (openHeap.size() > 0) {

			// Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
			var currentNode = openHeap.pop();

			// End case -- result has been found, return the traced path.
			if (currentNode === end) {
				var curr = currentNode;
				var ret = [];
				while (curr.parent) {
					ret[PUSH](curr);
					curr = curr.parent;
				}
				return ret.reverse();
			}

			// Normal case -- move currentNode from open to closed, process each of its neighbors.
			currentNode.closed = true;

			// Find all neighbors for the current node.
			var neighbors = astar.neighbors(grid, currentNode);

			for (var i = 0, il = neighbors[LENGTH]; i < il; i++) {
				var neighbor = neighbors[i];

				if (neighbor.closed || neighbor[SPEED] === 0) {
					// Not a valid node to process, skip to next neighbor.
					continue;
				}

				// The g score is the shortest distance from start to current node.
				// We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
				var gScore = currentNode.g + neighbor[COST];
				var beenVisited = neighbor.v;

				if (!beenVisited || gScore < neighbor.g) {

					// Found an optimal (so far) path to this node.  Take score for node to see how good it is.
					neighbor.v = true;
					neighbor.parent = currentNode;
					neighbor.h = neighbor.h || heuristic(neighbor.x, neighbor.y, end.x, end.y);
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;

					if (!beenVisited) {
						// Pushing to heap will put it in proper place based on the 'f' value.
						openHeap[PUSH](neighbor);
					} else {
						// Already seen the node, but since it has been rescored we need to reorder it in the heap
						openHeap.rescoreElement(neighbor);
					}
				}
			}
		}

		// No result was found - empty array signifies failure to find path.
		return [];
	},
	manhattan: function(pos0X, pos0Y, pos1X, pos1Y) {
		// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
		var d1 = WINDOW[MATH].abs(pos1X - pos0X);
		var d2 = WINDOW[MATH].abs(pos1Y - pos0Y);
		return d1 + d2;
	},
	neighbors: function(grid, node) {
		var ret = [];
		var x = node.x;
		var y = node.y;

		// West
		if (grid[x - 1] && grid[x - 1][y]) {
			ret[PUSH](grid[x - 1][y]);
		}

		// East
		if (grid[x + 1] && grid[x + 1][y]) {
			ret[PUSH](grid[x + 1][y]);
		}

		// South
		if (grid[x] && grid[x][y - 1]) {
			ret[PUSH](grid[x][y - 1]);
		}

		// North
		if (grid[x] && grid[x][y + 1]) {
			ret[PUSH](grid[x][y + 1]);
		}

		return ret;
	}
};

function BinaryHeap(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function(element) {
		// Add the new element to the end of the array.
		this.content[PUSH](element);

		// Allow it to sink down.
		this.sinkDown(this.content[LENGTH] - 1);
	},
	pop: function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it bubble up.
		if (this.content[LENGTH] > 0) {
			this.content[0] = end;
			this.bubbleUp(0);
		}
		return result;
	},
	size: function() {
		return this.content[LENGTH];
	},
	rescoreElement: function(node) {
		this.sinkDown(this.content.indexOf(node));
	},
	sinkDown: function(n) {
		// Fetch the element that has to be sunk.
		var element = this.content[n];

		// When at 0, an element can not sink any further.
		while (n > 0) {

			// Compute the parent element's index, and fetch it.
			var parentN = ((n + 1) >> 1) - 1,
				parent = this.content[parentN];
			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				// Update 'n' to continue at the new position.
				n = parentN;
			}

			// Found a parent that is less, no need to sink any further.
			else {
				break;
			}
		}
	},
	bubbleUp: function(n) {
		// Look up the target element and its score.
		var length = this.content[LENGTH],
			element = this.content[n],
			elemScore = this.scoreFunction(element);

		while (true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) << 1,
				child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = NULL;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N],
					child1Score = this.scoreFunction(child1);

				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore) swap = child1N;
			}

			// Do the same checks for the o child.
			if (child2N < length) {
				var child2 = this.content[child2N],
					child2Score = this.scoreFunction(child2);
				if (child2Score < (swap === NULL ? elemScore : child1Score)) {
					swap = child2N;
				}
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap !== NULL) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}

			// Otherwise, we are done.
			else {
				break;
			}
		}
	}
};*/
function drawMap() {
	var x1 = modulus(viewPortX) - 1;
	var y1 = modulus(viewPortY) - 1;
	var x2 = modulus(viewPortX) + modulus(playerCanvas.width) + 2;
	var y2 = modulus(viewPortY) + modulus(playerCanvas.height) + 2;
	if (x1 < 0) {
		x1 = 0;
	}
	if (y1 < 0) {
		y1 = 0;
	}
	if (x2 > currentMapTiles) {
		x2 = currentMapTiles;
	}
	if (y2 > currentMapTiles) {
		y2 = currentMapTiles;
	}
	for (var y = y1; y < y2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		tileContext.fillStyle = currentRoom.c.bg;
		for (var x = x1; x < x2; x++) {
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
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1) {
				drawRect(x, y, currentMap, currentMapTiles, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = y1; y < y2; y++) {
		for (var x = x1; x < x2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] > 1) {
				tileContext.fillStyle = rColors[currentMap[coordinate(x, y, currentMapTiles)] - 1].bg;
				drawRect(x, y, currentMap, currentMapTiles, (x * 16) - viewPortX, 16, true);
			}
		}
	}

	parseVerticalLines(x1, y1, x2, y2, 1);
	parseVerticalLines(x1, y1, x2, y2, 4);
	parseHorizontalLines(x1, y1, x2, y2, 2);
	parseHorizontalLines(x1, y1, x2, y2, 8);
}

function drawRect(x, y, map, currentMapTiles, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - (16 * 0.3125), rectWidth, 16 + (16 * 0.3125));
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
}

function parseVerticalLines(x1, y1, x2, y2, type) {
	for (var x = x1; x < x2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = y1; y < y2; y++) {
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
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === y2 - 1 || mainTile > 0) {
				bdContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2
				}
				if (hasFloor) {
					canvasY = canvasY - (16 * 0.3125);
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + (16 * 0.1875));
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				bdContext.closePath();
				bdContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === y2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(x1, y1, x2, y2, type) {
	for (var y = y1; y < y2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = x1; x < x2; x++) {
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
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1 || mainTile > 0) {
				bdContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - (16 * 0.3125), canvasX2, canvasY - (16 * 0.3125));
						drawLine(canvasX, canvasY + (16 * 0.1875), canvasX2, canvasY + (16 * 0.1875));
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				bdContext.closePath();
				bdContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}


var longestTime = 0;

function drawLine(startX, startY, endX, endY) {
	bdContext.moveTo(startX, startY);
	bdContext.lineTo(endX, endY);
}

var lastPlayerX = 0;
var lastPlayerY = 0;
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;
var lastRoomLength = 0;

function drawWorld() {
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.x * 16) + (modulus(modulus(modulus(player.x), 10), 1) * 16) - miniViewPortX;
	miniMapPlayerY = (currentRoom.y * 16) + (modulus(modulus(modulus(player.y), 10), 1) * 16) - miniViewPortY;
	if (currentRoom.x + modulus(modulus(modulus(player.x), 10), 1) !== lastPlayerX || currentRoom.y + modulus(modulus(modulus(player.y), 10), 1) !== lastPlayerY || lastRoomLength !== world.rooms.length) {
		minimapCanvas.width = 150;
		minimapCanvas.height = 150;
		minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
		drawnDoors.length = 0;
		minimapContext.lineWidth = 2;
		minimapContext.fillStyle = "#000";
		for (var r = 0; r < world.r.length; r++) {
			for (var i = 0; i < world.r[r].rooms.length; i++) {
				room = world.r[r].rooms[i];
				roomX = (room.x * 16) - miniViewPortX;
				roomY = (room.y * 16) - miniViewPortY;
				if (roomX + (room.w * 16) > 0 && roomY + (room.h * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
					minimapContext.beginPath();
					minimapContext.rect(roomX, roomY, room.w * 16, room.h * 16);
					minimapContext.fill();
					minimapContext.closePath();
				}
			}
		}
		forEachRoom("bg", "bd", function(room, roomX, roomY) {
			if (room.v) {
				minimapContext.beginPath();
				minimapContext.rect(roomX, roomY, room.w * 16, room.h * 16);
				minimapContext.fill();
				minimapContext.stroke();
				minimapContext.closePath();
			}
		});
		forEachRoom(0, "bg", drawDoors);
		forEachRoom(0, 0, drawIcons);
	}
	drawPlayer();
	lastPlayerX = currentRoom.x + modulus(modulus(modulus(player.x), 10), 1);
	lastPlayerY = currentRoom.y + modulus(modulus(modulus(player.y), 10), 1);
	lastRoomLength = world.rooms.length;
}

function forEachRoom(fillStyle, strokeStyle, fn) {
	for (var r = 0; r < world.r.length; r++) {
		if (typeof fillStyle === "string") {
			minimapContext.fillStyle = world.r[r].color[fillStyle];
		}
		if (typeof strokeStyle === "string") {
			minimapContext.strokeStyle = world.r[r].color[strokeStyle];
		}
		for (var i = 0; i < world.r[r].rooms.length; i++) {
			room = world.r[r].rooms[i];
			roomX = (room.x * 16) - miniViewPortX;
			roomY = (room.y * 16) - miniViewPortY;
			if (roomX + (room.w * 16) > 0 && roomY + (room.h * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				fn(room, roomX, roomY);
			}
		}
	}
}

var lColors = []

function drawIcons(room) {
	if (room.v) {
		var door = null;
		for (var i = 0; i < room.d.length; i++) {
			door = room.d[i];
			var color = rColors[door.dt].l;
			if (door.dt > 0) {
				switch (door.dir) {
					case "N":
						drawCircle(16 * door.x + 5, 16 * door.y, color);
						continue;
					case "S":
						drawCircle(16 * door.x + 5, 16 * door.y + 16, color);
						continue;
					case "W":
						drawCircle(16 * door.x - 3, 16 * door.y + 8, color);
						continue;
					case "E":
						drawCircle(16 * door.x + 13, 16 * door.y + 8, color);
						continue;
					default:
						continue;
				}
			}
		}
		var color = rColors[room.s].l;
		if (room.s > 0) {
			drawCircle(16 * (room.x + room.w / 2) - 3, 16 * (room.y + room.h / 2), "rgba(0,0,0,0)", color);
		}
	}
}

function drawCircle(centerX, centerY, color, bd) {
	var radius = 3;
	minimapContext.beginPath();
	minimapContext.arc(centerX + radius - miniViewPortX, centerY - miniViewPortY, radius, 0, 2 * Math.PI, false);
	minimapContext.fillStyle = color;
	minimapContext.fill();
	if (bd) {
		minimapContext.lineWidth = 2;
		minimapContext.strokeStyle = bd;
		minimapContext.stroke();
	}
	minimapContext.closePath();
}

var drawnDoors = [];

function drawDoors(room) {
	if (room.v) {
		var door = null;
		for (var e = 0; e < room.d.length; e++) {
			door = room.d[e];
			var ID = room.x + "-" + room.y + "-" + door.r2.x + "-" + door.r2.y;
			var ID2 = door.r2.x + "-" + door.r2.y + "-" + room.x + "-" + room.y;
			if (drawnDoors.indexOf(ID2) === -1 && drawnDoors.indexOf(ID) === -1) {
				var doorX = 16 * door.x;
				var doorY = 16 * door.y;

				if (door.dir === "N") {
					drawLine2(doorX + 4, doorY, doorX + 16 - 4, doorY);
				}
				if (door.dir === "S") {
					drawLine2(doorX + 4, 16 * (door.y + 1), doorX + 16 - 4, 16 * (door.y + 1));
				}
				if (door.dir === "W") {
					drawLine2(doorX, doorY + 4, doorX, doorY + 16 - 4);
				}
				if (door.dir === "E") {
					drawLine2(16 * (door.x + 1), doorY + 4, 16 * (door.x + 1), doorY + 16 - 4);
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
var playerCanvas, tileCanvas, bdCanvas, playerContext, tileContext, bdContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas;
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
	xd: 0,
	yd: 1,
	xa: 0,
	ya: 0,
	maxa: 5,
	jf: 7,
	jh: 50,
	js: 0,
	j: 0,
	ju: 0,
	ht: 0,
	mj: 1,
	a: 0,
	ῼ: 5,
	dc: window.performance.now(),
	mῼ: 5,
	keys:[]
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
// 		a: 0,
// 		img: img
// 	};
// 	if (moveable) {
// 		entity.xd = 0;
// 		entity.yd = 0;
// 		entity.xa = 0;
// 		entity.ya = 1;
// 		entity.maxa = 5;
// 	}
// 	if (moveable) {
// 		entity.jf = 7;
// 		entity.jh = 50;
// 		entity.js = 0;
// 		entity.j = 0;
// 		entity.ju = 0;
// 		entity.mj = 3;
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
	playerCanvas = getByType("p");
	bdCanvas = getByType("b");
	tileCanvas = getByType("t");
	minimapCanvas = getByType("m");
	miniMapIconsCanvas = getByType("i");
	playerContext = playerCanvas.getContext("2d");
	bdContext = bdCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	miniMapIconsContext = miniMapIconsCanvas.getContext("2d");
	resizeCanvas();
	startWorld();
	for (var r = 0; r < rColors.length; r++) {
		var rooms = random(10, 20);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		if (r + 1 < rColors.length) {
			addRegion();
		}
	}
	d();
	enterRoom(world.rooms[0]);
	currentRoom.sr = true;
	currentRoom.sx = random(0, (currentRoom.w * 1) - 1);
	currentRoom.sy = random(0, (currentRoom.h * 1) - 1);
	player.x = currentRoom.sx * 10 * 16 + (10 / 2 * 16);
	player.y = currentRoom.sy * 10 * 16 + (2 * 16);
	loop();
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		bdCanvas.width = playerCanvas.width = tileCanvas.width = 300;
	} else {
		bdCanvas.width = playerCanvas.width = tileCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		bdCanvas.height = playerCanvas.height = tileCanvas.height = 300;
	} else {
		bdCanvas.height = playerCanvas.height = tileCanvas.height = window.innerHeight;
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
	bdContext.strokeStyle = currentRoom.c.bd;
	bdContext.lineWidth = 2;
	playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
	bdContext.clearRect(0, 0, bdCanvas.width, bdCanvas.height);
	tileContext.fillStyle = currentRoom.c.bd;
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.c.bg;
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	drawMap();
	drawWorld();
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.ῼ / player.mῼ))).toString(16);
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
			player.j = 1;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xd = 1;
	} else if (event.keyCode === keys.a) {
		player.xd = -1;
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
			player.j = 0;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xd = 0;
			}
		} else {
			player.xd = 0;
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
// 			// 	// room = rotate(r1, 10, 10, random(0, 3));
// 			// 	room = rotate(r1, 10, 10, 0);
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
// 			// room = rotate(r1, 10, 10, 3);
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
// 	// console.log(width, height, r1, map.length)
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
	entity.xa = entity.xa + (entity.xd / 60 * dt);
	if (entity.xa > entity.maxa) {
		entity.xa = entity.maxa;
	}
	if (entity.xa < -entity.maxa) {
		entity.xa = -entity.maxa;
	}
	if (entity.xd === 0) {
		if (entity.xa > 0) {
			entity.xa = entity.xa + ((-1 * 2 / 60) * dt);
		} else if (entity.xa < 0) {
			entity.xa = entity.xa + ((1 * 2 / 60) * dt);
		}
		if ((entity.xa < ((1 / 60) * dt) && entity.xa > ((-1 / 60) * dt)) || entity.yd === 1 || entity.yd === -1) {
			entity.xa = 0;
		}
	}
	entity.x = entity.x + entity.xa;
}

function handleJump(entity) {
	if (entity.j && (entity.yd !== -1 && entity.ju < entity.mj)) {
		if (entity.mj > 1 && entity.ju === 0 && entity.yd === 1) {
			entity.ju++;
		}
		if ((entity.ju === 0 && entity.yd === 0) || entity.ju > 0 || entity.mj > 1) {
			entity.yd = -1;
			entity.ya = -entity.jf;
			entity.js = entity.y;
			entity.ju++;
		}
		entity.ht = 0;

	}
	if (entity.yd === 0 || !entity.j || entity.ht > entity.jh) {
		entity.yd = 1;
	}
	if (entity.yd === 1) {
		entity.j = 0;
		entity.ya = entity.ya + ((entity.jf / 2) / 60 * dt); // falling
	}

	if (entity.yd === 0) {
		if (entity.ya > 0) {
			entity.ya = entity.ya + ((-1 / 60) * dt);
		} else if (entity.ya < 0) {
			entity.ya = entity.ya + ((1 / 60) * dt);
		}
		if (entity.ya < ((1 / 60) * dt) && entity.ya > ((-1 / 60) * dt)) {
			entity.ya = 0;
		}
	}
	if (entity.ya > entity.maxa) {
		entity.ya = 10;
	}
	entity.ht -= entity.ya;
	entity.ht = round(entity.ht);
	entity.y = entity.y + entity.ya;
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
	if ((falling || entity.y + entity.h > height * 16) && entity.yd === 1) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * 16;
		entity.ya = 0;
		entity.yd = 0;
		entity.ju = 0;
		entity.j = 0;
		entity.ht = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var j = false;
	if (xAlignment === 0) {
		j = currentMap[aboveLeft] !== 0;
	} else {
		j = currentMap[aboveLeft] !== 0 || currentMap[aboveRight] !== 0;
	}
	if (j && entity.j === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.ya = -1;
		entity.yd = 1;
		entity.j = 0;
		entity.ht = 0;
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
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xa > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xd = 0;
			entity.xa = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xa > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xd = 0;
			entity.xa = 0;
		} else if ((walkLeft || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xa < 0) {
			// console.log("STOP -1")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xd = 0;
			entity.xa = 0;
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
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = {};
	var northDoor, eastDoor, southDoor, westDoor;
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var roomX = Math.floor(x / 10);
			var roomY = Math.floor(y / 10);
			northDoor = getDoor(worldRoom, roomX, roomY, "N");
			eastDoor = getDoor(worldRoom, roomX, roomY, "E");
			southDoor = getDoor(worldRoom, roomX, roomY, "S");
			westDoor = getDoor(worldRoom, roomX, roomY, "W");
			var arrayIndex = coordinate(roomX, roomY, topSize);
			var roomId = roomX + "-" + roomY;
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
			if (x === 0) {
				// console.log(roomX, roomY, worldRoom)
			}
			// top walls
			if ((y === 0 && northDoor === null && x < width * 10)) {
				map[mapCoord] = 1;
			}
			// left walls
			if ((x === 0 && westDoor === null && y < height * 10)) {
				map[mapCoord] = 1;
			}
			// bottom walls
			if ((y === height * 10 - 1 && southDoor === null && x < width * 10)) {
				map[mapCoord] = 1;
			}
			// right walls
			if ((x === width * 10 - 1 && eastDoor === null && y < height * 10)) {
				map[mapCoord] = 1;
			}
			// top walls
			if ((y === 0 && northDoor !== null && x < width * 10 && northDoor.dt > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = northDoor.dt + 1;
			}
			// left walls
			if ((x === 0 && westDoor !== null && y < height * 10 && westDoor.dt > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = westDoor.dt + 1;
			}
			// bottom walls
			if ((y === height * 10 - 1 && southDoor !== null && x < width * 10 && southDoor.dt > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = southDoor.dt + 1;
			}
			// right walls
			if ((x === width * 10 - 1 && eastDoor !== null && y < height * 10 && eastDoor.dt > 0 && map[mapCoord] === 0)) {
				map[mapCoord] = eastDoor.dt + 1;
			}
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
	room.map = BigRoom(room.w * 1, room.h * 1, room, function(array, roomsX, roomsY, arraySize) {
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
var width = 0;
var height = 0;

function movePlayer(room, direction, position) {
	enterRoom(room);
	for (var i = 0; i < room.d.length; i++) {
		var match = false;
		var door = room.d[i];
		if (door.dir === direction) {
			if (door.dir === "N" || door.dir === "S") {
				match = position === door.x;
			}
			if (door.dir === "E" || door.dir === "W") {
				match = position === door.y;
			}
			if (match) {
				var translatedX = ((door.x - room.x) * 1);
				var translatedY = ((door.y - room.y) * 1);
				// console.log(player.x, player.y)
				if (door.dir === "N") {
					translatedX += Math.floor(1 / 2);
					player.y = 0;
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "E") {
					translatedY += Math.floor(1 / 2);
					translatedX += 1;
					player.x = (room.w * 10 * 16 * 1) - (player.w);
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(1 / 2);
					translatedY += 1;
					player.y = (room.h * 10 * 16 * 1) - (player.h);
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(1 / 2);
					player.x = 0;
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
			}
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.d.length; i++) {
		var door = currentRoom.d[i];
		var translatedX = ((door.x - currentRoom.x) * 1);
		var translatedY = ((door.y - currentRoom.y) * 1);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.w * 10 * 16 * 1;
		var roomHeight = currentRoom.h * 10 * 16 * 1;
		if (door.dir === "N") {
			translatedX += Math.floor(1 / 2);
		}
		if (door.dir === "E") {
			translatedY += Math.floor(1 / 2);
			translatedX += 1;
		}
		if (door.dir === "S") {
			translatedX += Math.floor(1 / 2);
			translatedY += 1;
		}
		if (door.dir === "W") {
			translatedY += Math.floor(1 / 2);
		}
		if (window.performance.now() - player.dc > 400) {
			if (player.x <= 0 && player.xd === -1 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with left door");
				movePlayer(door.r2, "E", door.y);
			}
			if (player.y <= 0 && player.yd === -1 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with top door");
				movePlayer(door.r2, "S", door.x);
			}
			if (player.x + player.w >= roomWidth && player.xd === 1 && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
				// console.log("Collision with right door");
				movePlayer(door.r2, "W", door.y);
			}
			if (player.y + player.h >= roomHeight && player.yd !== 0 && Math.abs(player.ya) > 5 && door.dir === "S" && translatedX === playerX && (translatedY === playerY2 || translatedY === playerY)) {
				// console.log(player.ya)
				// console.log(window.performance.now() - player.dc)
				// console.log("Collision with bottom door");
				movePlayer(door.r2, "N", door.x);
			}
		}
	}
}

function enterRoom(room) {
	if (room.map === null) {
		playerSizedRoom(room);
	}
	currentRoom = room;
	collectKey(room);
	currentRoom.v = true;
	currentMapTiles = room.map.tiles;
	currentMap = room.map.map;
	height = room.map.height * 10;
	width = room.map.width * 10;
	realMapHeight = room.map.height * 10 * 16;
	realMapWidth = room.map.width * 10 * 16;
	player.dc = window.performance.now();
	document.title = currentRoom.c.name;
	history.pushState(null, null, "#"+document.title);
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
	viewPortY = ~~ (0.5 + viewPortY);
	viewPortY = ~~ (0.5 + viewPortY);
}
function parseMinimapViewport() {
	var canvas = minimapContext.canvas;
	var deadZoneX = canvas.width / 2;
	var deadZoneY = canvas.height / 2;
	var x = ((currentRoom.x + (modulus(modulus(modulus(player.x), 10), 1))) * 16);
	var y = ((currentRoom.y + (modulus(modulus(modulus(player.y), 10), 1))) * 16);
	if (x - miniViewPortX + deadZoneX > canvas.width) {
		miniViewPortX = x - (canvas.width - deadZoneX);
	} else if (x - deadZoneX < miniViewPortX) {
		miniViewPortX = x - deadZoneX;
	}
	if (y - miniViewPortY + deadZoneY > canvas.height) {
		miniViewPortY = y - (canvas.height - deadZoneY);
	} else if (y - deadZoneY < miniViewPortY) {
		miniViewPortY = y - deadZoneY;
	}
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	miniViewPortY = ~~ (0.5 + miniViewPortY);
}
var world, currentRoom;

var chanceOfAddingDoor = 0.2;
var currentColorIndex = 0;
var rColors = [{
	bg: "#BBBBBB",
	bd: "#A0A0A0",
	o: "#CFCFCF",
	l: "#FFFFFF",
	name:"Dungeon"
}, {
	bd: "#990000",
	bg: "#FF3333",
	o: "#FF0000",
	l: "#FF0000",
	name:"Fire"
}, {
	bd: "#006600",
	bg: "#00BB00",
	o: "#00BB00",
	l: "#00FF00",
	name:"Air"
}, {
	bd: "#000066",
	bg: "#3333FF",
	o: "#0000FF",
	l: "#0000FF",
	name:"Water"
}, {
	bg: "#9F9F9F",
	bd: "#555555",
	o: "#555555",
	l: "#000000",
	name:"Earth"
}];

function startAt(x, y, r) {
	world.f.length = 0;
	world.f.push({
		x: x,
		y: y
	});
	world.cr = r;
	world.r.push(r);
}

function startNewRegion(r) {
	var trapped = true;
	var f = getFrontiersForAllRooms();
	var test = [];
	while (trapped) {
		var emptySides = 0;
		var frontier = getRandom(f);
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
	startAt(frontier.x, frontier.y, r);
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
	var roomX = room.x;
	while (roomX < room.x + room.w) {
		if (canPlaceRoom(roomX, room.y - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.y - 1
			});
		}
		if (canPlaceRoom(roomX, room.y + room.h, 1, 1)) {
			array.push({
				x: roomX,
				y: room.y + room.h
			});
		}
		roomX++;
	}
	var roomY = room.x;
	while (roomY < room.y + room.h) {
		if (canPlaceRoom(roomY, room.x - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.x - 1
			});
		}
		if (canPlaceRoom(roomY, room.x + room.w, 1, 1)) {
			array.push({
				x: roomY,
				y: room.x + room.w
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
		if (room.x > x + width - 1 || room.x + room.w - 1 < x || room.y > y + height - 1 || room.y + room.h - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var d = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		d = 0;
		d = d + addDoorsAlongNorthWall(room);
		d = d + addDoorsAlongSouthWall(room);
		d = d + addDoorsAlongWestWall(room);
		d = d + addDoorsAlongEastWall(room);
		if (room.r.rooms.length === 1 && d > 0) {
			stop = true;
		}
		for (var i = 0; i < room.d.length; i++) {
			door = room.d[i];
			if (o(door, room).r === room.r) {
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
	var x = room.x;
	while (x < room.x + room.w) {
		thisRoom = getRoom(x, room.y - 1);
		if (thisRoom !== null) {
			array.push({
				x: x,
				y: room.y,
				o: thisRoom
			});
		}
		x++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.o);
			room.d.push(door);
			// object.o.d.push(door);
			object.o.d.push(Door(object.x, object.y - 1, "S", object.o, room));
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
	var x = room.x;
	while (x < room.x + room.w) {
		thisRoom = getRoom(x, room.y + room.h);
		if (thisRoom !== null) {
			array.push({
				x: x,
				y: room.y + room.h - 1,
				o: thisRoom
			});
		}
		x++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.o);
			room.d.push(door);
			// object.o.d.push(door);
			object.o.d.push(Door(object.x, object.y + 1, "N", object.o, room));
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
	var y = room.y;
	while (y < room.y + room.h) {
		thisRoom = getRoom(room.x - 1, y);
		if (thisRoom !== null) {
			array.push({
				x: room.x,
				y: y,
				o: thisRoom
			});
		}
		y++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.o);
			room.d.push(door);
			// object.o.d.push(door);
			object.o.d.push(Door(object.x - 1, object.y, "E", object.o, room));
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
	var y = room.y;
	while (y < room.y + room.h) {
		thisRoom = getRoom(room.x + room.w, y);
		if (thisRoom !== null) {
			array.push({
				x: room.x + room.w - 1,
				y: y,
				o: thisRoom
			});
		}
		y++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.o);
			room.d.push(door);
			// object.o.d.push(door);
			object.o.d.push(Door(object.x + 1, object.y, "W", object.o, room));
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
		if (room.x > x || room.x + room.w - 1 < x || room.y > y || room.y + room.h - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function getDoor(room, x, y, dir) {
	var door = null;
	for (var i = 0; i < room.d.length; i++) {
		door = room.d[i];
		if (door.dir === dir && door.x === room.x + x && door.y === room.y + y) {
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
	// if (world.f.length > 0) {
	var frontier = getRandom(world.f);
	try {
		addRoom(growRoom(frontier.x, frontier.y));
	} catch (e) {
		console.log(world, frontier, e)
	}
	// }
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.x, room.y, room.w, room.h)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.f = addBorderingFrontiers(array, room);
	if (world.f.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room))
	}
	room.c = world.cr.color;
	world.rooms.push(room);
	world.cr.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var x = room.x;
	while (x < room.x + room.w) {
		if (canPlaceRoom(x, room.y - 1, 1, 1)) {
			array.push({
				"x": x,
				"y": room.y - 1
			});
		}
		if (canPlaceRoom(x, room.y + room.h, 1, 1)) {
			array.push({
				"x": x,
				"y": room.y + room.h
			});
		}
		x++;
	}
	var y = room.y;
	while (y < room.y + room.h) {
		if (canPlaceRoom(room.x - 1, y, 1, 1)) {
			array.push({
				"x": room.x - 1,
				"y": y
			});
		}
		if (canPlaceRoom(room.x + room.w, y, 1, 1)) {
			array.push({
				"x": room.x + room.w,
				"y": y
			});
		}
		y++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.f.length; i++) {
		if (!(world.f[i].x >= room.x - 1 && world.f[i].x <= room.x + room.w && world.f[i].y >= room.y && world.f[i].y <= room.y + room.h - 1)) {
			if (!(world.f[i].x >= room.x && world.f[i].x <= room.x + room.w - 1 && world.f[i].y >= room.y - 1 && world.f[i].y <= room.y + room.h)) {
				array.push(world.f[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.cr.maxW || height < world.cr.maxH) && Math.random() < 0.9) {
		switch (parseInt(Math.random() * 4)) {
			case 0:
				if (height < world.cr.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
					y--;
					height++;
				}
				continue;
			case 1:
				if (height < world.cr.maxH && (canPlaceRoom(x, y, width, height + 1))) {
					height++;
				}
				continue;
			case 2:
				if (width < world.cr.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
					x--;
					width++;
				}
				continue;
			case 3:
				if (width < world.cr.maxW && (canPlaceRoom(x, y, width + 1, height))) {
					width++;
				}
				continue;
			default:
				continue;
		}
	}
	return Room(x, y, width, height, world.cr);
}

function Room(x, y, width, height, r) {
	return {
		x: x,
		y: y,
		w: width,
		h: height,
		c: null,
		r: r,
		s: 0,
		sx: 0,
		sy: 0,
		sr: false,
		v: false,
		d: [],
		map: null
	};
}

function Door(x, y, direction, r1, r2) {
	return {
		x: x,
		y: y,
		dt: 0,
		dir: direction,
		r1: r1,
		r2: r2
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.s = 0;
		for (var e = 0; e < room.d.length; e++) {
			door = room.d[e];
			door.dt = 0;
		}
	}
}

function assignDoorTypes() {
	var door = null;
	var r1 = null;
	var r2 = null;
	var room = null;
	for (var i = 0; i < world.r.length; i++) {
		r1 = world.r[i];
		getRandom(r1.rooms).s = (i + 1) % rColors.length;
		for (var e = 0; e < r1.rooms.length; e++) {
			room = r1.rooms[e];
			for (var r = 0; r < room.d.length; r++) {
				door = room.d[r];
				r2 = o(door, room).r;
				if (r2 !== r1) {
					if (door.dt === 0) {
						door.dt = (i + 1) % rColors.length;
					}
				}
			}
		}
	}
}

function collectKey(room) {
	if(player.keys.indexOf(room.s) === -1) {
		player.keys.push(room.s);
		unlRooms();
	}
}

function unlRooms() {
	for (var i = 0; i < world.rooms.length; i++) {
		var hasDoor = false;
		var room = world.rooms[i];
		if (player.keys.indexOf(room.s) > -1) {
			room.s = 0;
		}
		for (var e = 0; e < room.d.length; e++) {
			var door = room.d[e];
			if (player.keys.indexOf(door.dt) > -1) {
				door.dt = 0;
				hasDoor = true;
			}
		}
		if (hasDoor && room.map !== null) {
			for (var r = 0; r < room.map.map.length; r++) {
				if (room.map.map[r] > 1) {
					if (player.keys.indexOf(room.map.map[r] - 1)) {
						room.map.map[r] = 0;
					}
				}
			}
		}
	}
}

function o(door, room) {
	return door.r1 === room ? door.r2 : door.r1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		f: [],
		r: [],
		cr: 0,

	};
	crColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(1);
}

function nextRegion() {
	var r = Region(rColors[crColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1);
	crColorIndex = (crColorIndex + 1) % rColors.length;
	return r;
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
}

function addRoomToWorld() {
	createRoom();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function d() {
	clearDoorTypes();
	assignDoorTypes();
}