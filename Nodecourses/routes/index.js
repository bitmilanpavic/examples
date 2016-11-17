var express = require('express');
var router = express.Router();
var Course = require('../models/course');

/* GET home page. */
router.get('/', function(req, res, next) {
  Course.find({}, function(err, courses){
  	res.render('index', {
	  title: 'Home',
	  "courses":courses,
	  "errors":req.session.errors
	}, function(err, html){
		req.session.errors = null;
		res.send(html);
	});
  })	 	
  
});

module.exports = router;
