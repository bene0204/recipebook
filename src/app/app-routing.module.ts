import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { SelectRecipeComponent } from './recipes/recipe-detail/select-recipe/select-recipe.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolvelService } from './recipes/recipes-resolver.service';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  {path: "", redirectTo: "/recipes", pathMatch: 'full'},
  {path: "recipes", component: RecipesComponent, canActivate: [AuthGuard] ,
  children: [
{path: "", component: SelectRecipeComponent},
{path: "new", component: RecipeEditComponent},
{path: ":id", component: RecipeDetailComponent, resolve: [RecipesResolvelService]},
{path: ":id/edit", component: RecipeEditComponent, resolve: [RecipesResolvelService]},
  ]},
  {path: "shopping-list", component: ShoppingListComponent},
  {path: "auth", component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
