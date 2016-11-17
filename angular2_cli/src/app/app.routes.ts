import {Routes, RouterModule} from '@angular/router';
import {CartComponent} from "./cart/cart.component";
import {RecipesComponent} from "./recipes/recipes.component";
import {RecipesItemComponent} from "./recipes/recipes-item/recipes-item.component";
import {RecipeStartComponent} from "./recipes/recipe-start.component";
import {RecipeEditComponent} from "./recipes/recipe-edit/recipe-edit.component";

const APP_ROUTES:Routes = [
  {path:'', redirectTo:'/recipes', pathMatch:'full'},
  {path:'recipes', component: RecipesComponent,children:[
    {path:'', component: RecipeStartComponent},
    {path:'new', component: RecipeEditComponent},
    {path:':id', component: RecipesItemComponent},
    {path:':id/edit', component: RecipeEditComponent}
  ]},
  {path:'cart', component:CartComponent},
  {path:'**', redirectTo:'/recipes', pathMatch:'full'}
]

export const routess = RouterModule.forRoot(APP_ROUTES);
