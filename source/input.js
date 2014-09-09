function handleKeyDown(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.jumping = FALLING;
		}
		if (event.keyCode === keys.tab) {
			miniMapPixelSize = Math.min(modulus(window.innerHeight) * tileSize, modulus(window.innerWidth) * tileSize);
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xDirection = RIGHT;
	} else if (event.keyCode === keys.a) {
		player.xDirection = LEFT;
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
			player.jumping = IDLE;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.tab) {
		miniMapPixelSize = 150;
	}
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xDirection = IDLE;
			}
		} else {
			player.xDirection = IDLE;
		}
	}
}