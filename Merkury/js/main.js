(function($){
$(document).ready(function(){
	// When click on black overlay
	$('.blackOverlay').on('click', function(event){
		if(event.target !== event.currentTarget) return;
		$(this).closest('.blackOverlay').hide();
		$(this).hide();
		$('.topBanner').addClass('animateBg');
	});
	$('.redLogo').on('click', function(event){
		$(this).closest('.blackOverlay').hide();
		$('.topBanner').addClass('animateBg');
		return false;
	});

	// Header animate 
	$(window).scroll(function() {
	    if ($(window).scrollTop() > 100) {
	    	if(!$('header').hasClass('smallHeader')){
	    		$('header').removeClass('smallHeaderBack').addClass('smallHeader');
	    	}  
	    }
	    else {
	    	if($('header').hasClass('smallHeader')){
	    		 $('header').removeClass('smallHeader').addClass('smallHeaderBack');	
	    	}
	    }
	});
	

	// When click on menu
	$('header a[href^="#"]').on('click', function(event) {
    	var target = $( $(this).attr('href') );
	    if( target.length ) {
	        event.preventDefault();
	        $('html, body').animate({
	            scrollTop: target.offset().top
	        }, 1000);
	    }
	});

	// Blog section animate
	var blog={};
	blog.counter = 0;
	blog.el = [$('#blog .col-md-4').css('opacity',0)];
	var waypoint = new Waypoint({
	  element: document.getElementById('blog'),
	  handler: function(direction) {
	  	blog.counter++;
	  	if(blog.counter==1){
		    blog.el[0].each(function(i){
		    	var $this = $(this);
		    	setTimeout(function(){
		    		$this.css('opacity',1).addClass('animated fadeInUp');	
		    	},i*150)
		    }) 
		}	
	  },offset: '88%'
	})

	// Run slider
	$('.carousel').carousel();
	
	// PSD Template animate
	var layout={};
	layout.counter = 0;
	layout.el = [$('.layoutsContainer .layout h3')];
	var waypoint = new Waypoint({
	  element: document.getElementById('layoutsContainer'),
	  handler: function(direction) {
	  	layout.counter++;
	  	if(layout.counter==1){
		    layout.el[0].each(function(i){
		    	var $this = $(this);
		    	setTimeout(function(){
		    		$this.addClass('animateLine');
		    		setTimeout(function(){
		    			$this.addClass('showCircle');
		    		},800)	
		    	},i*500)
		    	
		    }) 
		}	
	  },offset: '100%'
	})

	// Pricing section animate
	var pricing={};
	pricing.counter = 0;
	pricing.el = [$('.pricingContainer .col-sm-4').css('opacity',0)];
	var waypoint = new Waypoint({
	  element: document.getElementById('pricing'),
	  handler: function(direction) {
	  	pricing.counter++;
	  	if(pricing.counter==1){
		    pricing.el[0].each(function(i){
		    	var $this = $(this);
		    	setTimeout(function(){
		    		$this.css('opacity',1).addClass('animated fadeInLeft');	
		    	},i*150)
		    }) 
		}	
	  },offset: '85%'
	})

});
}(jQuery))