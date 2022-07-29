import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  ingForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'amount': new FormControl(1,[Validators.required, this.validateNumber.bind(this)])
    })

    this.subscription = this.shoppingListService.startedEditing
    .subscribe(
(index: number) => {
  this.editedItemIndex = index;
  this.editMode = true;
  this.editedItem = this.shoppingListService.getIngredient(index);
  this.ingForm.setValue({
    'name': this.editedItem.name,
    'amount': this.editedItem.amount,
  })
}
    );
  }

  validateNumber(control: FormControl): {[s: string]: boolean} {
    let minValue = 1;
    if (this.editMode) {
      minValue = 0;
    }
    if (control.value < minValue){
      return {invalidAmount: true}
    }

    return null;
  }

  resetForm(){
    this.ingForm.reset()
    this.ingForm.setValue({
      'name': '',
      'amount': 1,
    })
    this.editMode = false;
  }

  onSubmit(){
    const newIngredient = new Ingredient(
      this.ingForm.get('name').value,
      this.ingForm.get('amount').value
      );
    if(!this.editMode){
      
        this.shoppingListService.addIngredient(newIngredient);

    } else {
        this.shoppingListService.updateIngredient(this.editedItemIndex,newIngredient)
    }
     this.resetForm()
  }

  clearIngredient(){
    this.resetForm()
  }

  deleteIngridient() {
    this.shoppingListService.deleteIngridient(this.editedItemIndex);
    this.resetForm()
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
