var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
	name:{type:String},
	lastname:{type:String},
	email:{type:String},
	password:{type:String,bcrypt:true},
	type:{type:String},
	courses_id:{
		type:{Array}
	}
});

var User = module.exports = mongoose.model('users', userSchema);

// Passport desiriliaze
module.exports.getById = function(id, callback){
	User.findById(id,callback);
}

//Save new user
module.exports.saveUser = function(newUser, callback){
	newUser.save(callback);
} 
