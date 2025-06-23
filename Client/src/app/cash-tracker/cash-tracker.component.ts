import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-cash-tracker',
  imports: [],
  templateUrl: './cash-tracker.component.html',
  styleUrl: './cash-tracker.component.css'
})
export class CashTrackerComponent {

  constructor(private apiService: ApiService) { }

  // Track money via db
}
