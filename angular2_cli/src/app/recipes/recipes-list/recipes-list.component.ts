import { Component, Input} from '@angular/core';


@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styles: []
})
export class RecipesListComponent {
  @Input() recipes;
  
}
