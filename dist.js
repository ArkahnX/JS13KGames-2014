var AdmZip = require('adm-zip');
var zip = new AdmZip();
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/b.js");
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/index.html");
zip.addLocalFile("D:/GitHub/js13kgames-2014/build/s.css");
zip.writeZip("D:/GitHub/js13kgames-2014/dist/archive.zip");