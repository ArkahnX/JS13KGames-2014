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
	var mapX = ((currentRoom.mapX + (modulus(modulus(modulus(player.x), roomSize), segmentsPerRoom))) * miniMapSize);
	var mapY = ((currentRoom.mapY + (modulus(modulus(modulus(player.y), roomSize), segmentsPerRoom))) * miniMapSize);
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
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	miniViewPortY = ~~ (0.5 + miniViewPortY);
}