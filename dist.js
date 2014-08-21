var AdmZip = require('adm-zip');
var zip = new AdmZip();
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/build.js");
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/index.html");
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/style.css");
zip.writeZip("D:/GitHub/js13kgames-2014/dist/archive.zip");