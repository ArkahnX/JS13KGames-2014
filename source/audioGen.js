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
// 	var p1 = (instr.fx_delay_time * rowLen) >> 1;
// 	var t1 = instr.fx_delay_amt / s255;

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

// 		osc_lfo: oscillators[instr.lfo_waveform],
// 		osc1: oscillators[instr.osc1_waveform],
// 		osc2: oscillators[instr.osc2_waveform],
// 		attack: instr.env_attack,
// 		sustain: instr.env_sustain,
// 		release: instr.env_release,
// 		panFreq: Math.pow(2, instr.fx_pan_freq - 8) / rowLen,
// 		lfoFreq: Math.pow(2, instr.lfo_freq - 8) / rowLen
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
// 	var o1t = getnotefreq(n + (soundGen.instr.osc1_oct - 8) * 12 + soundGen.instr.osc1_det) * (1 + 0.0008 * soundGen.instr.osc1_detune);
// 	var o2t = getnotefreq(n + (soundGen.instr.osc2_oct - 8) * 12 + soundGen.instr.osc2_det) * (1 + 0.0008 * soundGen.instr.osc2_detune);

// 	// State variable init
// 	var q = soundGen.instr.fx_resonance / s255;
// 	var low = 0;
// 	var band = 0;
// 	for (var j = soundGen.attack + soundGen.sustain + soundGen.release - 1; j >= 0; --j) {
// 		var k = j + currentpos;

// 		// LFO
// 		var lfor = soundGen.osc_lfo(k * soundGen.lfoFreq) * soundGen.instr.lfo_amt / 512 + 0.5;

// 		// Envelope
// 		var e = 1;
// 		if (j < soundGen.attack)
// 			e = j / soundGen.attack;
// 		else if (j >= soundGen.attack + soundGen.sustain)
// 			e -= (j - soundGen.attack - soundGen.sustain) / soundGen.release;

// 		// Oscillator 1
// 		var t = o1t;
// 		if (soundGen.instr.lfo_osc1_freq) t += lfor;
// 		if (soundGen.instr.osc1_xenv) t *= e * e;
// 		c1 += t;
// 		var rsample = soundGen.osc1(c1) * soundGen.instr.osc1_vol;

// 		// Oscillator 2
// 		t = o2t;
// 		if (soundGen.instr.osc2_xenv) t *= e * e;
// 		c2 += t;
// 		rsample += soundGen.osc2(c2) * soundGen.instr.osc2_vol;

// 		// Noise oscillator
// 		if (soundGen.instr.noise_fader) rsample += (2 * Math.random() - 1) * soundGen.instr.noise_fader * e;

// 		rsample *= e / s255;

// 		// State variable filter
// 		var f = soundGen.instr.fx_freq;
// 		if (soundGen.instr.lfo_fx_freq) f *= lfor;
// 		f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
// 		low += f * band;
// 		var high = q * (rsample - band) - low;
// 		band += f * high;
// 		var test = soundGen.instr.fx_filter;
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
// 		t = osc_sin(k * soundGen.panFreq) * soundGen.instr.fx_pan_amt / 512 + 0.5;
// 		rsample *= 39 * soundGen.instr.env_master;

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
// // 		var o1t = getnotefreq(n + (sound.instr.osc1_oct - 8) * 12 + sound.instr.osc1_det) * (1 + 0.0008 * sound.instr.osc1_detune);
// // 		var o2t = getnotefreq(n + (sound.instr.osc2_oct - 8) * 12 + sound.instr.osc2_det) * (1 + 0.0008 * sound.instr.osc2_detune);

// // 		// State variable init
// // 		var q = sound.instr.fx_resonance / s255;
// // 		var low = 0;
// // 		var band = 0;
// // 		for (var j = sound.attack + sound.sustain + sound.release - 1; j >= 0; --j) {
// // 			var k = j + currentpos;

// // 			// LFO
// // 			var lfor = sound.osc_lfo(k * sound.lfoFreq) * sound.instr.lfo_amt / 512 + 0.5;

// // 			// Envelope
// // 			var e = 1;
// // 			if (j < sound.attack)
// // 				e = j / sound.attack;
// // 			else if (j >= sound.attack + sound.sustain)
// // 				e -= (j - sound.attack - sound.sustain) / sound.release;

// // 			// Oscillator 1
// // 			var t = o1t;
// // 			if (sound.instr.lfo_osc1_freq) t += lfor;
// // 			if (sound.instr.osc1_xenv) t *= e * e;
// // 			c1 += t;
// // 			var rsample = sound.osc1(c1) * sound.instr.osc1_vol;

// // 			// Oscillator 2
// // 			t = o2t;
// // 			if (sound.instr.osc2_xenv) t *= e * e;
// // 			c2 += t;
// // 			rsample += sound.osc2(c2) * sound.instr.osc2_vol;

// // 			// Noise oscillator
// // 			if (sound.instr.noise_fader) rsample += (2 * Math.random() - 1) * sound.instr.noise_fader * e;

// // 			rsample *= e / s255;

// // 			// State variable filter
// // 			var f = sound.instr.fx_freq;
// // 			if (sound.instr.lfo_fx_freq) f *= lfor;
// // 			f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
// // 			low += f * band;
// // 			var high = q * (rsample - band) - low;
// // 			band += f * high;
// //             var test = sound.instr.fx_filter;
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
// // 			t = osc_sin(k * sound.panFreq) * sound.instr.fx_pan_amt / 512 + 0.5;
// // 			rsample *= 39 * sound.instr.env_master;

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