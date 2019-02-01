import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  env = environment;

  public constructor(private titleService: Title) {
    if (this.env.name = "default") {
      this.titleService.setTitle("Local");
    } else if (this.env.name = "staging") {
      this.titleService.setTitle("Staging")
    } else if (this.env.name = "production") {
      this.titleService.setTitle("Production")
    }

  };

  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    tapToDismiss: true,
    timeout: 4000,
  });
}