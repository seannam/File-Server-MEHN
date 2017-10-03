
var app = require('./app.js');

var port = process.env.PORT || 8080
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})