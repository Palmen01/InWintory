import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../service/api.service';

import { NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-item-modal',
  imports: [NgIf, CurrencyPipe, FormsModule],
  templateUrl: './edit-item-modal.component.html',
  styleUrl: './edit-item-modal.component.css'
})
export class EditItemModalComponent {
  itemName: string = "";
  itemQuantity: number = 0;
  itemThreshhold: number = 0;
  itemCost: number = 0;
  showErrors = false;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }
  
  editItem(form: NgForm) {
    this.showErrors = true;

    if (form.valid) {
      this.apiService.EditItem(this.itemName, this.itemQuantity, this.itemThreshhold, this.itemCost)
        .subscribe({
          next: (response) => {
            console.log('Item edited successfully:', response);
            this.closeEditItemModal();
            window.location.reload();
          },
          error: (error) => {
            console.error('Error editing item:', error);
          }
        });
    }
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
