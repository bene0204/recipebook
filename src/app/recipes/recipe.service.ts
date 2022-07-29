import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe("Easy Summer Vegetable Pizzas",
  //    "Flatbread pizza made with naan is quick, easy, and ready in less than 20 minutes.", 
  //    "https://www.simplyrecipes.com/thmb/Dxtu5nvhZBSFrlGoxxK2zm8yEDc=/648x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__08__Zucchini-Flatbread-Pizzas-LEAD-5-4c4c6be738654f989e65c58892c8981c.jpg",
  //    [new Ingredient("Naan", 4), new Ingredient("Parmesan", 2), new Ingredient("Vegetables", 5)]),
  
  //   new Recipe("Big Fat Burger", "What else you need to say?", "https://burgerking.hu/sites/burgerking.hu/files/BK_Web_BaconKingXtra_500x540px.png",
  //   [new Ingredient("Beef", 2),new Ingredient("Buns", 2), new Ingredient("Bacon", 2),new Ingredient("Cheese",2)])
  // ];

  private recipes: Recipe[]= [];

  recipeSelected = new Subject<Recipe>()
  recipesChanged = new Subject<Recipe[]>()

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes[index];
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.getRecipes())
  }

  getRecipesArrayLength(){
    return this.recipes.length;
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes())
  }

  updateRecipe(newRecipe: Recipe, index: number){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.getRecipes())
  }

  deleteRecipe(index: number){
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.getRecipes())
  }
}