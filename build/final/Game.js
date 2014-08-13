!function(navigator, window, document) {
    var hardware = {};
    var actions = 0;
    var addEventListener = "addEventListener";
    var LENGTH = "length";
    var i = 0;
    var mousex = 0;
    var mousey = 0;
    var movewait;
    var realMouseMoveData = !1;
    var mouseMOveXId = 0;
    var mouseMOveYId = 0;
    var context, canvas;
    var polyVertices = new Float32Array(8);
    var physicsEntity = new Float32Array(4);
    var test1, test2;
    var NULL = null;
    var LENGTH = "length";
    var NEXT = "next";
    var oldArrays = [];
    var types = {};
    types[2] = Uint8Array;
    types[3] = Uint8Array;
    types[5] = Uint16Array;
    types[7] = Uint16Array;
    types[11] = Uint32Array;
    types[6] = Int8Array;
    types[14] = Int16Array;
    types[22] = Int32Array;
    types[33] = Float32Array;
    types[13] = Float64Array;
    var buffers = {
        i4: new ArrayBuffer(524288),
        i8: new ArrayBuffer(1048576),
        i12: new ArrayBuffer(15360),
        i16: new ArrayBuffer(1048576),
        i32: new ArrayBuffer(40960)
    };
    var usedIndexes = {
        i4: new Uint8Array(131072),
        i8: new Uint8Array(131072),
        i12: new Uint8Array(1280),
        i16: new Uint8Array(65536),
        i32: new Uint8Array(1280)
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
    var stop = !0;
    var currentTick = 0;
    var lastTick = 0;
    var loop;
    var timeEstimates = [];
    var queuedFunctions = [];
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
        hardware[type][uniqueId].each(function(key, action) {
            key === keyCode && match(action);
        });
    }
    function action() {
        actions = +arguments.length;
    }
    function input(type, id) {
        var uniqueId = "" + type + id;
        hardware[type] || (hardware[type] = {});
        hardware[type][uniqueId] || (hardware[type][uniqueId] = getList(actions, 6));
    }
    function eventType(type) {
        return type.indexOf("mouse") > -1 ? 2 : type.indexOf("key") > -1 ? 3 : void 0;
    }
    function pressEvent(e) {
        e.touches ? changeKey(2, 0, 1, 1, e) : changeKey(eventType(e.type), 0, e.which, 1, e);
    }
    function releaseEvent(e) {
        e.touches ? changeKey(2, 0, 1, 0, e) : changeKey(eventType(e.type), 0, e.which, 0, e);
    }
    function scrollEvent(e) {
        changeKey(eventType(e.type), 0, 6, e.wheelDeltaX, e);
        changeKey(eventType(e.type), 0, 7, e.wheelDeltaY, e);
    }
    function handleMouseMove(e) {
        if (e.touches) {
            var touch = e.touches[0];
            if (touch.pageX || touch.pageY) {
                mousex = touch.pageX;
                mousey = touch.pageY;
            } else {
                if (touch.clientX || touch.clientY) {
                    mousex = touch.clientX;
                    mousey = touch.clientY;
                }
            }
        } else {
            if (e.pageX || e.pageY) {
                mousex = e.pageX;
                mousey = e.pageY;
            } else {
                if (e.clientX || e.clientY) {
                    mousex = e.clientX;
                    mousey = e.clientY;
                }
            }
        }
    }
    function moveEvent(e) {
        handleMouseMove(e);
        if (!realMouseMoveData) {
            void 0 !== movewait && clearTimeout(movewait);
            movewait = setTimeout(function() {
                changeKey(eventType(e.type), 0, 4, mousex, e);
                changeKey(eventType(e.type), 0, 5, mousey, e);
            }, 50);
        }
    }
    function changeKey(type, id, keyCode, value, e) {
        matchKey(type, id, keyCode, function(action) {
            e && e.preventDefault && e.preventDefault();
            Player.find(type, id, function(player) {
                if (player.get(Player.length + action) !== value || 2 === type && (6 === keyCode || 7 === keyCode)) {
                    player.set(Player.length + action, value);
                    sendEvent(player.get(0), action, value, player);
                }
            });
        });
    }
    function sendEvent(localId, action, value, player) {
        event.emit("change", localId, action, value, player);
    }
    function listen(node, type) {
        if (2 === type) {
            node[addEventListener]("mousedown", pressEvent);
            node[addEventListener]("mouseup", releaseEvent);
            node[addEventListener]("mousemove", moveEvent);
            node[addEventListener]("mousewheel", scrollEvent);
            node[addEventListener]("touchstart", pressEvent);
            node[addEventListener]("touchend", releaseEvent);
            node[addEventListener]("touchmove", moveEvent);
        }
        if (3 === type) {
            node[addEventListener]("keydown", pressEvent);
            node[addEventListener]("keyup", releaseEvent);
        }
    }
    function changeState(context, state, value) {
        context[state] !== value && (context[state] = value);
    }
    function poly(entity) {
        polyVertices = cleanList(polyVertices);
        context.beginPath();
        var vertices = getVertices(getPhysicsEntity(entity, physicsEntity), polyVertices);
        console.log(vertices);
        moveTo(getValue(vertices, 0), getValue(vertices, 1));
        for (i = 2; i < vertices.length; i += 2) {
            context.lineTo(getValue(vertices, i + 0), getValue(vertices, i + 1));
        }
        context.lineTo(getValue(vertices, 0), getValue(vertices, 1));
        context.beginPath();
        changeState(context, "lineWidth", 2);
        changeState(context, "strokeStyle", getValue(entity, 9).toString(16));
        context.fill();
        context.stroke();
        context.closePath();
    }
    function setupDraw(entity, callback) {
        var x = getValue(entity, 0);
        var y = getValue(entity, 1);
        var angle = getValue(entity, 2) || 0;
        context.save();
        context.translate(x, y);
        context.rotate(angle * Math.PI / 180);
        callback(entity);
        context.restore();
    }
    function start() {
        queue(1, function() {
            var ySpeed = -getValue(test1, 6);
            var xSpeed = getValue(test1, 5);
            setValue(test1, 0, getValue(test1, 0) + xSpeed);
            setValue(test1, 1, getValue(test1, 1) + ySpeed);
            var redraw = !1;
            var MTV = test(getValue(test1, 0), getValue(test1, 1), getValue(test1, 0), getValue(test1, 1), getValue(test1, 2), getValue(test2, 0), getValue(test2, 1), getValue(test2, 0), getValue(test2, 1), getValue(test2, 2));
            if (MTV) {
                if (16711680 !== getValue(test1, 9)) {
                    setValue(test1, 9, 16711680);
                    redraw = !0;
                }
            } else {
                if (0 !== getValue(test1, 9)) {
                    setValue(test1, 9, 0);
                    redraw = !0;
                }
            }
            setupDraw(test1, function() {
                poly(test1);
            });
        });
        go(!0);
    }
    function setup() {
        action(0, 2, 1, 3);
        input(3, 0);
        bind(3, 0, 0, "D".charCodeAt(0));
        bind(3, 0, 1, "W".charCodeAt(0));
        bind(3, 0, 2, "A".charCodeAt(0));
        bind(3, 0, 3, "S".charCodeAt(0));
        listen(document, 3);
        test2 = new Float32Array(10);
        setValue(test2, 0, 170);
        setValue(test2, 1, 90);
        setValue(test2, 2, 0);
        setValue(test2, 0, 200);
        setValue(test2, 1, 50);
        setValue(test2, 5, 0);
        setValue(test2, 6, 0);
        setValue(test2, 7, 0);
        setValue(test2, 9, 11184810);
        test1 = new Float32Array(10);
        setValue(test1, 0, 10);
        setValue(test1, 1, 10);
        setValue(test1, 2, 0);
        setValue(test1, 0, 30);
        setValue(test1, 1, 10);
        setValue(test1, 5, 0);
        setValue(test1, 6, 0);
        setValue(test1, 7, 0);
        setValue(test1, 9, 0);
    }
    function translate(description) {
        return 2 === description ? "i4" : 0 === description % 3 ? "i8" : 0 === description % 7 ? "i16" : 0 === description % 11 ? "i32" : 5 === description ? "i12" : 13 === description ? "i64" : void 0;
    }
    function getFunctions(view, bufferView, index) {
        return "i8" === view || "i16" === view || "i32" === view ? bufferView[index] : "i12" === view ? getBits(12, index, bufferView) : "i4" === view ? getBits(4, index, bufferView) : void 0;
    }
    function setFunctions(view, bufferView, index, value) {
        "i8" === view || "i16" === view || "i32" === view ? bufferView[index] = value : "i12" === view ? setBits(12, index, value, bufferView) : "i4" === view && setBits(4, index, value, bufferView);
    }
    function pad(width, string, padding) {
        return width > string.length ? pad(width, padding + string, padding) : string;
    }
    function changeCharacter(string, index, value) {
        return string.substr(0, index) + value + string.substr(index + 1);
    }
    function toBinaryString(decimal, padding) {
        return pad(padding, parseFloat(decimal, 10).toString(2), "0").replace("-", "").replace("+", "");
    }
    function toDecimal(binary) {
        return binary.indexOf(".") > -1 ? parseFloat(binary, 2) : parseInt(binary, 2);
    }
    function getBit(index, bufferView) {
        var decimal = bufferView[index >> 3];
        var binary = toBinaryString(decimal, 8);
        var offset = 7 - (7 & index);
        return parseInt(binary[offset], 10);
    }
    function get8bit(index, bufferView) {
        var v = bufferView[index >> 3];
        if (void 0 === v) {
            return 0/0;
        }
        var off = 7 & index;
        return 1 & v >> 7 - off;
    }
    function set8bit(index, value, bufferView) {
        var off = 7 & index;
        value ? bufferView[index >> 3] |= 128 >> off : bufferView[index >> 3] &= ~(128 >> off);
    }
    function setBit(index, value, bufferView) {
        var offset = 7 - (7 & index);
        var decimal = bufferView[index >> 3];
        var binary = toBinaryString(decimal, 8);
        binary = changeCharacter(binary, offset, value);
        bufferView[index >> 3] = toDecimal(binary);
    }
    function getBits(bits, index, bufferView) {
        var number = "";
        for (var i = 0; bits > i; i++) {
            var offset = index * bits + i;
            number += "" + getBit(offset, bufferView);
        }
        return toDecimal(number);
    }
    function setBits(bits, index, value, bufferView) {
        var binaryValue = toBinaryString(value, bits);
        for (var i = 0; bits > i; i++) {
            var offset = index * bits + i;
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
        if (!array) {
            return !1;
        }
        if (!Help.has(oldArrays, array)) {
            var next = array[NEXT];
            var previous = array.prev;
            var list = array.list;
            next && (next.prev = previous);
            previous && (previous[NEXT] = next);
            if (list) {
                list.first === array && next && (list.first = next);
                list.last === array && previous && (list.last = previous);
            }
            array[NEXT] = NULL;
            array.prev = NULL;
            array.list = NULL;
            for (var i = 0; i < array.indexes.length; i++) {
                var index = array.indexes[i];
                array.set(i, 0);
                var name = array.types[i];
                var arrayToSplice = usedIndexes[name];
                set8bit(index, 0, arrayToSplice);
            }
            array.indexes.length = 0;
            array.views.length = 0;
            oldArrays.push(array);
        }
    }
    function getList(entries, description) {
        if ("string" == typeof description) {
            console.trace();
            throw Error("Expected description to be a number, instead it was:" + description);
        }
        var result;
        result = oldArrays.length > 0 ? oldArrays.pop() : new Node();
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
            var found = !1;
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
            for (var i = 0; entries > i; i++) {
                index = lastSelectedNumbers[type] + 1;
                found = !1;
                var result = get8bit(index, usedIndexes[type]);
                if (0 === result) {
                    set8bit(index, 1, usedIndexes[type]);
                    this.indexes[i] = index;
                    this.views[i] = description;
                    this.types[i] = type;
                } else {
                    var restart = !1;
                    for (;found === !1; ) {
                        index++;
                        if (index > 1279) {
                            if (restart) {
                                throw Error("There are no more indexes in :" + type);
                            }
                            restart = !0;
                            index = 0;
                        }
                        if (0 === get8bit(index, usedIndexes[type])) {
                            found = !0;
                            set8bit(index, 1, usedIndexes[type]);
                            this.indexes[i] = index;
                            this.views[i] = description;
                            this.types[i] = type;
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
                throw Error("Index out of bounds!");
            }
            if (void 0 === index) {
                console.trace();
                throw Error("Undefined index!");
            }
            var internalIndex = this.indexes[index];
            var view = this.views[index];
            var name = this.types[index];
            var bufferView = new types[view](buffers[name]);
            var maximum = maxValue[name];
            value > maximum ? value = maximum : 0 > value && -maximum > value && (value = -maximum);
            return setFunctions(name, bufferView, internalIndex, value);
        },
        get: function(index) {
            if (index >= this.indexes.length) {
                console.trace();
                throw Error("Index out of bounds!");
            }
            if (void 0 === index) {
                console.trace();
                throw Error("Undefined index!");
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
                i + 1 !== this.views[LENGTH] && (string += ", ");
            }
            string += "]";
            return string;
        }
    };
    function linked() {
        var args = arguments;
        var list = {
            push: function() {
                var linkedList = this;
                for (var i = 0; i < arguments[LENGTH]; i++) {
                    var previous = linkedList.last;
                    var next = arguments[i];
                    linkedList.first ? previous[NEXT] = next : linkedList.first = next;
                    next.prev = previous;
                    next.list = linkedList;
                    linkedList.last = next;
                }
            },
            each: function(fn) {
                var previous = null;
                var item = this.first;
                do {
                    fn(item);
                    previous = item;
                    item = null === item.list ? null === previous ? this.first !== item ? this.first : null : previous[NEXT] !== item ? previous[NEXT] : null : item[NEXT] ? item[NEXT] : null;
                } while (null !== item);
            },
            first: NULL,
            last: NULL
        };
        args.length > 0 && (list.get = function() {
            var result = getList.apply(this, args);
            this.push(result);
            return result;
        });
        return list;
    }
    function queue(timeEstimate, functiontoQueue) {
        timeEstimates.push(timeEstimate);
        queuedFunctions.push(functiontoQueue);
        queueLength++;
    }
    function nextFrame(callback) {
        return "function" == typeof window.requestAnimationFrame ? window.requestAnimationFrame(callback) : setTimeout(callback, 1e3 / 60);
    }
    function go(bool) {
        stop = !bool;
        bool && (loop = nextFrame(run));
    }
    function run() {
        if (stop === !1) {
            lastTick = currentTick;
            currentTick = micro();
            var deltaTime = currentTick - lastTick;
            for (var i = 0; queueLength > i; i++) {
                queuedFunctions[i](deltaTime);
            }
            if (stop) {
                return !0;
            }
            loop = nextFrame(run);
        }
    }
    function dot(vector1, vector2) {
        return getValue(vector1, 0) * getValue(vector2, 0) + getValue(vector1, 1) * getValue(vector2, 1);
    }
    function getOverlap(vector1, vector2) {
        return Math.min(getValue(vector1, 1), getValue(vector2, 1)) - Math.max(getValue(vector1, 0), getValue(vector2, 0));
    }
    function overlapping(vector1, vector2) {
        return !(getValue(vector1, 0) > getValue(vector2, 1) || getValue(vector2, 0) > getValue(vector1, 1));
    }
    function getValue(list, index) {
        return list[index];
    }
    function setValue(list, index, value) {
        return list[index] = value;
    }
    function setXY(list, x, y, increment) {
        increment = increment || 0;
        setValue(list, increment + 0, x);
        setValue(list, increment + 1, y);
    }
    function cleanList(list) {
        for (var i = 0; i < list.length; i++) {
            list[i] = 0;
        }
        return list;
    }
    function test(entity1X, entity1Y, entity1W, entity1H, entity1R, entity2X, entity2Y, entity2W, entity2H, entity2R) {
        setValue(entity1, 0, entity1X);
        setValue(entity1, 1, entity1Y);
        setValue(entity1, 2, entity1W);
        setValue(entity1, 3, entity1H);
        setValue(entity1, 3, entity1R);
        setValue(entity2, 0, entity2X);
        setValue(entity2, 1, entity2Y);
        setValue(entity2, 2, entity2W);
        setValue(entity2, 3, entity2H);
        setValue(entity2, 3, entity2R);
        var vertices1 = rotate(getVertices(entity1, cleanList(verticeList1)), entity1);
        var vertices2 = rotate(getVertices(entity2, cleanList(verticeList2)), entity2);
        var index = -1;
        axes[0] = getAxes(vertices1, cleanList(axes1));
        axes[1] = getAxes(vertices2, cleanList(axes2));
        for (var i = 0; i < axes.length; i++) {
            for (var e = 0; e < axes[i].length; e += 2) {
                index++;
                setXY(axis, getValue(axes[i], e + 0), getValue(axes[i], e + 1));
                var projection1 = project(axis, entity1, vertices1, cleanList(projections[index]));
                index++;
                var projection2 = project(axis, entity2, vertices2, cleanList(projections[index]));
                if (!overlapping(projection1, projection2)) {
                    return !1;
                }
                var projectionOverlap = getOverlap(projection1, projection2);
                if (overlap > projectionOverlap) {
                    MTV[0] = getValue(axis, 0);
                    MTV[1] = getValue(axis, 1);
                    MTV[2] = getValue(axis, projectionOverlap);
                }
            }
        }
        return MTV;
    }
    function project(axis, entity, vertices, vector) {
        setXY(vector, getValue(vertices, 0), getValue(vertices, 1));
        var min = dot(axis, vector);
        var max = min;
        for (var i = 0; i < vertices.length; i += 2) {
            setXY(vector, getValue(vertices, i + 0), getValue(vertices, i + 1));
            var projection = dot(axis, vector);
            min > projection ? min = projection : projection > max && (max = projection);
        }
        var offset = dot(axis, entity);
        setXY(vector, min + offset, max + offset);
        return vector;
    }
    function getPhysicsEntity(source, destination) {
        setValue(destination, 0, getValue(source, 0));
        setValue(destination, 1, getValue(source, 1));
        setValue(destination, 2, getValue(source, 0));
        setValue(destination, 3, getValue(source, 1));
        setValue(destination, 3, getValue(source, 2));
        return destination;
    }
    function getVertices(entity, vertices, rotated) {
        var width = getValue(entity, 2) / 2;
        var height = getValue(entity, 3) / 2;
        setValue(vertices, 0, -width);
        setValue(vertices, 1, -height);
        setValue(vertices, 2, +width);
        setValue(vertices, 3, -height);
        setValue(vertices, 4, +width);
        setValue(vertices, 5, +height);
        setValue(vertices, 6, -width);
        setValue(vertices, 7, +height);
        return rotated ? rotate(vertices, entity) : vertices;
    }
    function getAxes(vertices, axes) {
        var length = vertices.length;
        var index = -1;
        for (var i = 0; length > i; i += 2) {
            index++;
            var vector1 = cleanList(vectors[index]);
            index++;
            var vector2 = cleanList(vectors[index]);
            setXY(vector1, getValue(vertices, i + 0), getValue(vertices, i + 1));
            var e = i + 2;
            e === length && (e = 0);
            setXY(vector2, getValue(vertices, e + 0), getValue(vertices, e + 1));
            subtract(vector1, vector2, cleanList(edge));
            var normal = perpendicular(edge);
            setXY(axes, getValue(normal, 0), getValue(normal, 1), i);
        }
        return axes;
    }
    function rotate(vertices, entity) {
        for (var i = 0; i < vertices.length; i += 2) {
            var x = getValue(vertices, i + 0);
            var y = getValue(vertices, i + 1);
            var angle = getValue(entity, 3) * mathPiDividedBy180;
            setXY(vertices, x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), i);
        }
        return vertices;
    }
    function perpendicular(vector) {
        var x = getValue(vector, 0);
        var y = getValue(vector, 1);
        setXY(vector, y, -x);
        return normalize(vector);
    }
    function normalize(vector) {
        var lengthSquared = dot(vector, vector);
        var length = Math.sqrt(lengthSquared);
        length > 0 && setXY(vector, getValue(vector, 0) / length, getValue(vector, 1) / length);
        return vector;
    }
    function subtract(vector1, vector2, result) {
        setXY(result, getValue(vector1, 0) - getValue(vector2, 0), getValue(vector1, 1) - getValue(vector2, 1));
        return result;
    }
    function nowTime() {
        return now();
    }
    var micro = function() {
        var loadTime;
        var performance = window.performance;
        if (performance && performance.now) {
            return function() {
                return performance.now();
            };
        }
        loadTime = now();
        return function() {
            return now() - loadTime;
        };
    }();
    queue(1, function() {
        if (realMouseMoveData) {
            sendEvent(0, mouseMOveXId, mousex);
            sendEvent(0, mouseMOveYId, mousey);
        }
    });
    document.addEventListener("DOMContentLoaded", function() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
    });
    document.addEventListener("resize", function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    var dataBuffer = new ArrayBuffer(432);
    edge = new Float32Array(dataBuffer, 0, 2);
    axis = new Float32Array(dataBuffer, 8, 2);
    verticeList1 = new Float32Array(dataBuffer, 16, 8);
    verticeList2 = new Float32Array(dataBuffer, 96, 8);
    axes1 = new Float32Array(dataBuffer, 128, 8);
    axes2 = new Float32Array(dataBuffer, 160, 8);
    MTV = new Int32Array(3);
    entity1 = new Float32Array(dataBuffer, 192, 4);
    entity2 = new Float32Array(dataBuffer, 112, 4);
    vectors.push(new Float32Array(dataBuffer, 128, 2));
    for (var i = 9; 24 > i; i++) {
        vectors.push(new Float32Array(dataBuffer, 4 * 2 * i, 2));
    }
    for (var e = 24; 40 > e; e++) {
        projections.push(new Float32Array(dataBuffer, 4 * 2 * e, 2));
    }
    window.Config = {
        get length() {
            return actions;
        },
        input: input,
        action: action,
        matchKey: matchKey,
        binding: binding,
        unbind: unbind,
        bind: bind
    };
    window.Control = {
        listen: listen,
        mouseMove: function(value, x, y) {
            mouseMOveXId = x;
            mouseMOveYId = y;
            realMouseMoveData = value ? !0 : !1;
        }
    };
    window.Draw = {
        clean: cleanList,
        size: size,
        get: getList,
        put: putList,
        linked: linked
    };
    window.Game = {
        test: test,
        getVertices: getVertices
    };
    window.List = {
        now: nowTime,
        micro: micro
    };
    document.addEventListener("DOMContentLoaded", function() {
        setup();
        start();
    });
}(navigator, window, document);