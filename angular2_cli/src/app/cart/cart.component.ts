import { Component, OnInit} from '@angular/core';
import {CartService} from "../services/cart.service";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {RecipesService} from "../services/recipes.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [`
    .list-group a{cursor:pointer !important}
  `]
})
export class CartComponent implements OnInit {
  cartItems = [];
  form:FormGroup;
  isAdd = true;
  selectedItem = null;
  index;

  constructor(private cartService:CartService, private recipesService:RecipesService) { }

  ngOnInit() {
    this.cartItems = this.cartService.cart;
    this.form = new FormGroup({
      'name': new FormControl('', Validators.required),
      'amount': new FormControl('', Validators.required)
    })
  }

  onSelectItem(item, index){
    this.selectedItem = item;
    this.index = index;
    this.isAdd = false;
    this.form.controls['name'].setValue(item.name);
    this.form.controls['amount'].setValue(item.amount);
  }

  onSubmit(){
    var formValues = {
      'name': this.form.controls['name'].value,
      'amount': this.form.controls['amount'].value
    };

    if(this.isAdd) {
      this.cartService.addToCart([formValues]);
    }else{
      //edit
      this.cartService.editItem(formValues, this.index);
      this.reset();
    }

  }

  delete(){
    this.cartService.deleteItem(this.index);
    this.reset();
  }

  reset(){
    this.isAdd = true;
    this.form.controls['name'].setValue('');
    this.form.controls['amount'].setValue('');
  }

}
