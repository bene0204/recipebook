import { trigger, state, style, transition, animate } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  animations: [
    trigger('showModal', [
      state('in', 
        style({
          opacity: 1, 
          'transform': 'translateX(0)'
        })),
      transition('void => *', [
        style({opacity: 0, 'transform': 'translateX(-100px)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({opacity: 0, 'transform': 'translateX(-100px)'}))
      ])

  ])
]
})
export class AuthComponent implements OnInit{
isLoginMode = true;
isLoading = false;
error: string = null;

authForm: FormGroup;

constructor(private authService: AuthService, private router: Router) {
  
}

ngOnInit() {
  this.authForm = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required,Validators.minLength(6)])
  })
}

onSubmit(){
  if (this.authForm.invalid){
    return;
  }

  const email = this.authForm.get('email').value;
  const password = this.authForm.get('password').value;

  let authObs: Observable<AuthResponseData>;

  this.isLoading = true;
  if(this.isLoginMode) {
   authObs = this.authService.login(email,password);
  } else {
   authObs = this.authService.signUp(email, password);
  }

  authObs.subscribe({
    next: (resData) => {
      console.log(resData);
      this.isLoading = false;
      this.error = null;
      this.router.navigate(['/recipes']);
    },
    error: (errorMessage) => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    }
  })

  
}

onSwitchMode(){
  this.isLoginMode = !this.isLoginMode
}

onHandleError() {
  this.authForm.reset()
  this.error = null;
}

}