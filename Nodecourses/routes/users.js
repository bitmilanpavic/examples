var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

// User Register
router.get('/register', ensureNotAuthenticated, function(req, res, next){
	res.render('register/register',{title:'Sign Up',errors:req.session.errors},
		function(err, html){
			req.session.errors = null;
			res.send(html);
		});
});
router.post('/register', function(req, res, next) {
    req.sanitize('name').escape(); 
    req.sanitize('name').trim();
    req.sanitize('lastname').escape(); 
    req.sanitize('lastname').trim();
    req.sanitize('password2').escape(); 
    req.sanitize('password2').trim();   

	req.checkBody('email2', 'Not A Valid Email').isEmail();
	req.checkBody('password2', 'Password can\'t be empty').notEmpty();
	req.checkBody('name', 'Name can\'t be empty').notEmpty();
	req.checkBody('lastname', 'Last Name can\'t be empty').notEmpty();
	req.checkBody('password2rpt', 'Password doesn\'t match').equals(req.body.password2);

	var errors = req.validationErrors();
	
	if(errors){
		res.render('register/register',{"errors":errors,'title':'Sign Up'});
	}else{

		// Coolect user data
		var newUser = new User({
			name:req.body.name,
			lastname:req.body.lastname,
			email:req.body.email2,
			password:bcrypt.hashSync(req.body.password2),
			type:req.body.type
		});
		
		// Save user to database
		User.findOne({email:req.body.email2}, function(err, user){
			// if user doesnt exists save to database
			if(!user){
				User.saveUser(newUser, function(err, user){
					if(err) throw err;
					req.flash('success','You can now log in.');
					res.redirect('/');
				});
			}else{
				res.render('register/register',{title:'Sign Up',"errors":false,'userExists':true});
			}
		});
	}	
});

/*USER login*/

// Passport serialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// Passport deserialize
passport.deserializeUser(function(id, done) {
  User.getById(id, function(err, user) {
    done(err, user);
  });
});
// Passport setup local strategy
passport.use(new localStrategy(
  {
	usernameField: 'email',
    passwordField: 'password'
  },

  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
      	console.log('user not exsists');
        return done(null, false, { message: 'Incorrect email.' });
      }
      bcrypt.compare(password, user.password, function(err, isMatch){
       if(err) throw err;
       
       if(isMatch){
       	return done(null, user);
       }else{
       	console.log('Password doesnt match');
       	return done(null, false, { message: 'Incorrect password.' });
       }
       	
      });
          
    });
  }

));

router.get('/login', function(req, res, next){
	res.redirect('/');
});
router.post('/login', function(req, res, next){
	
	req.sanitize('password').escape(); 
    req.sanitize('password').trim(); 

	req.checkBody('email', 'Not A Valid Email').isEmail();
	req.checkBody('password', 'Password can\'t be empty').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		req.session.errors = errors;
		res.redirect(req.body.url);
		req.session.errors = null;
	}else{
		passport.authenticate('local', { successRedirect: req.body.url,	
                                   failureRedirect: req.body.url,
                                   failureFlash: "User doesn't exists",
                                   successFlash: "You are now logged in",})(req,res);
		
	}
});


/* User logout */
router.get('/logout', function(req, res, next){
	res.redirect('/');
});
router.post('/logout', function(req, res, next){
	req.flash('alert alert-success','You are now logged out');
	req.logout();
  	res.redirect('/');
})

// Authentication functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
function ensureAuthenticatedInstructor(req, res, next){
	if(req.isAuthenticated() && req.params.type=='instructor'){
		return next();
	}
	res.redirect('/');
}
function ensureNotAuthenticated(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

module.exports = router;
