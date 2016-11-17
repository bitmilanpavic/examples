$(document).ready(function(){

/***********************************
 	GLOBAL(all pages) JAVASCRIPT
 **********************************/
	var menu = {
		menu:function(){
			var $this = this;
			this.menuIconDesktop = $('.menuIcon.menuIconDesktop');
			this.dashMenuDesktop = $('.dashMenu.desktop');
			this.toggleHideDesktop = $('.toggleHide');
			this.dashRightDesktop = $('.dashRight');
			this.menuIconDesktop.on('click', function(){
				$this.dashMenuDesktop.toggleClass('expanded');
				$this.toggleHideDesktop.toggleClass('toggleHideOpacity');
				$this.dashMenuDesktop.find('img').toggleClass('toggleImg');
				$this.dashRightDesktop.toggleClass('toggleBorder');
				return false;
			})
		},
		menuMobile:function(){
			var $this = this;
			this.menuIconMobile = $('.menuIcon.menuIconMobile');
			this.dashMenuMobile = $('.dashMenu.mobile');
			this.toggleHideMobile = $('.toggleHide');
			this.dashRightMobile = $('.dashRight');
			$('.menuIcon.menuIconMobile, .closeMobile').on('click', function(){
				$this.dashMenuMobile.closest('.dashLeft.dashLeftMobile').toggleClass('expanded');
				return false;
			})
		}

	}
	menu.menu();
	menu.menuMobile();

	// Search
	var search = {
		searchIconClick:function(){
			var $this = this;
			this.searchIcon = $('.searchIcon');
			this.searchForm = $('.searchForm');
			this.searchIcon.on('click', function(){
				$(this).hide();
				$this.searchForm.fadeIn().css('display','inline-block').find('input').focus();
				return false;
			});
		}
	}
	search.searchIconClick();



/**********************************************
 	GLOBAL(all pages) CART.JS CONFIGURATION
 **********************************************/	

	// round corners
	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				arc.round = {
					x: (chart.chartArea.left + chart.chartArea.right) / 2,
					y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
					radius: (chart.outerRadius + chart.innerRadius) / 2,
					thickness: (chart.outerRadius - chart.innerRadius) / 2 - 1,
					backgroundColor: arc._model.backgroundColor
				}
			}
		},

		afterDraw: function (chart) {
			if (chart.config.options.elements.arc.roundedCornersFor !== undefined) {
				var ctx = chart.chart.ctx;
				var arc = chart.getDatasetMeta(0).data[chart.config.options.elements.arc.roundedCornersFor];
				var startAngle = Math.PI / 2 - arc._view.startAngle;
				var endAngle = Math.PI / 2 - arc._view.endAngle;

				ctx.save();
				ctx.translate(arc.round.x, arc.round.y);
				ctx.fillStyle = arc.round.backgroundColor;
				ctx.beginPath();
				ctx.arc(arc.round.radius * Math.sin(startAngle), arc.round.radius * Math.cos(startAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.arc(arc.round.radius * Math.sin(endAngle), arc.round.radius * Math.cos(endAngle), arc.round.thickness, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.fill();
				ctx.restore();
			}
		},
	});

	// write text plugin
	Chart.pluginService.register({
		afterUpdate: function (chart) {
			if (chart.config.options.elements.center) {
				var helpers = Chart.helpers;
				var centerConfig = chart.config.options.elements.center;
				var globalConfig = Chart.defaults.global;
				var ctx = chart.chart.ctx;

				var fontStyle = helpers.getValueOrDefault(centerConfig.fontStyle, globalConfig.defaultFontStyle);
				var fontFamily = helpers.getValueOrDefault(centerConfig.fontFamily, globalConfig.defaultFontFamily);

				if (centerConfig.fontSize)
					var fontSize = centerConfig.fontSize;
					// figure out the best font size, if one is not specified
				else {
					ctx.save();
					var fontSize = helpers.getValueOrDefault(centerConfig.minFontSize, 1);
					var maxFontSize = helpers.getValueOrDefault(centerConfig.maxFontSize, 256);
					var maxText = helpers.getValueOrDefault(centerConfig.maxText, centerConfig.text);

					do {
						ctx.font = helpers.fontString(fontSize, fontStyle, fontFamily);
						var textWidth = ctx.measureText(maxText).width;

						// check if it fits, is within configured limits and that we are not simply toggling back and forth
						if (textWidth < chart.innerRadius * 2 && fontSize < maxFontSize)
							fontSize += 1;
						else {
							// reverse last step
							fontSize -= 1;
							break;
						}
					} while (true)
					ctx.restore();
				}

				// save properties
				chart.center = {
					font: helpers.fontString(fontSize, fontStyle, fontFamily),
					fillStyle: helpers.getValueOrDefault(centerConfig.fontColor, globalConfig.defaultFontColor)
				};
			}
		},
		afterDraw: function (chart) {
			if (chart.center) {
				var centerConfig = chart.config.options.elements.center;
				var ctx = chart.chart.ctx;

				ctx.save();
				ctx.font = chart.center.font;
				ctx.fillStyle = chart.center.fillStyle;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
				var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
				ctx.fillText(centerConfig.text, centerX, centerY);
				ctx.restore();
			}
		},
	})
	Chart.defaults.global.defaultFontFamily = "Roboto";
	Chart.defaults.global.defaultFontColor = "#7d889e";

	// GLOBAL CHART OBJECT
	var _chart = {
		donut:function(id, donutData, donutLabels, colors, centerText, centerTextColor, size, roundedCorners, showLabels, maxWidth ){
			var ctx = document.getElementById(id);
			if(!ctx) { return false;}
			ctx.style.maxWidth = maxWidth;
			ctx = ctx.getContext('2d');
			var roundCorners = (roundedCorners!==false)?{roundedCornersFor: 0}:{};
			var config = {
				type: 'doughnut',
				data: {
					labels: donutLabels,
					datasets: [{
						data: donutData,
						backgroundColor: colors,
						hoverBackgroundColor: colors,
						borderWidth:0
					}]
				},
				options:{
					legend:{
						display:false
					},
					animation:false,
					cutoutPercentage :size,
					segmentShowStroke: false,
					elements: {
						arc: roundCorners,
						center: {
							// the longest text that could appear in the center
							maxText: '100%',
							text: centerText,
							fontColor: centerTextColor,
							fontFamily: "Roboto",
							fontStyle: 'bold',
							fontSize: 30,
							// if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
							// if these are not specified either, we default to 1 and 256
							minFontSize: 1,
							maxFontSize: 30,
						}
					}
				}
			};
			
			var myChart = new Chart(ctx, config);
			
			if(showLabels===true){
				var html = "<ul class='chartLabels'>";
				for(var i = 0; i < donutLabels.length; i++){
					html+='<li><span style="background:'+colors[i]+'"></span>'+donutLabels[i]+'</li>';
				}
				html+="</ul>";
				$(html).insertAfter($('#'+id));
			}
			
		},

		reports:function(id, maxHeight, maxWidth, hideGridAndLabel, lineData, label, color, gradientColor, borderWidth){
			var ctx = document.getElementById(id);
			if(!ctx) { return false;}
			ctx.style.maxHeight=maxHeight;
			ctx.style.maxWidth = maxWidth;
			ctx = ctx.getContext('2d');

			var gradient = ctx.createLinearGradient(0, 0, 0, 400);
			gradient.addColorStop(0, 'rgba(86,132,255,1)');
			gradient.addColorStop(0.5, 'rgba(170,95,187,1)');  
			color = (gradientColor===false)? color : gradient;
			
			var set = {
		    	xAxes: [{
	                gridLines: {
	                    display:false,
	                    color: "rgba(0, 0, 0, 0)"
	                },
	                ticks: {
	                    display: false
	                }
		        }],
		   		yAxes: [{
	                gridLines: {
	                    display:false,
	                    color: "rgba(0, 0, 0, 0)"
	                },
	                ticks: {
	                     display: false
	                }   
		        }]    
		    }
		    var hideAll = (hideGridAndLabel===true)?set:{xAxes:[{gridLines:{color:'#e9ebf1'}}],yAxes:[{gridLines:{color:'#e9ebf1'}}]};
			
			new Chart(ctx, {
			    type: 'line',
			    data: {
			        datasets: [{
			        	data: lineData,
			            label: '',
			            showLine:true,
			            fill: false,
			            lineTension: 0.4,
			            backgroundColor: color,
			            borderColor: color,
			            borderCapStyle: 'butt',
			            borderDash: [],
			            borderDashOffset: 0.0,
			            borderJoinStyle: 'miter',
			            pointBorderColor: color,
			            pointBackgroundColor: color,
			            pointBorderWidth: 1,
			            pointHoverRadius: 5,
			            pointHoverBackgroundColor: color,
			            pointHoverBorderColor: color,
			            pointHoverBorderWidth: 2,
			            pointRadius: 0,
			            pointHitRadius: 10,
			            spanGaps: false,
			            borderWidth:borderWidth
			        }],
			        labels:label,
					// xLabels:['one','two'],
					// yLabels:['oneDown','twoDown']
			    },
			    options: {
			    	legend: {
			    		display: false
					},
					animation:false,
			        responsive:true,
			        maintainAspectRatio:false,
			        scales: hideAll
			    }
			});
		}
	} 


/*****************************
 	SINGLE PAGES JAVASCRIPT
 *****************************/

	// HOME PAGE CHARTS
	var id = 'reports',
	maxHeight = '255px',
	hideGridAndLabel = false,
	borderWidth = 5,
	lineData = [100,200,300,300,500,600,700,600,500,400,400,200],
	label = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
	color = '#5584ff',
	gradientColor = false,
	maxWidth = '100%';
	_chart.reports(id, maxHeight, maxWidth, hideGridAndLabel, lineData, label, color, gradientColor, borderWidth );

	var id = 'yoursales',
	data = [300, 150, 100, 400, 150],
	labels = ["Websites","Logo","Social Media","Adwords","E-Commerce"],
	colors = ["#25396e","#5584ff","#4b74e0","#3755a4","#4164c2"],
	showLabels = true,
	size = 62,
	centerTextColor = '#8492af',
	centerText = 0,
	roundedCorners = false,
	maxWidth = '202px';
	for(var i = 0; i<data.length; i++){
		centerText = centerText + data[i];
	}
	centerText = centerText.toLocaleString().toString();
	_chart.donut(id, data, labels, colors, centerText , centerTextColor, size, roundedCorners, showLabels, maxWidth);

	
	// STATISTICS PAGE CHARTS
	var id = 'activeUsers',
	maxHeight = '240px',
	hideGridAndLabel = false,
	borderWidth = 5,
	lineData = [100,200,300,300,500,600,700,600,500,400,400,200],
	label = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
	color = '#5584ff',
	gradientColor = true,
	maxWidth = '100%';
	_chart.reports(id, maxHeight, maxWidth, hideGridAndLabel, lineData, label, color, gradientColor, borderWidth );

	var id = 'statisticsChart1',
	maxHeight = '80px',
	hideGridAndLabel = true,
	borderWidth = 3,
	lineData = [100,200,300,300,500,600,700,600,500,400,400,200],
	label = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
	color = '#f83c7b',
	gradientColor = false,
	maxWidth = '162px';
	_chart.reports(id, maxHeight, maxWidth, hideGridAndLabel, lineData, label, color, gradientColor, borderWidth );

	var id = 'statisticsChart2',
	maxHeight = '80px',
	hideGridAndLabel = true,
	borderWidth = 3,
	lineData = [100,200,300,300,500,600,700,600,500,400,400,200],
	label = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec'],
	color = '#5584ff',
	gradientColor = false,
	maxWidth = '162px';
	_chart.reports(id, maxHeight, maxWidth, hideGridAndLabel, lineData, label, color, gradientColor, borderWidth );

	var id = 'statisticsChart3',
	data = [45, 100-45],
	labels = ["one",'two'],
	colors = ["#5484ff","#dadee7"],
	showLabels = false,
	centerText = '45%',
	centerTextColor = '#5484ff',
	size = 80,
	roundedCorners = 0,
	maxWidth = '133px';
	_chart.donut(id, data, labels, colors, centerText, centerTextColor, size, roundedCorners, showLabels, maxWidth);

	var id = 'statisticsChart4',
	data = [20, 100-20],
	labels = ["one",'two'],
	colors = ["#aa5fb9","#dadee7"],
	showLabels = false,
	centerText = '20%',
	centerTextColor = "#aa5fb9",
	size = 80,
	roundedCorners = 0,
	maxWidth = '133px';
	_chart.donut(id, data, labels, colors, centerText, centerTextColor, size, roundedCorners, showLabels, maxWidth);

	var id = 'statisticsChart5',
	data = [25, 100-25],
	labels = ["one",'two'],
	colors = ["#f83c7b","#dadee7"],
	showLabels = false,
	centerText = '25%',
	centerTextColor = "#f83c7b",
	size = 80,
	roundedCorners = 0,
	maxWidth = '133px';
	_chart.donut(id, data, labels, colors, centerText, centerTextColor, size, roundedCorners, showLabels, maxWidth);
	

	// WORKFLOW PAGE
	var length = $('#_toDo').find('li').length;
    $('#_toDo').prev('h2').find('span').html('('+length+')');
    	
	var length = $('#_inProgress').find('li').length;
	$('#_inProgress').prev('h2').find('span').html('('+length+')');
    	
	var length = $('#_completed').find('li').length;
	$('#_completed').prev('h2').find('span').html('('+length+')');

	var drag = {
		init:function(){
			this.startDragula();	
		},

		startDragula:function(){
			dragula([document.getElementById('_toDo'), document.getElementById('_inProgress'),document.getElementById('_completed')])
			.on('drag', function (el, target) {
		   	 	el.className = el.className.replace('', 'gu-preserveStyle');
		  	}).on('drop', function (el, target) {
		    	 el.className = el.className.replace('gu-preserveStyle', 'dropped');

		    	var length = $('#_toDo').find('li').length;
		    	$('#_toDo').prev('h2').find('span').html('('+length+')');
		    	
		    	var length = $('#_inProgress').find('li').length;
		    	$('#_inProgress').prev('h2').find('span').html('('+length+')');
		    	
		    	var length = $('#_completed').find('li').length;
		    	$('#_completed').prev('h2').find('span').html('('+length+')');

		    	// if(target.id=='_completed'){
		    	// 	this.days = $('.dropped').find('._days');
		    	// 	this.days.attr({'data-html':this.days.html(),'data-class':this.days.attr('class')});
		    	// 	this.days.html('<i class="fa fa-check-circle-o" aria-hidden="true"></i>Completed').removeClass('_pinkColor').addClass('_greenColor');
		    	// 	this.days.addClass('changed');
		    	// }else{
	    		// 	$('.changed')
	    		// 	.addClass( $('.changed').data('class') )
	    		// 	.html( $('.changed').data('html') ).removeClass('changed _greenColor')
	    		// 	.removeAttr('data-html').removeAttr('data-class');
		    	// }

		    	$('.dropped').removeClass('dropped');
		  	});	
		}
	}
	drag.init();


	// USERS PAGE PAGINATION
	var itemsOnPage = 6;

 	var elements = $('tbody tr');
 	var elementsLength = elements.length;
 	$('.totalUserCount').html('('+elementsLength+')');
 	
	function pagesArray(a,b){
		var arr=[];
		for(var i=a+1;i<=b;i++){
			arr.push(i);
		}
		return arr;
	}

	var a = (1*itemsOnPage)-itemsOnPage;
	var b = 1*itemsOnPage;

	elements.each(function(i){
		$(this).hide();
		if($.inArray($(this).index()+1, pagesArray(a,b))!==-1 ){
			$(this).show();
		}
	});
	elements.closest('table').removeClass('hidden');
	$('#paginate').pagination({
	    items: elementsLength,
	    itemsOnPage: itemsOnPage,
	    cssStyle: 'light-theme',
	    prevText:'<i class="fa fa-angle-left" aria-hidden="true"></i>',
	    nextText:'<i class="fa fa-angle-right" aria-hidden="true"></i>',
	    onPageClick:function(pageNumber){
			var a = (pageNumber*itemsOnPage)-itemsOnPage;
			var b = pageNumber*itemsOnPage;
			elements.each(function(i){
				$(this).hide();
				if($.inArray($(this).index()+1, pagesArray(a,b))!==-1 ){
					$(this).show();
				}
			});
	    }
	});


	// CALENDAR PAGE
	var imageSrc = "img/userImage.png",
	username = "User Name",
	userrole = "User Role",
	title = "Click here to edit event",
	startTime = "02:00",
	endTime = "02:00",
	place = "";
	var eventInformation = '<div class="_eventInformation">\
    			<a href="#" class="_close">X</a>\
					<div class="_eventInformationTop"><span>AUTHOR:</span><br>\
						<div class="_imgContainer"><img src="' + imageSrc + '"></div>\
						<div class="_userInfo"><span class="_username">' + username + '</span><span class="_userrole">' + userrole + '</span></div>\
					</div>\
					<table class="_eventInformationMiddle">\
						<tr>\
							<td>TITLE:</td><td class="titleValue">' + title + '</td>\
						</tr>\
							<td>START:</td><td class="startValue">'+ startTime +'</td>\
						<tr>\
							<td>ENDS:</td><td class="endValue">' + endTime + '</td>\
						</tr>\
						<tr>\
							\<td>PLACE:</td><td class="placeValue">' + place + '</td>\
						</tr>\
					</table>\
					<a href="#" class="_editButton">Edit event</a>\
				</div>\
				<div class="_editEventContainer">\
					<a href="#" class="_close">X</a>\
					<a href="#" class="_deleteEvent">Delete Event</a>\
					<div class="_inputContainer">\
						<label for="_title_">TITLE:</label>\
						<input type="text" id="_title_" name="_title_" value="'+title+'">\
					</div>\
					<div class="_inputContainer">\
						<label for="_starts_">STARTS:</label>\
						<input type="text" id="_starts_" name="_starts_" value="'+startTime+'">\
					</div>\
					<div class="_inputContainer">\
						<label for="_title_">ENDS:</label>\
						<input type="text" id="_ends_" name="_ends_" value="'+endTime+'">\
					</div>\
					<div class="_inputContainer containsCheckbox">\
						<label> <input type="checkbox" id="_longevent_" name="_longevent_"> <span>LONG EVENT(multiple days)</span></label>\
					</div>\
					<div class="_inputContainer">\
						<label for="_title_">PLACE:</label>\
						<input type="text" id="_place_" name="_place_" value="'+place+'">\
					</div>\
					<a href="#" class="_updateEvent_">Update event</a>\
				</div>\
				';
	
	$('body').on('click','._editButton', function(){
		$('._showeventInformation').removeClass('_showeventInformation').addClass('_showEventContainer');
		return false;
	});
	
	$('body').on('click','._close' , function(){
		var element = $(this).closest('td').find('>a');
		$('._showeventInformation, ._showEventContainer').removeClass('_showeventInformation _showEventContainer');
			
		return false;
	});

	$('body').on('click','._deleteEvent' , function(){
		var element = $(this).closest('td').find('>a');
		$('#calendar').fullCalendar('removeEvents',element.attr('id'));
		// For AJAX send id here...

		return false;
	});
	

	$('body').on('click','._updateEvent_' , function(){
		var id = $(this).closest('td').find('>a').attr('id');
		var element = $('#'+id);
		
		element.data('starttime', element.parent().find('#_starts_').val());
		element.data('endtime', element.parent().find('#_ends_').val());

		var start = element.data('start');
		var end = element.data('end');
		var hoursMinutesStart = element.data('starttime').split(":");
		var hoursMinutesEnd = element.data('endtime').split(":");

		var months = {'Jan':'0','Feb':'1','Mar':'2','Apr':'3','May':'4','Jun':'5',
				'Jul':'6','Aug':'7','Sep':'8','Oct':'9','Nov':'10','Dec':'11'}
		var startArray = start.split(" ");
		var endArray = end.split(" ");

		var year = parseFloat(startArray[3]);
		var month = parseFloat(months[startArray[1]]);
		var date = parseFloat(startArray[2]);
		
		var newStartDate = new Date();
		newStartDate.setFullYear(year);
		newStartDate.setMonth(month);
		newStartDate.setDate(date);
		newStartDate.setHours(parseFloat(hoursMinutesStart[0]));
		newStartDate.setMinutes(parseFloat(hoursMinutesStart[1]));
		
		var year = parseFloat(endArray[3]);
		var month = parseFloat(months[endArray[1]]);
		var date = parseFloat(endArray[2]);
		
		var newEndDate = new Date();
		newEndDate.setFullYear(year);
		newEndDate.setMonth(month);
		newEndDate.setDate(date);
		newEndDate.setHours(parseFloat(hoursMinutesEnd[0]));
		newEndDate.setMinutes(parseFloat(hoursMinutesEnd[1]));
			
		
		$('#calendar').fullCalendar('removeEvents',id);
        var newEvent = {
        	uniqueid:id,
            title: element.parent().find('#_title_').val(),
            start: newStartDate,
            end: newStartDate,
            place: element.parent().find('#_place_').val(),
            longevent:"false",
            starttime:element.parent().find('#_starts_').val(),
            endtime:element.parent().find('#_ends_').val()
        };
        var forAjax = {
        	uniqueid:id,
            title: element.parent().find('#_title_').val(),
            start: newStartDate.getFullYear()+'-'+('0' + (newStartDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newStartDate.getDate()).slice(-2)+"T"+element.parent().find('#_starts_').val(),
            end: newStartDate.getFullYear()+'-'+('0' + (newStartDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newStartDate.getDate()).slice(-2)+"T"+element.parent().find('#_ends_').val(),
            place: element.parent().find('#_place_').val(),
            longevent:"false",
            starttime:element.parent().find('#_starts_').val(),
            endtime:element.parent().find('#_ends_').val()
        };

        var MyDateString = newStartDate.getFullYear()+'-'+('0' + (newStartDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newStartDate.getDate()).slice(-2);
        var MyDateStringEnd = newEndDate.getFullYear()+'-'+('0' + (newEndDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newEndDate.getDate()).slice(-2);

        if(element.parent().find('#_longevent_').is(':checked')){
        	var newEvent = {
        		uniqueid:id,
	            title: element.parent().find('#_title_').val(),
	            start: MyDateString,
	            end: MyDateStringEnd,
	            place: element.parent().find('#_place_').val(),
	            longevent:"true",
	            starttime:element.parent().find('#_starts_').val(),
            	endtime:element.parent().find('#_ends_').val()
       		}
       		forAjax = {
        		uniqueid:id,
	            title: element.parent().find('#_title_').val(),
	            start: MyDateString,
	            end: MyDateStringEnd,
	            place: element.parent().find('#_place_').val(),
	            longevent:"true",
	            starttime:element.parent().find('#_starts_').val(),
            	endtime:element.parent().find('#_ends_').val()
       		}
        }

        // For AJAX send id here
        // console.log(forAjax);

        $('#calendar').fullCalendar( 'renderEvent', newEvent , 'stick');
	 	
	 	$('._showEventContainer').removeClass('_showEventContainer');	
		return false;
	});
	
	 var eventsArray = [
				 {
				 	title:'Event 1',
				 	start:'2016-09-12T14:00',
				 	end:'2016-09-12T14:30',
				 	uniqueid:'_fc1',
				 	place:'Place 1',
				 	starttime:'14:00',
				 	endtime:'14:30',
				 	longevent:"false"
				 },
				 {
				 	title:'Event 2',
				 	start:"2016-09-07",
				 	end:"2016-09-09",
				 	uniqueid:'_fc2',
				 	place:'Place 2',
				 	starttime:'13:00',
				 	endtime:'14:30',
				 	longevent:"true"
				 }
	];
	var arr = [];
	$('#calendar').fullCalendar({
			header: {left: 'title',center: '',right: ''},
			// defaultDate: '2016-09-04',
			selectable: true,
			selectHelper: true,
			editable: true,
			eventLimit: false, // allow "more" link when too many events
			events:eventsArray,
			timeFormat: 'HH:mm',
			timezone: "local",
			eventRender:function(event, element, view){
				event._id = event.uniqueid;
				element.attr({
					'id': event._id,
					'data-title': event.title,
					'data-start': new Date(event.start),
					'data-end':  new Date(event.end), 
					'data-place':event.place,
					'data-longevent':event.longevent,
					'data-starttime':event.starttime,
					'data-endtime':event.endtime		
				});
			
			},
			select: function(start, end, jsEvent, view) {
				
				if($('._eventInformation').is(':visible') || $('._editEventContainer').is(':visible')){
					$('#calendar').fullCalendar('unselect');
					return false
				}else{
					start._d.setHours(13);
					var uniqueid = '_fc'+Math.floor((Math.random() * 1000000) + 1).toString();
					while($('#'+uniqueid).length>0){
						uniqueid = '_fc'+Math.floor((Math.random() * 1000000) + 1).toString();
					}
					
					var MyDateString = start._d.getFullYear()+'-'+('0' + (start._d.getMonth()+1)).slice(-2)+'-'+ ('0' + start._d.getDate()).slice(-2);
					var eventData = {
						title: "Click here to edit event",
						start: MyDateString+'T13:00',
						end: MyDateString+'T13:00',
						place:"",
						longevent:"false",
						starttime:"13:00",
						endtime:"13:00",
						uniqueid:uniqueid
					}
				 	$('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
					$('#calendar').fullCalendar('unselect');
				}
			},
			// VAZNO
    		eventAfterAllRender:function(view){
    			//console.log('hmm');
    			if(!$('.fc-toolbar .fc-left h2>a').length){
	    			$('<a href="#"><i class="fa fa-caret-left" aria-hidden="true"></i></a>').on('click', function(){
						 $('#calendar').fullCalendar('prev');
					}).prependTo('.fc-toolbar .fc-left h2');
					$('<a href="#"><i class="fa fa-caret-right" aria-hidden="true"></i></a>').on('click', function(){
						 $('#calendar').fullCalendar('next');
					}).appendTo('.fc-toolbar .fc-left h2');
				}
    			$(eventInformation).insertAfter($('.fc-event-container>a'));

    			$('#_starts_, #_ends_').timepicker({timeFormat:"HH:mm"});
					
    		},
    		eventClick: function(callEvent, jsEvent, view) {
    			var id = callEvent._id;
    			
    			if(!$('._eventInformation').is(':visible')){
    				var element = $('#'+id);
    				
					var info = element.closest('td').find('._eventInformation');
					info.find('.titleValue').text(element.data('title'));
					info.find('.startValue').text(element.data('starttime'));
					info.find('.endValue').text(element.data('endtime'));
					info.find('.placeValue').text(element.data('place'));

					var editEvent = element.closest('td').find('._editEventContainer');
					editEvent.find('#_title_').val(element.data('title'));
					editEvent.find('#_starts_').val(element.data('starttime'));
					editEvent.find('#_ends_').val(element.data('endtime'));
					editEvent.find('#_place_').val(element.data('place'));

					if(element.data('longevent')==true){
						editEvent.find('#_longevent_').prop('checked', true);
					}else{
						editEvent.find('#_longevent_').prop('checked', false);
					}

	    			$('.fc-row').css('z-index','1');
	    			$('._showeventInformation').removeClass('_showeventInformation');
				    
				    element.addClass('_showeventInformation');

				    $('._showeventInformation').closest('.fc-row').css('z-index','2').siblings().css('z-index','1');
				}
			},

			eventResize:function(event, delta, revertFunc, jsEvent, ui, view ) {
				var months = {'Jan':'0','Feb':'1','Mar':'2','Apr':'3','May':'4','Jun':'5',
				'Jul':'6','Aug':'7','Sep':'8','Oct':'9','Nov':'10','Dec':'11'}
				var id = event.id;
				var element = $('#'+id);
				var end = event._end._d.toString();
				var endArray = end.split(" ");
				var year = parseFloat(endArray[3]);
				var month = parseFloat(months[endArray[1]]);
				var date = parseFloat(endArray[2]);
				var newEndDate = new Date();
				newEndDate.setFullYear(year);
				newEndDate.setMonth(month);
				newEndDate.setDate(date);
				var MyDateStringEnd = newEndDate.getFullYear()+'-'+('0' + (newEndDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newEndDate.getDate()).slice(-2)
				// Ajax use id to update end date whit MyDateStringEnd
			},
			eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ) { 
				var months = {'Jan':'0','Feb':'1','Mar':'2','Apr':'3','May':'4','Jun':'5',
				'Jul':'6','Aug':'7','Sep':'8','Oct':'9','Nov':'10','Dec':'11'}
				var id = event.id;
				var element = $('#'+id);
				
				var start = event._start._d.toString();
				var startArray = start.split(" ");

				var year = parseFloat(startArray[3]);
				var month = parseFloat(months[startArray[1]]);
				var date = parseFloat(startArray[2]);
				var newStartDate = new Date();
				newStartDate.setFullYear(year);
				newStartDate.setMonth(month);
				newStartDate.setDate(date);

				var MyDateStringStart = newStartDate.getFullYear()+'-'+('0' + (newStartDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newStartDate.getDate()).slice(-2);

				var MyDateStringEnd = null;
				if(event._end){
					var end = event._end._d.toString();
					var endArray = end.split(" ");

					var year = parseFloat(endArray[3]);
					var month = parseFloat(months[endArray[1]]);
					var date = parseFloat(endArray[2]);
					var newEndDate = new Date();
					newEndDate.setFullYear(year);
					newEndDate.setMonth(month);
					newEndDate.setDate(date);

					MyDateStringEnd = newEndDate.getFullYear()+'-'+('0' + (newEndDate.getMonth()+1)).slice(-2)+'-'+ ('0' + newEndDate.getDate()).slice(-2);

				}
				//console.log(MyDateStringStart, MyDateStringEnd);
				// Ajax use id to update end date whit MyDateStringEnd and MyDateStringStart
				
			},
			eventResizeStart:function( event, jsEvent, ui, view ) {
				$('#calendar td').css('position','static');
			},
			eventResizeStop:function( event, jsEvent, ui, view ) {
				$('#calendar td').css('position','relative');
			},
			dayRender: function (date, cell) {
	           	
	        },
	        dayClick: function (date, jsEvent, view) {
				
    		},
    		
		});
	
		var viewshtml = '<select class="_custom chooseView">\
		<option value = "month">Month</option><option value = "basicWeek">Week</option><option value = "basicDay">Day</option>\
		</select>';
		$('.fc-toolbar .fc-right').prepend(viewshtml);
		$('body').on('change','.chooseView', function(){
			var value = $(this).val();
			if(value=='basicDay'){
				$('#calendar').fullCalendar('changeView', 'basicDay');
			}else if(value=='basicWeek'){
				$('#calendar').fullCalendar('changeView', 'basicWeek');
			}else{
				$('#calendar').fullCalendar('changeView', 'month');
			}
		})
	
});

