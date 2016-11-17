import { Component, OnInit, OnDestroy, Input, AfterContentInit } from '@angular/core';
import {RecipesService} from "../services/recipes.service";
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'app-recipes',
  template: `
        <div class="container">
        <h2>Our Recipes</h2>
            <div class="row">
                <div class="col-sm-5">
                    <app-recipes-list [recipes]="recipes"></app-recipes-list>
                </div>
                <div class="col-sm-7">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div> 
  `
})

export class RecipesComponent implements OnInit, OnDestroy{
  recipes;
  private subscription:Subscription;
  constructor(private recipesService:RecipesService) { }

  ngOnInit() {
    if (!(this.recipesService.recipes.length > 0)){
      this.subscription = this.recipesService.getRecipes().subscribe(
        (recipes) => {
          this.recipes = recipes.recipes;
          this.recipesService.recipes = recipes.recipes;
          this.recipesService.recipesReady.emit('ready');
        }
      )
    }else{
      this.recipes =  this.recipesService.recipes;
    }
  }

  ngOnDestroy(){
    if(typeof this.subscription !=='undefined'){this.subscription.unsubscribe();}
  }
  ngAfterContentInit(){
    // alert('done');
  }
}
