import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './cart/cart.component';
import {routess} from "./app.routes";
import { RecipesComponent } from './recipes/recipes.component';
import {RecipesService} from "./services/recipes.service";
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesItemComponent } from './recipes/recipes-item/recipes-item.component';
import { RecipeStartComponent } from './recipes/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import {CartService} from "./services/cart.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CartComponent,
    RecipesComponent,
    RecipesListComponent,
    RecipesItemComponent,
    RecipeStartComponent,
    RecipeEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routess
  ],
  providers: [RecipesService, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
