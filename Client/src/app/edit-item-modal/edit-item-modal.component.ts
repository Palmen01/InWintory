import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService, Item } from '../service/api.service';
import { NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-item-modal',
  imports: [NgIf, CurrencyPipe, FormsModule],
  templateUrl: './edit-item-modal.component.html',
  styleUrl: './edit-item-modal.component.css'
})
export class EditItemModalComponent implements OnChanges {
  itemName: string = "";
  itemQuantity: number = 0;
  itemThreshhold: number = 0;
  itemCost: number = 0;
  showErrors = false;
  isLoading = false;
  error: string = '';
  
  @Input() isOpen = false;
  @Input() itemToEdit: Item | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() itemUpdated = new EventEmitter<Item>();

  constructor(private apiService: ApiService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemToEdit'] && this.itemToEdit) {
      this.itemName = this.itemToEdit.name;
      this.itemQuantity = this.itemToEdit.quantity;
      this.itemThreshhold = this.itemToEdit.reorderThreshold;
      this.itemCost = this.itemToEdit.cost;
    }
  }
  
  editItem(form: NgForm) {
    this.showErrors = true;
    this.error = '';
    this.isLoading = true;

    if (form.invalid) {
      return;
    }

    if (!this.itemToEdit) {
      this.error = 'No item selected for editing';
      return;
    }

    const updatedItem: Item = {
      id: this.itemToEdit.id,
      name: this.itemName.trim(),
      quantity: this.itemQuantity,
      unitsSold: this.itemToEdit.unitsSold,
      unitsLost: this.itemToEdit.unitsLost,
      reorderThreshold: this.itemThreshhold,
      cost: this.itemCost,
      restockOrders: undefined
    };

    this.apiService.UpdateItem(this.itemToEdit.id, updatedItem).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.itemUpdated.emit(response);
        this.closeEditItemModal();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating item:', error);
        this.error = 'Failed to update item. Please try again.';
      }
    });
  }

  closeEditItemModal() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeEditItemModal();
    }
  }
}