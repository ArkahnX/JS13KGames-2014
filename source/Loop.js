// name: Loop
// filenames: Game

// variables
var stop = true;
var currentTick = 0;
var lastTick = 0;
var loop;
var timeEstimates = [];
var queuedFunctions = [];
var queuedParameters = [];
var queueLength = 0;
// end variables

// functions

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
		currentTick = TIME_MICRO();
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
// end functions

// other
// end other

// return
// end return