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
	var xAlignment = entity.x % tileSize;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = collision(currentMap[bottomLeft]);
	} else {
		falling = collision(currentMap[bottomRight]) || collision(currentMap[bottomLeft]);
	}
	if ((falling || entity.y + entity.h > mapHeight * tileSize) && entity.yDirection === FALLING) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * tileSize;
		entity.yAccel = 0;
		entity.yDirection = 0;
		entity.jumpsUsed = 0;
		entity.jumping = 0;
		entity.heightTraveled = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % tileSize;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var jumping = false;
	if (xAlignment === 0) {
		jumping = collision(currentMap[aboveLeft]);
	} else {
		jumping = collision(currentMap[aboveLeft]) || collision(currentMap[aboveRight]);
	}
	if (jumping && entity.jumping === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * tileSize;
		entity.yAccel = -1;
		entity.yDirection = FALLING;
		entity.jumping = 0;
		entity.heightTraveled = 0;
	}
}

function testWalking(entity) {
	var yAlignment = entity.y % tileSize;
	var xAlignment = entity.x % tileSize;
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
		walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]);
		walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]);
	} else {
		if (modulus(entity.y + entity.h) * tileSize > entity.y + entity.h) {
			walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]) || collision(currentMap[aboveLeft]);
			walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]) || collision(currentMap[aboveRight]);
		} else {
			walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]) || collision(currentMap[bottomLeft]);
			walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]) || collision(currentMap[bottomRight]);
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > mapWidth * tileSize || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * tileSize;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > mapWidth * tileSize || entity.x < 0) && entity.xAccel > 0) {
			// console.log("STOP RIGHT")
			entity.x = modulus(entity.x) * tileSize;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		} else if ((walkLeft || entity.x + entity.w > mapWidth * tileSize || entity.x < 0) && entity.xAccel < 0) {
			// console.log("STOP LEFT")
			entity.x = modulus(entity.x + entity.w) * tileSize;
			// entity.xDirection = IDLE;
			entity.xAccel = 0;
		}
	}
}

function collision(block) {
	if (block === 9) {
		collectKey(currentRoom);
	}
	return block !== 0;
}

function bulletPhysics(bullet) {
	var destroy = false;
	bullet.x += Math.cos(bullet.angle) * ((10 / 60) * dt);
	bullet.y += Math.sin(bullet.angle) * ((10 / 60) * dt);
	var mapX = modulus(bullet.x);
	var mapY = modulus(bullet.y);
	var coord = coordinate(mapX, mapY, currentMapTiles);
	if (currentMap[coord] !== 0) {
		// if (mapX !== 0 && mapY !== 0 && mapX !== mapWidth - 1 && mapY !== mapHeight - 1) {
		// 	currentMap[coord] = 0;
		// 	blocks++;
		// }
		if (currentMap[coord] > 1 && player.keys[selectedColor] === currentMap[coord] - 2) {
			blocks[currentMap[coord] - 2]++;
			currentMap[coord] = 0;
		}
		destroy = true;
	}
	if (bullet.x > mapWidth * tileSize || bullet.x < 0 || bullet.y > mapHeight * tileSize || bullet.y < 0) {
		destroy = true;
	}
	if (destroy) {
		var index = bullets.indexOf(bullet);
		if (index > -1) {
			bullets.splice(index, 1);
		}
	}
}