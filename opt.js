var fs = require("fs");
var rootDir = "D:/GitHub/js13kgames-2014/";
var string = fs.readFileSync(rootDir + "source/app.min.js", "utf8");
var reading = false;
var variables = {};
var sort = {};
var varName = "";
for (var i = 0; i < string.length; i++) {
	if (reading && (/[a-zA-Z0-9_]/).test(string[i]) === true) {
		varName += string[i];
	}
	if ((/[a-zA-Z0-9_]/).test(string[i]) === false) {
		reading = false;
		if (varName !== "") {
			if (!sort[varName]) {
				sort[varName] = 0;
			}
			sort[varName]++;
			varName = "";
		}
	}
	if (string[i] === ".") {
		reading = true;
	}
}

var keys = Object.keys(sort);

keys.sort();

for (var i = 0; i < keys.length; i++)
{
    k = keys[i];
    variables[k] = sort[k];
}

fs.writeFileSync(rootDir + 'opt.json', JSON.stringify(variables));