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
			entity.xAccel = entity.xAccel + ((LEFT * 2 / 60) * dt);
		} else if (entity.xAccel < 0) {
			entity.xAccel = entity.xAccel + ((RIGHT * 2 / 60) * dt);
		}
		if (entity.xAccel < ((RIGHT / 60) * dt) && entity.xAccel > ((LEFT / 60) * dt)) {
			entity.xAccel = 0;
		}
	}
	entity.x = entity.x + entity.xAccel;
}

function handleJump(entity) {
	if (entity.jumping && (entity.yDirection !== JUMPING && entity.jumpsUsed < entity.maxJumps)) {
		entity.yDirection = JUMPING;
		entity.yAccel = -entity.jumpForce;
		entity.jumpStart = entity.y;
		entity.jumpsUsed++;
	}
	if (entity.yDirection === IDLE || !entity.jumping || entity.jumpStart - entity.y > entity.jumpHeight) {
		entity.yDirection = FALLING;
	}
	if (entity.yDirection === FALLING) {
		entity.jumping = IDLE;
		entity.yAccel = entity.yAccel + ((entity.jumpForce / 2) / 60 * dt); // falling
	}

	if (entity.yDirection === IDLE) {
		if (entity.yAccel > 0) {
			entity.yAccel = entity.yAccel + ((JUMPING / 60) * dt);
		} else if (entity.yAccel < 0) {
			entity.yAccel = entity.yAccel + ((FALLING / 60) * dt);
		}
		if (entity.yAccel < ((FALLING / 60) * dt) && entity.yAccel > ((JUMPING / 60) * dt)) {
			entity.yAccel = 0;
		}
	}
	if (entity.yAccel > entity.maxAccel) {
		entity.yAccel = 10;
	}
	entity.y = entity.y + entity.yAccel;
	// if (entity.y > 400) {
	// 	entity.y = 400;
	// 	entity.yAccel = 0;
	// 	entity.yDirection = 0;
	// 	entity.jumpsUsed = 0;
	// 	entity.jumping = 0;
	// }
}

function testFalling(entity) {
	var xAlignment = entity.x % 16;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), numMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), numMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = map[bottomLeft];
	} else {
		falling = map[bottomRight] !== 0 || map[bottomLeft] !== 0;
	}
	if ((falling || entity.y + entity.h > height * 16) && entity.yDirection === FALLING) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = 0;
		entity.yDirection = 0;
		entity.jumpsUsed = 0;
		entity.jumping = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var jumping = false;
	if (xAlignment === 0) {
		jumping = map[aboveLeft];
	} else {
		jumping = map[aboveLeft] !== 0 || map[aboveRight] !== 0;
	}
	if (jumping && entity.jumping === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.yAccel = 0;
		entity.yDirection = FALLING;
		entity.jumping = 0;
	}
}

function testWalking(entity) {
	var yAlignment = entity.y % 16;
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), numMapTiles);
	var topLeft = coordinate(modulus(entity.x), modulus(entity.y), numMapTiles);
	var topRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y), numMapTiles);
	var midLeft = coordinate(modulus(entity.x), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var midRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + (entity.h / 2)), numMapTiles);
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), numMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), numMapTiles);
	var walkLeft = false;
	var walkRight = false;
	if (yAlignment === 0) {
		walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0;
		walkRight = map[midRight] !== 0 || map[topRight] !== 0;
	} else {
		if (modulus(entity.y + entity.h) * 16 > entity.y + entity.h) {
			walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0 || map[aboveLeft] !== 0;
			walkRight = map[midRight] !== 0 || map[topRight] !== 0 || map[aboveRight] !== 0;
		} else {
			walkLeft = map[midLeft] !== 0 || map[topLeft] !== 0 || map[bottomLeft] !== 0;
			walkRight = map[midRight] !== 0 || map[topRight] !== 0 || map[bottomRight] !== 0;
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > width * 16 || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP LEFT")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	}
}