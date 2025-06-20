// app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService, Item } from './service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Client';
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
}