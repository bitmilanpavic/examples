import { Injectable } from '@angular/core';

@Injectable()
export class CartService {
  cart = [];
  constructor() { }

  addToCart(ingredients){
    for(var i = 0; i < ingredients.length; i++){
      this.cart.push(ingredients[i]);
    }
  }

  editItem(itemNewvalue, index){
    this.cart[index] = itemNewvalue;
    console.log(this.cart);
  }
  deleteItem(index){
    this.cart.splice(index,1);
  }
}
