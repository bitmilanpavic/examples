(function($, global){
$(document).ready(function(){
	
	var products = {
		cart: [],
		gold: [],
		silver: [],
		bars: [],
		coins: [],
		allProducts: '',

		// Call all methods
		init: function(){
			this.startCountdown();
		},	

		//When change categories
		categoryChange: function(thisObject){
			var products = $('ul.products > li');
			
			$('#gold, #silver, #bars, #coins').on('change', function(){
				products.show();
				var bars,coins,gold,silver;
				var category = $(this).attr('id');

				bars = ( !$('#bars').is(':checked'))? false : true;
				coins = ( !$('#coins').is(':checked'))?false : true;	
				gold = (!$('#gold').is(':checked'))?false : true;
				silver = (!$('#silver').is(':checked'))?false : true;
				
				var ar = [gold,silver,bars,coins];
				var arString = ['gold','silver','bars','coins'];
				var selectedCategoriesArray=[];

				// Generate array whit string values of selected categories
				for(var i=0; i<ar.length;i++){
					if(ar[i]==true){
						selectedCategoriesArray.push(arString[i]);
					}
				}

				// Filter products by category
				thisObject.filterByCategoryes(thisObject, selectedCategoriesArray, products, ['gold','silver','bars','coins']);

				// Save to localstorage
				localStorage.removeItem('selectedCategories');
				localStorage.setItem("selectedCategories", JSON.stringify(selectedCategoriesArray));

			})
		},

		// Filter products by categories (used inside getProducts and categoryChange)
		filterByCategoryes : function(thisObject, selectedCategoriesArray, products, arString){
			if(!selectedCategoriesArray){selectedCategoriesArray = ['gold','silver']}
			//Generate category spans
			$('.rightContentTopCategories span').remove();
			var span = [];
			for(var i=0; i < selectedCategoriesArray.length; i++){
				var html = '<span class="close"><span>' + selectedCategoriesArray[i] + '</span><a href="#"><img src="img/close.jpg" alt="close"></span>';
				span.push(html);
			}

			// Add span close elements and add click function
			for(var i =0; i<span.length; i++){
				$(span[i]).appendTo('.rightContentTopCategories').find('a').click(function(){
					var id = $(this).prev().text();
					$('#'+id).prop('checked',false);
					$(this).parent().remove();

					var selectedCategoriesArray = [];
					$('.rightContentTopCategories .close>span').each(function(){
						selectedCategoriesArray.push( $(this).text() );	
					});	
					
					// Filter when click on span close
					thisObject.filter(thisObject, selectedCategoriesArray, products,arString);

					// Reset local storage after category change
					localStorage.removeItem('selectedCategories');
					localStorage.setItem("selectedCategories", JSON.stringify(selectedCategoriesArray));

					return false;
				});
			}

			// Filter when category change
			thisObject.filter(thisObject, selectedCategoriesArray, products,arString);	
		},

		// FilterByCategoryes HELPER
		filter: function(thisObject, selectedCategoriesArray, products, arString){
				// console.log(thisObject, selectedCategoriesArray, products, arString)
				var removeSelected=[];

				// Hide products if 1,2 or 4 categories are selected
				if(selectedCategoriesArray.length <= 2 || selectedCategoriesArray.length == 4){
					products.hide();

				// Dont hide products if 3 categories are selected	
				}else{
					for(var i=0; i<arString.length; i++){
						if(selectedCategoriesArray.indexOf(arString[i])<0){
							removeSelected.push(arString[i]);
						}
					}
				}
				
				products.each(function(){
					var dataCategory = $(this).find('input[type="hidden"]').attr('data-category');
					var dataProducttype = $(this).find('input[type="hidden"]').attr('data-producttype');
					
					// If one category is selected
					if(selectedCategoriesArray.length ==1 ){
						if(selectedCategoriesArray[0]=='gold' || selectedCategoriesArray[0]=='silver'){
							if(dataCategory == selectedCategoriesArray[0]){
								$(this).show();
							}
						}
						if(selectedCategoriesArray[0]=='bars' || selectedCategoriesArray[0]=='coins'){
							if(dataProducttype == selectedCategoriesArray[0]){
								$(this).show();
							}
						}
					}

					// If two categories are selected
					else if(selectedCategoriesArray.length==2){	
						for(var i=0; i<selectedCategoriesArray.length;i++){
							if(selectedCategoriesArray[i]=='gold' || selectedCategoriesArray[i]=='silver'){
								var dataC = selectedCategoriesArray[i];
							}
							if(selectedCategoriesArray[i]=='bars' || selectedCategoriesArray[i]=='coins'){
								var dataP = selectedCategoriesArray[i];
							}
						}
						if(selectedCategoriesArray[0]=='bars' && selectedCategoriesArray[1]=='coins' || selectedCategoriesArray[0]=='gold' && selectedCategoriesArray[1]=='silver'){
							var showAll = true;
						}
						if(showAll == true){
							$(this).show();
						}else{
							if(dataC.length>1 && dataP.length>1){
								if(dataC==dataCategory && dataP == dataProducttype){
									$(this).show();
								}
							}
						}

					// If three categories are selected
					}else if(selectedCategoriesArray.length==3){
						if(removeSelected[0]=='gold' || removeSelected[0]=='silver'){
							if(dataCategory==removeSelected[0]){
								$(this).hide();
							}
						}
						if(removeSelected[0]=='bars' || removeSelected[0]=='coins'){
							if(dataProducttype==removeSelected[0]){
								$(this).hide();
							}
						}

					// If all four categories are selected		
					}else if(selectedCategoriesArray.length==4){
						$(this).show();
					}
				})
		},

		// Fetch products whit selected categories
		getProductsCategories : function(callback){
			var thisObject = this;
			var category = ['gold','silver','bars','coins'];
			for(var i = 0; i < category.length; i++){
				$.getJSON("js/"+category[i]+"P.json", (function(i, thisObject){
					return function(result){
						thisObject[category[i]] = result.Data;
						// When last getJson is done do the rest
						if(i==3){ 
							callback(thisObject); 
						}
					}
				}(i, thisObject)) );
			}
		},

		// List all products
		listProducts : function(){
			this.getProductsCategories(function(thisObject){

				// Get categories data from localstorage
				var selectedCategories = JSON.parse(localStorage.getItem("selectedCategories"));
				
				// Clear all category checkbox and check relevant checkboxes based on localstorage value
				if(selectedCategories){
					$('#gold,#silver').prop('checked',false);
					for(var i = 0; i<selectedCategories.length; i++){
						$('#'+selectedCategories[i]).prop('checked',true);
					}
				}

				// Send ajax request to JSON file to fetch all product
				$.getJSON( "js/test.json", function( result ) {
					var items = [];
					// Clean previous products DOM
					$('ul.products').remove();

					if(result.HasErrors == false){					
						// Loop true array that contains all products from JSON file 
				 		for (var i = 0; i < result.SelectedProducts.length; i++) {

							// Write products HTML
							var html = '\
								<li>\
									<div>\
										<a href="#">\
				                            <h6 class="productName">' + result.SelectedProducts[i].Name + '</h6>\
				                            <ul class="info"><li><i class="fa fa-info-circle"></i><ul><li>Info1</li><li>Info2</li></ul></li></ul>\
											<div class="clearfix"></div>\
											<img src='+ result.SelectedProducts[i].SmallImageUrl +' alt="img">\
											<div class="pricePerUnit fMuliExtraLight">\
												Price per unit: <span class="productPrice fMuliSemibold">'+ result.SelectedProducts[i].FormatedPricePerUnit +'</span>\
											</div>\
										</a>\
										<div class="quantityCartContainer">\
											<input type="number" value="1">\
											<a href="#" class="addToCart fMuliLight"><i class="fa fa-shopping-cart"></i>Add</a>\
											<input type="hidden" \
											data-price="' + result.SelectedProducts[i].PricePerUnit + '"\
											data-name="' + result.SelectedProducts[i].Name + '"\
											data-image="'+ result.SelectedProducts[i].SmallImageUrl + '"\
											data-category="' + thisObject.returnCategory(result.SelectedProducts[i], thisObject,'gold','silver') + '"\
											data-producttype="' + thisObject.returnCategory(result.SelectedProducts[i], thisObject,'bars','coins') + '">\
										</div>\
									</div>\
								</li>\
							';
							items.push(html);
				 		}	
						
						// Cereate ul element whit li(product) elements
						$( "<ul/>", {
					    "class": "products",
					    html: items.join( "" )
						}).insertAfter( ".rightContentTop" );

						// When DOM is written select all products and put to object variable
						thisObject.allProducts = $('ul.products>li');

						//Filter by categories
						thisObject.filterByCategoryes(thisObject, selectedCategories, $('ul.products>li'), ['gold','silver','bars','coins']);
					}
				}).done(function(){
					thisObject.addToCart(thisObject.allProducts);
					thisObject.categoryChange(thisObject);
				});
				
			}); // End products categories
		},

		// Add to car method
		addToCart : function(){
			var thisObject = this;

			// Populate cart if localstorage not empty
			var cart = JSON.parse(localStorage.getItem("cart"));
			if(cart){
				$('.dropdown').remove();
				this.cart = cart;
				//Build cart html
				thisObject.generateCartHtml(thisObject, thisObject.allProducts );
			}

			$('.addToCart').on('click', function(){
				var hidden = $(this).next(),
				qty = $(this).prev().val(),
				price = hidden.data('price')*qty,
				originalPrice = hidden.data('price'),
				name = hidden.data('name'),
				image = hidden.data('image'),
				items = [],
				doPush = true,
				total = 0,
				obj = {originalPrice, price, name, image, qty};
				if(qty < 1 || $(this).closest('li').find('.productPrice').text() == '$0.00' ){return false};
				
				//Check if product is in array
				for (var i = 0; i < thisObject.cart.length; i++) {
					if(thisObject.cart[i].name == name){
						if(thisObject.cart[i].qty == qty){
							return false;
						}else{
							thisObject.cart[i].qty = qty;
							thisObject.cart[i].price = hidden.data('price')*qty;
							doPush = false;
						}
						break;	
					}
				}

				// If product is not in array remove old cart and add product to cart array
				$('ul.dropdown').remove();
				if( doPush == true){
					thisObject.cart.push(obj);
				}
				
				//Build cart html
				thisObject.generateCartHtml(thisObject, thisObject.allProducts);

				//Save cart details to localstorage
				localStorage.removeItem('cart');
				localStorage.setItem("cart", JSON.stringify(thisObject.cart));
			
				return false;
			}) //End on click
		
		},

		// Generate cart HTML
		generateCartHtml : function(thisObject, products){
			var items = [], total = 0;
			for (var i = 0; i < thisObject.cart.length; i++) {
				var html = '\
					<li>\
						<img src='+thisObject.cart[i].image+' alt="small" alt="Product" class="vCenter">\
						<input type="number" class="vCenter cartQty" value='+thisObject.cart[i].qty+'>\
						<div class="name vCenter">'+ thisObject.cart[i].name +'</div>\
						<span class="price vCenter fMuliLight">$'+ thisObject.cart[i].price.toFixed(2) +'</span>\
						<a href="#" class="remove vCenter"><img src="img/remove.jpg" alt="remove"></a>\
					</li>\
				';
				total += thisObject.cart[i].price;
				items.push(html);				
			}
				
			$( "<ul/>", {
		    "class": "dropdown",
		    html: items.join( "" )
			}).insertBefore( ".cartBottom" );

			thisObject.cart.total = total;

			//Calculate total price
			$('.subtotal').text('SUBTOTAL: $'+thisObject.cart.total.toFixed(2));
			$('.totalPrice').text('$'+thisObject.cart.total.toFixed(2));
			$('.cartTopTotal>span .fRobotoBold').text(thisObject.cart.length);

			// Call cart methods, remove item from cart, and change qty on input change
			thisObject.removeFromCart(thisObject, products);
			thisObject.onInputChange(thisObject, products);

			// When page is load first change qty of product list based on cart products
			if($('ul.dropdown>li').length > 0){
				$('ul.dropdown>li').each(function(){
					var name = $(this).find('.name').text();
					var qty = $(this).find('input').val();
					products.each(function(){
						if( $(this).find('.productName').text() == name ){
							$(this).find('input').val( qty );
						}
					});
				})
			}
			
		},

		// Remove from cart (used inside generateCartHtml)
		removeFromCart : function(thisObject, products){
			$('a.remove').on('click', function(){
				console.log('click');
				var index = $(this).closest('li').index(),
				total = 0;
				
				// Remove item from cart
				thisObject.cart.splice(index, 1);

				for (var i = 0; i < thisObject.cart.length; i++) {
					total += thisObject.cart[i].price;
				}

				//Add total price as object to existing cart array;
				thisObject.cart.total = total;

				$('.subtotal').text('SUBTOTAL: $'+thisObject.cart.total.toFixed(2));
				$('.totalPrice').text('$'+thisObject.cart.total.toFixed(2));
				$('.cartTopTotal>span .fRobotoBold').text(thisObject.cart.length);

				//Save cart details to localstorage
				localStorage.removeItem('cart');
				localStorage.setItem("cart", JSON.stringify(thisObject.cart));

				// Reset qty on product when removed
				var name = $(this).prev().prev().text();
				var qty = $(this).prev().prev().prev().val();

				products.each(function(){
					if( $(this).find('.productName').text() == name ){
						$(this).find('input').val(1);
					}
				});
					
				$(this).closest('li').remove();
				return false;
			});
		},

		// When quantity change in cart (used inside generateCartHtml)
		onInputChange : function(thisObject,products){
			
			$('.cartQty').on('change', function(){
				
				var qty = $(this).val(),
				index = $(this).closest('li').index(),
				total = 0;
				
				//If quantity is lover or 0, remove item from cart html and cart array 
				if(qty <= 0){
					thisObject.cart.splice(index, 1);

					// Reset qty on products
					var name = $(this).next().text();
					var qty = $(this).val();

					products.each(function(){
						if( $(this).find('.productName').text() == name ){
							$(this).find('input').val(1);
						}
					});

					$(this).closest('li').remove();
				}
				// Else, change quantity and price in array
				else{
					thisObject.cart[index].qty = qty;
					thisObject.cart[index].price = thisObject.cart[index].originalPrice*qty;
				}

				// Calculate new total price looping true changed array
				for (var i = 0; i < thisObject.cart.length; i++) {
					total += thisObject.cart[i].price;
				}

				//Add total price as object to existing cart array;
				thisObject.cart.total = total;

				//Save cart details to localstorage
				localStorage.removeItem('cart');
				localStorage.setItem("cart", JSON.stringify(thisObject.cart));

				// Change html inside cart
				$('.subtotal').text('SUBTOTAL: $' + thisObject.cart.total.toFixed(2));
				$('.totalPrice').text('$' + thisObject.cart.total.toFixed(2));
				$('.cartTopTotal>span .fRobotoBold').text(thisObject.cart.length);
				$(this).next().next().text("$" + thisObject.cart[index].price.toFixed(2));

				// Edit products qty where products are listed
				var name = $(this).next().text();
				var thisInput = $(this);

				products.each(function(){
					if( $(this).find('.productName').text() == name ){
						$(this).find('input').val( qty );
					}
				});

			});
		},

		returnCategory: function(element,thisObject,category1,category2){
			for(var k=0;k<thisObject[category1].length;k++){
				if(thisObject[category1][k].Name == element.Name){
					return category1;
				}
			}
			for(var j=0;j<thisObject[category2].length;j++){
				if(thisObject[category2][j].Name == element.Name){
					return category2;
				}
			}	 			
		},

		// When page loads start timer and get new data every 60 sec
		startCountdown: function(){
	
			// List all products
			this.listProducts();

			// Start countdown from 60 sec
			var counter = 60,
			timeContainer = $('header .fDisplayFree');
			
			var interval = setInterval(function() {
			    counter--;
			    if(counter < 0) {
			        clearInterval(interval);
			    } else {
			        timeContainer.html( counter.toString() );
			    }
			}, 1000);

			//Call this method every 60 sec
			setInterval(this.startCountdown.bind(this, this), 60000);
		}
	}
	
	products.init();

})
}(jQuery, window))