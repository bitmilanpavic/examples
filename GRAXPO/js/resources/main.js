
$(document).ready(function(){

	$(window).scroll(function() {
	    if ($(window).scrollTop() > 10) {
	    	if(!$('header').hasClass('smallHeader')){
	    		$('header').addClass('smallHeader');
	    	} 
	    }
	    else {
	       $('header').removeClass('smallHeader');
	    }
	});

	// Top section animate
	$('#top img').each(function(i){
		var $this=$(this);
		$('.scrollDown').animate({'opacity':'1'},2200);
		
		setTimeout(function(){
    		$this.css('opacity','1').addClass('fadeInUp');
    	}, i*200);

    	setTimeout(function(){
    		$('#top img:nth-child(4)').addClass('bouncee');
    	}, 7*200) 
	});
		

	// Counters section animate
	var counters = {};
	counters.counter = 0;
	counters.el = [$('#counter1'), $('#counter2'), $('#counter3'), $('#counter4')];
			
	var waypoint = new Waypoint({
	  element: document.getElementById('counters'),
	  handler: function(direction) {
	  	counters.counter++;
	  	if(counters.counter==1){
		    counters.el[0].animateNumber({ number: 1580 },1500);
			counters.el[1].animateNumber({ number: 2850 },1500);
			counters.el[2].animateNumber({ number: 1500 },1500);
			counters.el[3].animateNumber({ number: 1430 },1500);
		}	
	  },
	  offset: '85%'
	})

	// About section animate
	var about={};
	about.counter = 0;
	about.el = [$('#aboutAnimate .col-md-6:nth-child(1)'),$('#about .col-md-6:nth-child(2)')];

	var waypoint = new Waypoint({
	  element: document.getElementById('aboutAnimate'),
	  handler: function(direction) {
	  	about.counter++;
	  	if(about.counter==1){
		    about.el[0].css('opacity','1').addClass('slideInLeft');
		    setTimeout(function(){
		    	about.el[1].css('opacity','1').addClass('slideInUp');
		    }, 250); 
		}	
	  },
	  offset: '100%'
	})

	// What we do section animate
	var whatwedo={};
	whatwedo.counter = 0;
	whatwedo.el = [$('#whatwedoAnimate .col-md-6:nth-child(2n+1) .action'),$('#whatwedoAnimate .col-md-6:nth-child(2n+2) .action')];

	var waypoint = new Waypoint({
	  element: document.getElementById('whatwedoAnimate'),
	  handler: function(direction) {
	  	whatwedo.counter++;
	  	if(whatwedo.counter==1){
		    whatwedo.el[0].css('opacity','1').addClass('slideInLeft');
		    setTimeout(function(){
		    	whatwedo.el[1].css('opacity','1').addClass('slideInRight');
		    }, 250); 
		}	
	  },
	  offset: '75%'
	})

	// Steps section animate
	var steps={};
	steps.counter = 0;
	steps.el = [$('#steps .col-md-4')];

	var waypoint = new Waypoint({
	  element: document.getElementById('steps'),
	  handler: function(direction) {
	  	steps.counter++;

	  	if(steps.counter==1){
	  		steps.el[0].each(function(i){
	  			var $this=$(this);
	  			setTimeout(function(){
			    	$this.css('opacity','1').addClass('fadeInUp');
			    	if(i+1==steps.el[0].length){
			    		setTimeout(function(){
			    			steps.el[0].addClass('afterShow');
			    		}, 1200);
			    	}

			    }, i*250); 
	  		});
		}

	  },
	  offset: '90%'
	})

	// When click on menu
	$('a[href^="#"]').on('click', function(event) {
    	var target = $( $(this).attr('href') );
	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, 1000);
	    }
	});


	$('.carousel').carousel();

});

$(window).load(function(){
		if( $(window).outerWidth()<768 ){
			var liElements = $('.grid>li');
			$('.categoriesContainer>a').on('click', function(){
				$(this).siblings().removeClass('active').end().addClass('active');
				var linkCategory = $(this).data('category');

	 			if(linkCategory==='All'){
	 				liElements.find('.itemContainer').each(function(){
	 					$(this).show();
	 				});

	 			}else{
	 				liElements.find('.itemContainer').each(function(){
		 				$(this).hide();
		 				if($(this).data('category')===linkCategory){
		 					$(this).show();
		 				}	
		 			});
	 			}

				return false;
			})	
			return false
		}
		var liElements = $('.grid>li');
 		var liHeight = [];
 		
 		liElements.each(function(){
 			var height = $(this).outerHeight();
 			liHeight.push(height); 
 		})

 		// Sort li heihgt from smaller to bigger
 		var sorted = liHeight.sort(function(a, b){return a>b});

 		liElements.each(function(){
 			// Calculate difference in height beetwen li elements comparet to smallest li element
			var difference = $(this).outerHeight()-sorted[0];
			
			// Get number of items
			var length = $(this).find('.itemContainer').length;

			// Calculate how much to resize each item
			var resize = difference/length;

			// Apply height reszie changes and set images as background
			$(this).find('.itemContainer').each(function(){
	 			$(this).css('height',$(this).outerHeight()-resize).attr('data-original',$(this).outerHeight());
	 			var src = $(this).find('img').attr('src');
	 			$(this).find('img').hide();
	 			$(this).css({'background-image':'url('+src+')','background-size':'cover','background-position':'center center'})
	 		});
 			 
 		})		
		
 		// When click on categories link
 		$('.categoriesContainer>a').on('click', function(){
 			$(this).siblings().removeClass('active').end().addClass('active');
 			
 			currentLiHeight = [];
 			var linkCategory = $(this).data('category');

 			if(linkCategory==='All'){
 				liElements.find('.itemContainer').each(function(){
 					$(this).show().css('height',$(this).data('original'));
 				});

 			}else{
	 			liElements.find('.itemContainer').each(function(){
	 				$(this).hide();
	 				if($(this).data('category')===linkCategory){
	 					$(this).show();
	 				}	
	 			});

	 			$('.grid>li').each(function(){
	 				var height = $(this).outerHeight();
 					currentLiHeight.push(height); 
 				});

 				// Sort li heihgt from smaller to bigger
		 		var sorted = currentLiHeight.sort(function(a, b){return a>b});

		 		$('.grid>li').each(function(){
		 			
		 			// Calculate difference in height beetwen li elements comparet to smallest li element
					var difference = $(this).outerHeight()-sorted[0];
					var length=0;
					// Get number of items
					$(this).find('.itemContainer').each(function(){
						if($(this).is(':visible')){
							length++;
						}
					
					});
					 
					// Calculate how much to resize each item
					var resize = difference/length;
					
					// Apply height reszie changes 
					$(this).find('.itemContainer').each(function(){
						if($(this).is(':visible')){
			 				$(this).css('height',$(this).outerHeight()-resize);
						}
						
			 		});
		 			 
		 		})
	 		}	
 			return false;
 		});
})