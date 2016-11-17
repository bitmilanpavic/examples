var express = require('express');
var router = express.Router();
var User = require('../models/user'); 
var Course = require('../models/course');
var Category = require('../models/category');

/* REDIRECT IF URL /COURSES */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

// 	GET SINGLE COURSE DETAILS
router.get('/:id/details', function(req, res, next){
	var course_id = req.params.id;
	Course.findOne({_id: course_id}, function(err, courses){
		if(err){res.redirect('/'); return};

		// Check if course bellongs to current instructor user
		if(res.locals.user.email==courses.course_instructor_email && res.locals.user.type=='instructor'){
			res.locals.instructorEdit = true;
		}

		// Check if student payed course and allow him video access
		if(res.locals.user.type=='student' && res.locals.user.courses_id){
			
			for(i=0;i<res.locals.user.courses_id.length;i++){
				if(courses._id==res.locals.user.courses_id[i]){
					res.locals.studentWatch = true;	
				}
			}	
		}
		
		res.render('courses/course_single',{
			title:courses.course_title,
			"courses":courses,
			"instructorEdit":res.locals.instructorEdit,
			"studentWatch":res.locals.studentWatch,
			"errors":req.session.errors
		}, function(err, html){
			req.session.errors = null;
			res.send(html);
		});
				
	})
})


// ADD COURSE
router.get('/addcourse',ensureAuthenticatedInstructor, function(req, res, next){
	Category.findOne({}, function(err, categories){
		if(categories){
			res.render('courses/add_course',{
				title:'Add Course',
				"errors":req.session.errors,
				"categories":categories
				}, function(err, html){
					req.session.errors = null;
					res.send(html);
			});	
		}
	});

	
});
router.post('/addcourse',ensureAuthenticatedInstructor, function(req, res, next){
	req.checkBody('course_title', 'Course Title can\'t be empty').notEmpty();
	req.checkBody('course_desc', 'Course Description can\'t be empty').notEmpty();
	req.checkBody('course_price', 'Course Price can\'t be empty').notEmpty();
	req.checkBody('course_price', 'Price must be number').isInt();
	req.checkBody('course_category', 'Course category can\'t be empty').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		Category.findOne({}, function(err, categories){
			if(categories){
				res.render('courses/add_course',{
					title:'Add Course',
					"errors":req.session.errors,
					"errors2":errors,
					"categories":categories
					}, function(err, html){
						req.session.errors = null;
						res.send(html);
				});	
			}
		});
	}else{

		// Coolect course data
		var newCourse = new Course({
			course_title:req.body.course_title,
			course_body:req.body.course_desc,
			course_price:req.body.course_price,
			course_categories:req.body.course_category,
			course_date:new Date(),
			course_instructor_name:res.locals.user.name,
			course_instructor_lastname:res.locals.user.lastname,
			course_instructor_email:res.locals.user.email
		});
		
		// Save new course to database
		Course.saveCourse(newCourse, function(err, course){
			if(err) throw err;
			if(course){
				User.findOneAndUpdate(
					{_id:res.locals.user._id},
					{$push:{
						courses_id:course._id.toString()
					}},
					{upsert:true,safa:true},
					function(err, updated){
						
					}
				)
			}
			req.flash('success','Course added you can proceed whit adding lessons');
			res.redirect('/courses/'+ course._id +'/details');
		});
	}	
});


//ADD LESSONS
router.post('/:id/addlesson', function(req, res, next){
	var courseid = req.params.id;
	Course.findOneAndUpdate(
		{_id:courseid},
		{$push:{course_lessons:{lesson_length:req.body.length,lesson_title:req.body.title,lesson_video_link:"asdasd/asasd.mp4"}}},
		{safe:true,upsert:true},
		function(err, course){
			if(err)throw err;
			if(course){
				req.flash('success', "Lesson Added");
				res.redirect('/courses/'+courseid+'/details');
			}
		}
	)

});


// MY COURSES
router.get('/mycourses', ensureAuthenticated, function(req, res, next){
	Course.find({}).where('_id').in(res.locals.user.courses_id).exec(function(err, courses){
		if(courses){
			res.render('courses/my_courses',{title:"My Courses","courses":courses});
		}else{
			res.render('courses/my_courses',{title:"My Courses","courses":false});
		}
	});
})


// REGISTER FOR COURSE(student action)
router.get('/registerforcourse',function(req, res, next){
	res.redirect('/');
})
router.post('/registerforcourse', function(req, res, next){
	var id = req.body.courseid;
	if(res.locals.user.type && res.locals.user.type=='student'){
		var query = {_id:res.locals.user._id}
		User.findOneAndUpdate(
			query,
			{$push:{courses_id:id}},
			{upsert:true,safe:true},
			function(err, user){
				if(err) throw err;
				if(user){
					req.flash('success','Tnx for registering for this class');
					res.redirect('/courses/'+id+'/details');
				}
			}
		);	
	}else{
		req.flash('error','Login as student in order to register for this class');
		res.redirect('/courses/'+id+'/details');
	}
	
})

// Authentication functions
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}
function ensureAuthenticatedInstructor(req, res, next){
	if(req.isAuthenticated() && res.locals.user.type=='instructor'){
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
