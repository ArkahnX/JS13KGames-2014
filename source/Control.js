var Control = (function(navigator) {
	// name: Control
	// filenames: Game

	// variables
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
	// end variables

	// functions

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
		CONFIG_MATCH_KEY(type, id, keyCode, function(action) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			PLAYER_FIND(type, id, function(player) {
				// console.log(player.get(PLAYER_LENGTH + action), value, player.get(PLAYER_LENGTH + action) !== value)
				if (player.get(PLAYER_LENGTH + action) !== value || (type === MOUSE && (keyCode === MOUSE_WHEEL_X || keyCode === MOUSE_WHEEL_Y))) { // we only want to submit a change if the value is different
					player.set(PLAYER_LENGTH + action, value);
					sendEvent(player.get(LOCALID), action, value, player);
				}
			});
		});
	}

	function sendEvent(localId, action, value, player) {
		EMIT_EVENT("change", localId, action, value, player);
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
	// end functions

	// other

	LOOP_QUEUE(1, function() {
		if (realMouseMoveData) {
			sendEvent(0, mouseMOveXId, mousex);
			sendEvent(0, mouseMOveYId, mousey);
		}
	});
	// end other

	return {
		// return

		listen: listen,
		// init: initControl,
		mouseMove: function(value, x, y) {
			mouseMOveXId = x;
			mouseMOveYId = y;
			if (value) {
				realMouseMoveData = true;
			} else {
				realMouseMoveData = false;
			}
		}
		// end return
	};
});