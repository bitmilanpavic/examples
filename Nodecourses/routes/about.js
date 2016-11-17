var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  	res.render('pages_static/about', {
	  title: 'About Us',
	  "errors":req.session.errors
	}, function(err, html){
		req.session.errors = null;
		res.send(html);
	});
});

module.exports = router;
