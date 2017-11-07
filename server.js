// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/mongoose_demo');

var UserSchema = new mongoose.Schema({
    firstname:  { type: String, required: true, minlength: 6},
    lastname: { type: String, required: true, maxlength: 20 },
    age: { type: Number, min: 1, max: 150 },
    email: { type: String, required: true }
}, {timestamps: true });

mongoose.model('User', UserSchema);
var User = mongoose.model('User')

var QuoteSchema = new mongoose.Schema({
    user:  { type: String, required: true },
    content: { type: String, required: true },
}, {timestamps: true });

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote')

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
		res.render('index')  // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
});
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    var user = new User({
    	firstname: req.body.firstname, 
    	lastname: req.body.lastname,
    	age: req.body.age,
    	email: req.body.email
    	});

    user.save(function(err){
    	if(err){
    		res.redirect('index', {errors: user.errors})
    	}
    	else {
    		console.log('user added');
    		res.redirect('/users');
    	}
    })
});

app.get('/users', function(req, res) {
	users = User.find({}, function(err, users){
		if(err){
			console.log('unable to get users');
		}
		else {
		res.render('users', {users: users})
		}
	})   // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
})

app.get('/addquote', function(req, res) {
	res.render('addquote');
})

app.post('/addquote', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({
    	user: req.body.user, 
    	content: req.body.content
    	});

    quote.save(function(err){
    	// if(err){
    	// 	res.render('addquote', {errors: quote.errors})
    	// }
    	// else {
    	// 	console.log('quote added');
    	// 	res.redirect('/quotes');
    	// }
    	console.log('quote added');
    	res.redirect('/quotes');
    })
});

app.get('/quotes', function(req, res) {
	var quotes = Quote.find({}, function(err, quotes){
		if(err){
			console.log('unable to get quotes');
		}
		else {
		res.render('quotes', {quotes: quotes})
		}
	})   // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})