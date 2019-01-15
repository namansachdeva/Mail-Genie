module.exports = function(app, uploadOptions) {
	var uiControls = require('../controllers/uiController');

	app.route('/')
		.get(uiControls.showHomePage);
	
	app.route('/upload')
		.post(uploadOptions, uiControls.uploadFiles);
}