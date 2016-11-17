var mongoose = require('mongoose');

var schema = mongoose.Schema({
	course_title:{
		type:String
	},
	course_body:{
		type:String
	},
	course_date:{
		type:String
	},
	course_instructor_name:{
		type:String
	},
	course_instructor_lastname:{
		type:String
	},
	course_instructor_email:{
		type:String
	},
	course_price:{
		type:Number
	},
	course_categories:{
		type:Array
	},
	course_lessons:[{
		lesson_length:{type:String},
		lesson_title:{type:String},
		lesson_video_link:{type:String}
	}]
})

var Course = module.exports = mongoose.model('courses', schema);

module.exports.saveCourse = function(newCourse, callback){
	newCourse.save(callback);
} 
