var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	bodyParser = require('body-parser'),
	fs = require('fs'),
	multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views'); // general config
app.set('view engine', 'ejs');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
  	if(file.fieldname == "sheetSelected")
    	callback(null,  file.fieldname + ".csv");
    else
    	callback(null, file.fieldname + ".html")
  }
});

var upload = multer({ storage: storage })
var uploadOptions = upload.fields([{ name: 'templateSelected', maxCount: 1 }, { name: 'sheetSelected', maxCount: 1 }])

var routes = require('./routes/uiRoutes');
routes(app, uploadOptions);

app.listen(port);

console.log('Server started on port ' + port);