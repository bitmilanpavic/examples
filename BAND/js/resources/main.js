(function($){
$(document).ready(function(){

	$('.carousel').carousel();
	$('.carousel-indicators li').eq(2).addClass('active');
	$('.carousel-inner .item').eq(2).addClass('active');

	setTimeout(function(){
		$('.overlay').hide();	
	},4000);
	

	// Append menu hover elements
	$('header a,.footer-menu a').each(function(){
		var aWidth = $(this).outerWidth();
		var numberOfLis = Math.round(aWidth/7);
		var html="<ul>";
		for(var i=0; i<numberOfLis;i++){
			html+="<li></li>";
		}
		html+="</ul>";
		$(html).appendTo($(this));
	})

	// Audio object
	var audio = {
		playlist:[],
		index:0,
		activeTrack:{},

		init:function(src){
			this.listDataOnLoad(src);
			this.onListenButtonClick();
			this.onTrackClick();
			this.whenTrackEnd();
			this.whenClickOnPlayPause();
			this.whenClickOnPrevNext();
			this.audioProgressBar();
		},

		// List authors and songs from first author when page loads
		listDataOnLoad : function(src){
			var thisObject = this;

			this.getJSON(src, function(data){
				var items = [];
				var allAuthors = [],active;

				if(data.HasErrors===false){

					for (var i=0; i < data.Author.length; i++) {
						var author = data.Author[i];

						// Get first author songs
						if(i===0){
							for (var j=0; j < author.Tracks.length; j++) {

								//Add first track to audio plyer
								if(j===0){
									$('audio, audio>source').attr({"src":author.Tracks[j].src,"data-index":0});
									$('audio')[0].play();
									$('h3.authorNameAudio').html(author.Name+"<small>"+ author.Tracks[j].TrackNumber+". " + author.Tracks[j].TrackName+"</small>");
									$('h3.authorName').html(author.Name);
								}
								active=(j===0)?'active':'';
								var html = '\
								<li>\
									<a href="#" class="track '+active+'" data-src="' +  author.Tracks[j].src + '" data-tracknumber="'+author.Tracks[j].TrackNumber+'" data-trackname="'+author.Tracks[j].TrackName+'" data-authorname="'+ author.Name+'">' + author.Tracks[j].TrackNumber+". " + author.Tracks[j].TrackName + '</a>\
									<span class="trackTime pull-right">' + author.Tracks[j].TrackTime + '</span>\
								</li>';

								items.push(html);
								thisObject.playlist.push(author.Tracks[j]);
							}
									
						}	
						
						var html = '\
								<li>\
									<div class="nameContainer"><h3>' + author.Name + '</h3></div>\
									<div class="circleContainer"><span class="circle"></span></div>\
									<div class="yearContainer"><span class="year">' + author.Year + '</span></div>\
									<div class="listenButtonContainer"><a href="#" class="button listen" data-authorname="' + author.Name + '">LISTEN</a></div>\
									<div class="buyButtonContainer"><a href="#" class="button buy">BUY</a></div>\
								</li>';
						allAuthors.push(html);
						
					}

					// Append tracks from first auhor
					$("<ul>",{
						"class":"tracks",
						"html":items.join("")
					}).appendTo(".tracksContainer");

					// List all authors
					$("<ul>",{
						"class":"Discography",
						"html":allAuthors.join("")
					}).insertAfter("h2.Discography");

					var active = $('ul.tracks a.active'),
					authorname = active.data('authorname'),
					tracknumber = active.data('tracknumber');

					thisObject.activeTrack={authorName:authorname,trackNumber:tracknumber};
					
				}	
			});
		},

		// When click on track
		onTrackClick:function(){
			var thisObject = this;
			$('body').on('click','a.track',function(){
				$(this).addClass('active').parent().siblings().find('a').removeClass('active');
				var src = $(this).data('src'),
				trackNumber = $(this).data('tracknumber'),
				trackName = $(this).data('trackname'),
				authorName = $(this).data('authorname');
				var playlist = [];

				thisObject.index = $(this).parent().index();
				thisObject.playlist = [];

				$(this).closest('ul').find('li').each(function(){
					var trackNameAll = $(this).find('a').data('trackname');
					var trackNumberAll = $(this).find('a').data('tracknumber');
					var srcAll = $(this).find('a').data('src');
					var authorName = $(this).find('a').data('authorname');

					thisObject.playlist.push({'TrackName':trackNameAll, 'TrackNumber':trackNumberAll, 'src':srcAll,'TrackAuthor':authorName});
				});
				
				$('audio, audio>source').attr({"src":src,"data-index":thisObject.index});
				$('audio')[0].play();
				
				$('h3.authorNameAudio').html(authorName+"<small>"+ trackNumber+". " + trackName+"</small>");
				thisObject.activeTrack={authorName:authorName,trackNumber:trackNumber};
				return false;	
			})	
		},

		// When track end
		whenTrackEnd:function(){
			var thisObject = this;

			$('audio').on('ended', function(){
				
				var length = thisObject.playlist.length;
				thisObject.index++;
				thisObject.index=(thisObject.index>length-1)? 0 : thisObject.index;

				$(this).attr({src:thisObject.playlist[thisObject.index].src});
				$('h3.authorNameAudio>small').html(thisObject.playlist[thisObject.index].TrackNumber+". " + thisObject.playlist[thisObject.index].TrackName);
				$(this)[0].play();

				thisObject.activeTrack={authorName:$('h3.authorName').text(),trackNumber:thisObject.playlist[thisObject.index].TrackNumber};
				$('ul.tracks a').each(function(){
					if($(this).data('authorname') === thisObject.activeTrack.authorName && $(this).data('tracknumber') === thisObject.activeTrack.trackNumber){
						$(this).addClass('active').parent().siblings().find('a').removeClass('active');
					}
				})
			})
		},

		// When clikc on listen button next to author
		onListenButtonClick:function(){
			var thisObject = this;

			$('body').on('click','a.listen', function(){
				var authorName = $(this).data('authorname'),
				items = [];

				// Remove previous list
				$('ul.tracks').remove();

				thisObject.getJSON('json/songs.json', function(data){
					
					for (var i=0; i < data.Author.length; i++) {
						var author = data.Author[i];

						//If author name from clicked element match autor from json
						if(authorName === author.Name ){
							for (var j=0; j < author.Tracks.length; j++) {
								active=(author.Tracks[j].TrackNumber===thisObject.activeTrack.trackNumber&&author.Name===thisObject.activeTrack.authorName)?'active':'';
								var html = '\
								<li>\
									<a href="#" class="track '+active+'" data-src="' +  author.Tracks[j].src + '" data-tracknumber="'+author.Tracks[j].TrackNumber+'" data-trackname="'+author.Tracks[j].TrackName+'" data-authorname="'+ author.Name+'">' + author.Tracks[j].TrackNumber+". " + author.Tracks[j].TrackName + '</a>\
									<span class="trackTime pull-right">' + author.Tracks[j].TrackTime + '</span>\
								</li>';
								items.push(html);	
							}			
						}
					}

					// Append tracks from clicked author
					$("<ul>",{
						"class":"tracks",
						"html":items.join("")
					}).appendTo(".tracksContainer");
					$('h3.authorName').html(authorName);
				});
	
				$('ul.tracks a').each(function(){
					if($(this).data('authorname') === thisObject.activeTrack.authorName && $(this).data('tracknumber') === thisObject.activeTrack.trackNumber){
						$(this).addClass('active').parent().siblings().find('a').removeClass('active');
					}
				})

				return false;
			});	
		},

		whenClickOnPlayPause:function(){
			$('a.playPause').on('click', function(){
				$(this).toggleClass('active');
				if($(this).hasClass('active')){
					$('audio')[0].pause();
				}else{
					$('audio')[0].play();
				}
				return false;
			});
		},

		whenClickOnPrevNext:function(){
			var thisObject = this;

			$('.controlsContainer>a:not(.playPause)').on('click', function(){
				var direction = $(this).data('direction');
				if(direction==='next'){
					thisObject.index++;
				}else{
					thisObject.index--;
				}

				var length = thisObject.playlist.length;
				
				thisObject.index=(thisObject.index>length-1)? 0 : thisObject.index;
				thisObject.index=(thisObject.index<0)? length-1 : thisObject.index;
				
				$('h3.authorNameAudio>small').html(thisObject.playlist[thisObject.index].TrackNumber+". " + thisObject.playlist[thisObject.index].TrackName);	
				$('audio').attr({src:thisObject.playlist[thisObject.index].src});
				
				if(!$('a.playPause').hasClass('active')){
					$('audio')[0].play();	
				}
				
				thisObject.activeTrack={authorName:$('h3.authorName').text(),trackNumber:thisObject.playlist[thisObject.index].TrackNumber};
				
				$('ul.tracks a').each(function(){
					if($(this).data('authorname') === thisObject.activeTrack.authorName && $(this).data('tracknumber') === thisObject.activeTrack.trackNumber){
						$(this).addClass('active').parent().siblings().find('a').removeClass('active');
					}
				})
				return false;
			});
		},

		audioProgressBar:function(){
			$('audio').on('timeupdate', function() {
				var percentagePassed = 100*(this.currentTime/this.duration);
	    		$('.playhead').css("margin-left", (percentagePassed/100)*$('.timeline').outerWidth()+'px');  
	    
			});

			$('.timeline').on('click', function(e){
				var music = document.getElementById('music'),
				newMarginLeft = e.pageX - $(this).offset().left,
				timelineContainerWidth = $('.timelineContainer').outerWidth(), 
				percent = 100*(newMarginLeft/timelineContainerWidth);

				music.currentTime = (percent/100)*music.duration;
			});
		},

		// HELPER (get json data)
		getJSON:function(src, callback){
			$.getJSON(src, function(data){
				callback(data);
			}).error(function(){
				console.log('error');
			});
		}

	}
	audio.init('json/songs.json');

	// Tour Dates Slider
	var slidestoshow=12;
	var ac=0;
	$('.eventsContainerTopSlider').bxSlider({
	    slideWidth: 75,
	   	minSlides: slidestoshow,
	    maxSlides: slidestoshow,
	    moveSlides: 1,
	    pager: false,
	    // slideMargin: 10,
	    infiniteLoop:true,
	    onSlideAfter: function (currentSlideHtmlObject, totalSlideQty, currentSlideNumber) {

	    	// console.log(currentSlideHtmlObject,currentSlideNumber);
		    // // $('.slide').removeClass('activeSlide leftAll rightAll');
		    // // $('.eventsContainerTopSlider .slide').eq(currentSlideHtmlObject + 1).addClass('activeSlide');
		},
		onSliderLoad: function (currentIndex) {
		    $('.eventsContainerTopSlider .slide').each(function(){
		    	if($(this).hasClass('slide') && !$(this).hasClass('bx-clone') ){
		    		
		    		var index = $(this).index();
		    		var eqq = index+(Math.floor(slidestoshow/2));
		    		
	 	  			$('.eventsContainerTopSlider .slide').eq(eqq).addClass('activeSlide');
	 	  			$('.eventsContainerTopSlider .slide.activeSlide').nextAll().addClass('rightAll').end().prevAll().addClass('leftAll');
		    		return false;
		    	}
		    })
		    var counter = 0;
		    $('.bx-controls-direction>a').on('click', function(){
						    	
		    		if($(this).hasClass('bx-next')){
		    			counter++;
			    		$('.eventsContainerTopSlider .slide.activeSlide').removeClass('activeSlide').next().addClass('activeSlide');
			    	}else{
			    		counter--;
			    		$('.eventsContainerTopSlider .slide.activeSlide').removeClass('activeSlide').prev().addClass('activeSlide');
			    	}
			    	$('.eventsContainerTopSlider .slide').removeClass('leftAll rightAll');
			    	$('.eventsContainerTopSlider .slide.activeSlide').nextAll().addClass('rightAll').end().prevAll().addClass('leftAll');

			    	function run(){
			    		setTimeout(function(){
			    			$('.eventsContainerTopSlider .slide').removeClass('leftAll rightAll');
			    			$('.eventsContainerTopSlider .slide').each(function(){
					    	if($(this).hasClass('slide') && !$(this).hasClass('bx-clone') ){
					    		var index = $(this).index();
					    		var eqq = index+(Math.floor(slidestoshow/2));		
				 	  			$('.eventsContainerTopSlider .slide').eq(eqq).addClass('activeSlide');
				 	  			$('.eventsContainerTopSlider .slide.activeSlide').nextAll().addClass('rightAll').end().prevAll().addClass('leftAll');
					    		return false;
					    	}
					    })
			    		},500)
			    	}
			    	
			    	counter=(counter===slidestoshow || counter===-slidestoshow)?0:counter;
			    	if(counter===0){
			    		run();
			    	}
			    	if(counter===-1){
			    		setTimeout(function(){
			    			$('.eventsContainerTopSlider .slide').removeClass('leftAll rightAll activeSlide');
			    			$('.eventsContainerTopSlider .slide').eq($('.eventsContainerTopSlider .slide').length-(slidestoshow/2)-1).addClass('activeSlide');
			    			$('.eventsContainerTopSlider .slide.activeSlide').nextAll().addClass('rightAll').end().prevAll().addClass('leftAll');
			    		},500)
			    	}
			    	
						
					
		    	
		    })
		}
	  })

	//Add circles above slides
	var html="<ul class='sliderDots'>";
		for(var i=0; i<slidestoshow;i++){
			html+="<li><span></span></li>";
		}
	html+="</ul>";
	$('.bx-wrapper').prepend($(html));
	$('.bx-wrapper > ul li').each(function(){
		if($(this).index()===(Math.floor($('.bx-wrapper> ul li').length/2))){
			$(this).addClass('center');
		}
		$('.bx-wrapper >ul li.center').nextAll().addClass('rightOff');
	})
	var media  = window.matchMedia( "(max-width: 991px)" );
	 if(media){
	 	console.log('ok');
	 }

	// Scroll plugin
	$('.eventsContainer').jScrollPane();

	// When click on menu
  	$('ul li a[href^="#"]').on('click', function(event) {
	  $(this).parent().addClass('active').siblings().removeClass('active');
	  var target = $( $(this).attr('href') );
	  if( target.length ) {
	      event.preventDefault();
	      $('html, body').animate({
	          scrollTop: target.offset().top
	      }, 1500);
	  }
  	});


});
}(jQuery))