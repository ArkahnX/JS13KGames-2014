// process.on("uncaughtException", function(err) {
// 	"use strict";
// 	console.log(err.stack);
// 	console.log(err.toString());
// });
var fs = require('fs');
var UglifyJS = require("uglify-js");

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

var badList = ["build_system", "node_modules", ".git", "crashes", "build", "app.js", "seedrandom.min.js"];

function isGoodFile(file) {
	"use strict";
	for (var i = 0; i < badList.length; i++) {
		if (file.indexOf(badList[i]) > -1) {
			return false;
		}
	}
	return true;
}

var walk = function(dir) {
	"use strict";
	var results = [];
	var list = fs.readdirSync(dir);
	var pending = list.length;
	if (!pending) {
		return results;
	}
	for (var i = 0; i < list.length; i++) {
		var file = list[i];
		file = dir + "/" + file;
		var stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			var res = walk(file);
			results = results.concat(res);
			if (!--pending) {
				return results;
			}
		} else {
			if (isGoodFile(file)) {
				results.push(file);
			}
			if (!--pending) {
				return results;
			}
		}
	}
};

var options = {
	parse: {
		strict: false,
		filename: process.argv[2]
	},
	compress: {
		sequences: true, // join consecutive statemets with the “comma operator”
		properties: true, // optimize property access: a["foo"] → a.foo
		dead_code: true, // discard unreachable code
		drop_debugger: true, // discard “debugger” statements
		unsafe: false, // some unsafe optimizations (see below)
		conditionals: true, // optimize if-s and conditional expressions
		comparisons: true, // optimize comparisons
		evaluate: true, // evaluate constant expressions
		booleans: true, // optimize boolean expressions
		loops: true, // optimize loops
		unused: true, // drop unused variables/functions
		hoist_funs: true, // hoist function declarations
		hoist_vars: false, // hoist variable declarations
		if_return: true, // optimize if-s followed by return/continue
		join_vars: true, // join var declarations
		cascade: true, // try to cascade `right` into `left` in sequences
		side_effects: true, // drop side-effect-free statements
		warnings: true, // warn about potentially dangerous optimizations/code
		global_defs: {} // global definitions
	},
	output: {
		// indent_start: 0, // start indentation on every line (only when `beautify`)
		// indent_level: 4, // indentation level (only when `beautify`)
		// quote_keys: false, // quote all keys in object literals?
		// space_colon: true, // add a space after colon signs?
		// ascii_only: false, // output ASCII-safe? (encodes Unicode characters as ASCII)
		// inline_script: false, // escape "</script"?
		// width: 80, // informative maximum line width (for beautified output)
		// max_line_len: 32000, // maximum line length (for non-beautified output)
		// ie_proof: true, // output IE-safe code?
		// beautify: false, // beautify output?
		// source_map: null, // output a source map
		// bracketize: false, // use brackets every time?
		// comments: false, // output comments?
		// semicolons: true // use semicolons to separate statements? (otherwise, newlines)
	}
};

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

var rootDir = "D:/GitHub/js13kgames-2014/";
var files = walk(rootDir + "source");
var data = "";
for (var i = 0; i < files.length; i++) {
	if (files[i].indexOf(".js") > 0 && files[i].indexOf(".json") === -1) {
		data += fs.readFileSync(files[i], "utf8");
	}
}
fs.writeFileSync(rootDir + 'source/app.js', data);
options.parse.filename = rootDir + "source/app.js";
var parseOptions = UglifyJS.defaults({}, options.parse);
var compressOptions = UglifyJS.defaults({}, options.compress);
var outputOptions = UglifyJS.defaults({}, options.output);

// parseOptions = defaults(parseOptions, defaultOptions.parse, true);
// compressOptions = defaults(compressOptions, defaultOptions.compress, true);
// outputOptions = defaults(outputOptions, defaultOptions.output, true);

// 1. Parse
var fullCode = data;
var topLevelAst = UglifyJS.parse(fullCode, parseOptions);
topLevelAst.figure_out_scope();

// 2. Compress
var compressor = new UglifyJS.Compressor(compressOptions);
var compressedAst = topLevelAst.transform(compressor);

// 3. Mangle
compressedAst.figure_out_scope();
compressedAst.compute_char_frequency();
// compressedAst.mangle_names();

// 4. Generate output
var uglifiedCode = compressedAst.print_to_string(outputOptions);
var oldSize = getUTF8Size(fullCode);
var newSize = getUTF8Size(uglifiedCode);
var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
console.log("Saved " + saved + " % of old size: " + oldSize + "B with new size: " + newSize + "B for build.js");
var minifiedCode = Minify(uglifiedCode);

// fs.writeFileSync(rootDir + "build/" + folder + "/" + fileName + ".js", uglifiedCode);
console.log("Wrote final build to " + rootDir + "build/build.js");
fs.writeFileSync(rootDir + 'build/build.js', minifiedCode);
