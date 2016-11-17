;(function($, global){

	var initiate = function(settings){
		return new init(settings);
	}

	function init(settings){
		var $this = this;
		$this.counter = 1,
		cssSettings={};
		
		// Set Default Settings
		var defaults = {
			c : $('#sslidercontainer'),
			previousSlide : $('.prev'),
			nextSlide : $('.next'),
			slidesToShow : 1,
			slidesToScroll : 1,
			animateSpeed : 1500,
			autoplay : false,
			autoplaySpeed : 3000,
			transition : 'horizontal'
		}

		// Extend default settings whit user settings
		$this.settings = $.extend(defaults, settings);

		if($this.settings.transition == 'horizontal'){

			cssSettings.sizeWH = 'width';
			cssSettings.position = 'left';
			cssSettings.margin = 'margin-left';
			cssSettings.li={'float':'left'};
		
		}else if($this.settings.transition == 'vertical'){
			
			cssSettings.sizeWH = 'height';
			cssSettings.position = 'top';
			cssSettings.margin = 'margin-top';
			cssSettings.li={};
		
		}

		// Setup slidesToScroll not to be bigger that slidesToShow
		$this.settings.slidesToScroll = ($this.settings.slidesToScroll>$this.settings.slidesToShow || $this.settings.slidesToScroll<=0)?$this.settings.slidesToShow: $this.settings.slidesToScroll;

		// Get ul element, add slider class to container
		$this.Ul = $this.settings.c.addClass('sslidercontainer').find('>ul');

		// Duplicate slides append/prepend to ul
		// $this.counter = $this.Ul.find('>li').length;
		// $this.Ul.css('left',-($this.counter-1)*((100/$this.settings.slidesToShow)*$this.settings.slidesToScroll) + "%");
		// $this.Ul.find('>li').clone().prependTo($this.Ul).end().clone().appendTo($this.Ul);

		// Get all li elements
		$this.li = $this.Ul.find('>li');				

		// Init slider css
		$this.cssSetup($this, cssSettings);

		// On prev/next click
		$this.clickSetup($this, cssSettings);

		//Autoplay
		// $this.autoplaySetup($this);

		// Add active class to middle element
		$('#sslidercontainer ul li').eq(Math.round($this.settings.slidesToShow/2)-1).addClass('active');
		$('#sslidercontainer ul li.active').nextAll().addClass('rightOff').end().prevAll().addClass('leftOff');
	}

	init.prototype = {

		cssSetup : function($this, cssSettings){
			$this.settings.c.find('>ul')
			.css(cssSettings.sizeWH , $this.li.length * 100 + '%').find('>li')
			.css(cssSettings.sizeWH , 100/$this.li.length/$this.settings.slidesToShow + '%').css(cssSettings.li);
		},

		clickSetup : function($this, cssSettings){
			$('.navigation').on('click', function(){

				// Set counter value, increase or decrease
				// If counter value > number of slides reset it to 1
				// If counter value < less then 1 set it to number of slides
				$(this).hasClass('next') ? $this.counter++: $this.counter--;
				$this.counter = ($this.counter > $this.li.length)? 1 : $this.counter;
				$this.counter = ($this.counter < 1)? $this.li.length : $this.counter;
				
				// Calculate how many times we can click before/if white space appears
				// Example 7 slides 3 to show 3 to scroll= 2 extra white spaces on last click
				var step = Math.ceil( ($this.li.length - $this.settings.slidesToShow)/$this.settings.slidesToScroll ); 
				
				// Set counter value based on step value 
				if($(this).hasClass('next')){
					if($this.counter-1 > step){ $this.counter = 1; }
				}else if($(this).hasClass('prev')){
					if($this.counter > step){ $this.counter = step + 1; }
				}
			
				// Add active class to center element
				$('#sslidercontainer ul li').removeClass('leftOff rightOff');
				if($(this).hasClass('next')){
					$this.Ul.find('li.active').removeClass('active').next().addClass('active');
					if($this.counter==1){
						$('#sslidercontainer ul li').eq(Math.round($this.settings.slidesToShow/2)-1).addClass('active').siblings().removeClass('active');
					}
				}else if($(this).hasClass('prev')){
					$this.Ul.find('li.active').removeClass('active').prev().addClass('active');
					if($this.counter-1==step){
						$('#sslidercontainer ul li').eq($('#sslidercontainer ul li').length-Math.round($this.settings.slidesToShow/2)).addClass('active').siblings().removeClass('active');
					}
				}

				$('#sslidercontainer ul li.active').nextAll().addClass('rightOff').end().prevAll().addClass('leftOff');

				// Animate slider
				$this.Ul.animate({

					// Animate margin-left/top based on counter,slides to show, slides to scroll
					[cssSettings.position] : -($this.counter-1)*((100/$this.settings.slidesToShow)*$this.settings.slidesToScroll) + "%",
					
					// Move ul container from left/top if needed (white space fix)
					[cssSettings.margin] : (function($this){
						var number = 0;

						// If white space appears
						if($this.counter>step){
							//Calculate how many empty slides(white spaces) will appear and add it to number var
							for(var i = $this.settings.slidesToShow; i <= $this.li.length + $this.settings.slidesToShow; i = i + $this.settings.slidesToScroll){
								if(i >= $this.li.length){ number = (i - $this.li.length); break;}	
							}
						}

						// Return number of white spaces times 100/slides to show
						return (number*(100/$this.settings.slidesToShow))+"%";

					}($this))

				}, $this.settings.animateSpeed, function(){
					// console.log($this.counter,step);
					// if($this.counter==step){
					// 	$this.counter = 1
					// 	$this.Ul.css({'left':'0%'});
					// }else if($this.counter===1){
					// 	$this.counter=$this.settings.slidesToShow;
					// 	//console.log($this.counter,'1212');
					// 	$this.Ul.css('left','-100%');
					// }
				});	
				
			}) // End on click/arrow press
			
		} // End clickSetup function
	}

	// Set global variable s_slider
	global.s_slider = initiate;
	
		
}(jQuery, window));