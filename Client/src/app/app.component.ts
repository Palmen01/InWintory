import { Component} from '@angular/core';
import { ItemViewComponent } from './item-view/item-view.component';

@Component({
  selector: 'app-root',
  imports: [ItemViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {  
}