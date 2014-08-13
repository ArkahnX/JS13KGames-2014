(function(navigator, window, document) {
		
	var hardware = {};
	var actions = 0;
	

	var addEventListener = "addEventListener";
	var LENGTH = "length";
	var disabled = false;
	var polling = false;

	var i = 0;
	var mousex = 0;
	var mousey = 0;
	var movewait;
	var realMouseMoveData = false;
	var mouseMOveXId = 0;
	var mouseMOveYId = 0;
	

var stage, renderer;
var context, canvas;
var polyVertices = new Float32Array(8);
var physicsEntity = new Float32Array(PHYSICS_ENTRIES);


var test1, test2;


	var NULL = null;
	var LENGTH = "length";
	var NEXT = "next";
	var oldArrays = [];
	var types = {};
	types[UINT4] = Uint8Array;
	types[UINT8] = Uint8Array;
	types[UINT12] = Uint16Array;
	types[UINT16] = Uint16Array;
	types[UINT32] = Uint32Array;
	types[INT8] = Int8Array;
	types[INT16] = Int16Array;
	types[INT32] = Int32Array;
	types[FLOAT32] = Float32Array;
	types[FLOAT64] = Float64Array;
	var buffers = {
		i4: new ArrayBuffer((1048576 * 4) / 8),
		i8: new ArrayBuffer((1048576 * 8) / 8),
		i12: new ArrayBuffer((10240 * 12) / 8),
		i16: new ArrayBuffer((524288 * 16) / 8),
		i32: new ArrayBuffer((10240 * 32) / 8)
	};
	var usedIndexes = {
		i4: new Uint8Array((1048576 * 1) / 8),
		i8: new Uint8Array((1048576 * 1) / 8),
		i12: new Uint8Array((10240 * 1) / 8),
		i16: new Uint8Array((524288 * 1) / 8),
		i32: new Uint8Array((10240 * 1) / 8)
	};
	var lastSelectedNumbers = {
		i4: -1,
		i8: -1,
		i12: -1,
		i16: -1,
		i32: -1
	};
	var maxValue = {
		i4: Math.pow(2, 4) - 1,
		i8: Math.pow(2, 8) - 1,
		i12: Math.pow(2, 12) - 1,
		i16: Math.pow(2, 16) - 1,
		i32: Math.pow(2, 32) - 1
	};
	

var stop = true;
var currentTick = 0;
var lastTick = 0;
var loop;
var timeEstimates = [];
var queuedFunctions = [];
var queuedParameters = [];
var queueLength = 0;


	var axes = [];
	var edge, axis, verticeList1, verticeList2, axes1, axes2, MTV, entity1, entity2;
	var vectors = [];
	var projections = [];
	var overlap = 9e9;
	var mathPiDividedBy180 = Math.PI / 180;
	

	var now = Date.now;
	
	function bind(type, id, action, keyCode) {
		var uniqueId = "" + type + id;
		hardware[type][uniqueId].set(action, keyCode);
	}

	function unbind(type, id, action) {
		bind(type, id, action, -1);
	}

	function binding(type, uniqueId, action) {
		return hardware[type][uniqueId].get(action);
	}

	function matchKey(type, id, keyCode, match) {
		var uniqueId = "" + type + id;
		var result = hardware[type][uniqueId].each(function(key, action) {
			if (key === keyCode) {
				match(action);
			}
		});
	}

	function action() {
		actions =+ arguments.length;
	}

	function input(type, id) {
		var uniqueId = "" + type + id;
		if (!hardware[type]) {
			hardware[type] = {};
		}
		if (!hardware[type][uniqueId]) {
			hardware[type][uniqueId] = getList(actions, INT8);
		}
	}
	


	function eventType(type) {
		if (type.indexOf("mouse") > -1) {
			return MOUSE;
		}
		if (type.indexOf("key") > -1) {
			return KEYBOARD;
		}
	}


	function pressEvent(e) {
		if (e.touches) {
			changeKey(MOUSE, 0, MOUSE_LEFT_CLICK, ACTIVE, e);
		} else {
			changeKey(eventType(e.type), 0, e.which, ACTIVE, e);
		}
	}

	function releaseEvent(e) {
		if (e.touches) {
			changeKey(MOUSE, 0, MOUSE_LEFT_CLICK, INACTIVE, e);
		} else {
			changeKey(eventType(e.type), 0, e.which, INACTIVE, e);
		}
	}

	function scrollEvent(e) {
		changeKey(eventType(e.type), 0, MOUSE_WHEEL_X, e.wheelDeltaX, e);
		changeKey(eventType(e.type), 0, MOUSE_WHEEL_Y, e.wheelDeltaY, e);
	}

	function handleMouseMove(e) {
		if (e.touches) {
			var touch = e.touches[0];
			if (touch.pageX || touch.pageY) {
				mousex = touch.pageX;
				mousey = touch.pageY;
			} else if (touch.clientX || touch.clientY) {
				mousex = touch.clientX;
				mousey = touch.clientY;
			}
		} else if (e.pageX || e.pageY) {
			mousex = e.pageX;
			mousey = e.pageY;
		} else if (e.clientX || e.clientY) {
			mousex = e.clientX;
			mousey = e.clientY;
		}
	}

	function moveEvent(e) {
		handleMouseMove(e);
		if (!realMouseMoveData) {
			if (typeof movewait !== 'undefined') {
				clearTimeout(movewait);
			}
			movewait = setTimeout(function() {
				changeKey(eventType(e.type), 0, MOUSE_MOVE_X, mousex, e);
				changeKey(eventType(e.type), 0, MOUSE_MOVE_Y, mousey, e);
			}, 50);
		}
	}



	function compare(a, b) {
		var proto = Array.prototype;
		return proto.filter.call(a, function(i) {
			return proto.indexOf.call(b, i) > -1;
		});
	}



	function changeKey(type, id, keyCode, value, e) {
		matchKey(type, id, keyCode, function(action) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			Player.find(type, id, function(player) {
				// console.log(player.get(Player.length + action), value, player.get(Player.length + action) !== value)
				if (player.get(Player.length + action) !== value || (type === MOUSE && (keyCode === MOUSE_WHEEL_X || keyCode === MOUSE_WHEEL_Y))) { // we only want to submit a change if the value is different
					player.set(Player.length + action, value);
					sendEvent(player.get(LOCALID), action, value, player);
				}
			});
		});
	}

	function sendEvent(localId, action, value, player) {
		event.emit("change", localId, action, value, player);
	}

	function listen(node, type) {
		if (type === MOUSE) {
			node[addEventListener]("mousedown", pressEvent);
			node[addEventListener]("mouseup", releaseEvent);
			node[addEventListener]("mousemove", moveEvent);
			node[addEventListener]("mousewheel", scrollEvent);
			node[addEventListener]("touchstart", pressEvent);
			node[addEventListener]("touchend", releaseEvent);
			node[addEventListener]("touchmove", moveEvent);
		}
		if (type === KEYBOARD) {
			node[addEventListener]("keydown", pressEvent);
			node[addEventListener]("keyup", releaseEvent);
		}
	}
	


function changeState(context, state, value) {
	if(context[state] !== value) {
		context[state] = value;
	}
}

function poly(entity) {
	polyVertices = cleanList(polyVertices)
	context.beginPath();
	var vertices = getVertices(getPhysicsEntity(entity, physicsEntity), polyVertices);
	console.log(vertices)
	moveTo(getValue(vertices, X), getValue(vertices, Y));
	for (i = 2; i < vertices.length; i += 2) {
		context.lineTo(getValue(vertices, i + X), getValue(vertices, i + Y));
	}
	context.lineTo(getValue(vertices, X), getValue(vertices, Y));
	// putList(vertices);
	context.beginPath();
	changeState(context, "lineWidth", 2);
	changeState(context, "strokeStyle", getValue(entity, COLOR).toString(16));
	context.fill();
	context.stroke();
	context.closePath();
}

function setupDraw(entity, callback) {
	var x = getValue(entity, X);
	var y = getValue(entity, Y);
	var angle = getValue(entity, ANGLE) || 0;
	context.save();
	context.translate(x, y);
	context.rotate(angle * Math.PI / 180);
	callback(entity);
	context.restore();
}

function reposition(graphic, entity) {
	graphic.position.x = getValue(entity, X);
	graphic.position.y = getValue(entity, Y);
	graphic.rotation = getValue(entity, ANGLE) * Math.PI / 180;
}

function drawStage() {
	renderer.render(stage);
}



function start() {
	// event.on("change", function(localId, action, value, player) {
	// 	if (action === MOVEUP) {
	// 		setValue(test1, VELOCITY_Y, value);
	// 	}
	// 	if (action === TURNCW) {
	// 		// setValue(test1, TURNSPEED, value);
	// 	}
	// 	if (action === TURNCCW) {
	// 		// setValue(test1, TURNSPEED, -value);
	// 	}
	// 	if (action === TURNCW) {
	// 		setValue(test1, VELOCITY_X, value);
	// 	}
	// 	if (action === TURNCCW) {
	// 		setValue(test1, VELOCITY_X, -value);
	// 	}
	// 	if (action === MOVEDOWN) {
	// 		setValue(test1, VELOCITY_Y, -value);
	// 	}
	// 	// console.log(action, value)

	// 	// console.log(localId, action, value, player)
	// });
	queue(1, function(deltaTime) {
		//move
		// setValue(test1, TURNSPEED, 10)
		// var turnAngle = test1.get(ANGLE) + test1.get(TURNSPEED);
		// var reverse = turnAngle;
		// turnAngle = Math.abs(turnAngle) % 360;
		// if (reverse < 0) {
		// turnAngle = 360 - turnAngle;
		// }
		// var xSpeed = test1.get(VELOCITY_Y) * Math.cos(turnAngle * Math.PI / 180);
		// var ySpeed = test1.get(VELOCITY_Y) * Math.sin(turnAngle * Math.PI / 180);
		var ySpeed = -getValue(test1, VELOCITY_Y)
		var xSpeed = getValue(test1, VELOCITY_X)
		setValue(test1, X, getValue(test1, X) + xSpeed);
		setValue(test1, Y, getValue(test1, Y) + ySpeed);
		// setValue(test1, ANGLE, turnAngle);
		//then physics
		var redraw = false;
		var MTV = test(getValue(test1, X), getValue(test1, Y), getValue(test1, WIDTH), getValue(test1, HEIGHT), getValue(test1, ANGLE),
			getValue(test2, X), getValue(test2, Y), getValue(test2, WIDTH), getValue(test2, HEIGHT), getValue(test2, ANGLE));
		if (MTV) {
			if (getValue(test1, COLOR) !== 0xFF0000) {
				setValue(test1, COLOR, 0xFF0000);
				redraw = true;
			}
		} else {
			if (getValue(test1, COLOR) !== 0x000000) {
				setValue(test1, COLOR, 0x000000);
				redraw = true;
			}
		}
		// if (redraw) {
		setupDraw(test1, function(entity) {
			poly(test1);
		});
		// }
		//then draw
		// Draw.clear();
		// reposition(DRAW_GET_GRAPHIC(test2.get(SPRITE_ID)), test2);
		// reposition(DRAW_GET_GRAPHIC(test1.get(SPRITE_ID)), test1);
	});
	go(true);
	// (function() {
	// 	console.timeline();
	// 	console.profile();
	// 	setTimeout(function() {
	// 		go();
	// 		console.timelineEnd();
	// 		console.profileEnd();
	// 	}, 3000);
	// })();

}

function setup() {
	action(TURNCW, TURNCCW, MOVEUP, MOVEDOWN);
	input(KEYBOARD, 0);
	bind(KEYBOARD, 0, TURNCW, "D".charCodeAt(0));
	bind(KEYBOARD, 0, MOVEUP, "W".charCodeAt(0));
	bind(KEYBOARD, 0, TURNCCW, "A".charCodeAt(0));
	bind(KEYBOARD, 0, MOVEDOWN, "S".charCodeAt(0));
	listen(document, KEYBOARD);
	test2 = new Float32Array(10);
	setValue(test2, X, 170);
	setValue(test2, Y, 90);
	setValue(test2, ANGLE, 0);
	setValue(test2, WIDTH, 200);
	setValue(test2, HEIGHT, 50);
	setValue(test2, VELOCITY_X, 0);
	setValue(test2, VELOCITY_Y, 0);
	setValue(test2, TURNSPEED, 0);
	setValue(test2, COLOR, 0xAAAAAA);
	// setValue(test2, SPRITE_ID, DRAW_NEW_GRAPHIC(function(graphic) {
	// 	Draw.setup(test2, graphic, function(entity, sprite) {
	// 		Draw.poly(test2, sprite);
	// 	});
	// }));
	test1 = new Float32Array(10);
	// test1 = getList("f32", "f32", "s16", "u8", "u8", "s8", "s8", "s8", "u8", "u32");
	setValue(test1, X, 10);
	setValue(test1, Y, 10);
	setValue(test1, ANGLE, 0);
	setValue(test1, WIDTH, 30);
	setValue(test1, HEIGHT, 10);
	setValue(test1, VELOCITY_X, 0);
	setValue(test1, VELOCITY_Y, 0);
	setValue(test1, TURNSPEED, 0);
	setValue(test1, COLOR, 0x000000);
	// setValue(test1, SPRITE_ID, DRAW_NEW_GRAPHIC(function(graphic) {
	// 	Draw.setup(test1, graphic, function(entity, sprite) {
	// 		Draw.poly(test1, sprite);
	// 	});
	// }));

}



	function translate(description) {
		if (description === UINT4) {
			return "i4";
		} else if (description % UINT8 === 0) {
			return "i8";
		} else if (description % UINT16 === 0) {
			return "i16";
		} else if (description % UINT32 === 0) {
			return "i32";
		} else if (description === UINT12) {
			return "i12";
		} else if (description === FLOAT64) {
			return "i64";
		}
	}

	function getFunctions(view, bufferView, index) {
		if (view === "i8" || view === "i16" || view === "i32") {
			return bufferView[index];
		} else if (view === "i12") {
			return getBits(12, index, bufferView);
		} else if (view === "i4") {
			return getBits(4, index, bufferView);
		}
	}

	function setFunctions(view, bufferView, index, value) {
		if (view === "i8" || view === "i16" || view === "i32") {
			bufferView[index] = value;
		} else if (view === "i12") {
			setBits(12, index, value, bufferView);
		} else if (view === "i4") {
			setBits(4, index, value, bufferView);
		}
	}

	function pad(width, string, padding) {
		return (width <= string.length) ? string : pad(width, padding + string, padding);
	}

	function changeCharacter(string, index, value) {
		return string.substr(0, index) + value + string.substr(index + 1);
	}

	function toBinaryString(decimal, padding) {
		return pad(padding, parseFloat(decimal, 10).toString(2), "0").replace("-", "").replace("+", "");
	}

	function toDecimal(binary) {
		if (binary.indexOf(".") > -1) {
			return parseFloat(binary, 2);
		} else {
			return parseInt(binary, 2);
		}
	}

	function getBit(index, bufferView) {
		var decimal = bufferView[index >> 3];
		var binary = toBinaryString(decimal, 8);
		var offset = 7 - (index & 7); // keeps the number below 8
		return parseInt(binary[offset], 10);
	}

	function get8bit(index, bufferView) {
		var v = bufferView[index >> 3];
		if (v === undefined) {
			return NaN;
		}
		var off = index & 0x7;
		return (v >> (7 - off)) & 1;
	}

	function set8bit(index, value, bufferView) {
		var off = index & 0x7;
		if (value) {
			bufferView[index >> 3] |= (0x80 >> off);
		} else {
			bufferView[index >> 3] &= ~ (0x80 >> off);
		}
	}

	function setBit(index, value, bufferView) {
		var offset = 7 - (index & 7); // keeps the number below 8
		var decimal = bufferView[index >> 3];
		var binary = toBinaryString(decimal, 8);
		binary = changeCharacter(binary, offset, value);
		bufferView[index >> 3] = toDecimal(binary);
	}

	function getBits(bits, index, bufferView) {
		var number = "";
		for (var i = 0; i < bits; i++) {
			var offset = (index * bits) + i;
			number += "" + getBit(offset, bufferView);
		}
		return toDecimal(number);
	}

	function setBits(bits, index, value, bufferView) {
		var binaryValue = toBinaryString(value, bits);
		for (var i = 0; i < bits; i++) {
			var offset = (index * bits) + i;
			setBit(offset, binaryValue[i], bufferView);
		}
	}

	function size(description) {
		return types[description].BYTES_PER_ELEMENT;
	}

	function cleanList(list) {
		for (var i = 0; i < list.views[LENGTH]; i++) {
			list.set(i, 0);
		}
		return list;
	}



	function putList(array) {
		if (array) {
			if (!Help.has(oldArrays, array)) {
				var next = array[NEXT];
				var previous = array.prev;
				var list = array.list;
				if (next) {
					next.prev = previous;
				}
				if (previous) {
					previous[NEXT] = next;
				}
				if (list) {
					if (list.first === array) {
						if (next) {
							list.first = next;
						}
					}
					if (list.last === array) {
						if (previous) {
							list.last = previous;
						}
					}
				}
				array[NEXT] = NULL;
				array.prev = NULL;
				array.list = NULL;
				for (var i = 0; i < array.indexes.length; i++) {
					var index = array.indexes[i];
					array.set(i, 0);
					var name = array.types[i];
					var arrayToSplice = usedIndexes[name];
					// arrayToSplice[index] = 0;
					set8bit(index, 0, arrayToSplice);
				}
				array.indexes.length = 0;
				array.views.length = 0;
				oldArrays.push(array);
			}
		} else {
			return false;
		}
	}


	function getList(entries, description) {
		if (typeof description === "string") {
			console.trace();
			throw new Error("Expected description to be a number, instead it was:" + description);
		}
		var result;

		if (oldArrays.length > 0) {
			result = oldArrays.pop();
		} else {
			result = new Node();
		}
		result.setup(entries, description);
		return result;
	}

	function Node() {}

	Node.prototype = {
		next: NULL,
		prev: NULL,
		list: NULL,
		setup: function(entries, description) {
			var index = -1;
			var found = false;
			if (this.indexes) {
				this.indexes.length = entries;
				this.views.length = entries;
				this.types.length = entries;
			} else {
				this.indexes = [];
				this.views = [];
				this.types = [];
			}
			var type = translate(description);
			for (var i = 0; i < entries; i++) {
				index = lastSelectedNumbers[type] + 1;
				found = false;
				var result = get8bit(index, usedIndexes[type]);
				if (result === 0) { // not used
					set8bit(index, 1, usedIndexes[type]);
					this.indexes[i] = (index);
					this.views[i] = (description);
					this.types[i] = (type);
				} else {
					var restart = false;
					while (found === false) {
						index++;
						if (index > 1279) {
							if (restart) {
								throw new Error("There are no more indexes in :" + type);
							}
							restart = true;
							index = 0;
						}
						if (get8bit(index, usedIndexes[type]) === 0) {
							found = true;
							set8bit(index, 1, usedIndexes[type]);
							this.indexes[i] = (index);
							this.views[i] = (description);
							this.types[i] = (type);
						}
					}
				}
				lastSelectedNumbers[type] = index;
			}
		},
		get length() {
			return this.views[LENGTH];
		},
		each: function(fn) {
			for (var i = 0; i < this.views[LENGTH]; i++) {
				fn(this.get(i), i);
			}
		},
		set: function(index, value) {
			if (index >= this.indexes.length) {
				console.trace();
				throw new Error("Index out of bounds!");
			}
			if (index === undefined) {
				console.trace();
				throw new Error("Undefined index!");
			}
			var internalIndex = this.indexes[index];
			var view = this.views[index];
			var name = this.types[index];
			var bufferView = new types[view](buffers[name]);
			var maximum = maxValue[name];
			if (value > maximum) {
				value = maximum;
			} else if (value < 0 && value < -maximum) {
				value = -maximum;
			}
			return setFunctions(name, bufferView, internalIndex, value);
		},
		get: function(index) {
			if (index >= this.indexes.length) {
				console.trace();
				throw new Error("Index out of bounds!");
			}
			if (index === undefined) {
				console.trace();
				throw new Error("Undefined index!");
			}
			var internalIndex = this.indexes[index];
			var view = this.views[index];
			var name = this.types[index];
			var bufferView = new types[view](buffers[name]);
			return getFunctions(name, bufferView, internalIndex);
		},
		toString: function() {
			var string = "[";
			for (var i = 0; i < this.views[LENGTH]; i++) {
				string += this.get(i);
				if (i + 1 !== this.views[LENGTH]) {
					string += ", ";
				}
			}
			string += "]";
			return string;
		}
	};

	function linked() {
		var args = arguments;
		var list = {
			push: function pushList() {
				var linkedList = this;
				for (var i = 0; i < arguments[LENGTH]; i++) {
					var previous = linkedList.last;
					var next = arguments[i];
					if (!linkedList.first) {
						// we need to set the first node
						linkedList.first = next;
					} else {
						// if the previous node exists, point it to the new node
						previous[NEXT] = next;
					}
					next.prev = previous;
					next.list = linkedList;
					linkedList.last = next;
				}
			},
			each: function eachList(fn) {
				var previous = null;
				var item = this.first;
				do {
					fn(item);
					previous = item;
					if (item.list === null) {
						if (previous === null) {
							if (this.first !== item) {
								item = this.first;
							} else {
								item = null;
							}
						} else {
							if (previous[NEXT] !== item) {
								item = previous[NEXT];
							} else {
								item = null;
							}
						}
					} else {
						if (item[NEXT]) {
							item = item[NEXT];
						} else {
							item = null;
						}
					}
				} while (item !== null);
			},
			first: NULL,
			last: NULL
		};
		if (args.length > 0) {
			list.get = function() {
				var result = getList.apply(this, args);
				this.push(result);
				return result;
			};
		}
		return list;
	}
	


function queue(timeEstimate, functiontoQueue) {
	timeEstimates.push(timeEstimate);
	queuedFunctions.push(functiontoQueue);
	queueLength++;
}

function nextFrame(callback) {
	if (typeof window.requestAnimationFrame === "function") {
		return window.requestAnimationFrame(callback);
	} else {
		return setTimeout(callback, 1000 / 60);
	}
}

function go(bool) {
	stop = !bool;
	if (bool) {
		loop = nextFrame(run);
	}
}

function run() {
	if (stop === false) {
		lastTick = currentTick;
		currentTick = micro();
		var deltaTime = currentTick - lastTick;
		var timeOccupied = 0;
		var done = false;
		for(var i=0;i<queueLength;i++) {
			queuedFunctions[i](deltaTime);
		}
		// while (queueLength > 0 && done === false) {
		// 	if (timeEstimates[timeEstimates.length - 1] + timeOccupied < 10) {
		// 		queueLength--;
		// 		var fn = queuedFunctions.pop();
		// 		timeOccupied += timeEstimates.pop();
		// 		fn.call(null, deltaTime);
		// 	} else {
		// 		done = true;
		// 	}
		// }
		if (stop) {
			return true;
		}
		loop = nextFrame(run);
	}
}



	function dot(vector1, vector2) {
		return (getValue(vector1, PHYSICS_X) * getValue(vector2, PHYSICS_X)) + (getValue(vector1, PHYSICS_Y) * getValue(vector2, PHYSICS_Y));
	}

	function getOverlap(vector1, vector2) {
		return Math.min(getValue(vector1, PHYSICS_Y), getValue(vector2, PHYSICS_Y)) - Math.max(getValue(vector1, PHYSICS_X), getValue(vector2, PHYSICS_X));
	}

	function overlapping(vector1, vector2) {
		return !(getValue(vector1, PHYSICS_X) > getValue(vector2, PHYSICS_Y) || getValue(vector2, PHYSICS_X) > getValue(vector1, PHYSICS_Y));
	}

	function getf32List(size) {
		return getList(size, FLOAT32);
	}

	function getValue(list, index) {
		return list[index];
	}

	function setValue(list, index, value) {
		return list[index] = value;
	}

	function setXY(list, x, y, increment) {
		increment = increment || 0;
		setValue(list, increment + PHYSICS_X, x);
		setValue(list, increment + PHYSICS_Y, y);
	}

	function cleanList(list) {
		for (var i = 0; i < list.length; i++) {
			list[i] = 0;
		}
		return list;
	}

	function test(entity1X, entity1Y, entity1W, entity1H, entity1R, entity2X, entity2Y, entity2W, entity2H, entity2R) {
		// Minimum Translation Vector (MTV)
		setValue(entity1, PHYSICS_X, entity1X);
		setValue(entity1, PHYSICS_Y, entity1Y);
		setValue(entity1, PHYSICS_WIDTH, entity1W);
		setValue(entity1, PHYSICS_HEIGHT, entity1H);
		setValue(entity1, PHYSICS_ANGLE, entity1R);
		setValue(entity2, PHYSICS_X, entity2X);
		setValue(entity2, PHYSICS_Y, entity2Y);
		setValue(entity2, PHYSICS_WIDTH, entity2W);
		setValue(entity2, PHYSICS_HEIGHT, entity2H);
		setValue(entity2, PHYSICS_ANGLE, entity2R);
		var vertices1 = rotate(getVertices(entity1, cleanList(verticeList1)), entity1);
		var vertices2 = rotate(getVertices(entity2, cleanList(verticeList2)), entity2);
		var index = -1;
		axes[0] = getAxes(vertices1, cleanList(axes1));
		axes[1] = getAxes(vertices2, cleanList(axes2));
		for (var i = 0; i < axes.length; i++) {
			for (var e = 0; e < axes[i].length; e += 2) {
				index++;
				setXY(axis, getValue(axes[i], e + PHYSICS_X), getValue(axes[i], e + PHYSICS_Y));
				// project both shapes onto the axis
				var projection1 = project(axis, entity1, vertices1, cleanList(projections[index]));
				index++;
				var projection2 = project(axis, entity2, vertices2, cleanList(projections[index]));

				// do the projections overlap?
				if (!overlapping(projection1, projection2)) {
					// then we can guarantee that the shapes do not overlap
					return false;
				} else {
					// get the overlap
					var projectionOverlap = getOverlap(projection1, projection2);
					// check for minimum
					if (projectionOverlap < overlap) {
						// then set this one as the smallest
						MTV[0] = getValue(axis, PHYSICS_X);
						MTV[1] = getValue(axis, PHYSICS_Y);
						MTV[2] = getValue(axis, projectionOverlap);
					}
				}
			}
		}
		// if we get here then we know that every axis had overlap on it
		// so we can guarantee an intersection
		return MTV;
	}

	function project(axis, entity, vertices, vector) {
		setXY(vector, getValue(vertices, PHYSICS_X), getValue(vertices, PHYSICS_Y));
		var min = dot(axis, vector);
		var max = min;
		for (var i = 0; i < vertices.length; i += 2) {
			setXY(vector, getValue(vertices, i + PHYSICS_X), getValue(vertices, i + PHYSICS_Y));
			var projection = dot(axis, vector);
			if (projection < min) {
				min = projection;
			} else if (projection > max) {
				max = projection;
			}
		}
		var offset = dot(axis, entity);
		setXY(vector, min + offset, max + offset);
		return vector;
	}

	function getPhysicsEntity(source, destination) {
		setValue(destination, PHYSICS_X, getValue(source, X));
		setValue(destination, PHYSICS_Y, getValue(source, Y));
		setValue(destination, PHYSICS_WIDTH, getValue(source, WIDTH));
		setValue(destination, PHYSICS_HEIGHT, getValue(source, HEIGHT));
		setValue(destination, PHYSICS_ANGLE, getValue(source, ANGLE));
		return destination;
	}

	function getVertices(entity, vertices, rotated) {
		// counter clockwise vertices
		var width = (getValue(entity, PHYSICS_WIDTH) / 2);
		var height = (getValue(entity, PHYSICS_HEIGHT) / 2);
		setValue(vertices, 0, -width); // top left
		setValue(vertices, 1, -height);
		setValue(vertices, 2, +width); // top right
		setValue(vertices, 3, -height);
		setValue(vertices, 4, +width); // bottom right
		setValue(vertices, 5, +height);
		setValue(vertices, 6, -width); // bottom left
		setValue(vertices, 7, +height);
		if (rotated) {
			return rotate(vertices, entity);
		}
		return vertices;
	}

	function getAxes(vertices, axes) {
		var length = vertices.length;
		var index = -1;
		for (var i = 0; i < length; i += 2) {
			index++;
			var vector1 = cleanList(vectors[index]);
			index++;
			var vector2 = cleanList(vectors[index]);
			setXY(vector1, getValue(vertices, i + X), getValue(vertices, i + Y));
			var e = i + 2;
			if (e === length) {
				e = 0;
			}
			setXY(vector2, getValue(vertices, e + X), getValue(vertices, e + Y));
			subtract(vector1, vector2, cleanList(edge));
			var normal = perpendicular(edge);
			setXY(axes, getValue(normal, X), getValue(normal, Y), i);
		}
		return axes;
	}

	function rotate(vertices, entity) {
		for (var i = 0; i < vertices.length; i += 2) {
			var x = getValue(vertices, i + PHYSICS_X);
			var y = getValue(vertices, i + PHYSICS_Y);
			var angle = getValue(entity, PHYSICS_ANGLE) * mathPiDividedBy180;
			setXY(vertices, ((x * Math.cos(angle)) - (y * Math.sin(angle))), ((x * Math.sin(angle)) + (y * Math.cos(angle))), i);
		}
		return vertices;
	}

	function perpendicular(vector) {
		// pretty sure you need to detect what is the run and what is the rise in order to do -run/rise for an angled polygon. eg y may be run and x may be rise, if its flipped 90 degrees.
		var x = getValue(vector, PHYSICS_X);
		var y = getValue(vector, PHYSICS_Y);
		setXY(vector, y, -x);
		return normalize(vector);
	}

	function normalize(vector) {
		var lengthSquared = dot(vector, vector);
		var length = Math.sqrt(lengthSquared);
		if (length > 0) {
			setXY(vector, getValue(vector, PHYSICS_X) / length, getValue(vector, PHYSICS_Y) / length);
		}
		return vector;
	}

	function subtract(vector1, vector2, result) {
		setXY(result, getValue(vector1, PHYSICS_X) - getValue(vector2, PHYSICS_X), getValue(vector1, PHYSICS_Y) - getValue(vector2, PHYSICS_Y));
		return result;
	}
	


	function nowTime() {
		return now();
	}

	var micro = (function() {
		var loadTime;
		var performance = window.performance;
		if (performance && performance.now) {
			return function() {
				return performance.now();
			};
		} else {
			loadTime = now();
			return function() {
				return now() - loadTime;
			};
		}
	}());
	
	


	queue(1, function() {
		if (realMouseMoveData) {
			sendEvent(0, mouseMOveXId, mousex);
			sendEvent(0, mouseMOveYId, mousey);
		}
	});
	

document.addEventListener("DOMContentLoaded", function(event) {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
});
// Engine.once("UIReady", function() {
// 	stage = new PIXI.Stage();
// 	renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, true);
// 	// amount = (renderer instanceof PIXI.WebGLRenderer) ? 50 : 5;
// 	// if (amount == 5) {
// 	// 	renderer.context.mozImageSmoothingEnabled = false;
// 	// 	renderer.context.webkitImageSmoothingEnabled = false;
// 	// }

// 	event.emit("RenderReady");
// });
document.addEventListener("resize", function(event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});




	



	// event.on("RenderReady", function() {
	// formula is lastquantity, index, bytesize
	var dataBuffer = new ArrayBuffer(432);
	edge = new Float32Array(dataBuffer, 0 * 0 * 4, 2);
	axis = new Float32Array(dataBuffer, 2 * 1 * 4, 2);
	verticeList1 = new Float32Array(dataBuffer, 2 * 2 * 4, 8);
	verticeList2 = new Float32Array(dataBuffer, 8 * 3 * 4, 8);
	axes1 = new Float32Array(dataBuffer, 8 * 4 * 4, 8);
	axes2 = new Float32Array(dataBuffer, 8 * 5 * 4, 8);
	MTV = new Int32Array(3);
	entity1 = new Float32Array(dataBuffer, 8 * 6 * 4, PHYSICS_ENTRIES);
	entity2 = new Float32Array(dataBuffer, PHYSICS_ENTRIES * 7 * 4, PHYSICS_ENTRIES);
	vectors.push(new Float32Array(dataBuffer, PHYSICS_ENTRIES * 8 * 4, 2));
	for (var i = 9; i < 24; i++) {
		vectors.push(new Float32Array(dataBuffer, 2 * i * 4, 2));
	}
	for (var e = 24; e < 40; e++) {
		projections.push(new Float32Array(dataBuffer, 2 * e * 4, 2));
	}
	// edge = getf32List(2);
	// axis = getf32List(2);
	// verticeList1 = getf32List(8);
	// verticeList2 = getf32List(8);
	// axes1 = getf32List(8);
	// axes2 = getf32List(8);
	// MTV = new Int32Array(3);
	// entity1 = getf32List(PHYSICS_ENTRIES);
	// entity2 = getf32List(PHYSICS_ENTRIES);
	// for (var i = 0; i < 16; i++) {
	// 	vectors.push(getf32List(2));
	// }
	// for (var e = 0; e < 16; e++) {
	// 	projections.push(getf32List(2));
	// }
	// });
	

	window.Config={get length() {
			return actions;
		},
		input: input,
		action: action,
		matchKey: matchKey,
		binding: binding,
		unbind: unbind,
		bind: bind};
window.Control={listen: listen,
		// init: initControl,
		mouseMove: function(value, x, y) {
			mouseMOveXId = x;
			mouseMOveYId = y;
			if (value) {
				realMouseMoveData = true;
			} else {
				realMouseMoveData = false;
			}
		}};
window.Draw={clean: cleanList,
		size: size,
		get: getList,
		put: putList,
		linked: linked};
window.Game={test: test,
		getVertices: getVertices};
window.List={now: nowTime,
		micro: micro};

		document.addEventListener("DOMContentLoaded", function() {
			setup();
			start();
		});
}(navigator, window, document));