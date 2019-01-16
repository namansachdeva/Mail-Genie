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
	var html, options;

	try {
		html = fs.readFileSync('./uploads/templateSelected.html', 'utf8');
		options = { height: '676px',
					width: '878px',
					timeout: 30000,
					base: 'file://' + path.join(__dirname, '../public/img/') };
	} catch(err) {
		res.send("No Template Available.")
	}

	var createPromise = new Promise(function(resolve, reject) {
		pdf.create(html, options).toFile('./pdfs/samplepdf.pdf', function(err, res) {
		  if(err)
		  	reject(err);
		  else
		  	resolve(res)
		});
	})

	// Use promise here - DONE
	createPromise.then(function(result) {
		console.log('File is - ', result);
		res.sendFile(path.join(__dirname, '../pdfs/samplepdf.pdf'));
	})
}

exports.sendEmails = function(req, res) {
	var csv = require('csv');
	var path = require('path');
	var fs = require('fs');
	var pdf = require('html-pdf');
	const nodemailer = require('nodemailer');
	var obj = csv();

	function AttendeeData(name, email, phone) {
	    this.Name = name;
	    this.EmailID = email;
	    this.PhoneNo = phone;
	};

	var Attendees = [];
	var num = 0;
	var readCSVPromise = new Promise(function(resolve, reject) {
		obj.from.path(path.join(__dirname, '../uploads/sheetSelected.csv')).to.array(function(data) {
			for (var index = 0; index < data.length; index++) {
				num++;
	        	Attendees.push(new AttendeeData(data[index][0], data[index][1], data[index][2]));
	    	}
	    	resolve(Attendees);
		});
	})

	var htmlSource;
	readCSVPromise.then(function(result) {

		htmlSource = fs.readFileSync("./uploads/templateSelected.html", "utf8");
	
	}).then(function(){

		var templateStr = htmlSource.toString();
		options = { height: '676px',
					width: '878px',
					timeout: 30000,
					base: 'file://' + path.join(__dirname, '../public/img/') };

		// TODO make this synchronous 
		for (var index = 0; index < num; index++) {
	        
	        var tempHTML = templateStr.replace("mojojojo", Attendees[index].Name)
			var emailP = Attendees[index].EmailID;

			var createPromiseForEach = new Promise(function(resolve, reject) {
				pdf.create(tempHTML, options).toFile('./pdfs/certificate.pdf', function(err, res) {
				  if(err)
				  	reject(err);
				  else
				  	resolve(res)
				});
			})

			createPromiseForEach.then(function(result) {
				const transporter = nodemailer.createTransport({
									service: 'Gmail',
						  			auth: {
						    		user: 'namansachdevaa@gmail.com',
						    		pass: '<password here>'
						 }
					});
				
				console.log(emailP)
				const options = {
						from: 'namansachdevaa@gmail.com',
						to: emailP,
						subject: 'Your Android Development Workshop certificate is here!',
						text: 'Hello World',
						attachments: [
						    {
						     path: path.join(__dirname, '../pdfs/certificate.pdf')
						    }
						]
					};

				transporter.sendMail(options, (error, info) =>{
					if(error) {
						console.log('----------------------ERROR---------------------------')
					} else {
						console.log('----------------------DONE---------------------------')
						console.log(info)
					}
				});
			})
	    }
	})
	res.send("success")
}
