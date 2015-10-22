var errorHandler,
    jsCompiler,
    config,
    app;

app          = require('express')();
config       = require('./config.json');
jsCompiler   = require('./controllers/jsCompiler');
errorHandler = require('./controllers/errorHandler');

app.get('/', function(req, res) {
    res.contentType('application/json');
    res.sendFile(__dirname + '/welcome.json');
});

app.get('/*.js', function(req, res) {
    res.contentType('application/json');
    jsCompiler.apply(app, arguments)
});

//error middleware
app.use(errorHandler);

//check if code is being run by the terminal.
if(require.main === module) {
    app.listen(config.port, function() {
        console.log('mixerjs listening in port ' + config.port);
    })
}

module.exports = app;

