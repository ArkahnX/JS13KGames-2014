var fs = require("fs");
var rootDir = "D:/GitHub/js13kgames-2014/";
var map = JSON.parse(fs.readFileSync(rootDir + "maps/test.json", "utf8"));
var result = "";
for (var i = 1; i < map.layers.length; i++) {
	var mapData = map.layers[i].data;
	if(result !== "") {
		result += ",";
	}
	result += mapData.join("");
}

fs.writeFileSync(rootDir + 'maps/string.txt', result);