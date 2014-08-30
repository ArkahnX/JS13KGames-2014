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
		if ((entity.xAccel < ((RIGHT / 60) * dt) && entity.xAccel > ((LEFT / 60) * dt)) || entity.yDirection === FALLING || entity.yDirection === JUMPING) {
			entity.xAccel = 0;
		}
	}
	entity.x = entity.x + entity.xAccel;
}

function handleJump(entity) {
	if (entity.jumping && (entity.yDirection !== JUMPING && entity.jumpsUsed < entity.maxJumps)) {
		if (entity.maxJumps > 1 && entity.jumpsUsed === 0 && entity.yDirection === FALLING) {
			entity.jumpsUsed++;
		}
		if ((entity.jumpsUsed === 0 && entity.yDirection === IDLE) || entity.jumpsUsed > 0 || entity.maxJumps > 1) {
			entity.yDirection = JUMPING;
			entity.yAccel = -entity.jumpForce;
			entity.jumpStart = entity.y;
			entity.jumpsUsed++;
		}
		entity.heightTraveled = 0;

	}
	if (entity.yDirection === IDLE || !entity.jumping || entity.heightTraveled > entity.jumpHeight) {
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
	if ((falling || entity.y + entity.h > mapHeight * 16) && entity.yDirection === FALLING) {
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
		entity.yDirection = FALLING;
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
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > mapWidth * 16 || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP LEFT")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	}
}