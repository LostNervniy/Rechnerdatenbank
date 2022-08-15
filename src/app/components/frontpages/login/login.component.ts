import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Login} from "../../../interfaces/login";
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private notificationService: NotificationService) {
  }

  model: Login = {userid: 'admin', password: 'admin'};
  user: Login = {userid: '', password: ''};

  loginForm: FormGroup;
  message: string;
  returnUrl: string;

  ngOnInit() {
    this.notificationService.createInfoNotification('Login', 'Bitte loggen Sie sich ein.');
    this.loginForm = this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = '/computer';
    this.authService.logout();
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      this.user.userid = this.user.userid.toLowerCase();
      if (this.user.userid === this.model.userid && this.user.password === this.model.password) {
        this.notificationService.createSuccessNotification('Login', 'Erfolgreich');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', this.f.userid.value);
        this.router.navigate([this.returnUrl]);
      } else {
        this.notificationService.createErrorNotification('Login', 'Benutzername und/oder Passwort falsch.');
      }
    }
  }
}
