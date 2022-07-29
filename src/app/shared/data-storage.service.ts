import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  baseUrl = 'https://recipe-book-ec11a-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    
    this.http.put(this.baseUrl + 'recipes.json', recipes)
      .subscribe((res) => {
        console.log(res);
    })
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>(this.baseUrl + 'recipes.json')
      .pipe(
        map(recipes => {
        return recipes.map(recipe => {
          if(!recipe.ingredients){
            recipe.ingredients = []
          }
          return recipe;
        })
      }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
      }));
   
  }
}