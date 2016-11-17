$(document).ready(function(){

  // Initiate sliders
	$('.carousel').carousel({
	  interval: 6000
	});

	$('.my-slider').unslider({
		autoplay: false,
		infinite: true,
		keys: false,
		arrows: true,
		nav: false,
		arrows: {
			//  Unslider default behaviour
			prev: '<a class="unslider-arrow prev"><i class="fa fa-angle-double-left" aria-hidden="true"></i></a>',
			next: '<a class="unslider-arrow next"><i class="fa fa-angle-double-right" aria-hidden="true"></i> </a>'
		}
	});

	$('.slickSlider').slick({
   		slidesToShow:3,
   		slidesToScroll:1,
   		prevArrow:'<i class="fa fa-angle-double-left f26" aria-hidden="true"></i>',
		  nextArrow:'<i class="fa fa-angle-double-right f26" aria-hidden="true"></i>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          }
        }
      ]
  	});

  	
    //When click on portfolio links
  	var items = $('.portfolioItemsContainer>div');
  	$('.portfolioCategories a').on('click', function(){
  		var category = $(this).data('category');
  		$(this).addClass('active').siblings().removeClass('active');

  		items.hide();
  		if(category==='all'){
  			items.show();
  		}else{
  			items.hide();
  		}
  		items.each(function(){
  			if($(this).data('category')===category){
  				$(this).show();
  			}
  		});

  		return false;
  	});

  // Add waypoint for range section  
	var waypoint = new Waypoint({
	  element: document.getElementById('rangeAnimate'),
	  handler: function(direction) {
	  		$('.rangePercent').each(function(){
  			var percent=$(this).parent().prev();

  			// Animate percent container
  			percent.transition({
  				'left':parseFloat( percent.find('span').data('percent') )+'%'
  			},2000)

  			// Animate span position
  			$(this).transition({ x: -(99-parseFloat(percent.find('span').data('percent') ))+'%' },2000);

  			// Animate percent number
  			percent.find('span').animateNumbers(percent.find('span').data('percent'),false, 2000, "linear" );

  		});
	  },
	  offset: '85%'
	})
 
  // When click on menu
  $('a[href^="#"]').on('click', function(event) {
      $(this).parent().addClass('active').siblings().removeClass('active');
      var target = $( $(this).attr('href') );
      if( target.length ) {
          event.preventDefault();
          $('html, body').animate({
              scrollTop: target.offset().top
          }, 1500);
      }
  });

  // TESTIMONIALS
  $('.slickSliderTestimonials').slick({
      slidesToShow:4,
      slidesToScroll:1,
      initialSlide:0,
      prevArrow:'<i class="fa fa-angle-double-left f26" aria-hidden="true"></i>',
      nextArrow:'<i class="fa fa-angle-double-right f26" aria-hidden="true"></i>',
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          }
        }
      ] 
    }).on('afterChange', function(event, slick, currentSlide, nextSlide){
      var dataHtml = $('.slickSliderTestimonials .slick-current').data('html');
      $('.slickSliderText>div').html(dataHtml);
    });

  // Testimonials click
  $('.slick-track>div').on('click', function(){
    var dataHtml = $(this).data('html');
    $(this).addClass('slick-current').siblings().removeClass('slick-current');
    $('.slickSliderText>div').html(dataHtml);

  })

});
