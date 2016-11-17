var mongoose = require('mongoose');

var schema = mongoose.Schema({
	category:{
		type:Array
	}
});

var Category = module.exports = mongoose.model('categories', schema);
// Category({
// 	category:['html','css','javascript','jquery','php','frontend','backend']
// }).save();

