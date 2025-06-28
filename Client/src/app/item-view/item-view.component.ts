import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService, Item } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { ItemButtonComponent } from '../item-button/item-button.component';

@Component({
  selector: 'app-item-view',
  imports: [CommonModule, RouterOutlet, ItemButtonComponent],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.css'
})
export class ItemViewComponent {
  items: Item[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.error = null;
    
    this.apiService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.error = 'Failed to load items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getStockStatus(item: Item): 'good' | 'low' | 'critical' {
    if (item.quantity <= item.reorderThreshold) {
      return 'critical';
    } else if (item.quantity <= item.reorderThreshold * 1.2) {
      return 'low';
    } else {
      return 'good';
    }
  }

  sell(item: Item) {
    this.apiService.SellItem(item.id, 1).subscribe({
      next: (updatedItem) => {
      item.quantity = updatedItem.quantity;
    }
    });
  }

  order(item: Item) {
    this.apiService.OrderItem(item.id, 1).subscribe({
      next: (updatedItem) => {
        item.quantity = updatedItem.quantity
      }
    })
  }

  remove(item: Item) {
    
  }
}
