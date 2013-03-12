var express = require('express'),
    path = require('path'),
    http = require('http'),
		index = require('./routes/index');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.post('/addLocation', index.addLocation);
app.get('/recentLocation', index.recentLocation);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
