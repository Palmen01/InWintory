import { Component} from '@angular/core';
import { ItemViewComponent } from './item-view/item-view.component';
import { ItemThresholdTrackerComponent } from './item-threshold-tracker/item-threshold-tracker.component';

@Component({
  selector: 'app-root',
  imports: [ItemViewComponent, ItemThresholdTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {  
}