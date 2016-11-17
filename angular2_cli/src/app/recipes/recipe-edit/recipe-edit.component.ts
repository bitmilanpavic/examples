import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {RecipesService} from "../../services/recipes.service";
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styles: []
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id = 0;
  currentRecipe;
  subs:Subscription;
  form:FormGroup;
  addNewRecipe = true;
  addName;
  addAmount;

  constructor(private activatedRoute:ActivatedRoute, private recipesService:RecipesService) {
  }

  ngOnInit(){
    this.form = new FormGroup({
      'name': new FormControl('', Validators.required),
      'imageUrl': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'ingredients': new FormArray([])
    })

    this.subs = this.activatedRoute.params.subscribe(
      (param) => {
        if(param.hasOwnProperty('id')){this.addNewRecipe = false}else{this.addNewRecipe = true}
        // If is edit page do bellow
        if (!this.addNewRecipe){
          this.id = param['id'];
          if (this.recipesService.recipes.length > 0) {
            this.currentRecipe = this.recipesService.filterRecipe(param['id'], this.recipesService.recipes);
            this.setFormValues();
          } else {
            this.recipesService.recipesReady.subscribe(
              (ready)=> {
                this.currentRecipe = this.recipesService.filterRecipe(param['id'], this.recipesService.recipes);
                this.setFormValues();
              }
            )
          }
        }else{
        // If is new recipe page do bellow
          (<FormArray>this.form.controls['ingredients']).push(
            new FormGroup({
              'name':new FormControl('', Validators.required),
              'amount': new FormControl('',[Validators.required,Validators.pattern("\\d+")])
            })
          );
        }
      }
    )
  }

  setFormValues(){
    this.form.controls['name'].setValue(this.currentRecipe[0].name);
    this.form.controls['description'].setValue(this.currentRecipe[0].description);
    this.form.controls['imageUrl'].setValue(this.currentRecipe[0].imagePath);

    var ingredients = this.currentRecipe[0].ingredients;
    for(var i = 0; i < ingredients.length; i++){
      (<FormArray>this.form.controls['ingredients']).push(
        new FormGroup({
          'name':new FormControl(this.currentRecipe[0].ingredients[i].name, Validators.required),
          'amount': new FormControl(this.currentRecipe[0].ingredients[i].amount,[Validators.required,Validators.pattern("\\d+")])
        })
      );
    }
  }

  onSubmit(){
    this.recipesService.saveRecipe(this.form, this.id, this.addNewRecipe);
  }

  onCancel(){
    this.recipesService.cancel(this.id, this.addNewRecipe);
  }

  onAddIng(name, amount){
    (<FormArray>this.form.controls['ingredients']).push(
      new FormGroup({
        'name': new FormControl(name,Validators.required),
        'amount': new FormControl(amount, Validators.required)
      })
    );
    this.addName = '';
    this.addAmount = '';
  }

  onRemoveIng(index){
    (<FormArray>this.form.controls['ingredients']).removeAt(index);
  }

  ngOnDestroy(){
    if(typeof this.subs!=='undefined'){this.subs.unsubscribe()}
  }
}
