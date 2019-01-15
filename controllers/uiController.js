exports.showHomePage = function(req, res) {
	res.render('index');
}

exports.uploadFiles = function(req, res) {
	res.render('sendmails');
}

exports.downloadSample = function(req,res) {
	var fs = require('fs');
	var pdf = require('html-pdf');
	var path = require('path')

	var html = fs.readFileSync('./uploads/templateSelected.html', 'utf8');
	var options = { format: 'Letter' };

	pdf.create(html, options).toFile('./pdfs/samplepdf.pdf', function(err, res) {
	  if (err) return console.log(err);
	  console.log(res);
	});
	// Use promise here
	res.sendFile(path.join(__dirname, '../pdfs/samplepdf.pdf'));
}