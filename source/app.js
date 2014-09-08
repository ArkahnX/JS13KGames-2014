(function(window,document){

var WAVE_SPS = 44100; // Samples per second
var WAVE_CHAN = 2; // Channels
var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively

var audioCtx = null;

// Oscillators
function osc_sin(value) {
	return Math.sin(value * 6.283184);
}

function osc_square(value) {
	if (osc_sin(value) < 0) return -1;
	return 1;
}

function osc_saw(value) {
	return (value % 1) - 0.5;
}

function osc_tri(value) {
	var v2 = (value % 1) * 4;
	if (v2 < 2) return v2 - 1;
	return 3 - v2;
}

// Array of oscillator functions
var oscillators =
	[
		osc_sin,
		osc_square,
		osc_saw,
		osc_tri
	];

function getnotefreq(n) {
	return 0.00390625 * Math.pow(1.059463094, n - 128);
}

function genBuffer(waveSize, callBack) {
	setTimeout(function() {
		// Create the channel work buffer
		var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
		var b = buf.length - 2;
		var iterate = function() {
			var begin = new Date();
			var count = 0;
			while (b >= 0) {
				buf[b] = 0;
				buf[b + 1] = 128;
				b -= 2;
				count += 1;
				if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
					setTimeout(iterate, 0);
					return;
				}
			}
			setTimeout(function() {
				callBack(buf);
			}, 0);
		};
		setTimeout(iterate, 0);
	}, 0);
}

function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
	var p1 = (instr.ft * rowLen) >> 1;
	var t1 = instr.fm / 255;

	var n1 = 0;
	var iterate = function() {
		var beginning = new Date();
		var count = 0;
		while (n1 < waveSamples - p1) {
			var b1 = 4 * n1;
			var l = 4 * (n1 + p1);

			// Left channel = left + right[-p1] * t1
			var x1 = chnBuf[l] + (chnBuf[l + 1] << 8) +
				(chnBuf[b1 + 2] + (chnBuf[b1 + 3] << 8) - 32768) * t1;
			chnBuf[l] = x1 & 255;
			chnBuf[l + 1] = (x1 >> 8) & 255;

			// Right channel = right + left[-p1] * t1
			x1 = chnBuf[l + 2] + (chnBuf[l + 3] << 8) +
				(chnBuf[b1] + (chnBuf[b1 + 1] << 8) - 32768) * t1;
			chnBuf[l + 2] = x1 & 255;
			chnBuf[l + 3] = (x1 >> 8) & 255;
			++n1;
			count += 1;
			if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
				setTimeout(iterate, 0);
				return;
			}
		}
		setTimeout(callBack, 0);
	};
	setTimeout(iterate, 0);
}


function MusicGenerator(song) {
	return {
		song: song,
		waveSize: WAVE_SPS * song.songLen // Total song size (in samples)
	}
}

function createAudioBuffer(music, callBack) {
	getAudioGenerator(music, function(ag) {
		getAudioBuffer(ag, callBack);
	});
}

function getAudioBuffer(ag, callBack) {
	if (audioCtx === null) {
		audioCtx = new AudioContext();
	}
	var mixBuf = ag.mixBuf;
	var waveSize = ag.waveSize;

	var waveBytes = waveSize * WAVE_CHAN * 2;
	var buffer = audioCtx.createBuffer(WAVE_CHAN, ag.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
	var lchan = buffer.getChannelData(0);
	var rchan = buffer.getChannelData(1);
	var b = 0;
	var iterate = function() {
		var beginning = new Date();
		var count = 0;
		while (b < (waveBytes / 2)) {
			var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - 32768);
			y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
			lchan[b] = y / 32768;
			y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - 32768);
			y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
			rchan[b] = y / 32768;
			b += 1;
			count += 1;
			if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
				setTimeout(iterate, 0);
				return;
			}
		}
		setTimeout(function() {
			callBack(buffer);
		}, 0);
	};
	setTimeout(iterate, 0);
}

function AudioGenerator(mixBuf) {
	return {
		mixBuf: mixBuf,
		waveSize: mixBuf.length / WAVE_CHAN / 2
	};
}

function getAudioGenerator(music, callBack) {
	genBuffer(music.waveSize, function(mixBuf) {
		var t = 0;
		var recu = function() {
			if (t < music.song.songData.length) {
				t += 1;
				generateTrack(music, music.song.songData[t - 1], mixBuf, recu);
			} else {
				callBack(AudioGenerator(mixBuf));
			}
		};
		recu();
	});
}

function SoundGenerator(instr, rowLen) {
	return {
		instr: instr,
		rowLen: rowLen || 5605,

		osc_lfo: oscillators[instr.lw],
		osc1: oscillators[instr.ow],
		osc2: oscillators[instr.pw],
		attack: instr.ea,
		sustain: instr.es,
		release: instr.er,
		panFreq: Math.pow(2, instr.fp - 8) / rowLen,
		lfoFreq: Math.pow(2, instr.lr - 8) / rowLen
	}
}

function generateTrack(music, instr, mixBuf, callBack) {
	genBuffer(music.waveSize, function(chnBuf) {
		// Preload/precalc some properties/expressions (for improved performance)
		var waveSamples = music.waveSize,
			waveBytes = music.waveSize * WAVE_CHAN * 2,
			rowLen = music.song.rowLen,
			endPattern = music.song.endPattern,
			soundGen = SoundGenerator(instr, rowLen);

		var currentpos = 0;
		var p = 0;
		var row = 0;
		var recordSounds = function() {
			var beginning = new Date();
			while (true) {
				if (row === 32) {
					row = 0;
					p += 1;
					continue;
				}
				if (p === endPattern - 1) {
					setTimeout(delay, 0);
					return;
				}
				var cp = instr.p[p];
				if (cp) {
					var n = instr.c[cp - 1].n[row];
					if (n) {
						SoundGeneratorGenSound(soundGen, n, chnBuf, currentpos);
					}
				}
				currentpos += rowLen;
				row += 1;
				if (new Date() - beginning > MAX_TIME) {
					setTimeout(recordSounds, 0);
					return;
				}
			}
		};

		var delay = function() {
			applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
		};

		var b2 = 0;
		var finalize = function() {
			var beginning = new Date();
			var count = 0;
			// Add to mix buffer
			while (b2 < waveBytes) {
				var x2 = mixBuf[b2] + (mixBuf[b2 + 1] << 8) + chnBuf[b2] + (chnBuf[b2 + 1] << 8) - 32768;
				mixBuf[b2] = x2 & 255;
				mixBuf[b2 + 1] = (x2 >> 8) & 255;
				b2 += 2;
				count += 1;
				if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
					setTimeout(finalize, 0);
					return;
				}
			}
			setTimeout(callBack, 0);
		};
		setTimeout(recordSounds, 0);
	});
}

function SoundGeneratorGenSound(soundGen, n, chnBuf, currentpos) {
	var marker = new Date();
	var c1 = 0;
	var c2 = 0;

	// Precalculate frequencues
	var o1t = getnotefreq(n + (soundGen.instr.oo - 8) * 12 + soundGen.instr.od) * (1 + 0.0008 * soundGen.instr.oe);
	var o2t = getnotefreq(n + (soundGen.instr.po - 8) * 12 + soundGen.instr.pd) * (1 + 0.0008 * soundGen.instr.pe);

	// State variable init
	var q = soundGen.instr.fr / 255;
	var low = 0;
	var band = 0;
	for (var j = soundGen.attack + soundGen.sustain + soundGen.release - 1; j >= 0; --j) {
		var k = j + currentpos;

		// LFO
		var lfor = soundGen.osc_lfo(k * soundGen.lfoFreq) * soundGen.instr.la / 512 + 0.5;

		// Envelope
		var e = 1;
		if (j < soundGen.attack)
			e = j / soundGen.attack;
		else if (j >= soundGen.attack + soundGen.sustain)
			e -= (j - soundGen.attack - soundGen.sustain) / soundGen.release;

		// Oscillator 1
		var t = o1t;
		if (soundGen.instr.lf) t += lfor;
		if (soundGen.instr.ox) t *= e * e;
		c1 += t;
		var rsample = soundGen.osc1(c1) * soundGen.instr.ov;

		// Oscillator 2
		t = o2t;
		if (soundGen.instr.px) t *= e * e;
		c2 += t;
		rsample += soundGen.osc2(c2) * soundGen.instr.pv;

		// Noise oscillator
		if (soundGen.instr.nf) rsample += (2 * Math.random() - 1) * soundGen.instr.nf * e;

		rsample *= e / 255;

		// State variable filter
		var f = soundGen.instr.fq;
		if (soundGen.instr.lq) f *= lfor;
		f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
		low += f * band;
		var high = q * (rsample - band) - low;
		band += f * high;
		var test = soundGen.instr.ff;
		if (test === 1) { // Hipass
			rsample = high;
		}
		if (test === 2) { // Lopass
			rsample = low;
		}
		if (test === 3) { // Bandpass
			rsample = band;
		}
		if (test === 4) { // Notch
			rsample = low + high;
		}

		// Panning & master volume
		t = osc_sin(k * soundGen.panFreq) * soundGen.instr.ft / 512 + 0.5;
		rsample *= 39 * soundGen.instr.em;

		// Add to 16-bit channel buffer
		k = k * 4;
		if (k + 3 < chnBuf.length) {
			var x = chnBuf[k] + (chnBuf[k + 1] << 8) + rsample * (1 - t);
			chnBuf[k] = x & 255;
			chnBuf[k + 1] = (x >> 8) & 255;
			x = chnBuf[k + 2] + (chnBuf[k + 3] << 8) + rsample * t;
			chnBuf[k + 2] = x & 255;
			chnBuf[k + 3] = (x >> 8) & 255;
		}
	}
}

// function createSFXBuffer(sound, n, callBack) {
// 	getSFXGenerator(sound, n, function(ag) {
// 		getAudioBuffer(ag, callBack);
// 	});
// }

// function getSFXGenerator(sound, n, callBack) {
// 	var bufferSize = (sound.attack + sound.sustain + sound.release - 1) + (32 * sound.rowLen);
// 	genBuffer(bufferSize, function(buffer) {
// 		genSFX(sound, n, buffer, 0);
// 		applyDelay(buffer, bufferSize, sound.instr, sound.rowLen, function() {
// 			callBack(AudioGenerator(buffer));
// 		});
// 	});
// };

// function genSFX(sound, n, chnBuf, currentpos) {
// 		var marker = new Date();
// 		var c1 = 0;
// 		var c2 = 0;

// 		// Precalculate frequencues
// 		var o1t = getnotefreq(n + (sound.instr.oo - 8) * 12 + sound.instr.od) * (1 + 0.0008 * sound.instr.oe);
// 		var o2t = getnotefreq(n + (sound.instr.po - 8) * 12 + sound.instr.pd) * (1 + 0.0008 * sound.instr.pe);

// 		// State variable init
// 		var q = sound.instr.fr / 255;
// 		var low = 0;
// 		var band = 0;
// 		for (var j = sound.attack + sound.sustain + sound.release - 1; j >= 0; --j) {
// 			var k = j + currentpos;

// 			// LFO
// 			var lfor = sound.osc_lfo(k * sound.lfoFreq) * sound.instr.la / 512 + 0.5;

// 			// Envelope
// 			var e = 1;
// 			if (j < sound.attack)
// 				e = j / sound.attack;
// 			else if (j >= sound.attack + sound.sustain)
// 				e -= (j - sound.attack - sound.sustain) / sound.release;

// 			// Oscillator 1
// 			var t = o1t;
// 			if (sound.instr.lf) t += lfor;
// 			if (sound.instr.ox) t *= e * e;
// 			c1 += t;
// 			var rsample = sound.osc1(c1) * sound.instr.ov;

// 			// Oscillator 2
// 			t = o2t;
// 			if (sound.instr.px) t *= e * e;
// 			c2 += t;
// 			rsample += sound.osc2(c2) * sound.instr.pv;

// 			// Noise oscillator
// 			if (sound.instr.nf) rsample += (2 * Math.random() - 1) * sound.instr.nf * e;

// 			rsample *= e / 255;

// 			// State variable filter
// 			var f = sound.instr.fq;
// 			if (sound.instr.lq) f *= lfor;
// 			f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
// 			low += f * band;
// 			var high = q * (rsample - band) - low;
// 			band += f * high;
//             var test = sound.instr.ff;
//             if(test === 1) { // Hipass
//                 rsample = high;
//             }
//             if(test === 2) { // Lopass
//                 rsample = low;
//             }
//             if(test === 3) { // Bandpass
//                 rsample = band;
//             }
//             if(test === 4) { // Notch
//                 rsample = low + high;
//             }

// 			// Panning & master volume
// 			t = osc_sin(k * sound.panFreq) * sound.instr.ft / 512 + 0.5;
// 			rsample *= 39 * sound.instr.em;

// 			// Add to 16-bit channel buffer
// 			k = k * 4;
// 			if (k + 3 < chnBuf.length) {
// 				var x = chnBuf[k] + (chnBuf[k + 1] << 8) + rsample * (1 - t);
// 				chnBuf[k] = x & 255;
// 				chnBuf[k + 1] = (x >> 8) & 255;
// 				x = chnBuf[k + 2] + (chnBuf[k + 3] << 8) + rsample * t;
// 				chnBuf[k + 2] = x & 255;
// 				chnBuf[k + 3] = (x >> 8) & 255;
// 			}
// 		}
// 	};
function drawMap() {
	bdContext.strokeStyle = currentRoom.c.bd;
	bdContext.lineWidth = 2;
	parseViewPort();
	tileContext.fillStyle = currentRoom.c.bd;
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.c.bg;
	// optimize
	tileContext.clearRect(0 - viewPortX, 0 - viewPortY, realMapWidth, realMapHeight);
	var x1 = modulus(viewPortX) - 1;
	var y1 = modulus(viewPortY) - 1;
	var x2 = modulus(viewPortX) + modulus(playerCanvas.width) + 2;
	var y2 = modulus(viewPortY) + modulus(playerCanvas.height) + 2;
	if (x1 < 0) {
		x1 = 0;
	}
	if (y1 < 0) {
		y1 = 0;
	}
	if (x2 > currentMapTiles) {
		x2 = currentMapTiles;
	}
	if (y2 > currentMapTiles) {
		y2 = currentMapTiles;
	}
	for (var y = y1; y < y2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		tileContext.fillStyle = currentRoom.c.bg;
		for (var x = x1; x < x2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0) {
				rectWidth += 1 * 16;
				if (startX === -currentMapTiles * 16 * 2) {
					startX = (x * 16) - viewPortX;
				}
				if (y - 1 < 0) {
					topTile = -1;
				} else {
					topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
				}
				if (topTile === 0) {
					hasFloor = 1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1) {
				drawRect(y, startX, rectWidth, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = y1; y < y2; y++) {
		for (var x = x1; x < x2; x++) {
			if (currentMap[coordinate(x, y, currentMapTiles)] > 1) {
				if (currentMap[coordinate(x, y, currentMapTiles)] === 9 && currentRoom.s > -1) {
					tileContext.fillStyle = rColors[currentRoom.s].l;
				} else if (currentMap[coordinate(x, y, currentMapTiles)] !== 9) {
					tileContext.fillStyle = rColors[currentMap[coordinate(x, y, currentMapTiles)] - 2].l;
				}
				drawRect(y, (x * 16) - viewPortX, 16, true);
			}
		}
	}

	parseVerticalLines(x1, y1, x2, y2, 1);
	parseVerticalLines(x1, y1, x2, y2, 4);
	parseHorizontalLines(x1, y1, x2, y2, 2);
	parseHorizontalLines(x1, y1, x2, y2, 8);
}

function drawRect(y, startX, rectWidth, hasFloor) {
	var canvasX = startX;
	var canvasY = (y * 16) - viewPortY;
	if (hasFloor === 1) {
		tileContext.fillRect(canvasX, canvasY - (16 * 0.3125), rectWidth, 16 + (16 * 0.3125));
	} else {
		tileContext.fillRect(canvasX, canvasY, rectWidth, 16);
	}
}

function parseVerticalLines(x1, y1, x2, y2, type) {
	for (var x = x1; x < x2; x++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var y = y1; y < y2; y++) {
			var topRightTile = currentMap[coordinate(x + 1, y - 1, currentMapTiles)];
			var topTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
			var topLeftTile = currentMap[coordinate(x - 1, y - 1, currentMapTiles)];
			if (type === 1) {
				mainTile = currentMap[coordinate(x - 1, y, currentMapTiles)];
				if (x - 1 < 0) {
					mainTile = -1;
				}
			} else if (type === 4) {
				mainTile = currentMap[coordinate(x + 1, y, currentMapTiles)];
				if (x + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === y2 - 1 || mainTile > 0) {
				bdContext.beginPath();
				var canvasY = startPosition;
				var canvasX = (x * 16) - viewPortX;
				var canvasY2 = canvasY + rectSize;
				var canvasX2 = ((x + 1) * 16) - viewPortX;
				var startX = canvasX;
				if (type === 4) {
					startX = canvasX2;
				}
				if (hasFloor) {
					canvasY = canvasY - (16 * 0.3125);
				}
				if (((type === 4 && topRightTile === 0) || (type === 1 && topLeftTile === 0)) && mainTile > 0) {
					drawLine(startX, canvasY, startX, canvasY2 + (16 * 0.1875));
				} else {
					drawLine(startX, canvasY, startX, canvasY2);
				}
				bdContext.closePath();
				bdContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || y === y2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

function parseHorizontalLines(x1, y1, x2, y2, type) {
	for (var y = y1; y < y2; y++) {
		var rectSize = 0;
		var startPosition = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var mainTile = 0;
		for (var x = x1; x < x2; x++) {
			if (type === 2) {
				if (y - 1 < 0) {
					mainTile = -1;
				} else {
					mainTile = currentMap[coordinate(x, y - 1, currentMapTiles)];
					hasFloor = 1;
				}
			} else if (type === 8) {
				mainTile = currentMap[coordinate(x, y + 1, currentMapTiles)];
				if (y + 1 > currentMapTiles - 1) {
					mainTile = -1;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] !== 0 && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
				// drawTile(x, y, currentMap, currentMapTiles, startPosition, rectSize, hasFloor);
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1 || mainTile > 0) {
				bdContext.beginPath();
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawLine(canvasX, canvasY - (16 * 0.3125), canvasX2, canvasY - (16 * 0.3125));
						drawLine(canvasX, canvasY + (16 * 0.1875), canvasX2, canvasY + (16 * 0.1875));
					} else {
						drawLine(canvasX, canvasY, canvasX2, canvasY);
					}
				} else if (type === 8) {
					drawLine(canvasX, canvasY2, canvasX2, canvasY2);
				}
				bdContext.closePath();
				bdContext.stroke();
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || x === x2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}


function drawLine(startX, startY, endX, endY) {
	bdContext.moveTo(startX, startY);
	bdContext.lineTo(endX, endY);
}

var faviconEl = document.getElementById('f');
var canvas = document.createElement('canvas');
canvas.height = 16;
canvas.width = 16;
var ctx = canvas.getContext('2d');
// (function() {
// 	// faviconEl.rel = 'icon';
// 	// faviconEl.type = 'image/png'; //required for chromium
// 	// document.head.appendChild(faviconEl);
// 	var start = new Date().getTime();
// 	ctx.font = '5pt arial';
// 	(function() {
// 		parseMinimapViewport();
// 		miniMapPlayerX = (currentRoom.x * 16) + (modulus(modulus(modulus(player.x), 10), 1) * 16);
// 		miniMapPlayerY = (currentRoom.y * 16) + (modulus(modulus(modulus(player.y), 10), 1) * 16);
// 		minimapCanvas.width = 150;
// 		minimapCanvas.height = 150;
// 		minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
// 		drawnDoors.length = 0;
// 		minimapContext.lineWidth = 2;
// 		minimapContext.fillStyle = "#000";
// 		forEachRoom("bg", "bd", function(room, roomX, roomY) {
// 			if (room.v) {
// 				minimapContext.beginPath();
// 				minimapContext.rect(roomX / 16, roomY / 16, room.mw, room.mh);
// 				minimapContext.fill();
// 				minimapContext.stroke();
// 				minimapContext.closePath();
// 			}
// 		});
// 	})();
// })();
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;

function drawWorld() {
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.x * 16) + (modulus(modulus(modulus(player.x), 10), 1) * 16);
	miniMapPlayerY = (currentRoom.y * 16) + (modulus(modulus(modulus(player.y), 10), 1) * 16);
	minimapCanvas.width = 300;
	minimapCanvas.height = 300;
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	drawnDoors.length = 0;
	minimapContext.lineWidth = 2;
	minimapContext.fillStyle = "#000";
	for (var r = 0; r < world.r.length; r++) {
		for (var i = 0; i < world.r[r].rooms.length; i++) {
			var room = world.r[r].rooms[i];
			var roomX = (room.x * 16) - miniViewPortX;
			var roomY = (room.y * 16) - miniViewPortY;
			if (roomX + (room.mw * 16) > 0 && roomY + (room.mh * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				minimapContext.beginPath();
				minimapContext.rect(roomX, roomY, room.mw * 16, room.mh * 16);
				minimapContext.fill();
				minimapContext.closePath();
			}
		}
	}
	forEachRoom("bg", "bd", function(room, roomX, roomY) {
		if (room.v) {
			minimapContext.beginPath();
			minimapContext.rect(roomX, roomY, room.mw * 16, room.mh * 16);
			minimapContext.fill();
			minimapContext.stroke();
			minimapContext.closePath();
		}
	}, minimapContext);
	ctx.clearRect(0, 0, 16, 16);
	forEachRoom("bg", "bd", function(room, roomX, roomY) {
		if (room.v) {
			ctx.beginPath();
			ctx.rect(roomX / 16 * 2, roomY / 16 * 2, room.mw * 2, room.mh * 2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}, ctx);
	faviconEl.href = canvas.toDataURL();
	forEachRoom(0, "bg", drawDoors, minimapContext);
	forEachRoom(0, 0, drawIcons, minimapContext);
	drawPlayer();
}

function forEachRoom(fillStyle, strokeStyle, fn, context) {
	var canvasContext = context || minimapContext;
	for (var r = 0; r < world.r.length; r++) {
		if (typeof fillStyle === "string") {
			canvasContext.fillStyle = world.r[r].color[fillStyle];
		}
		if (typeof strokeStyle === "string") {
			canvasContext.strokeStyle = world.r[r].color[strokeStyle];
		}
		for (var i = 0; i < world.r[r].rooms.length; i++) {
			var room = world.r[r].rooms[i];
			var roomX = (room.x * 16) - miniViewPortX;
			var roomY = (room.y * 16) - miniViewPortY;
			if (roomX + (room.mw * 16) > 0 && roomY + (room.mh * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				fn(room, roomX, roomY, canvasContext);
			}
		}
	}
}

function drawIcons(room) {
	if (room.v) {
		var door = null;
		var color = null;
		for (var i = 0; i < room.d.length; i++) {
			door = room.d[i];
			if (door.dt > -1) {
				color = rColors[door.dt].l;
				var xModifier = 0;
				var yModifier = 0;
				if (door.dir === "N") {
					xModifier = 5;
				}
				if (door.dir === "S") {
					xModifier = 5;
					yModifier = 16;
				}
				if (door.dir === "W") {
					xModifier = -3;
					yModifier = 8;
				}
				if (door.dir === "E") {
					xModifier = 13;
					yModifier = 8;
				}
				drawCircle(16 * door.x + xModifier, 16 * door.y + yModifier, color);
			}
		}
		if (room.s > -1) {
			color = rColors[room.s].l;
			drawCircle(16 * (room.x + room.mw / 2) - 3, 16 * (room.y + room.mh / 2), "rgba(0,0,0,0)", color);
		}
	}
}

function drawCircle(centerX, centerY, color, bd) {
	var radius = 3;
	minimapContext.beginPath();
	minimapContext.arc(centerX + radius - miniViewPortX, centerY - miniViewPortY, radius, 0, 2 * Math.PI, false);
	minimapContext.fillStyle = color;
	minimapContext.fill();
	if (bd) {
		minimapContext.lineWidth = 2;
		minimapContext.strokeStyle = bd;
		minimapContext.stroke();
	}
	minimapContext.closePath();
}

var drawnDoors = [];

function drawDoors(room) {
	if (room.v) {
		var door = null;
		for (var e = 0; e < room.d.length; e++) {
			door = room.d[e];
			var ID = room.x + "-" + room.y + "-" + door.r2.x + "-" + door.r2.y;
			var ID2 = door.r2.x + "-" + door.r2.y + "-" + room.x + "-" + room.y;
			if (drawnDoors.indexOf(ID2) === -1 && drawnDoors.indexOf(ID) === -1) {
				var doorX = 16 * door.x;
				var doorY = 16 * door.y;

				if (door.dir === "N") {
					drawLine2(doorX + 4, doorY, doorX + 16 - 4, doorY);
				}
				if (door.dir === "S") {
					drawLine2(doorX + 4, 16 * (door.y + 1), doorX + 16 - 4, 16 * (door.y + 1));
				}
				if (door.dir === "W") {
					drawLine2(doorX, doorY + 4, doorX, doorY + 16 - 4);
				}
				if (door.dir === "E") {
					drawLine2(16 * (door.x + 1), doorY + 4, 16 * (door.x + 1), doorY + 16 - 4);
				}
				drawnDoors.push(ID);
			}
		}
	}
}

function drawLine2(startX, startY, endX, endY) {
	minimapContext.beginPath();
	minimapContext.moveTo(startX - miniViewPortX, startY - miniViewPortY);
	minimapContext.lineTo(endX - miniViewPortX, endY - miniViewPortY);
	minimapContext.stroke();
	minimapContext.closePath();
}

var animationLoopProgress = 0;
var initPlayerCanvas = false;
var lastFrame = 0;


function fillKeys() {
	for (var i = 0; i < player.keys.length; i++) {
		playerContext.beginPath();
		playerContext.fillStyle = rColors[player.keys[i]].l;
		playerContext.rect(player.x - viewPortX, player.y - viewPortY + ((4 - i) * player.h / 5), player.w, player.h / 5);
		playerContext.fill();
		playerContext.closePath();
	}
}

function drawPlayer() {
	if (!initPlayerCanvas) {
		miniMapIconsCanvas.width = minimapCanvas.width;
		miniMapIconsCanvas.height = minimapCanvas.height;
		miniMapIconsContext.lineWidth = 1;
		initPlayerCanvas = true;
	}
	playerContext.fillStyle = "#000000";
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.ῼ / player.mῼ))).toString(16);
		playerContext.beginPath();
		playerContext.fillStyle = 'rgba(0,0,0,0.1)';
		playerContext.rect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		playerContext.fill();
		playerContext.closePath();
		fillKeys();
		playerContext.beginPath();
		playerContext.lineWidth = 1;
		playerContext.strokeStyle = '#' + red + red + '0000';
		playerContext.fillStyle = 'rgba(0,0,0,0)';
		playerContext.rect(entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		playerContext.stroke();
		playerContext.closePath();
	}
	miniMapIconsContext.clearRect(0, 0, miniMapIconsCanvas.width, miniMapIconsCanvas.height);
	animationLoopProgress += 2 * (dt / 1000);
	animationLoopProgress = animationLoopProgress % 2;
	var frame = 1;
	if (animationLoopProgress > 1) {
		frame = 0;
	}
	if (lastFrame !== frame) {
		miniMapIconsContext.fillStyle = "rgba(200,200,255," + (0.6 * frame) + ")";
		miniMapIconsContext.strokeStyle = "rgba(200,200,255," + (0.8 * frame) + ")";
	}
	miniMapIconsContext.beginPath();
	miniMapIconsContext.rect(miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, 16, 16);
	miniMapIconsContext.fill();
	miniMapIconsContext.stroke();
	miniMapIconsContext.closePath();
	ctx.beginPath();
	ctx.fillStyle = "rgba(200,200,255,1)";
	ctx.strokeStyle = "rgba(200,200,255,1)";
	ctx.rect((miniMapPlayerX - miniViewPortX) / 16 * 2, (miniMapPlayerY - miniViewPortY) / 16 * 2, 2, 2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	lastFrame = frame;
}

function drawArrow() {
	if (player.keys.length === 0) {
		playerContext.fillStyle = '#000000';
	} else {
		playerContext.fillStyle = rColors[player.keys[selectedColor]].l;
	}
	playerContext.strokeStyle = '#000000';
	playerContext.save();
	playerContext.translate(player.x - viewPortX + (player.w / 2), player.y - viewPortY + (player.h / 2));
	playerContext.rotate(aToPlayer);
	playerContext.beginPath();
	playerContext.moveTo(10 + player.w, 0);
	playerContext.lineTo(0 + player.w, -10);
	playerContext.lineTo(0 + player.w, 10);
	playerContext.lineTo(10 + player.w, 0);
	playerContext.fill();
	playerContext.stroke();
	playerContext.closePath();
	playerContext.restore();
}

function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		playerContext.fillStyle = rColors[bullet.key].l;
		playerContext.save();
		playerContext.translate(bullet.x - viewPortX, bullet.y - viewPortY);
		playerContext.rotate(bullet.a);
		playerContext.beginPath();
		playerContext.rect(0, 0, 10, 2);
		playerContext.fill();
		// playerContext.moveTo(0, 0);
		// playerContext.lineTo(-10, 0);
		// playerContext.stroke();
		playerContext.closePath();
		playerContext.restore();
	}
}
var playerCanvas, tileCanvas, bdCanvas, playerContext, tileContext, bdContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas;
var runGameLoop = true;
var animate = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};

var player = {
	x: -1,
	y: -1,
	w: 16,
	h: 16 * 2,
	img: null,
	xd: 0,
	yd: 1,
	xa: 0,
	ya: 0,
	maxa: 5,
	jf: 7,
	jh: 16 * 3.125,
	js: 0,
	j: 0,
	ju: 0,
	ht: 0,
	mj: 1,
	a: 0,
	ῼ: 5,
	dc: window.performance.now(),
	mῼ: 5,
	keys: []
};
var dt = currentTick - lastTick;
var entities = [player];
var keys = {
	a: 65,
	w: 87,
	s: 83,
	d: 68,
	space: 32,
	shift: 16,
	ctrl: 17,
	alt: 18,
	tab: 9,
	debug: 192
};

function listen(eventName, fn) {
	if (!events[eventName]) {
		events[eventName] = [];
	}
	events[eventName].push(fn);
}

// function entity(x, y, w, h, img, moveable) {
// 	var entity = {
// 		x: x,
// 		y: y,
// 		w: w,
// 		h: h,
// 		a: 0,
// 		img: img
// 	};
// 	if (moveable) {
// 		entity.xd = 0;
// 		entity.yd = 0;
// 		entity.xa = 0;
// 		entity.ya = 1;
// 		entity.maxa = 5;
// 	}
// 	if (moveable) {
// 		entity.jf = 7;
// 		entity.jh = 50;
// 		entity.js = 0;
// 		entity.j = 0;
// 		entity.ju = 0;
// 		entity.mj = 3;
// 	}
// 	return (entity);
// }

function trigger(event) {
	var eventName = event.type;
	if (events[eventName] && events[eventName].length > 0) {
		for (var i = 0; i < events[eventName].length; i++) {
			events[eventName][i](event);
		}
	}
}

function getByType(id) {
	return document.getElementById(id);
}



function DOMLoaded() {
	playerCanvas = getByType("p");
	bdCanvas = getByType("b");
	tileCanvas = getByType("t");
	minimapCanvas = getByType("m");
	miniMapIconsCanvas = getByType("i");
	playerContext = playerCanvas.getContext("2d");
	bdContext = bdCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	miniMapIconsContext = miniMapIconsCanvas.getContext("2d");
	resizeCanvas();
	startWorld();
	for (var r = 0; r < rColors.length; r++) {
		// var rooms = random(10, 20);
		var rooms = random(1, 2);
		for (var i = 0; i < rooms; i++) {
			addRoomToWorld();
		}
		if (r + 1 < rColors.length) {
			addRegion();
		}
	}
	d();
	var door = world.rooms[0].d[0];
	var direction = door.dir;
	var position = door.x;
	if (door.dir === "E" || door.dir === "W") {
		position = door.y;
	}
	enterRoom(world.rooms[0], direction, position);
	loop();
	var div = document.createElement("span");
	div.innerHTML = "<p>A, D, to move</p><p>space to jump</p><p>mouse to aim</p><p>left click to take colors</p><p>right click to place colors</p><p>middle click to change colors</p>";
	document.body.appendChild(div);
}

function resizeCanvas() {
	if (window.innerWidth > 300) {
		bdCanvas.width = playerCanvas.width = tileCanvas.width = 300;
	} else {
		bdCanvas.width = playerCanvas.width = tileCanvas.width = window.innerWidth;
	}
	if (window.innerHeight > 300) {
		bdCanvas.height = playerCanvas.height = tileCanvas.height = 300;
	} else {
		bdCanvas.height = playerCanvas.height = tileCanvas.height = window.innerHeight;
	}
}



function eachFrame() {
	if (runGameLoop) {
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			handleXMovement(entity);
			entity.x = round(entity.x);
			entity.y = round(entity.y);
			testWalking(entity);
			testJumping(entity);
			handleJump(entity);
			testDoors();
			testFalling(entity);
		}
		processShot();
		for(var i=0;i<bullets.length;i++) {
			bulletPhysics(bullets[i]);
		}
		playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
		bdContext.clearRect(0, 0, bdCanvas.width, bdCanvas.height);
		drawMap();
		drawWorld();
		drawArrow();
		drawBullets();
	}
}



function loop() {
	currentTick = window.performance.now();
	dt = currentTick - lastTick;
	lastTick = currentTick;
	document.dispatchEvent(frameEvent);
	if (animate) {
		requestAnimationFrame(loop);
	}
}

// canvas.addEventListener("mousedown")
listen("keydown", handleKeyDown);
listen("keyup", handleKeyUp);
listen("resize", resizeCanvas);
listen("DOMContentLoaded", DOMLoaded);
listen("frame", eachFrame);
listen("frame", transition);
listen("mousemove", mousePosition);
listen("mousedown", click);
listen("mouseup", release);
listen("contextmenu", place);
window.addEventListener("resize", trigger);
document.addEventListener("DOMContentLoaded", trigger);
document.addEventListener("mousedown", trigger);
document.addEventListener("mouseup", trigger);
document.addEventListener("keydown", trigger);
document.addEventListener("keyup", trigger);
document.addEventListener("frame", trigger);
document.addEventListener("mousemove", trigger);
document.addEventListener("contextmenu", trigger);

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function modulus(num, size) {
	var mod = num % (size || 16);
	return (num - mod) / (size || 16);
}

function coordinate(x, y, size) {
	return (y * size + x);
}

function indexOf(array, searchKey) {
	if(typeof searchKey === "object") {
		for(var i=0;i<array.length;i++) {
			var found = true;
			if(typeof array[i] === "object") {
				for(var attr in searchKey) {
					if(array[i][attr] !== searchKey[attr]) {
						found = false;
						break;
					}
				}
				if(found === true) {
					return i;
				}
			}
		}
		return -1;
	} else {
		return array.indexOf(searchKey);
	}
}

function round(value) {
	return ~~ (0.5 + value);
}
function handleKeyDown(event) {
	for (var attr in keys) {
		if (keys[attr] === event.keyCode) {
			event.preventDefault();
		}
	}

	if (keymap[event.keyCode] !== event.type) {
		if (event.keyCode === keys.space) {
			player.j = 1;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d) {
		player.xd = 1;
	} else if (event.keyCode === keys.a) {
		player.xd = -1;
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
			player.j = 0;
		}
	}
	keymap[event.keyCode] = event.type;
	if (event.keyCode === keys.d || event.keyCode === keys.a) {
		if (keymap[keys.d] && keymap[keys.a]) {
			if (keymap[keys.d] === event.type && keymap[keys.a] === event.type) {
				player.xd = 0;
			}
		} else {
			player.xd = 0;
		}
	}
}
var mouseX = 0;
var mouseY = 0;
var aToPlayer = 0;
var bullets = [];
var lastShot = window.performance.now();
var clicking = false;
var delayBetweenShots = 150;
var bls = [0,0,0,0,0];
var mouseCanvasX = -1;
var mouseCanvasY = -1;
var selectedColor = 0;

function mousePosition(event) {
	if (event.target === playerCanvas) {
		mouseCanvasX = event.layerX;
		mouseCanvasY = event.layerY;
	}
	mouseX = event.clientX;
	mouseY = event.clientY;
	aToPlayer = Math.atan2(playerCanvas.offsetTop + player.y - viewPortY - mouseY, playerCanvas.offsetLeft + player.x - viewPortX - mouseX) + Math.PI;
}

function click(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = true;
	}
	if (event.which === 2) {
		selectedColor++;
		if(selectedColor > player.keys.length-1) {
			selectedColor = 0;
		}
	}
}

function release(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = false;
	}
}

function processShot() {
	if (clicking) {
		if (window.performance.now() - lastShot > delayBetweenShots && player.keys.length > 0) {
			lastShot = window.performance.now();
			bullets.push(Bullet(player.x + (player.w / 2) + (Math.cos(aToPlayer) * 10), player.y + (player.h / 2) + (Math.sin(aToPlayer) * 10), aToPlayer, player.keys[selectedColor]));
		}
	}
}

function place(event) {
	event.preventDefault();
	var x = mouseCanvasX + viewPortX;
	var y = mouseCanvasY + viewPortY;
	if (x >= 0 && x < mwidth * 16 && y >= 0 && y < mheight * 16) {
		var coord = coordinate(modulus(x), modulus(y), currentMapTiles);
		if(currentMap[coord] === 0 && bls[player.keys[selectedColor]] > 0) {
			currentMap[coord] = 1;
			bls[player.keys[selectedColor]]--;
		}
	}
}

function Bullet(x, y, a, key) {
	return {
		x: x,
		y: y,
		a: a,
		key:key
	}
}
function handleXMovement(entity) {
	entity.xa = entity.xa + (entity.xd / 60 * dt);
	if (entity.xa > entity.maxa) {
		entity.xa = entity.maxa;
	}
	if (entity.xa < -entity.maxa) {
		entity.xa = -entity.maxa;
	}
	if (entity.xd === 0) {
		if (entity.xa > 0) {
			entity.xa = entity.xa + ((-1 * 2 / 60) * dt);
		} else if (entity.xa < 0) {
			entity.xa = entity.xa + ((1 * 2 / 60) * dt);
		}
		if ((entity.xa < ((1 / 60) * dt) && entity.xa > ((-1 / 60) * dt)) || entity.yd === 1 || entity.yd === -1) {
			entity.xa = 0;
		}
	}
	entity.x = entity.x + entity.xa;
}

function handleJump(entity) {
	if (entity.j && (entity.yd !== -1 && entity.ju < entity.mj)) {
		if (entity.mj > 1 && entity.ju === 0 && entity.yd === 1) {
			entity.ju++;
		}
		if ((entity.ju === 0 && entity.yd === 0) || entity.ju > 0 || entity.mj > 1) {
			entity.yd = -1;
			entity.ya = -entity.jf;
			entity.js = entity.y;
			entity.ju++;
		}
		entity.ht = 0;

	}
	if (entity.yd === 0 || !entity.j || entity.ht > entity.jh) {
		entity.yd = 1;
	}
	if (entity.yd === 1) {
		entity.j = 0;
		entity.ya = entity.ya + ((entity.jf / 2) / 60 * dt); // falling
	}

	if (entity.yd === 0) {
		if (entity.ya > 0) {
			entity.ya = entity.ya + ((-1 / 60) * dt);
		} else if (entity.ya < 0) {
			entity.ya = entity.ya + ((1 / 60) * dt);
		}
		if (entity.ya < ((1 / 60) * dt) && entity.ya > ((-1 / 60) * dt)) {
			entity.ya = 0;
		}
	}
	if (entity.ya > entity.maxa) {
		entity.ya = 10;
	}
	entity.ht -= entity.ya;
	entity.ht = round(entity.ht);
	entity.y = entity.y + entity.ya;
}

function testFalling(entity) {
	var xAlignment = entity.x % 16;
	var bottomLeft = coordinate(modulus(entity.x), modulus(entity.y + entity.h), currentMapTiles);
	var bottomRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y + entity.h), currentMapTiles);
	var falling = false;
	if (xAlignment === 0) {
		falling = collision(currentMap[bottomLeft]);
	} else {
		falling = collision(currentMap[bottomRight]) || collision(currentMap[bottomLeft]);
	}
	if ((falling || entity.y + entity.h > mheight * 16) && entity.yd === 1) {
		// console.log("STOP FALL")
		entity.y = modulus(entity.y) * 16;
		entity.ya = 0;
		entity.yd = 0;
		entity.ju = 0;
		entity.j = 0;
		entity.ht = 0;
	}
}

function testJumping(entity) {
	var xAlignment = entity.x % 16;
	var aboveLeft = coordinate(modulus(entity.x), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var aboveRight = coordinate(modulus(entity.x + entity.w), modulus(entity.y - (entity.h / 2)), currentMapTiles);
	var j = false;
	if (xAlignment === 0) {
		j = collision(currentMap[aboveLeft]);
	} else {
		j = collision(currentMap[aboveLeft]) || collision(currentMap[aboveRight]);
	}
	if (j && entity.j === 1) {
		// console.log("STOP JUMP")
		entity.y = modulus(entity.y) * 16;
		entity.ya = -1;
		entity.yd = 1;
		entity.j = 0;
		entity.ht = 0;
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
		walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]);
		walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]);
	} else {
		if (modulus(entity.y + entity.h) * 16 > entity.y + entity.h) {
			walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]) || collision(currentMap[aboveLeft]);
			walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]) || collision(currentMap[aboveRight]);
		} else {
			walkLeft = collision(currentMap[midLeft]) || collision(currentMap[topLeft]) || collision(currentMap[bottomLeft]);
			walkRight = collision(currentMap[midRight]) || collision(currentMap[topRight]) || collision(currentMap[bottomRight]);
		}
	}
	if (xAlignment === 0) {
		if ((walkRight || entity.x + entity.w > mwidth * 16 || entity.x < 0) && entity.xa > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xd = 0;
			entity.xa = 0;
		}
	} else {
		if ((walkRight || entity.x + entity.w > mwidth * 16 || entity.x < 0) && entity.xa > 0) {
			// console.log("STOP 1")
			entity.x = modulus(entity.x) * 16;
			// entity.xd = 0;
			entity.xa = 0;
		} else if ((walkLeft || entity.x + entity.w > mwidth * 16 || entity.x < 0) && entity.xa < 0) {
			// console.log("STOP -1")
			entity.x = modulus(entity.x + entity.w) * 16;
			// entity.xd = 0;
			entity.xa = 0;
		}
	}
}

function collision(bl) {
	if (bl === 9) {
		collectKey(currentRoom);
	}
	return bl !== 0;
}

function bulletPhysics(bullet) {
	var destroy = false;
	bullet.x += Math.cos(bullet.a) * ((10 / 60) * dt);
	bullet.y += Math.sin(bullet.a) * ((10 / 60) * dt);
	var x = modulus(bullet.x);
	var y = modulus(bullet.y);
	var coord = coordinate(x, y, currentMapTiles);
	if (currentMap[coord] !== 0) {
		// if (x !== 0 && y !== 0 && x !== mwidth - 1 && y !== mheight - 1) {
		// 	currentMap[coord] = 0;
		// 	bls++;
		// }
		if (currentMap[coord] > 1 && player.keys.indexOf(currentMap[coord] - 2) > -1) {
			bls[currentMap[coord] - 2]++;
			currentMap[coord] = 0;
		}
		destroy = true;
	}
	if (bullet.x > mwidth * 16 || bullet.x < 0 || bullet.y > mheight * 16 || bullet.y < 0) {
		destroy = true;
	}
	if (destroy) {
		var index = bullets.indexOf(bullet);
		if (index > -1) {
			bullets.splice(index, 1);
		}
	}
}
var currentMapTiles = 0;

var realMapHeight = 0;
var realMapWidth = 0;
var width = currentMapTiles;
var height = currentMapTiles;
var roomList = [];
var blankArray = [];
for (var i = 0; i < 10 * 10; i++) {
	blankArray[i] = 0;
}


var smallRoomArray =
	"1111111111111111111100000000000000000000000000000000000000000000000000000000000011111111111111111111,1100000011111000001111110000111100000011110000001111000000111100000111110000111111000000111100000011,1000000001110000001111100001110001001000000000000000000000000000000000000111100011111111111111111111,1111111111111000011100000000000000000000000011000000011110000000000000000000000011000000111100000111,1111000011110000001111000000111100000011110001111111000000001100000000110000000011111111111111111111,1111111111100000000010000000001000000000100000000010000000001000000000100000000010000011111000000011,1111111111000000000100000000010000000001000000000100000000010000000001000000000110000000011100000001,1111000011110000001111000000111100000011110001111100000111110000111111000011111111111111111111111111,1110000011110000000100000000000000000000000011000000001100000000000000000000000011000000111100000111,1100000011111000001100110000110000000011000000001100000000110000000111000000111111000000111100000011,1100000011111000001111110000001100000000110000000011000000001100000111110000111111000000111100000011".split(",");

function smallRoom(RoomType, array) {
	array = array.split("");
	for (var i = 0; i < array.length; i++) {
		array[i] = parseInt(array[i]);
	}
	return {
		map: array,
		type: RoomType
	};
}

function cloneRoom(room) {
	return {
		map: room.map.slice(0),
		type: room.type
	};
}

roomList.push({
	map: blankArray,
	type: 0
});
for (var i = 0; i < smallRoomArray.length; i++) {
	roomList.push(smallRoom(i + 1, smallRoomArray[i]));
}

function BigRoom(width, height, worldRoom, roomCreator) {
	var array = [];
	var map = [];
	var topSize = Math.max(width, height);
	for (var i = 0; i < topSize * topSize; i++) {
		array[i] = 0;
		// array[i] = random(0,9);
	}
	array = roomCreator(array, width, height, topSize);
	var room;
	var rooms = {};
	var northDoor, eastDoor, southDoor, westDoor;
	for (var y = 0; y < topSize * 10; y++) {
		for (var x = 0; x < topSize * 10; x++) {
			var roomX = Math.floor(x / 10);
			var roomY = Math.floor(y / 10);
			northDoor = getDoor(worldRoom, roomX, roomY, "N");
			eastDoor = getDoor(worldRoom, roomX, roomY, "E");
			southDoor = getDoor(worldRoom, roomX, roomY, "S");
			westDoor = getDoor(worldRoom, roomX, roomY, "W");
			var arrayIndex = coordinate(roomX, roomY, topSize);
			var roomId = roomX + "-" + roomY;
			if (x % 10 === 0 || y % 10 === 0) {
				if (!rooms[roomId]) {
					room = cloneRoom(roomList[array[arrayIndex]]);
					rooms[roomId] = room;
				}
				room = rooms[roomId];
			}
			var mapCoord = coordinate(x, y, topSize * 10);
			var roomCoord = coordinate(x % 10, y % 10, 10);
			map[mapCoord] = room.map[roomCoord];
			if (map[mapCoord] === 0 && room.type !== 9 && x < width * 10 && y < height * 10 && x < width * 10 && y < height * 10) {
				map[mapCoord] = worldRoom.r.id + 2;
			}
			// top walls
			if ((y === 0 && northDoor === null && x < width * 10)) {
				map[mapCoord] = 1;
			}
			// left walls
			if ((x === 0 && westDoor === null && y < height * 10)) {
				map[mapCoord] = 1;
			}
			// bottom walls
			if ((y === height * 10 - 1 && southDoor === null && x < width * 10)) {
				map[mapCoord] = 1;
			}
			// right walls
			if ((x === width * 10 - 1 && eastDoor === null && y < height * 10)) {
				map[mapCoord] = 1;
			}
			// top walls
			if ((y === 0 && northDoor !== null && x < width * 10 && northDoor.dt > -1 && map[mapCoord] === 0)) {
				map[mapCoord] = northDoor.dt + 2;
			}
			// left walls
			if ((x === 0 && westDoor !== null && y < height * 10 && westDoor.dt > -1 && map[mapCoord] === 0)) {
				map[mapCoord] = westDoor.dt + 2;
			}
			// bottom walls
			if ((y === height * 10 - 1 && southDoor !== null && x < width * 10 && southDoor.dt > -1 && map[mapCoord] === 0)) {
				map[mapCoord] = southDoor.dt + 2;
			}
			// right walls
			if ((x === width * 10 - 1 && eastDoor !== null && y < height * 10 && eastDoor.dt > -1 && map[mapCoord] === 0)) {
				map[mapCoord] = eastDoor.dt + 2;
			}
		}
	}
	// currentMapTiles = topSize * 10;
	// currentMap = map;
	return {
		map: map,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * 10
	};
}



// function setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY) {
// 	roomSelection.length = 0;
// 	for (var e = 0; e < roomList.length; e++) {
// 		validRooms[e] = e;
// 	}
// 	var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
// 	var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
// 	var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
// 	var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
// 	if (currentY - 1 < 0) {
// 		aboveRoom = -1;
// 	}
// 	if (currentX - 1 < 0) {
// 		leftRoom = -1;
// 	}
// 	if (currentY + 1 > roomsY - 1) {
// 		belowRoom = -1;
// 	}
// 	if (currentX + 1 > roomsX - 1) {
// 		rightRoom = -1;
// 	}
// 	if (aboveRoom === 4 || aboveRoom === 2 || aboveRoom === 6 || aboveRoom === 7 || aboveRoom === 9 || aboveRoom === 13) {
// 		console.warn("Room for Above")
// 		for (var i = 0; i < validRooms.length; i++) {
// 			validRooms[i] = -1;
// 		}
// 		validRooms[2] = 2;
// 		validRooms[3] = 3;
// 		validRooms[5] = 5;
// 		validRooms[8] = 8;
// 		validRooms[9] = 9;
// 		if (leftRoom !== -1) {
// 			if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
// 				console.warn("Room for Above and Left")
// 				validRooms[2] = -1;
// 				validRooms[5] = -1;
// 				validRooms[3] = 3;
// 				validRooms[8] = 8;
// 				validRooms[9] = 9;
// 				if (rightRoom !== -1) {
// 					if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
// 						validRooms[8] = -1;
// 					}
// 				}
// 			}
// 		}
// 		if (rightRoom !== -1) {
// 			if (rightRoom === 1 || rightRoom === 3 || rightRoom === 4 || rightRoom === 7 || rightRoom === 8 || rightRoom === 9 || rightRoom === 11) {
// 				console.warn("Room for Above and Left")
// 				validRooms[2] = -1;
// 				validRooms[8] = -1;
// 				validRooms[3] = 3;
// 				validRooms[5] = 5;
// 				validRooms[9] = 9;
// 				if (leftRoom !== -1) {
// 					if (leftRoom === 1 || leftRoom === 3 || leftRoom === 4 || leftRoom === 5 || leftRoom === 6 || leftRoom === 9 || leftRoom === 10) {
// 						validRooms[5] = -1;
// 					}
// 				}
// 			}
// 		}
// 	}
// 	if (currentX === 0) {
// 		console.warn("Left of Map")
// 		validRooms[7] = -1;
// 		validRooms[8] = -1;
// 		validRooms[1] = -1;
// 	}
// 	if (currentX === roomsX - 1) {
// 		console.warn("Right of Map")
// 		validRooms[5] = -1;
// 		validRooms[6] = -1;
// 		validRooms[1] = -1;
// 	}
// 	if (currentY === 0) {
// 		console.warn("Top of Map")
// 		validRooms[3] = -1;
// 		validRooms[5] = -1;
// 		validRooms[8] = -1;
// 		validRooms[2] = -1;
// 	}
// 	if (currentY === roomsY - 1) {
// 		console.warn("Bottom of Map")
// 		validRooms[4] = -1;
// 		validRooms[6] = -1;
// 		validRooms[7] = -1;
// 		validRooms[2] = -1;
// 	}
// 	if (currentX === startX && currentY === startY) {
// 		console.warn("Room for Start")
// 		for (var i = 0; i < validRooms.length; i++) {
// 			validRooms[i] = -1;
// 		}
// 		validRooms[10] = 10;
// 		validRooms[11] = 11;
// 		validRooms[12] = 12;
// 		validRooms[13] = 13;
// 		if (leftRoom === -1) {
// 			validRooms[11] = -1;
// 		}
// 		if (aboveRoom === -1) {
// 			validRooms[12] = -1;
// 		}
// 		if (rightRoom === -1) {
// 			validRooms[10] = -1;
// 		}
// 		if (belowRoom === -1) {
// 			validRooms[13] = -1;
// 		}
// 	} else {
// 		validRooms[10] = -1;
// 		validRooms[11] = -1;
// 		validRooms[12] = -1;
// 		validRooms[13] = -1;
// 	}
// 	validRooms[9] = 9;
// 	for (var i = 0; i < validRooms.length; i++) {
// 		if (validRooms[i] !== -1) {
// 			roomSelection.push(validRooms[i]);
// 		}
// 	}
// 	var selectedRoom = roomSelection[random(0, roomSelection.length - 1)];
// 	if (selectedRoom === 11) {
// 		if ([1, 3, 4, 5, 6, 9].indexOf(leftRoom) === -1) {
// 			setRoom(startX, startY, currentX - 1, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
// 		}
// 	}
// 	if (selectedRoom === 12) {
// 		if ([2, 4, 6, 7, 9].indexOf(aboveRoom) === -1) {
// 			setRoom(startX, startY, currentX, currentY - 1, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
// 		}
// 	}
// 	array[coordinate(currentX, currentY, arraySize)] = selectedRoom;
// }

function playerSizedRoom(room) {
	room.map = BigRoom(room.mw * 1, room.mh * 1, room, function(array, roomsX, roomsY, arraySize) {
		var currentX = 0;
		var currentY = 0;
		var roomID = 0;
		for (var i = 0; i < arraySize * arraySize; i++) {
			// var aboveRoom = array[coordinate(currentX, currentY - 1, arraySize)];
			// var leftRoom = array[coordinate(currentX - 1, currentY, arraySize)];
			// var rightRoom = array[coordinate(currentX + 1, currentY, arraySize)];
			// var belowRoom = array[coordinate(currentX, currentY + 1, arraySize)];
			// var roomX = Math.floor(currentX / 10);
			// var roomY = Math.floor(currentY / 10);
			var northDoor = getDoor(room, currentX, currentY, "N");
			var eastDoor = getDoor(room, currentX, currentY, "E");
			var southDoor = getDoor(room, currentX, currentY, "S");
			var westDoor = getDoor(room, currentX, currentY, "W");
			var horizontalRooms = [1, 3, 4, 9];
			var verticalRooms = [2, 9, 10, 11];
			// if (currentY - 1 < 0) {
			// 	aboveRoom = -1;
			// }
			// if (currentX - 1 < 0) {
			// 	leftRoom = -1;
			// }
			// if (currentY + 1 > roomsY - 1) {
			// 	belowRoom = -1;
			// }
			// if (currentX + 1 > roomsX - 1) {
			// 	rightRoom = -1;
			// }
			// setRoom(startX, startY, currentX, currentY, arraySize, array, validRooms, roomSelection, roomsX, roomsY);
			if (currentX === 0 || currentY === 0 || currentX === roomsX - 1 || currentY === roomsY - 1) {
				roomID = random(0, 11);
			}
			if (currentX === 0 || currentX === roomsX - 1) {
				roomID = verticalRooms[random(0, 3)];
			}
			if ((currentY === 0 || currentY === roomsY - 1)) {
				roomID = horizontalRooms[random(0, 3)];
			}
			if ((currentX === 0 && currentY === 0) || (currentX === roomsX - 1 && currentY === 0) || (currentX === roomsX - 1 && currentY === roomsY - 1) || (currentX === 0 && currentY === roomsY - 1)) {
				roomID = 9;
			}
			if (room.mw === 1) {
				roomID = verticalRooms[random(0, 3)];
			}
			if (room.mh === 1) {
				roomID = horizontalRooms[random(0, 3)];
			}
			// if (room.mw === 2 || room.mh === 2) {
			if (currentX === 0 && currentY === 0) {
				roomID = 6;
			}
			if (currentX === roomsX - 1 && currentY === 0) {
				roomID = 7;
			}
			if (currentX === 0 && currentY === roomsY - 1) {
				roomID = 5;
			}
			if (currentX === roomsX - 1 && currentY === roomsY - 1) {
				roomID = 8;
			}
			// }
			if (northDoor || southDoor || eastDoor || westDoor) {
				roomID = 9;
			}
			array[coordinate(currentX, currentY, arraySize)] = roomID;
			currentX++;
			if (currentX > roomsX - 1) {
				currentX = 0;
				currentY++;
			}
			if (currentY > roomsY - 1) {
				i = arraySize * arraySize;
			}
		}
		return array;
	});
	if (room.s > -1) {
		var randomW = random(1, room.mw * 1) - 1;
		var randomH = random(1, room.mh * 1) - 1;
		var randomX = random(1, 10 - 1);
		var randomY = random(1, 10 - 1);
		while (room.map.map[coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles)] !== 0 && room.map.map[coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles)] !== room.r.id + 2) {
			console.log(room.map.map[coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles)], room.r.id + 2)
			randomX = random(1, 10 - 1);
			randomY = random(1, 10 - 1);
			randomW = random(1, room.mw * 1) - 1;
			randomH = random(1, room.mh * 1) - 1;
		}
		room.map.map[coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles)] = 9;
	}
}
var currentMap = null;
var mwidth = 0;
var mheight = 0;
var transitionDirection = 0;
var transitionPosition = 0;

function movePlayer(room, direction, position) {
	for (var i = 0; i < room.d.length; i++) {
		var match = false;
		var door = room.d[i];
		if (door.dir === direction) {
			if (door.dir === "N" || door.dir === "S") {
				match = position === door.x;
			}
			if (door.dir === "E" || door.dir === "W") {
				match = position === door.y;
			}
			if (match) {
				var translatedX = ((door.x - room.x) * 1);
				var translatedY = ((door.y - room.y) * 1);
				// console.log(player.x, player.y)
				if (player.y === -1) {
					player.y = translatedY * 10 * 16 + (10 / 2 * 16);
				}
				if (player.x === -1) {
					player.x = translatedX * 10 * 16 + (10 / 2 * 16);
				}
				if (door.dir === "N") {
					translatedX += Math.floor(1 / 2);
					player.y = 0;
					if (door.dt > -1) {
						player.y = 16;
					}
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "E") {
					translatedY += Math.floor(1 / 2);
					translatedX += 1;
					player.x = (room.mw * 10 * 16 * 1) - (player.w);
					if (door.dt > -1) {
						player.x -= 16;
					}
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
				if (door.dir === "S") {
					translatedX += Math.floor(1 / 2);
					translatedY += 1;
					player.y = (room.mh * 10 * 16 * 1) - (player.h);
					if (door.dt > -1) {
						player.y -= 16;
					}
					player.x = (player.x % (10 * 16)) + (translatedX * 10 * 16);
				}
				if (door.dir === "W") {
					translatedY += Math.floor(1 / 2);
					player.x = 0;
					if (door.dt > -1) {
						player.x = 16;
					}
					player.y = (player.y % (10 * 16)) + (translatedY * 10 * 16);
				}
			}
		}
	}
}

function testDoors() {
	for (var i = 0; i < currentRoom.d.length; i++) {
		var door = currentRoom.d[i];
		var translatedX = ((door.x - currentRoom.x) * 1);
		var translatedY = ((door.y - currentRoom.y) * 1);
		var playerX = modulus(modulus(player.x), 10);
		var playerX2 = modulus(modulus(player.x + player.w), 10);
		var playerY = modulus(modulus(player.y), 10);
		var playerY2 = modulus(modulus(player.y + player.h), 10);
		var roomWidth = currentRoom.mw * 10 * 16 * 1;
		var roomHeight = currentRoom.mh * 10 * 16 * 1;
		if (door.dir === "N") {
			translatedX += Math.floor(1 / 2);
		}
		if (door.dir === "E") {
			translatedY += Math.floor(1 / 2);
			translatedX += 1;
		}
		if (door.dir === "S") {
			translatedX += Math.floor(1 / 2);
			translatedY += 1;
		}
		if (door.dir === "W") {
			translatedY += Math.floor(1 / 2);
		}
		if (window.performance.now() - player.dc > 400) {
			if (player.x <= 0 && player.xd === -1 && door.dir === "W" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with left door");
				enterRoom(door.r2, "E", door.y);
			}
			if (player.y <= 0 && player.yd === -1 && door.dir === "N" && translatedX === playerX && translatedY === playerY) {
				// console.log("Collision with top door");
				enterRoom(door.r2, "S", door.x);
			}
			if (player.x + player.w >= roomWidth && player.xd === 1 && door.dir === "E" && translatedX === playerX2 && translatedY === playerY) {
				// console.log("Collision with right door");
				enterRoom(door.r2, "W", door.y);
			}
			if (player.y + player.h >= roomHeight && player.yd !== 0 && Math.abs(player.ya) > 5 && door.dir === "S" && translatedX === playerX && (translatedY === playerY2 || translatedY === playerY)) {
				// console.log(player.ya)
				// console.log(window.performance.now() - player.dc)
				// console.log("Collision with bottom door");
				enterRoom(door.r2, "N", door.x);
			}
		}
	}
}

var transitionRoom = null;
var transitionBetweenRooms = false;
var transitionCanvas = document.createElement("canvas");
var transitionContext = transitionCanvas.getContext("2d");
// document.body.appendChild(transitionCanvas);
// transitionCanvas.style.right = "initial";
// transitionCanvas.style.bd = "1px solid black";
var stage = 0;
var FPS = 1;

function transition() {
	if (transitionBetweenRooms) {
		if (currentRoom === null) {
			stage = FPS;
		}
		var width = playerCanvas.width;
		var height = playerCanvas.height;
		var canvasWidth = width;
		var canvasHeight = height;
		if (stage < FPS) {

			canvasWidth = width * stage / FPS;
			canvasWidth = width - canvasWidth;
			canvasHeight = height * stage / FPS;
			canvasHeight = height - canvasHeight;

		}
		if (stage >= FPS) {
			if (currentRoom !== transitionRoom) {
				bdContext.clearRect(0, 0, width, height);
				tileContext.clearRect(0, 0, width, height);
				currentRoom = transitionRoom;
				// collectKey(transitionRoom);
				currentRoom.v = true;
				currentMapTiles = transitionRoom.map.tiles;
				currentMap = transitionRoom.map.map;
				mheight = transitionRoom.map.height * 10;
				mwidth = transitionRoom.map.width * 10;
				realMapHeight = transitionRoom.map.height * 10 * 16;
				realMapWidth = transitionRoom.map.width * 10 * 16;
				movePlayer(transitionRoom, transitionDirection, transitionPosition);
				document.title = currentRoom.c.name;
				history.pushState(null, null, "#" + document.title);
				bullets.length = 0;
			}
			canvasWidth = width * (stage - FPS) / FPS;
			canvasHeight = height * (stage - FPS) / FPS;
		}
		transitionCanvas.width = width;
		transitionCanvas.height = height;
		transitionContext.clearRect(0, 0, width, height);
		drawWorld();
		drawMap();
		transitionContext.drawImage(tileCanvas, 0, 0);
		transitionContext.drawImage(bdCanvas, 0, 0);
		transitionContext.drawImage(playerCanvas, 0, 0);
		// if(stage > 3) {
		// console.log(tileCanvas.toDataURL(), width, height);
		// transitionBetweenRooms = false;
		// }
		playerContext.clearRect(0, 0, width, height);
		bdCanvas.style.display = "none";
		tileCanvas.style.display = "none";
		// bdContext.clearRect(0, 0, width, height);
		// tileContext.clearRect(0, 0, width, height);
		transitionContext.globalCompositeOperation = "destination-in";
		// var startX = ((width - canvasWidth) / 2);
		// var startY = ((height - canvasHeight) / 2);
		var startX = ((player.x + (player.w / 2)) - viewPortX) - ((canvasWidth) / 2);
		var startY = ((player.y + (player.h / 2)) - viewPortY) - ((canvasHeight) / 2);
		transitionContext.beginPath();
		transitionContext.rect(startX, startY, canvasWidth, canvasHeight);
		transitionContext.fillStyle = "black";
		transitionContext.fill();
		playerContext.drawImage(transitionCanvas, 0, 0);

		stage += (FPS * 2) * (dt / 1000);
		if (stage > FPS * 2) {
			stage = 0;
			runGameLoop = true;
			transitionRoom = null;
			transitionBetweenRooms = false;
			bdCanvas.style.display = "initial";
			tileCanvas.style.display = "initial";
			player.dc = window.performance.now();
		}
	}
}

function enterRoom(room, direction, position) {
	transitionDirection = direction;
	transitionPosition = position;
	transitionBetweenRooms = true;
	transitionRoom = room;
	runGameLoop = false;
	if (room.map === null) {
		playerSizedRoom(room);
	}
}
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
	var x = ((currentRoom.x + (modulus(modulus(modulus(player.x), 10), 1))) * 16);
	var y = ((currentRoom.y + (modulus(modulus(modulus(player.y), 10), 1))) * 16);
	if (x - miniViewPortX + deadZoneX > canvas.width) {
		miniViewPortX = x - (canvas.width - deadZoneX);
	} else if (x - deadZoneX < miniViewPortX) {
		miniViewPortX = x - deadZoneX;
	}
	if (y - miniViewPortY + deadZoneY > canvas.height) {
		miniViewPortY = y - (canvas.height - deadZoneY);
	} else if (y - deadZoneY < miniViewPortY) {
		miniViewPortY = y - deadZoneY;
	}
	miniViewPortY = ~~ (0.5 + miniViewPortY);
	miniViewPortY = ~~ (0.5 + miniViewPortY);
}
var world = null;
var currentRoom = null;

var chanceOfAddingDoor = 0.2;
var crColorIndex = 0;
var rColors = [{
	bg: "#BBBBBB",
	bd: "#A0A0A0",
	o: "#CFCFCF",
	l: "#FFFFFF",
	name: "Dungeon"
}, {
	bd: "#990000",
	bg: "#FF3333",
	o: "#FF0000",
	l: "#FF0000",
	name: "Fire"
}, {
	bd: "#006600",
	bg: "#00BB00",
	o: "#00BB00",
	l: "#00FF00",
	name: "Air"
}, {
	bd: "#000066",
	bg: "#3333FF",
	o: "#0000FF",
	l: "#0000FF",
	name: "Water"
}, {
	bg: "#9F9F9F",
	bd: "#555555",
	o: "#555555",
	l: "#000000",
	name: "Earth"
}];

function startAt(x, y, r) {
	world.f.length = 0;
	world.f.push({
		x: x,
		y: y
	});
	world.cr = r;
	world.r.push(r);
}

function startNewRegion(r) {
	var trapped = true;
	var f = getFrontiersForAllRooms();
	var test = [];
	var frontier = null;
	while (trapped) {
		var emptySides = 0;
		frontier = getRandom(f);
		test.length = 0;
		test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
		for (var i = 0; i < 4; i++) {
			if (test[i] === null) {
				emptySides++;
			}
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	startAt(frontier.x, frontier.y, r);
}

function getRandom(array) {
	var index = random(0, array.length - 1);
	return array[index];
}

function getFrontiersForAllRooms() {
	var results = [];
	for (var i = 0; i < world.rooms.length; i++) {
		results = addBorderingFrontiers(results, world.rooms[i]);
	}
	return results;
}

function addBorderingFrontiers(array, room) {
	var roomX = room.x;
	while (roomX < room.x + room.mw) {
		if (canPlaceRoom(roomX, room.y - 1, 1, 1)) {
			array.push({
				x: roomX,
				y: room.y - 1
			});
		}
		if (canPlaceRoom(roomX, room.y + room.mh, 1, 1)) {
			array.push({
				x: roomX,
				y: room.y + room.mh
			});
		}
		roomX++;
	}
	var roomY = room.x;
	while (roomY < room.y + room.mh) {
		if (canPlaceRoom(roomY, room.x - 1, 1, 1)) {
			array.push({
				x: roomY,
				y: room.x - 1
			});
		}
		if (canPlaceRoom(roomY, room.x + room.mw, 1, 1)) {
			array.push({
				x: roomY,
				y: room.x + room.mw
			});
		}
		roomY++;
	}
	return array;
}

function canPlaceRoom(x, y, width, height) {
	return (isInBounds(x, y, width, height)) && !isInAnyRoom(x, y, width, height);
}

function isInBounds(x, y, width, height) {
	return x > 0 && y > 0 && x + width < world.width && y + height < world.height;
}

function isInAnyRoom(x, y, width, height) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.x > x + width - 1 || room.x + room.mw - 1 < x || room.y > y + height - 1 || room.y + room.mh - 1 < y) {
			i++;
			continue;
		}
		return true;
	}
	return false;
}

function addDoors(room) {
	var d = 0;
	var door = null;
	var stop = false;
	var times = 100;
	while (world.rooms.length > 1 && !stop) {
		d = 0;
		d = d + addDoorsAlongNorthWall(room);
		d = d + addDoorsAlongSouthWall(room);
		d = d + addDoorsAlongWestWall(room);
		d = d + addDoorsAlongEastWall(room);
		if (room.r.rooms.length === 1 && d > 0) {
			stop = true;
		}
		for (var i = 0; i < room.d.length; i++) {
			door = room.d[i];
			if (o(door, room).r === room.r) {
				stop = true;
			}
		}
		times--;
		if (times === 0) {
			stop = true;
		}
		// console.log(times, stop)
	}
}

function addDoorsAlongNorthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
	var array = [];
	var x = room.x;
	while (x < room.x + room.mw) {
		thisRoom = getRoom(x, room.y - 1);
		if (thisRoom !== null) {
			array.push({
				x: x,
				y: room.y,
				o: thisRoom
			});
		}
		x++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "N", room, object.o);
			door2 = Door(object.x, object.y - 1, "S", object.o, room);
			room.d.push(door);
			door.o = door2;
			door2.o = door;
			// object.o.d.push(door);
			object.o.d.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongSouthWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
	var array = [];
	var x = room.x;
	while (x < room.x + room.mw) {
		thisRoom = getRoom(x, room.y + room.mh);
		if (thisRoom !== null) {
			array.push({
				x: x,
				y: room.y + room.mh - 1,
				o: thisRoom
			});
		}
		x++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "S", room, object.o);
			door2 = Door(object.x, object.y + 1, "N", object.o, room);
			room.d.push(door);
			door.o = door2;
			door2.o = door;
			// object.o.d.push(door);
			object.o.d.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongWestWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
	var array = [];
	var y = room.y;
	while (y < room.y + room.mh) {
		thisRoom = getRoom(room.x - 1, y);
		if (thisRoom !== null) {
			array.push({
				x: room.x,
				y: y,
				o: thisRoom
			});
		}
		y++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "W", room, object.o);
			door2 = Door(object.x - 1, object.y, "E", object.o, room);
			room.d.push(door);
			door.o = door2;
			door2.o = door;
			// object.o.d.push(door);
			object.o.d.push(door2);
			i++;
		}
	}
	return i;
}

function addDoorsAlongEastWall(room) {
	var object = null;
	var thisRoom = null;
	var door = null;
	var door2 = null;
	var array = [];
	var y = room.y;
	while (y < room.y + room.mh) {
		thisRoom = getRoom(room.x + room.mw, y);
		if (thisRoom !== null) {
			array.push({
				x: room.x + room.mw - 1,
				y: y,
				o: thisRoom
			});
		}
		y++;
	}
	var i = 0;
	for (var e = 0; e < array.length; e++) {
		object = array[e];
		var hasDoor = false;
		for (var t = 0; t < room.d.length; t++) {
			if (room.d[t].r2 === object.o) {
				hasDoor = true;
			}
		}
		if (!(Math.random() > chanceOfAddingDoor || indexOf(room.d, object) >= 0) && !hasDoor) {
			door = Door(object.x, object.y, "E", room, object.o);
			door2 = Door(object.x + 1, object.y, "W", object.o, room);
			door.o = door2;
			door2.o = door;
			room.d.push(door);
			// object.o.d.push(door);
			object.o.d.push(door2);
			i++;
		}
	}
	return i;
}


function getRoom(x, y) {
	var room = null;
	var i = 0;
	while (i < world.rooms.length) {
		room = world.rooms[i];
		if (room.x > x || room.x + room.mw - 1 < x || room.y > y || room.y + room.mh - 1 < y) {
			i++;
			continue;
		}
		return room;
	}
	return null;
}

function getDoor(room, x, y, dir) {
	var door = null;
	for (var i = 0; i < room.d.length; i++) {
		door = room.d[i];
		if (door.dir === dir && door.x === room.x + x && door.y === room.y + y) {
			return door;
		}
	}
	return null;
}

function createRooms(numberOfRooms) {
	var i = 0;
	var length = world.rooms.length;
	while (i++ < numberOfRooms * 10 && world.rooms.length < length + numberOfRooms) {
		createRoom();
	}
}

function createRoom() {
	// if (world.f.length > 0) {
	var frontier = getRandom(world.f);
	try {
		addRoom(growRoom(frontier.x, frontier.y));
	} catch (e) {
		console.log(world, frontier, e);
	}
	// }
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.x, room.y, room.mw, room.mh)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.f = addBorderingFrontiers(array, room);
	if (world.f.length === 0) {
		console.log(array, room, addBorderingFrontiers(array, room));
	}
	room.c = world.cr.color;
	world.rooms.push(room);
	world.cr.rooms.push(room);
	addDoors(room);
}

function addBorderingFrontiers(array, room) {
	var x = room.x;
	while (x < room.x + room.mw) {
		if (canPlaceRoom(x, room.y - 1, 1, 1)) {
			array.push({
				"x": x,
				"y": room.y - 1
			});
		}
		if (canPlaceRoom(x, room.y + room.mh, 1, 1)) {
			array.push({
				"x": x,
				"y": room.y + room.mh
			});
		}
		x++;
	}
	var y = room.y;
	while (y < room.y + room.mh) {
		if (canPlaceRoom(room.x - 1, y, 1, 1)) {
			array.push({
				"x": room.x - 1,
				"y": y
			});
		}
		if (canPlaceRoom(room.x + room.mw, y, 1, 1)) {
			array.push({
				"x": room.x + room.mw,
				"y": y
			});
		}
		y++;
	}
	return array;
}

function removeFrontiers(array, room) {
	for (var i = 0; i < world.f.length; i++) {
		if (!(world.f[i].x >= room.x - 1 && world.f[i].x <= room.x + room.mw && world.f[i].y >= room.y && world.f[i].y <= room.y + room.mh - 1)) {
			if (!(world.f[i].x >= room.x && world.f[i].x <= room.x + room.mw - 1 && world.f[i].y >= room.y - 1 && world.f[i].y <= room.y + room.mh)) {
				array.push(world.f[i]);
			}
		}
	}
	return array;
}

function growRoom(x, y) {
	var var1 = 0;
	var width = 1;
	var height = 1;
	while (var1++ < 25 && (width < world.cr.maxW || height < world.cr.maxH) && Math.random() < 0.9) {
		var growth = parseInt(Math.random() * 4);
		if (growth === 0) {
			if (height < world.cr.maxH && (canPlaceRoom(x, y - 1, width, height + 1))) {
				y--;
				height++;
			}
		}
		if (growth === 1) {
			if (height < world.cr.maxH && (canPlaceRoom(x, y, width, height + 1))) {
				height++;
			}
		}
		if (growth === 2) {
			if (width < world.cr.maxW && (canPlaceRoom(x - 1, y, width + 1, height))) {
				x--;
				width++;
			}
		}
		if (growth === 3) {
			if (width < world.cr.maxW && (canPlaceRoom(x, y, width + 1, height))) {
				width++;
			}
		}
	}
	return Room(x, y, width, height, world.cr);
}

function Room(x, y, width, height, r) {
	return {
		x: x,
		y: y,
		mw: width,
		mh: height,
		c: null,
		r: r,
		s: -1,
		sx: 0,
		sy: 0,
		sr: false,
		v: false,
		d: [],
		map: null
	};
}

function Door(x, y, direction, r1, r2) {
	return {
		x: x,
		y: y,
		dt: -1,
		dir: direction,
		r1: r1,
		r2: r2,
		o: null,
	};
}

function clearDoorTypes() {
	var room = null;
	var door = null;
	for (var i = 0; i < world.rooms.length; i++) {
		room = world.rooms[i];
		room.s = -1;
		for (var e = 0; e < room.d.length; e++) {
			door = room.d[e];
			door.dt = -1;
		}
	}
}

function assignDoorTypes() { // FIXME
	var door = null;
	var r1 = null;
	var r2 = null;
	var room = null;
	for (var i = 0; i < world.r.length; i++) {
		r1 = world.r[i];
		room = getRandom(r1.rooms);
		room.s = (i + 1) % rColors.length;
		for (var e = 0; e < r1.rooms.length; e++) {
			room = r1.rooms[e];
			for (var r = 0; r < room.d.length; r++) {
				door = room.d[r];
				r2 = o(door, room).r;
				if (r2 !== r1) {
					if (door.o.dt === -1) {
						door.o.dt = (i + 1) % rColors.length;
					}
				}
			}
		}
	}
}

function collectKey(room) {
	if (player.keys.indexOf(room.s) === -1 && room.s > -1) {
		player.keys.push(room.s);
		unlRooms();
	}
}

function unlRooms() {
	for (var i = 0; i < world.rooms.length; i++) {
		var hasDoor = false;
		var room = world.rooms[i];
		if (player.keys.indexOf(room.s) > -1) {
			room.s = -1;
			if (room.map !== null) {
				var index = room.map.map.indexOf(9);
				if (index > -1) {
					room.map.map[index] = 0;
				}
			}
		}
		for (var e = 0; e < room.d.length; e++) {
			var door = room.d[e];
			if (player.keys.indexOf(door.dt) > -1) {
				door.dt = -1;
				hasDoor = true;
			}
		}
		if (hasDoor && room.map !== null) {
			if (room.s === -1) {}
			// for (var r = 0; r < player.keys.length; r++) {
			// 	var index = room.map.map.indexOf(player.keys[r] + 1);
			// 	while (index > 0) {
			// 		room.map.map[index] = 0;
			// 	}
			// }
			for (var r = 0; r < room.map.map.length; r++) {
				if (room.map.map[r] > 1) {
					if (player.keys.indexOf(room.map.map[r] - 1) > -1) {
						room.map.map[r] = 0;
					}
				}
			}
		}
	}
}

function o(door, room) {
	return door.r1 === room ? door.r2 : door.r1;
}

function create() {
	world = {
		width: 0,
		height: 0,
		rooms: [],
		f: [],
		r: [],
		cr: 0,

	};
	crColorIndex = 0;
	world.width = 80;
	world.height = 48;
	startAt(40, 24, nextRegion());
	createRooms(1);
}

function nextRegion() {
	var r = Region(rColors[crColorIndex], parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, parseInt(Math.random() * 3) + parseInt(Math.random() * 3) + 1, crColorIndex);
	crColorIndex = (crColorIndex + 1) % rColors.length;
	return r;
}

function Region(color, maxWidth, maxHeight, id) {
	return {
		color: color,
		maxW: maxWidth,
		maxH: maxHeight,
		id: id,
		rooms: []
	};
}

function startWorld() {
	create();
}

function addRoomToWorld() {
	createRoom();
}

function addRegion() {
	startNewRegion(nextRegion());
}

function d() {
	clearDoorTypes();
	assignDoorTypes();
}
})(window,document);