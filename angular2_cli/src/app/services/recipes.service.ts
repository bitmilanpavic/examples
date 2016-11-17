import { Injectable, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class RecipesService {
  recipesReady = new EventEmitter();
  recipes = [];
  recipesArrayFiltered=[];

  constructor(private http:Http, private router:Router) {}

  getRecipes(){
    return this.http.get('app/json/recipes.json').map(
      (response:Response) => response.json()
    )
  }

  filterRecipe(id,result){
    this.recipesArrayFiltered = [];
    for(var i=0; i<result.length; i++){
      if(result[i].id == id){
        this.recipesArrayFiltered.push(result[i]);
        break;
      }
    }
    return this.recipesArrayFiltered;
  }

  deleteRecipe(recipeId){
    for(var i = 0; i<this.recipes.length; i++){
      if(this.recipes[i].id==recipeId){
        this.recipes.splice(i,1);
      }
    }
  }

  saveRecipe(form, recipeId, addNewRecipe){
   var newIngredients = [];
    for(var i =0; i<form.controls['ingredients'].value.length;i++){
      newIngredients.push(form.controls['ingredients'].value[i]);
    }

    var newRecipeValues={
      id:recipeId || 1,
      name:form.controls['name'].value,
      description:form.controls['description'].value,
      imagePath:form.controls['imageUrl'].value,
      ingredients:newIngredients
    };

    // If its edit page
    if(!addNewRecipe) {
      for (var i = 0; i < this.recipes.length; i++) {
        if (this.recipes[i].id == recipeId) {
          this.recipes[i] = newRecipeValues;
          break;
        }
      }
      this.router.navigate(['/recipes',recipeId]);
    }else{
    // If new recipe page
      var newId = (this.recipes.length>0)?this.recipes[this.recipes.length-1].id+1 : 1;

      newRecipeValues.id = newId;
      this.recipes.push(newRecipeValues);
      this.router.navigate(['/recipes',newId]);
    }

  }

  cancel(id,addNewRecipe){
    if(!addNewRecipe){
      this.router.navigate(['/recipes',id]);
    }else{
      this.router.navigate(['/recipes']);
    }
  }


}
