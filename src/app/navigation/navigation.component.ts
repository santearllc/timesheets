import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';


declare const gapi: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  
  constructor(public serviceService: ServiceService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }


}
