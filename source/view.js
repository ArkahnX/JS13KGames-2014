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
	var mapX = (currentRoom.mapX * miniMapSize);
	var mapY = (currentRoom.mapY * miniMapSize);
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