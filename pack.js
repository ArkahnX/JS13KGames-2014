var fs = require("fs");

var rootDir = "D:/GitHub/js13kgames-2014/";


var getUTF8Size = function(str) {
	"use strict";
	var sizeInBytes = str.split('')
		.map(function(ch) {
			return ch.charCodeAt(0);
		}).map(function(uchar) {
			// characters over 127 are larger than one byte
			return uchar < 128 ? 1 : 2;
		}).reduce(function(curr, next) {
			return curr + next;
		});

	return sizeInBytes;
};

var Q = [];
var result;

for (i = 1000; --i; i - 10 && i - 13 && i - 34 && i - 39 && i - 92 && Q.push(String.fromCharCode(i)));
var Minify = function(code, s) {
	i = s = code.replace(/([\r\n]|^)\s*\/\/.*|[\r\n]+\s*/g, '').replace(/\\/g, '\\\\'), X = B = s.length / 2, O = m = '';
	for (S = encodeURI(i).replace(/%../g, 'i').length;; m = c + m) {
		for (M = N = e = c = 0, i = Q.length; !c && --i; !~s.indexOf(Q[i]) && (c = Q[i]));
		if (!c) break;
		if (O) {
			o = {};
			for (x in O)
				for (j = s.indexOf(x), o[x] = 0;~ j; o[x]++) j = s.indexOf(x, j + x.length);
			O = o;
		} else
			for (O = o = {}, t = 1; X; t++)
				for (X = i = 0; ++i < s.length - t;)
					if (!o[x = s.substr(j = i, t)])
						if (~(j = s.indexOf(x, j + t)))
							for (X = t, o[x] = 1;~ j; o[x]++) j = s.indexOf(x, j + t);
		for (x in O) {
			j = encodeURI(x).replace(/%../g, 'i').length;
			if (j = (R = O[x]) * j - j - (R + 1) * encodeURI(c).replace(/%../g, 'i').length)(j > M || j == M && R > N) && (M = j, N = R, e = x);
			if (j < 1) delete O[x]
		}
		o = {};
		for (x in O) o[x.split(e).join(c)] = 1;
		O = o;
		if (!e) break;
		s = s.split(e).join(c) + c + e
	}
	c = s.split('"').length < s.split("'").length ? (B = '"', /"/g) : (B = "'", /'/g);
	i = result = '_=' + B + s.replace(c, '\\' + B) + B + ';for(Y in $=' + B + m + B + ')with(_.split($[Y]))_=join(pop());eval(_)';
	i = encodeURI(i).replace(/%../g, 'i').length;
	console.log(S + 'B to ' + i + 'B (' + (i = i - S) + 'B, ' + ((i / S * 1e4 | 0) / 100) + '%)');
	return result;
};

/*!
 * JavaScript Packify - v0.4 - 8/24/2010
 * http://benalman.com/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Currently tested in WebKit console, TODO: node.js version.

function packify(input) {
	var script = input,
		len,
		i,
		chunk,
		chunk_size,
		re,
		matches,
		savings,

		potential,
		potentials = {},
		potentials_arr = [],

		map = '',
		char_code,
		char,
		output;

	// Single quotes need to be escaped, so use double-quotes in your input
	// source whenever possible.
	script = script.replace(/'/g, "\\'");

	// Replace any non-space whitespace with spaces (shouldn't be necessary).
	script = script.replace(/\s+/g, ' ');

	// Return number of chars saved by replacing `count` occurences of `string`.
	function get_savings(string, count) {
		return (string.length - 1) * (count - 1) - 2;
	};

	// Just trying to keep things DRY here... Let's match some patterns!
	function get_re_match(pattern, text) {
		var re = RegExp(pattern.replace(/(\W)/g, '\\$1'), 'g');
		return [
			text.match(re) || [],
			re
		];
	};

	// Look for recurring patterns between 2 and 20 characters in length (could
	// have been between 2 and len / 2, but that gets REALLY slow).
	for (chunk_size = 2, len = script.length; chunk_size <= 20; chunk_size++) {

		// Start at the beginning of the input string, go to the end.
		for (i = 0; i < len - chunk_size; i++) {

			// Grab the "chunk" at the current position.
			chunk = script.substr(i, chunk_size);

			if (!potentials[chunk]) {
				// Find the number of chunk matches in the input script.
				matches = get_re_match(chunk, script)[0];

				// If any matches, save this chunk as a potential pattern. By using an
				// object instead of an array, we don't have to worry about uniquing
				// the array as new potentials will just overwrite previous potentials.
				if (get_savings(chunk, matches.length) >= 0) {
					potentials[chunk] = matches.length;
				}
			}
		}
	}

	// Since we'll need to sort the potentials, create an array from the object.
	for (i in potentials) {
		potentials.hasOwnProperty(i) && potentials_arr.push({
			pattern: i,
			count: potentials[i]
		});
	}

	// Potentials get sorted first by byte savings, then by # of occurrences
	// (favoring smaller count, longer patterns), then lexicographically.
	function sort_potentials(a, b) {
		return get_savings(b.pattern, b.count) - get_savings(a.pattern, a.count) || a.count - b.count || (a.pattern < b.pattern ? -1 : a.pattern > b.pattern ? 1 : 0);
	};

	// Loop over all the potential patterns, unless we run out of replacement
	// chars first. Dealing with 7-bit ASCII, valid replacement chars are 1-31
	// & 127 (excluding ASCII 10 & 13).
	for (char_code = 0; potentials_arr.length && char_code < 127;) {

		// Re-calculate match counts.
		for (i = 0, len = potentials_arr.length; i < len; i++) {
			potential = potentials_arr[i];
			matches = get_re_match(potential.pattern, script)[0];
			potential.count = matches.length;
		}

		// Sort the array of potentials such that replacements that will yield the
		// highest byte savings come first.
		potentials_arr.sort(sort_potentials);

		// Get the current best potential replacement.
		potential = potentials_arr.shift();

		// Find all chunk matches in the input string.
		chunk = potential.pattern;
		matches = get_re_match(chunk, script);
		re = matches[1];
		matches = matches[0];

		// Ensure that replacing this potential pattern still actually saves bytes.
		savings = get_savings(chunk, matches.length);
		if (savings >= 0) {

			// Increment the current replacement character.
			char_code = ++char_code == 10 ? 11 : char_code == 13 ? 14 : char_code == 32 ? 127 : char_code;

			// Get the replacement char.
			char = String.fromCharCode(char_code);

			//console.log( char_code, char, matches.length, chunk, savings );

			// Replace the pattern with the replacement character.
			script = script.replace(re, char);

			// Add the char + pattern combo into the map of replacements.
			map += char + chunk;
		}
	}

	// For each group of 1 low ASCII char / 1+ regular ASCII chars combo in the
	// map string, replace the low ASCII char in the script string with the
	// remaining regular ASCII chars, then eval the script string. Using with in
	// this manner ensures that the temporary _ var won't be leaked.
	output = "" + "with({_:'" + script + "'})" + "'" + map + "'.replace(/.([ -~]+)/g,function(x,y){" + "_=_.replace(RegExp(x[0],'g'),y)" + "})," + "eval(_)";

	if (eval(output.replace('eval(_)', '_')) === input) {
		// If the output *actually* evals to the input string, packing was
		// successful. Log some useful stats and return the output.
		console.log('Success, ' + input.length + 'b -> ' + output.length + 'b (' + (input.length - output.length) + 'b or ' + (~~((1 - output.length / input.length) * 10000) / 100) + '% savings)');

		return output;

	} else {
		// Otherwise, exit with an error.
		console.log('Error!');
		return input;
	}
};


var uglifiedCode = fs.readFileSync(rootDir + "source/app.min.js", "utf8");
var minifiedCode = Minify(uglifiedCode);
// var minifiedCode = packify(uglifiedCode);

// fs.writeFileSync(rootDir + "build/" + folder + "/" + fileName + ".js", uglifiedCode);
console.log("Wrote final build to " + rootDir + "build/build.js");
fs.writeFileSync(rootDir + 'build/build.js', minifiedCode);