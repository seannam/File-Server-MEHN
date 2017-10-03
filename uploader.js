var path = require('path');
var fs = require('fs');
var multer = require('multer');

var newFileName = "";

// var storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         callback(null, './uploads')
//     },
//     filename: function(req, file, callback) {
//         console.log("file: ");
//         console.log(file);
//         newFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
//         console.log(newName);
//         callback(null, newName);
//     }
// });

module.exports.newFileName = newFileName;
module.exports.storage = storage;
