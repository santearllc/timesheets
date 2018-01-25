import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';


declare const gapi: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login_res = '';
  googleLoginButtonId = "googleBtn";
  show_signin = true;  

  constructor(public serviceService: ServiceService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    setTimeout(x => {
      this.serviceService.googleInit();

      // Converts the Google login button stub to an actual button.
      gapi.signin2.render(
        this.googleLoginButtonId,
        {
          "scope": "profile email",
          "theme": "dark"
        });
    }, 10)   
  }
}
