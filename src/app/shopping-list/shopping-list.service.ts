import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {
    private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes",10)
  ];

  ingredientsChanged = new Subject<Ingredient[]>;
  startedEditing = new Subject<number>();

  getIngredients() {
    return this.ingredients.slice()
  }

  getIngredient(index: number) {
    return this.ingredients[index];

  }

updateIngredient(index: number, ing: Ingredient){
  if(ing.amount === 0){
    return this.deleteIngridient(index);
  }
  this.ingredients[index] = ing;

  this.ingredientsChanged.next(this.ingredients.slice());
}

  addIngredient(ingredient: Ingredient, emitEvent: boolean = true) {

    const index = this.ingredients.findIndex((ing) => ing.name === ingredient.name)
    if (index === -1){
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    } else{
      this.ingredients[index].amount += ingredient.amount;
      
    }
if(emitEvent){
  this.ingredientsChanged.next(this.ingredients.slice());
}
    
  }

  addIngredients(ingredients: Ingredient[]){
    ingredients.forEach((ingredient) => {
      this.addIngredient(ingredient, false)
    })
    this.ingredientsChanged.next(this.ingredients.slice());
    
  }

  deleteIngridient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}