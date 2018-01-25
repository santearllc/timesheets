import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  online = true;

  ngOnInit() {
    this.isOnline()
  }

  isOnline(){
		if(navigator.onLine) { // true|false
		  this.online = true;
		} else {
			this.online = false;
    }
	
		setTimeout(res => {
		  this.isOnline();
		}, 2500)
    }	  
    
    
  
}
