import { Component } from '@angular/core';
import { Item, ApiService } from '../service/api.service';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-item-threshold-tracker',
  imports: [CommonModule],
  templateUrl: './item-threshold-tracker.component.html',
  styleUrl: './item-threshold-tracker.component.css'
})
export class ItemThresholdTrackerComponent {
  isLoading = false;
  error: string | null = null;
  items: Item[] = [];

  constructor(private apiService: ApiService) { }

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
    } else if (item.quantity <= Math.ceil(item.reorderThreshold * 1.2)) {
      return 'low';
    } else {
      return 'good';
    }
  }

}
