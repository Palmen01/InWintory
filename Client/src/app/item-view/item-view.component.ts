import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService, Item } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { ItemButtonComponent } from '../item-button/item-button.component';
import { AddItemModalComponent } from '../add-item-modal/add-item-modal.component';
import { CashTrackerComponent } from '../cash-tracker/cash-tracker.component';
import { EditItemModalComponent } from '../edit-item-modal/edit-item-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-view',
  imports: [CommonModule, RouterOutlet, ItemButtonComponent, AddItemModalComponent, CashTrackerComponent, EditItemModalComponent],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.css'
})
export class ItemViewComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  isLoading = false;
  error: string | null = null;
  isAddItemModalOpen = false;
  isEditItemModalOpen = false;
  selectedItem: Item | null = null;
  private subscription = new Subscription();
  private isCurrentComponentAction = false;

  constructor(private apiService: ApiService) { }

  openAddItemModal() {
    this.isAddItemModalOpen = true;
  }

  closeAddItemModal() {
    this.isAddItemModalOpen = false;
    // Only reload when we add a new item
    this.loadItems();
  }

  openEditItemModal(item: Item) {
    this.selectedItem = item;
    this.isEditItemModalOpen = true;
  }

  closeEditItemModal() {
    this.isEditItemModalOpen = false;
    this.selectedItem = null;
    // Only reload when we edit an item
    this.loadItems();
  }

  ngOnInit(): void {
    this.loadItems();
    
    // Subscribe to updates from OTHER components only
    this.subscription.add(
      this.apiService.itemsUpdated$.subscribe(() => {
        // Only reload if the update came from another component
        if (!this.isCurrentComponentAction) {
          this.loadItems();
        }
        // Reset the flag
        this.isCurrentComponentAction = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onItemUpdated(updatedItem: Item) {
    const index = this.items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = updatedItem;
    }
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
    // Flag that this action is from current component
    this.isCurrentComponentAction = true;
    
    this.apiService.SellItem(item.id, 1).subscribe({
      next: (updatedItem) => {
        // Update local item immediately - no reload needed!
        item.quantity = updatedItem.quantity;
        item.unitsSold = updatedItem.unitsSold;
      },
      error: (error) => {
        console.error('Error selling item:', error);
        this.isCurrentComponentAction = false; // Reset flag on error
      }
    });
  }

  order(item: Item) {
    // Flag that this action is from current component
    this.isCurrentComponentAction = true;
    
    this.apiService.OrderItem(item.id, 1).subscribe({
      next: (updatedItem) => {
        // Update local item immediately - no reload needed!
        item.quantity = updatedItem.quantity;
      },
      error: (error) => {
        console.error('Error ordering item:', error);
        this.isCurrentComponentAction = false; // Reset flag on error
      }
    });
  }

  remove(item: Item) {
    // Flag that this action is from current component
    this.isCurrentComponentAction = true;
    
    this.apiService.RemoveItem(item.id).subscribe({
      next: () => {
        // Remove from local array immediately - no reload needed!
        this.items = this.items.filter(i => i.id !== item.id);
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.error = 'Failed to remove item. Please try again.';
        this.isCurrentComponentAction = false; // Reset flag on error
      }
    });
  }
}