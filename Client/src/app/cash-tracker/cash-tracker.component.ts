import { Component } from '@angular/core';
import { ApiService, Item } from '../service/api.service';

@Component({
  selector: 'app-cash-tracker',
  imports: [],
  templateUrl: './cash-tracker.component.html',
  styleUrl: './cash-tracker.component.css'
})
export class CashTrackerComponent {
  items: Item[] = [];
  constructor(private apiService: ApiService) { }

  totalValue = 0;

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.LoadTotalValue();
      },
    });
  }

  LoadTotalValue(): void {
    this.items.forEach(i => this.totalValue += i.quantity * i.cost)
  }
}
