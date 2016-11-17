import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription} from 'rxjs/Rx';
import { RecipesService} from "../../services/recipes.service";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-recipes-item',
  templateUrl: './recipes-item.component.html',
  styles: []
})

export class RecipesItemComponent implements OnInit, OnDestroy {
  recipes;
  private subscription:Subscription;

  constructor(private recipesService:RecipesService,
              private cartService:CartService,
              private activatedRoute:ActivatedRoute,
              private router:Router) {}

  // Delete recipe
  delete(recipeId){
    this.recipesService.deleteRecipe(recipeId);
    this.router.navigate(['/recipes']);
  }

  //Add to cart
  addToCart(recipe){
    this.cartService.addToCart(recipe.ingredients);
  }

  ngOnInit() {
    // Fetch single recipe data
    this.subscription = this.activatedRoute.params.subscribe(
      (param)=> {
        if(this.recipesService.recipes.length<=0){
          this.recipesService.recipesReady.subscribe(
            (ready)=>{
              this.recipes = this.recipesService.filterRecipe(param['id'], this.recipesService.recipes);
            }
          )
        }else{
          this.recipes = this.recipesService.filterRecipe(param['id'], this.recipesService.recipes);
        }
      }
    );

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
