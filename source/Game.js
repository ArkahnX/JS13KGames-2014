// name: Game
// filenames: Game
// variables
var test1, test2;
// end variables
// functions

function start() {
	// CONTROL_ON("change", function(localId, action, value, player) {
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
	LOOP_QUEUE(1, function(deltaTime) {
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
		var MTV = PHYSICS_TEST(getValue(test1, X), getValue(test1, Y), getValue(test1, WIDTH), getValue(test1, HEIGHT), getValue(test1, ANGLE),
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
		// DRAW_MOVE(DRAW_GET_GRAPHIC(test2.get(SPRITE_ID)), test2);
		// DRAW_MOVE(DRAW_GET_GRAPHIC(test1.get(SPRITE_ID)), test1);
	});
	LOOP_GO(true);
	// (function() {
	// 	console.timeline();
	// 	console.profile();
	// 	setTimeout(function() {
	// 		LOOP_GO();
	// 		console.timelineEnd();
	// 		console.profileEnd();
	// 	}, 3000);
	// })();

}

function setup() {
	CONFIG_ACTION(TURNCW, TURNCCW, MOVEUP, MOVEDOWN);
	CONFIG_INPUT(KEYBOARD, 0);
	CONFIG_BIND(KEYBOARD, 0, TURNCW, "D".charCodeAt(0));
	CONFIG_BIND(KEYBOARD, 0, MOVEUP, "W".charCodeAt(0));
	CONFIG_BIND(KEYBOARD, 0, TURNCCW, "A".charCodeAt(0));
	CONFIG_BIND(KEYBOARD, 0, MOVEDOWN, "S".charCodeAt(0));
	CONTROL_LISTEN(document, KEYBOARD);
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
	// test1 = LIST_GET("f32", "f32", "s16", "u8", "u8", "s8", "s8", "s8", "u8", "u32");
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
// end functions
// other
// end other

// return
// end return