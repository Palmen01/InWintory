import { Component } from '@angular/core';
import { ApiService, Item } from '../service/api.service';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-cash-tracker',
  imports: [CurrencyPipe],
  templateUrl: './cash-tracker.component.html',
  styleUrl: './cash-tracker.component.css'
})
export class CashTrackerComponent {
  items: Item[] = [];
  totalValue = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadItems();

    // Listen for updates from apiService
    this.apiService.itemsUpdated$.subscribe(() => {
      this.loadItems();
    });
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
    this.totalValue = 0;
    this.items.forEach(i => this.totalValue += i.quantity * i.cost)
  }
}