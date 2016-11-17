(function($){
$(document).ready(function(){

	// Mobile phone and search form
	var elements = $('#mobile-phone, #mobile-form');
	$('.mobile-search-phone a').on('click', function(e){
		e.preventDefault();
		var id = $(this).attr('href');
		elements.hide();
		$(id).show();

		return false;	
	})	
	
});	
}(jQuery))