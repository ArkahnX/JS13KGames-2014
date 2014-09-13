(function(window,document){

// var WAVE_SPS = 44100; // Samples per second
// var WAVE_CHAN = 2; // Channels
// var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively
// var s3k = 32768;
// var s255 = 255;
// var audioCtx = null;

// // Oscillators
// function osc_sin(value) {
// 	return Math.sin(value * 6.283184);
// }

// function osc_square(value) {
// 	if (osc_sin(value) < 0) return -1;
// 	return 1;
// }

// function osc_saw(value) {
// 	return (value % 1) - 0.5;
// }

// function osc_tri(value) {
// 	var v2 = (value % 1) * 4;
// 	if (v2 < 2) return v2 - 1;
// 	return 3 - v2;
// }

// // Array of oscillator functions
// var oscillators =
// 	[
// 		osc_sin,
// 		osc_square,
// 		osc_saw,
// 		osc_tri
// 	];

// function getnotefreq(n) {
// 	return 0.00390625 * Math.pow(1.059463094, n - 128);
// }

// function genBuffer(waveSize, callBack) {
// 	setTimeout(function() {
// 		// Create the channel work buffer
// 		var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
// 		var b = buf.length - 2;
// 		var iterate = function() {
// 			var begin = new Date();
// 			var count = 0;
// 			while (b >= 0) {
// 				buf[b] = 0;
// 				buf[b + 1] = 128;
// 				b -= 2;
// 				count += 1;
// 				if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
// 					setTimeout(iterate, 0);
// 					return;
// 				}
// 			}
// 			setTimeout(function() {
// 				callBack(buf);
// 			}, 0);
// 		};
// 		setTimeout(iterate, 0);
// 	}, 0);
// }

// function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
// 	var p1 = (instr.ft * rowLen) >> 1;
// 	var t1 = instr.fm / s255;

// 	var n1 = 0;
// 	var iterate = function() {
// 		var beginning = new Date();
// 		var count = 0;
// 		while (n1 < waveSamples - p1) {
// 			var b1 = 4 * n1;
// 			var l = 4 * (n1 + p1);

// 			// Left channel = left + right[-p1] * t1
// 			var x1 = chnBuf[l] + (chnBuf[l + 1] << 8) +
// 				(chnBuf[b1 + 2] + (chnBuf[b1 + 3] << 8) - s3k) * t1;
// 			chnBuf[l] = x1 & s255;
// 			chnBuf[l + 1] = (x1 >> 8) & s255;

// 			// Right channel = right + left[-p1] * t1
// 			x1 = chnBuf[l + 2] + (chnBuf[l + 3] << 8) +
// 				(chnBuf[b1] + (chnBuf[b1 + 1] << 8) - s3k) * t1;
// 			chnBuf[l + 2] = x1 & s255;
// 			chnBuf[l + 3] = (x1 >> 8) & s255;
// 			++n1;
// 			count += 1;
// 			if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
// 				setTimeout(iterate, 0);
// 				return;
// 			}
// 		}
// 		setTimeout(callBack, 0);
// 	};
// 	setTimeout(iterate, 0);
// }


// function MusicGenerator(song) {
// 	return {
// 		song: song,
// 		waveSize: WAVE_SPS * song.songLen // Total song size (in samples)
// 	}
// }

// function createAudioBuffer(music, callBack) {
// 	getAudioGenerator(music, function(ag) {
// 		getAudioBuffer(ag, callBack);
// 	});
// }

// function getAudioBuffer(ag, callBack) {
// 	if (audioCtx === null) {
// 		audioCtx = new AudioContext();
// 	}
// 	var mixBuf = ag.mixBuf;
// 	var waveSize = ag.waveSize;

// 	var waveBytes = waveSize * WAVE_CHAN * 2;
// 	var buffer = audioCtx.createBuffer(WAVE_CHAN, ag.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
// 	var lchan = buffer.getChannelData(0);
// 	var rchan = buffer.getChannelData(1);
// 	var b = 0;
// 	var iterate = function() {
// 		var beginning = new Date();
// 		var count = 0;
// 		while (b < (waveBytes / 2)) {
// 			var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - s3k);
// 			y = y < -s3k ? -s3k : (y > 32767 ? 32767 : y);
// 			lchan[b] = y / s3k;
// 			y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - s3k);
// 			y = y < -s3k ? -s3k : (y > 32767 ? 32767 : y);
// 			rchan[b] = y / s3k;
// 			b += 1;
// 			count += 1;
// 			if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
// 				setTimeout(iterate, 0);
// 				return;
// 			}
// 		}
// 		setTimeout(function() {
// 			callBack(buffer);
// 		}, 0);
// 	};
// 	setTimeout(iterate, 0);
// }

// function AudioGenerator(mixBuf) {
// 	return {
// 		mixBuf: mixBuf,
// 		waveSize: mixBuf.length / WAVE_CHAN / 2
// 	};
// }

// function getAudioGenerator(music, callBack) {
// 	genBuffer(music.waveSize, function(mixBuf) {
// 		var t = 0;
// 		var recu = function() {
// 			if (t < music.song.songData.length) {
// 				t += 1;
// 				generateTrack(music, music.song.songData[t - 1], mixBuf, recu);
// 			} else {
// 				callBack(AudioGenerator(mixBuf));
// 			}
// 		};
// 		recu();
// 	});
// }

// function SoundGenerator(instr, rowLen) {
// 	return {
// 		instr: instr,
// 		rowLen: rowLen || 5605,

// 		osc_lfo: oscillators[instr.lw],
// 		osc1: oscillators[instr.ow],
// 		osc2: oscillators[instr.pw],
// 		attack: instr.ea,
// 		sustain: instr.es,
// 		release: instr.er,
// 		panFreq: Math.pow(2, instr.fp - 8) / rowLen,
// 		lfoFreq: Math.pow(2, instr.lr - 8) / rowLen
// 	}
// }

// function generateTrack(music, instr, mixBuf, callBack) {
// 	genBuffer(music.waveSize, function(chnBuf) {
// 		// Preload/precalc some properties/expressions (for improved performance)
// 		var waveSamples = music.waveSize,
// 			waveBytes = music.waveSize * WAVE_CHAN * 2,
// 			rowLen = music.song.rowLen,
// 			endPattern = music.song.endPattern,
// 			soundGen = SoundGenerator(instr, rowLen);

// 		var currentpos = 0;
// 		var p = 0;
// 		var row = 0;
// 		var recordSounds = function() {
// 			var beginning = new Date();
// 			while (true) {
// 				if (row === 32) {
// 					row = 0;
// 					p += 1;
// 					continue;
// 				}
// 				if (p === endPattern - 1) {
// 					setTimeout(delay, 0);
// 					return;
// 				}
// 				var cp = instr.p[p];
// 				if (cp) {
// 					var n = instr.c[cp - 1].n[row];
// 					if (n) {
// 						SoundGeneratorGenSound(soundGen, n, chnBuf, currentpos);
// 					}
// 				}
// 				currentpos += rowLen;
// 				row += 1;
// 				if (new Date() - beginning > MAX_TIME) {
// 					setTimeout(recordSounds, 0);
// 					return;
// 				}
// 			}
// 		};

// 		var delay = function() {
// 			applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
// 		};

// 		var b2 = 0;
// 		var finalize = function() {
// 			var beginning = new Date();
// 			var count = 0;
// 			// Add to mix buffer
// 			while (b2 < waveBytes) {
// 				var x2 = mixBuf[b2] + (mixBuf[b2 + 1] << 8) + chnBuf[b2] + (chnBuf[b2 + 1] << 8) - s3k;
// 				mixBuf[b2] = x2 & s255;
// 				mixBuf[b2 + 1] = (x2 >> 8) & s255;
// 				b2 += 2;
// 				count += 1;
// 				if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
// 					setTimeout(finalize, 0);
// 					return;
// 				}
// 			}
// 			setTimeout(callBack, 0);
// 		};
// 		setTimeout(recordSounds, 0);
// 	});
// }

// function SoundGeneratorGenSound(soundGen, n, chnBuf, currentpos) {
// 	var marker = new Date();
// 	var c1 = 0;
// 	var c2 = 0;

// 	// Precalculate frequencues
// 	var o1t = getnotefreq(n + (soundGen.instr.oo - 8) * 12 + soundGen.instr.od) * (1 + 0.0008 * soundGen.instr.oe);
// 	var o2t = getnotefreq(n + (soundGen.instr.po - 8) * 12 + soundGen.instr.pd) * (1 + 0.0008 * soundGen.instr.pe);

// 	// State variable init
// 	var q = soundGen.instr.fr / s255;
// 	var low = 0;
// 	var band = 0;
// 	for (var j = soundGen.attack + soundGen.sustain + soundGen.release - 1; j >= 0; --j) {
// 		var k = j + currentpos;

// 		// LFO
// 		var lfor = soundGen.osc_lfo(k * soundGen.lfoFreq) * soundGen.instr.la / 512 + 0.5;

// 		// Envelope
// 		var e = 1;
// 		if (j < soundGen.attack)
// 			e = j / soundGen.attack;
// 		else if (j >= soundGen.attack + soundGen.sustain)
// 			e -= (j - soundGen.attack - soundGen.sustain) / soundGen.release;

// 		// Oscillator 1
// 		var t = o1t;
// 		if (soundGen.instr.lf) t += lfor;
// 		if (soundGen.instr.ox) t *= e * e;
// 		c1 += t;
// 		var rsample = soundGen.osc1(c1) * soundGen.instr.ov;

// 		// Oscillator 2
// 		t = o2t;
// 		if (soundGen.instr.px) t *= e * e;
// 		c2 += t;
// 		rsample += soundGen.osc2(c2) * soundGen.instr.pv;

// 		// Noise oscillator
// 		if (soundGen.instr.nf) rsample += (2 * Math.random() - 1) * soundGen.instr.nf * e;

// 		rsample *= e / s255;

// 		// State variable filter
// 		var f = soundGen.instr.fq;
// 		if (soundGen.instr.lq) f *= lfor;
// 		f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
// 		low += f * band;
// 		var high = q * (rsample - band) - low;
// 		band += f * high;
// 		var test = soundGen.instr.ff;
// 		if (test === 1) { // Hipass
// 			rsample = high;
// 		}
// 		if (test === 2) { // Lopass
// 			rsample = low;
// 		}
// 		if (test === 3) { // Bandpass
// 			rsample = band;
// 		}
// 		if (test === 4) { // Notch
// 			rsample = low + high;
// 		}

// 		// Panning & master volume
// 		t = osc_sin(k * soundGen.panFreq) * soundGen.instr.ft / 512 + 0.5;
// 		rsample *= 39 * soundGen.instr.em;

// 		// Add to 16-bit channel buffer
// 		k = k * 4;
// 		if (k + 3 < chnBuf.length) {
// 			var x = chnBuf[k] + (chnBuf[k + 1] << 8) + rsample * (1 - t);
// 			chnBuf[k] = x & s255;
// 			chnBuf[k + 1] = (x >> 8) & s255;
// 			x = chnBuf[k + 2] + (chnBuf[k + 3] << 8) + rsample * t;
// 			chnBuf[k + 2] = x & s255;
// 			chnBuf[k + 3] = (x >> 8) & s255;
// 		}
// 	}
// }

// // function createSFXBuffer(sound, n, callBack) {
// // 	getSFXGenerator(sound, n, function(ag) {
// // 		getAudioBuffer(ag, callBack);
// // 	});
// // }

// // function getSFXGenerator(sound, n, callBack) {
// // 	var bufferSize = (sound.attack + sound.sustain + sound.release - 1) + (32 * sound.rowLen);
// // 	genBuffer(bufferSize, function(buffer) {
// // 		genSFX(sound, n, buffer, 0);
// // 		applyDelay(buffer, bufferSize, sound.instr, sound.rowLen, function() {
// // 			callBack(AudioGenerator(buffer));
// // 		});
// // 	});
// // };

// // function genSFX(sound, n, chnBuf, currentpos) {
// // 		var marker = new Date();
// // 		var c1 = 0;
// // 		var c2 = 0;

// // 		// Precalculate frequencues
// // 		var o1t = getnotefreq(n + (sound.instr.oo - 8) * 12 + sound.instr.od) * (1 + 0.0008 * sound.instr.oe);
// // 		var o2t = getnotefreq(n + (sound.instr.po - 8) * 12 + sound.instr.pd) * (1 + 0.0008 * sound.instr.pe);

// // 		// State variable init
// // 		var q = sound.instr.fr / s255;
// // 		var low = 0;
// // 		var band = 0;
// // 		for (var j = sound.attack + sound.sustain + sound.release - 1; j >= 0; --j) {
// // 			var k = j + currentpos;

// // 			// LFO
// // 			var lfor = sound.osc_lfo(k * sound.lfoFreq) * sound.instr.la / 512 + 0.5;

// // 			// Envelope
// // 			var e = 1;
// // 			if (j < sound.attack)
// // 				e = j / sound.attack;
// // 			else if (j >= sound.attack + sound.sustain)
// // 				e -= (j - sound.attack - sound.sustain) / sound.release;

// // 			// Oscillator 1
// // 			var t = o1t;
// // 			if (sound.instr.lf) t += lfor;
// // 			if (sound.instr.ox) t *= e * e;
// // 			c1 += t;
// // 			var rsample = sound.osc1(c1) * sound.instr.ov;

// // 			// Oscillator 2
// // 			t = o2t;
// // 			if (sound.instr.px) t *= e * e;
// // 			c2 += t;
// // 			rsample += sound.osc2(c2) * sound.instr.pv;

// // 			// Noise oscillator
// // 			if (sound.instr.nf) rsample += (2 * Math.random() - 1) * sound.instr.nf * e;

// // 			rsample *= e / s255;

// // 			// State variable filter
// // 			var f = sound.instr.fq;
// // 			if (sound.instr.lq) f *= lfor;
// // 			f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
// // 			low += f * band;
// // 			var high = q * (rsample - band) - low;
// // 			band += f * high;
// //             var test = sound.instr.ff;
// //             if(test === 1) { // Hipass
// //                 rsample = high;
// //             }
// //             if(test === 2) { // Lopass
// //                 rsample = low;
// //             }
// //             if(test === 3) { // Bandpass
// //                 rsample = band;
// //             }
// //             if(test === 4) { // Notch
// //                 rsample = low + high;
// //             }

// // 			// Panning & master volume
// // 			t = osc_sin(k * sound.panFreq) * sound.instr.ft / 512 + 0.5;
// // 			rsample *= 39 * sound.instr.em;

// // 			// Add to 16-bit channel buffer
// // 			k = k * 4;
// // 			if (k + 3 < chnBuf.length) {
// // 				var x = chnBuf[k] + (chnBuf[k + 1] << 8) + rsample * (1 - t);
// // 				chnBuf[k] = x & s255;
// // 				chnBuf[k + 1] = (x >> 8) & s255;
// // 				x = chnBuf[k + 2] + (chnBuf[k + 3] << 8) + rsample * t;
// // 				chnBuf[k + 2] = x & s255;
// // 				chnBuf[k + 3] = (x >> 8) & s255;
// // 			}
// // 		}
// // 	};
var miniMapPixelSize = 150;

function drawMap() {
	parseViewPort();
	colorize(tileContext, currentRoom.c.bd, currentRoom.c.bd, 2);
	tileContext.fillRect(0, 0, tileCanvas.width, tileCanvas.height);
	tileContext.fillStyle = currentRoom.c.bg;
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
	var checkedRoom = {};

	for (var y = y1; y < y2; y++) {
		var rectWidth = 0;
		var startX = -currentMapTiles * 16 * 2;
		var hasFloor = 0;
		var topTile;
		colorize(tileContext, currentRoom.c.bg, false, false);
		for (var x = x1; x < x2; x++) {
			var coord = coordinate(x, y, currentMapTiles);
			if (currentMap[coord] === 1) {
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
			if (currentMap[coord] !== 1 || x === x2 - 1) {
				var canvasX = startX;
				var canvasY = (y * 16) - viewPortY;
				if (hasFloor) {
					drawCanvasRecta(tileContext, true, false, canvasX, canvasY - (16 * 0.3125), rectWidth, 16 + (16 * 0.3125));
				} else {
					drawCanvasRecta(tileContext, true, false, canvasX, canvasY, rectWidth, 16);
				}
			}
			if (currentMap[coord] !== 1 || x === x2 - 1) {
				rectWidth = 0;
				startX = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}

	for (var y = y1; y < y2; y++) {
		for (var x = x1; x < x2; x++) {
			var coord = coordinate(x, y, currentMapTiles);
			var tile = currentMap[coord];
			if (tile > 1) {
				if (tile === 9 && currentRoom.s > -1) {
					colorize(tileContext, rColors[currentRoom.s].l, rColors[currentRoom.s].bd, 2);
					drawCircle(tileContext, (x * 16) + (16 / 2) - viewPortX-8, (y * 16) + (16 / 2) - viewPortY, 8, true);
				} else if (tile !== 9 && tile !== 10) {
					colorize(tileContext, rColors[tile - 2].l, false, false);
					drawCanvasRecta(tileContext, true, false, (x * 16) - viewPortX, (y * 16) - viewPortY - (16 * 0.3125), 16, 16 + (16 * 0.3125));
				}
			}
		}
	}

	for (var x = 0; x < mwidth / 10; x++) {
		for (var y = 0; y < mheight / 10; y++) {
			var northDoor = getDoor(currentRoom, x, y, "N");
			var eastDoor = getDoor(currentRoom, x, y, "E");
			var southDoor = getDoor(currentRoom, x, y, "S");
			var westDoor = getDoor(currentRoom, x, y, "W");
			if (northDoor) {
				drawDoorArrow(northDoor, x, y);
			}
			if (eastDoor) {
				drawDoorArrow(eastDoor, x, y);
			}
			if (southDoor) {
				drawDoorArrow(southDoor, x, y);
			}
			if (westDoor) {
				drawDoorArrow(westDoor, x, y);
			}
		}
	}

	parseVerticalLines(x1, y1, x2, y2, 1);
	parseVerticalLines(x1, y1, x2, y2, 4);
	parseHorizontalLines(x1, y1, x2, y2, 2);
	parseHorizontalLines(x1, y1, x2, y2, 8);
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
			if ((currentMap[coordinate(x, y, currentMapTiles)] !== 0 && currentMap[coordinate(x, y, currentMapTiles)] !== 9) && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					if (topTile === 0) {
						hasFloor = 1;
					}
					startPosition = (y * 16) - viewPortY;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || y === y2 - 1 || mainTile > 0) {
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
					drawCanvasLine(bdContext, false, true, startX, canvasY, startX, canvasY2 + (16 * 0.1875));
				} else {
					drawCanvasLine(bdContext, false, true, startX, canvasY, startX, canvasY2);
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || y === y2 - 1 || mainTile > 0) {
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
			if ((currentMap[coordinate(x, y, currentMapTiles)] !== 0 && currentMap[coordinate(x, y, currentMapTiles)] !== 9) && mainTile < 1) {
				rectSize += 1 * 16;
				if (startPosition === -currentMapTiles * 16 * 2) {
					startPosition = (x * 16) - viewPortX;
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === x2 - 1 || mainTile > 0) {
				var canvasX = startPosition;
				var canvasY = (y * 16) - viewPortY;
				var canvasX2 = canvasX + rectSize;
				var canvasY2 = ((y + 1) * 16) - viewPortY;
				if (type === 2) {
					if (hasFloor === 1) {
						drawCanvasLine(bdContext, false, true, canvasX, canvasY - (16 * 0.3125), canvasX2, canvasY - (16 * 0.3125));
						drawCanvasLine(bdContext, false, true, canvasX, canvasY + (16 * 0.1875), canvasX2, canvasY + (16 * 0.1875));
					} else {
						drawCanvasLine(bdContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
					}
				} else if (type === 8) {
					drawCanvasLine(bdContext, false, true, canvasX, canvasY2, canvasX2, canvasY2);
				}
			}
			if (currentMap[coordinate(x, y, currentMapTiles)] === 0 || currentMap[coordinate(x, y, currentMapTiles)] === 9 || x === x2 - 1 || mainTile > 0) {
				rectSize = 0;
				startPosition = -currentMapTiles * 16 * 2;
				hasFloor = 0;
			}
		}
	}
}

// var faviconEl = document.getElementById('f');
// var canvas = document.createElement('canvas');
// canvas.height = 16;
// canvas.width = 16;
// var ctx = canvas.getContext('2d');
var miniMapPlayerX = 0;
var miniMapPlayerY = 0;

function drawWorld() {
	minimapCanvas.width = miniMapPixelSize;
	minimapCanvas.height = miniMapPixelSize;
	parseMinimapViewport();
	miniMapPlayerX = (currentRoom.x * 16) + (modulus(modulus(modulus(player.x), 10), 1) * 16);
	miniMapPlayerY = (currentRoom.y * 16) + (modulus(modulus(modulus(player.y), 10), 1) * 16);
	minimapContext.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
	drawnDoors.length = 0;
	colorize(minimapContext, "#000", false, 2);
	for (var r = 0; r < world.r.length; r++) {
		for (var i = 0; i < world.r[r].rooms.length; i++) {
			var room = world.r[r].rooms[i];
			var roomX = (room.x * 16) - miniViewPortX;
			var roomY = (room.y * 16) - miniViewPortY;
			if (roomX + (room.mw * 16) > 0 && roomY + (room.mh * 16) > 0 && roomX < minimapCanvas.width && roomY < minimapCanvas.height) {
				drawCanvasRecta(minimapContext, true, false, roomX, roomY, room.mw * 16, room.mh * 16);
			}
		}
	}
	forEachRoom("bg", "bd", function(room, roomX, roomY) {
		if (room.v) {
			drawCanvasRecta(minimapContext, true, true, roomX, roomY, room.mw * 16, room.mh * 16);
		}
	}, minimapContext);
	forEachRoom("bd", 0, function(room, roomX, roomY) {
		if (room.r.u && !room.v) {
			drawCanvasRecta(minimapContext, true, false, roomX, roomY, room.mw * 16, room.mh * 16);
		}
	}, minimapContext);
	// ctx.clearRect(0, 0, 16, 16);
	// forEachRoom("bg", "bd", function(room, roomX, roomY) {
		// if (room.v) {
			// drawCanvasRecta(ctx, true, true, roomX / 16 * 2, roomY / 16 * 2, room.mw * 2, room.mh * 2);
		// }
	// }, ctx);
	// faviconEl.href = canvas.toDataURL();
	forEachRoom(0, "bg", drawDoors, minimapContext);
	forEachRoom(0, 0, drawIcons, minimapContext);
	drawPlayer();
}

function forEachRoom(fillStyle, strokeStyle, fn, context) {
	var canvasContext = context || minimapContext;
	for (var r = 0; r < world.r.length; r++) {
		colorize(canvasContext, world.r[r].color[fillStyle] || "rgba(0,0,0,0)", world.r[r].color[strokeStyle] || "rgba(0,0,0,0)", false);
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
		var color2 = null;
		for (var i = 0; i < room.d.length; i++) {
			door = room.d[i];
			if (door.dt > -1) {
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
				colorize(minimapContext, rColors[door.dt].l, rColors[door.dt].bd, 2);
				drawCircle(minimapContext, (16 * door.x) + xModifier - miniViewPortX, (16 * door.y) + yModifier - miniViewPortY, 3, true);
			}
		}
		if (room.s > -1) {
			colorize(minimapContext, rColors[room.s].bd, rColors[room.s].l, 2);
			drawCircle(minimapContext, (16 * (room.x + room.mw / 2)) - 3 - miniViewPortX, (16 * (room.y + room.mh / 2)) - miniViewPortY, 3, true);
		}
	}
}

function drawCircle(context, centerX, centerY, radius, bd) {
	context.beginPath();
	context.arc(centerX + radius, centerY, radius, 0, 2 * Math.PI, false);
	context.fill();
	if (bd) {
		context.stroke();
	}
	context.closePath();
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
				var doorX = (16 * door.x) - miniViewPortX;
				var doorY = (16 * door.y) - miniViewPortY;

				if (door.dir === "N") {
					drawCanvasLine(minimapContext, true, true, doorX + 4, doorY, doorX + 16 - 4, doorY);
				}
				if (door.dir === "S") {
					drawCanvasLine(minimapContext, true, true, doorX + 4, (16 * (door.y + 1)) - miniViewPortY, doorX + 16 - 4, (16 * (door.y + 1)) - miniViewPortY);
				}
				if (door.dir === "W") {
					drawCanvasLine(minimapContext, true, true, doorX, doorY + 4, doorX, doorY + 16 - 4);
				}
				if (door.dir === "E") {
					drawCanvasLine(minimapContext, true, true, (16 * (door.x + 1)) - miniViewPortX, doorY + 4, (16 * (door.x + 1)) - miniViewPortX, doorY + 16 - 4);
				}
				drawnDoors.push(ID);
			}
		}
	}
}

var animationLoopProgress = 0;
var initPlayerCanvas = false;
var lastFrame = 0;


function fillKeys() {
	for (var i = 0; i < player.keys.length; i++) {
		colorize(playerContext, rColors[player.keys[i]].l, false, false);
		drawCanvasRecta(playerContext, true, false, player.x - viewPortX + 1, player.y - viewPortY + ((4 - i) * player.h / 5), player.w - 2, (player.h / 5) - 1);
	}
}

function drawPlayer() {
	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];
		var red = (15 - ((15) * (player.ῼ / player.mῼ))).toString(16);
		colorize(playerContext, 'rgba(0,0,0,0.1)', '#' + red + red + '0000', 1);
		drawCanvasRecta(playerContext, true, true, entity.x - viewPortX, entity.y - viewPortY, entity.w, entity.h);
		fillKeys();
	}
	animationLoopProgress += 2 * (dt / 1000);
	animationLoopProgress = animationLoopProgress % 2;
	var frame = 1;
	if (animationLoopProgress > 1) {
		frame = 0;
	}
	if (lastFrame !== frame) {
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (miniMapIconsCanvas.width !== minimapCanvas.width) {
		miniMapIconsCanvas.width = minimapCanvas.width;
		miniMapIconsCanvas.height = minimapCanvas.height;
		colorize(miniMapIconsContext, "rgba(255,255,0," + (0.6 * frame) + ")", "rgba(255,255,0," + (0.8 * frame) + ")", false);
	}
	if (!initPlayerCanvas) {
		colorize(miniMapIconsContext, false, false, 1);
		initPlayerCanvas = true;
	}
	miniMapIconsContext.clearRect(0, 0, miniMapIconsCanvas.width, miniMapIconsCanvas.height);
	drawCanvasRecta(miniMapIconsContext, true, true, miniMapPlayerX - miniViewPortX, miniMapPlayerY - miniViewPortY, 16, 16);
	// colorize(ctx, "rgba(200,200,255,1)", "rgba(200,200,255,1)", false);
	// drawCanvasRecta(ctx, true, true, (miniMapPlayerX - miniViewPortX) / 16 * 2, (miniMapPlayerY - miniViewPortY) / 16 * 2, 2, 2);
	lastFrame = frame;
}

function drawArrow() {
	if (player.keys.length > 0) {
		colorize(playerContext, rColors[player.keys[selectedColor]].l, '#000000', false);
		moveContext(playerContext, player.x - viewPortX + (player.w / 2), player.y - viewPortY + (player.h / 2), aToPlayer, function() {
			drawCanvasLine(playerContext, true, true, 10 + player.w, 0, 0 + player.w, -10, 0 + player.w, 10, 10 + player.w, 0);
		});
	}
}

function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		colorize(playerContext, rColors[bullet.key].l, rColors[bullet.key].bd, 1);
		moveContext(playerContext, bullet.x - viewPortX, bullet.y - viewPortY, bullet.a, function() {
			drawCanvasRecta(playerContext, true, true, 0, 0, 10, 2);
		});
	}
}

function drawDoorArrow(door, doorX, doorY) {
	var strokeStyle = '#FFFFFF';
	var fillStyle = '#000000';
	if (door.dt > -1) {
		fillStyle = rColors[door.dt].l;
	}
	colorize(tileContext, fillStyle, strokeStyle, false);
	var xOffset = 16 * 10;
	var yOffset = (16 * 10) / 2;
	if (door.dir === "N") {
		xOffset = yOffset;
		yOffset = 0;
	}
	if (door.dir === "W") {
		xOffset = 0;
	}
	if (door.dir === "S") {
		xOffset = yOffset;
		yOffset = 16 * 10;
	}
	moveContext(tileContext, (doorX * 16 * 10) - viewPortX + xOffset, (doorY * 16 * 10) - viewPortY + yOffset, false, function() {

		if (door.dir === "N") {
			drawCanvasLine(tileContext, true, true, 0, -20, 10, -10, -10, -10, 0, -20);
		}
		if (door.dir === "W") {
			drawCanvasLine(tileContext, true, true, -20, 0, -10, -10, -10, 10, -20, 0);
		}
		if (door.dir === "S") {
			drawCanvasLine(tileContext, true, true, 0, 20, 10, 10, -10, 10, 0, 20);
		}
		if (door.dir === "E") {
			drawCanvasLine(tileContext, true, true, 20, 0, 10, -10, 10, 10, 20, 0);
		}
	})
}

function colorize(context, fillStyle, strokeStyle, lineWidth) {
	if (fillStyle !== false) {
		context.fillStyle = fillStyle;
	}
	if (strokeStyle !== false) {
		context.strokeStyle = strokeStyle;
	}
	if (lineWidth !== false) {
		context.lineWidth = lineWidth;
	}
}

function drawCanvasRecta(context, fill, stroke, x, y, w, h) {
	context.beginPath();
	context.rect(x, y, w, h);
	if (fill) {
		context.fill();
	}
	if (stroke) {
		context.stroke();
	}
	context.closePath();
}

function drawCanvasLine(context, fill, stroke, x, y) {
	context.beginPath();
	context.moveTo(x, y);
	for (var i = 3; i < arguments.length; i += 2) {
		context.lineTo(arguments[i], arguments[i + 1]);
	}
	if (fill) {
		context.fill();
	}
	if (stroke) {
		context.stroke();
	}
	context.closePath();
}

function moveContext(context, x, y, a, callback) {
	context.save();
	context.translate(x, y);
	if (a !== false) {
		context.rotate(a /* * 180 / Math.PI*/ );
	}
	callback();
	context.restore();
}
var playerCanvas, tileCanvas, bdCanvas, playerContext, tileContext, bdContext, minimapContext, minimapCanvas, miniMapIconsContext, miniMapIconsCanvas, colorCircles, blCount;
var runGameLoop = true;
var animate = true;
var frameEvent = new CustomEvent("frame");
var currentTick = window.performance.now();
var lastTick = window.performance.now();
var events = {};
var keymap = {};
var BEGINPATH = "beginPath";
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
	// keys: [0,1,2,3,4]
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
	colorCircles = getByType("clr");
	playerCanvas = getByType("p");
	bdCanvas = getByType("b");
	tileCanvas = getByType("t");
	minimapCanvas = getByType("m");
	blCount = getByType("v");
	miniMapIconsCanvas = getByType("i");
	playerContext = playerCanvas.getContext("2d");
	bdContext = bdCanvas.getContext("2d");
	tileContext = tileCanvas.getContext("2d");
	minimapContext = minimapCanvas.getContext("2d");
	miniMapIconsContext = miniMapIconsCanvas.getContext("2d");
	resizeCanvas();
	create();
	var previousRegion = null;
	for (var r = 0; r < rColors.length; r++) {
		var rooms = random(5, 10);
		// var rooms = random(1, 2);
		for (var i = 0; i < rooms; i++) {
			createRoom();
		}
		// if (previousRegion) {
		// 	while (world.r[world.r.length - 1].bds.indexOf(previousRegion) === -1) {
		// 		createRoom();
		// 	}
		// }
		if (r + 1 < rColors.length) {
			previousRegion = world.r[world.r.length - 1];
			startNewRegion(nextRegion(), previousRegion);
			// startNewRegion(nextRegion());
		}
	}
	startNewRegion(nextRegion(), world.r[0]);
	var rooms = random(5, 10);
	// var rooms = random(1, 2);
	for (var i = 0; i < rooms; i++) {
		createRoom();
	}
	var room = world.r[0].rooms[0];
	var door = room.d[0];
	var direction = door.dir;
	var position = door.x;
	room.sr = true;
	room.sx = position - room.x;
	room.sy = door.y - room.y;
	if (door.dir === "E" || door.dir === "W") {
		position = door.y;
	}
	clearDoorTypes();
	assignDoorTypes();
	enterRoom(room, direction, position);
	loop();
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

var end = false;
setInterval(function() {
	playerSizedRoom(currentRoom);
	currentMapTiles = currentRoom.map.tiles;
	currentMap = currentRoom.map.map;
	mheight = currentRoom.map.height * 10;
	mwidth = currentRoom.map.width * 10;
	realMapHeight = currentRoom.map.height * 10 * 16;
	realMapWidth = currentRoom.map.width * 10 * 16;
}, 15000);

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
		if (currentRoom === world.rooms[world.rooms.length - 1] && !end) {
			colorCircles.innerHTML = "there is no exit...";
			setTimeout(function() {
				colorCircles.innerHTML = "Simulation complete.";
			}, 3000);
			end = true;
		}
		processShot();
		placeBl();
		for (var i = 0; i < bullets.length; i++) {
			bulletPhysics(bullets[i]);
		}
		playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
		bdContext.clearRect(0, 0, bdCanvas.width, bdCanvas.height);
		drawMap();
		drawWorld();
		drawArrow();
		drawBullets();
		blCount.innerHTML = bls[player.keys[selectedColor]];
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
		if (event.keyCode === keys.tab) {
			miniMapPixelSize = Math.min(modulus(window.innerHeight) * 16, modulus(window.innerWidth) * 16);
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
	if (event.keyCode === keys.tab) {
		miniMapPixelSize = 150;
	}
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
var placing = false;
var delayBetweenShots = 150;
var bls = [0, 0, 0, 0, 0];
var mouseCanvasX = -1;
var mouseCanvasY = -1;
var selectedColor = 0;

function mousePosition(event) {
	var rect = playerCanvas.getBoundingClientRect();
	mouseCanvasX = event.clientX - rect.left;
	mouseCanvasY = event.clientY - rect.top;
	mouseX = event.clientX;
	mouseY = event.clientY;
	aToPlayer = Math.atan2(player.y + (player.h / 2) - viewPortY - mouseCanvasY, player.x + (player.w / 2) - viewPortX - mouseCanvasX) + Math.PI;
}

function click(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = true;
	}
	if (event.which === 2) {
		selectedColor++;
		if (selectedColor > player.keys.length - 1) {
			selectedColor = 0;
		}
	}
	if (event.which === 3) {
		placing = true;
	}
}

function release(event) {
	event.preventDefault();
	if (event.which === 1) {
		clicking = false;
	}
	if (event.which === 3) {
		placing = false;
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
}

function placeBl() {
	if (placing) {
		var x = mouseCanvasX + viewPortX;
		var y = mouseCanvasY + viewPortY;
		if (x >= 0 && x < mwidth * 16 && y >= 0 && y < mheight * 16) {
			var coord = coordinate(modulus(x), modulus(y), currentMapTiles);
			if (currentMap[coord] === 0 && bls[player.keys[selectedColor]] > 0) {
				currentMap[coord] = player.keys[selectedColor] + 2;
				bls[player.keys[selectedColor]]--;
			}
		}
	}
}

function Bullet(x, y, a, key) {
	return {
		x: x,
		y: y,
		a: a,
		key: key
	}
}
// var songJSON = {
// 	"songLen": 29,
// 	"songData": [{
// 		"oo": 7,
// 		"od": 0,
// 		"oe": 0,
// 		"ox": 0,
// 		"ov": 127,
// 		"ow": 1,
// 		"po": 6,
// 		"pd": 0,
// 		"pe": 9,
// 		"px": 0,
// 		"pv": 93,
// 		"pw": 1,
// 		"nf": 0,
// 		"ea": 137,
// 		"es": 2000,
// 		"er": 4611,
// 		"em": 192,
// 		"ff": 1,
// 		"fq": 982,
// 		"fr": 89,
// 		"ft": 6,
// 		"fm": 25,
// 		"fp": 6,
// 		"ft": 77,
// 		"lf": 0,
// 		"lq": 1,
// 		"lr": 3,
// 		"la": 69,
// 		"lw": 0,
// 		"p": [
// 			1,
// 			1,
// 			1,
// 			1,
// 			2,
// 			2
// 		],
// 		"c": [{
// 			"n": [
// 				0,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				135,
// 				0,
// 				0,
// 				135,
// 				140,
// 				140,
// 				0,
// 				0,
// 				0,
// 				0,
// 				140,
// 				137,
// 				0,
// 				135,
// 				135,
// 				135,
// 				0,
// 				0,
// 				0
// 			]
// 		}, {
// 			"n": [
// 				0,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				142,
// 				0,
// 				0,
// 				142,
// 				147,
// 				147,
// 				0,
// 				0,
// 				0,
// 				0,
// 				147,
// 				144,
// 				0,
// 				142,
// 				142,
// 				142,
// 				0,
// 				0,
// 				0
// 			]
// 		}]
// 	}, {
// 		"oo": 7,
// 		"od": 0,
// 		"oe": 0,
// 		"ox": 0,
// 		"ov": 192,
// 		"ow": 2,
// 		"po": 7,
// 		"pd": 0,
// 		"pe": 0,
// 		"px": 0,
// 		"pv": 201,
// 		"pw": 3,
// 		"nf": 0,
// 		"ea": 100,
// 		"es": 150,
// 		"er": 13636,
// 		"em": 191,
// 		"ff": 2,
// 		"fq": 5839,
// 		"fr": 254,
// 		"ft": 6,
// 		"fm": 121,
// 		"fp": 6,
// 		"ft": 147,
// 		"lf": 0,
// 		"lq": 1,
// 		"lr": 6,
// 		"la": 195,
// 		"lw": 0,
// 		"p": [
// 			2,
// 			2,
// 			2,
// 			2,
// 			3,
// 			3
// 		],
// 		"c": [{
// 			"n": [
// 				135,
// 				0,
// 				135,
// 				0,
// 				0,
// 				135,
// 				0,
// 				135,
// 				135,
// 				0,
// 				135,
// 				0,
// 				0,
// 				135,
// 				0,
// 				135,
// 				135,
// 				0,
// 				135,
// 				0,
// 				0,
// 				135,
// 				0,
// 				135,
// 				135,
// 				0,
// 				135,
// 				0,
// 				0,
// 				135,
// 				0,
// 				135
// 			]
// 		}, {
// 			"n": [
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0,
// 				135,
// 				0,
// 				0,
// 				0
// 			]
// 		}, {
// 			"n": [
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0,
// 				149,
// 				0,
// 				0,
// 				0
// 			]
// 		}]
// 	}, {
// 		"oo": 7,
// 		"od": 0,
// 		"oe": 0,
// 		"ox": 0,
// 		"ov": 192,
// 		"ow": 2,
// 		"po": 7,
// 		"pd": 0,
// 		"pe": 0,
// 		"px": 0,
// 		"pv": 201,
// 		"pw": 3,
// 		"nf": 0,
// 		"ea": 100,
// 		"es": 150,
// 		"er": 13636,
// 		"em": 191,
// 		"ff": 2,
// 		"fq": 5839,
// 		"fr": 254,
// 		"ft": 6,
// 		"fm": 121,
// 		"fp": 6,
// 		"ft": 147,
// 		"lf": 0,
// 		"lq": 1,
// 		"lr": 6,
// 		"la": 195,
// 		"lw": 0,
// 		"p": [
// 			1,
// 			1,
// 			1,
// 			1,
// 			2,
// 			2
// 		],
// 		"c": [{
// 			"n": [
// 				154,
// 				0,
// 				151,
// 				0,
// 				0,
// 				156,
// 				152,
// 				0,
// 				0,
// 				154,
// 				0,
// 				0,
// 				151,
// 				0,
// 				156,
// 				0,
// 				0,
// 				152,
// 				0,
// 				0,
// 				154,
// 				0,
// 				0,
// 				151,
// 				0,
// 				0,
// 				154,
// 				154,
// 				0,
// 				0,
// 				0,
// 				0
// 			]
// 		}, {
// 			"n": [
// 				161,
// 				0,
// 				158,
// 				0,
// 				0,
// 				163,
// 				159,
// 				0,
// 				0,
// 				161,
// 				0,
// 				0,
// 				158,
// 				0,
// 				163,
// 				0,
// 				0,
// 				159,
// 				0,
// 				0,
// 				161,
// 				0,
// 				0,
// 				158,
// 				0,
// 				0,
// 				161,
// 				161,
// 				0,
// 				0,
// 				0,
// 				0
// 			]
// 		}]
// 	}],
// 	"rowLen": 5606,
// 	"endPattern": 7
// };

// var songGen = MusicGenerator(songJSON);
// var source, sourceBuffer;
// createAudioBuffer(songGen, function(buffer) {
// 	sourceBuffer = buffer;
// 	toggle();
// });
// var playing = false;
// var startOffset = 0;
// var startTime = 0;

// function toggle() {
// 	if (playing) {
// 		source.stop();
// 		// Measure how much time passed since the last pause.
// 		startOffset += audioCtx.currentTime - startTime;
// 	} else {
// 		startTime = audioCtx.currentTime;
// 		source = audioCtx.createBufferSource();
// 		// Connect graph
// 		source.buffer = sourceBuffer;
// 		source.loop = true;
// 		source.connect(audioCtx.destination);
// 		// Start playback, but make sure we stay in bound of the buffer.
// 		source.start(0, startOffset % sourceBuffer.duration);
// 	}
// 	playing = !playing;
// };
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
		if (currentMap[coord] > 1 && player.keys[selectedColor] === currentMap[coord] - 2) {
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
			// var leftMap = coordinate(x - 1, y, topSize * 10);
			// var rightMap = coordinate(x + 1, y, topSize * 10);
			// var aboveMap = coordinate(x, y - 1, topSize * 10);
			// var aboveAbove = coordinate(x, y - 2, topSize * 10);
			// if (y - 1 < 0) {
			// 	aboveMap = -1;
			// }
			// if (x - 1 < 0) {
			// 	leftMap = -1;
			// }
			// if (y + 1 > (height * 10) - 1) {
			// 	belowMap = -1;
			// }
			// if (x + 1 > (width * 10) - 1) {
			// 	rightMap = -1;
			// }
			var onScreen = x < width * 10 && y < height * 10 && x < width * 10 && y < height * 10;
			if (worldRoom.r.u && worldRoom.r.id === 0 && room.map[roomCoord] !== 0 && onScreen) {
				if (random(0, 5) === 1) {
					map[mapCoord] = random(0, rColors.length - 1) + 2;
				} else {
					map[mapCoord] = 0;
				}
			} else {
				map[mapCoord] = room.map[roomCoord];

			}
			if (worldRoom.r.u && map[mapCoord] === 0 && room.type !== 9 && onScreen) {
				if (worldRoom.r.id === 1 || worldRoom.r.id === 2 || worldRoom.r.id === 3) {
					map[mapCoord] = worldRoom.r.id + 2;
				}
				if (random(0, 6) < 2 && worldRoom.r.id === 2) {
					map[mapCoord] = 0;
				}
				if (random(0, 6) < 4 && worldRoom.r.id === 3) {
					map[mapCoord] = 0;
				}
				if (random(0, 3) === 1 && worldRoom.r.id === 4) {
					map[mapCoord] = worldRoom.r.id + 2;
				}
				if (random(0, 3) === 1 && worldRoom.r.id === 0) {
					map[mapCoord] = worldRoom.r.id + 2;
				}
			}
			if (worldRoom.r.u && worldRoom.r.id !== 2 && worldRoom.r.id !== 1 && map[mapCoord] === 1 && room.type !== 9 && onScreen) {
				if (random(0, 3) === 1) {
					map[mapCoord] = worldRoom.r.id + 2;
				} else if (random(0, 3) === 2) {
					map[mapCoord] = 0;
				}
			}
			var roomTileHeight = height * 10;
			var roomTileWidth = width * 10;
			var inRoomX = x % 10;
			var inRoomY = y % 10;
			// top walls
			if ((y === 0 && northDoor === null && x < roomTileWidth) && onScreen) {
				map[mapCoord] = 1;
			}
			// left walls
			if ((x === 0 && westDoor === null && y < roomTileHeight) && onScreen) {
				map[mapCoord] = 1;
			}
			// bottom walls
			if ((y === roomTileHeight - 1 && southDoor === null && x < roomTileWidth) && onScreen) {
				map[mapCoord] = 1;
			}
			// right walls
			if ((x === roomTileWidth - 1 && eastDoor === null && y < roomTileHeight) && onScreen) {
				map[mapCoord] = 1;
			}
			var roomX = x % 10;
			var roomY = y % 10;
			if (roomX > -1 && roomX < 2 && roomY > -1 && roomY < 2 && onScreen) {
				map[mapCoord] = 1;
			}
			if (roomX > 10 - 3 && roomX < 10 && roomY > -1 && roomY < 2 && onScreen) {
				map[mapCoord] = 1;
			}
			if (roomX > -1 && roomX < 2 && roomY > 10 - 3 && roomY < 10 && onScreen) {
				map[mapCoord] = 1;
			}
			if (roomX > 10 - 3 && roomX < 10 && roomY > 10 - 3 && roomY < 10 && onScreen) {
				map[mapCoord] = 1;
			}

			// top walls
			if (map[mapCoord] === 0 && onScreen) {
				if ((y === 0 && northDoor !== null && x < roomTileWidth && northDoor.dt > -1)) {
					map[mapCoord] = northDoor.dt + 2;
				}
				// left walls
				if ((x === 0 && westDoor !== null && y < roomTileHeight && westDoor.dt > -1)) {
					map[mapCoord] = westDoor.dt + 2;
				}
				// bottom walls
				if ((y === roomTileHeight - 1 && southDoor !== null && x < roomTileWidth && southDoor.dt > -1)) {
					map[mapCoord] = southDoor.dt + 2;
				}
				// right walls
				if ((x === roomTileWidth - 1 && eastDoor !== null && y < roomTileHeight && eastDoor.dt > -1)) {
					map[mapCoord] = eastDoor.dt + 2;
				}
			}
		}
	}
	return {
		map: map,
		width: width,
		height: height,
		size: topSize,
		tiles: topSize * 10
	};
}

function playerSizedRoom(room) {
	room.map = BigRoom(room.mw * 1, room.mh * 1, room, function(array, roomsX, roomsY, arraySize) {
		var currentX = 0;
		var currentY = 0;
		var roomID = 0;
		for (var i = 0; i < arraySize * arraySize; i++) {
			var northDoor = getDoor(room, currentX, currentY, "N");
			var eastDoor = getDoor(room, currentX, currentY, "E");
			var southDoor = getDoor(room, currentX, currentY, "S");
			var westDoor = getDoor(room, currentX, currentY, "W");
			var horizontalRooms = [1, 3, 4, 9];
			var verticalRooms = [2, 9, 10, 11];
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
	if (room.s > -1 && player.keys.indexOf(room.s) === -1) {
		var attempts = 0;
		var found = false;
		while (found === false && attempts < 5) {
			if (room.sr) {
				var randomW = room.sx * 1;
				var randomH = room.sy * 1;
			} else {
				var randomW = random(1, room.mw * 1) - 1;
				var randomH = random(1, room.mh * 1) - 1;
			}
			var randomY = random(1, 10 - 1);
			var randomX = random(1, 10 - 1);
			var coord = coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles);
			var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.r.id + 2;
			if (validPlacement) {
				found = true;
				room.map.map[coordinate((randomW * 10) + randomX, (randomH * 10) + randomY, room.map.tiles)] = 9;
			}
			attempts++;
		}
		// if (!found) {
		// 	if (room.sr) {
		// 		var startX = room.sx * 1 * 10;
		// 		var startY = room.sy * 1 * 10;
		// 		for (var x = startX + 1; x < startX + 10 - 1; x++) {
		// 			for (var y = startY + 1; y < startY + 10 - 1; y++) {
		// 				var coord = coordinate(x, y, room.map.tiles);
		// 				var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.r.id + 2;
		// 				if (validPlacement) {
		// 					room.map.map[coord] = 9;
		// 				}
		// 			}
		// 		}
		// 	} else {
		// 		var startX = room.sx * 1 * 10;
		// 		var startY = room.sy * 1 * 10;
		// 		for (var x = 0 + 1; x < (room.mw * 1 * 10) - 1; x++) {
		// 			for (var y = 0 + 1; y < (room.mh * 1 * 10) - 1; y++) {
		// 				var coord = coordinate(x, y, room.map.tiles);
		// 				var validPlacement = room.map.map[coord] === 0 || room.map.map[coord] === room.r.id + 2;
		// 				if (validPlacement) {
		// 					room.map.map[coord] = 9;
		// 				}
		// 			}
		// 		}
		// 	}
		// }
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
	bg: "#FF3333",
	bd: "#990000",
	o: "#FF0000",
	l: "#FFAAAA",
	name: "Fire"
}, {
	bg: "#00BB00",
	bd: "#006600",
	o: "#00BB00",
	l: "#AAFFAA",
	name: "Air"
}, {
	bg: "#3333FF",
	bd: "#000066",
	o: "#0000FF",
	l: "#AAAAFF",
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

function startNewRegion(r, previousRegion) {
	var trapped = true;
	var f = getFrontiersForAllRooms(previousRegion);
	var test = [];
	var frontier = null;
	var used = [];
	while (trapped) {
		var emptySides = 0;
		frontier = getRandom(f, used);
		test.length = 0;
		if (frontier) {
			test.push(getRoom(frontier.x - 1, frontier.y), getRoom(frontier.x + 1, frontier.y), getRoom(frontier.x, frontier.y - 1), getRoom(frontier.x, frontier.y + 1));
			for (var i = 0; i < 4; i++) {
				if (test[i] === null) {
					emptySides++;
				}
			}
		} else {
			trapped = false;
		}
		if (emptySides > 2) {
			trapped = false;
		}
	}
	if (frontier) {
		startAt(frontier.x, frontier.y, r);
	}
}

function getRandom(array, used) {
	if (used.length === array.length) {
		return false;
	}
	var index = random(0, array.length - 1);
	while (used.indexOf(index) > -1) {
		index = random(0, array.length - 1);
	}
	used.push(index);
	return array[index];
}

function getFrontiersForAllRooms(previousRegion) {
	var results = [];
	var rooms = world.rooms;
	if (previousRegion) {
		rooms = previousRegion.rooms;
	}
	for (var i = 0; i < rooms.length; i++) {
		results = addBorderingFrontiers(results, rooms[i]);
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
	for (var i = 0; i < room.d.length; i++) {
		var r1 = room.r;
		var r2 = o(door, room).r;
		if (r1 !== r2) {
			if (r1.bds.indexOf(r2) === -1) {
				r1.bds.push(r2);
			}
			if (r2.bds.indexOf(r1) === -1) {
				r2.bds.push(r1);
			}
		}
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
	var used = [];
	var frontier = getRandom(world.f, used);
	if (frontier) {
		addRoom(growRoom(frontier.x, frontier.y));
	}
}

function addRoom(room) {
	if (room === null || !canPlaceRoom(room.x, room.y, room.mw, room.mh)) {
		return false;
	}
	var array = [];
	array = removeFrontiers(array, room);
	world.f = addBorderingFrontiers(array, room);
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

function assignDoorTypes() {
	var door = null;
	var r1 = null;
	var r2 = null;
	var room = null;
	for (var i = 0; i < world.r.length; i++) {
		var used = [];
		r1 = world.r[i];
		if (i !== 0) {
			room = getRandom(r1.rooms, used);
			room.s = (i + 1) % rColors.length;
		}
		for (var e = 0; e < r1.rooms.length; e++) {
			room = r1.rooms[e];
			if (i === 0 && room.sr) {
				room.s = (i + 1) % rColors.length;
			}
			for (var r = 0; r < room.d.length; r++) {
				door = room.d[r];
				r2 = o(door, room).r;
				if (r2 !== r1) {
					if (door.o.dt === -1) {
						door.o.dt = (i) % rColors.length;
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
	colorCircles.innerHTML = "find " + (5 - player.keys.length) + " color circles";
	if((5 - player.keys.length) === 0) {
		colorCircles.innerHTML = "find the exit";
	}
	for (var e = 0; e < world.r.length; e++) {
		if (player.keys.indexOf(world.r[e].id) > -1) {
			world.r[e].u = true;
		}
	}
	for (var i = 0; i < world.rooms.length; i++) {
		// var hasDoor = false;
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
				// hasDoor = true;
			}
		}
		// if (hasDoor && room.map !== null) {
		// 	if (room.s === -1) {}
		// 	// for (var r = 0; r < player.keys.length; r++) {
		// 	// 	var index = room.map.map.indexOf(player.keys[r] + 1);
		// 	// 	while (index > 0) {
		// 	// 		room.map.map[index] = 0;
		// 	// 	}
		// 	// }
		// 	// for (var r = 0; r < room.map.map.length; r++) {
		// 	// 	if (room.map.map[r] > 1) {
		// 	// 		if (player.keys.indexOf(room.map.map[r] - 1) > -1) {
		// 	// 			room.map.map[r] = 0;
		// 	// 		}
		// 	// 	}
		// 	// }
		// }
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
		u: false,
		bds: [],
		rooms: []
	};
}
})(window,document);