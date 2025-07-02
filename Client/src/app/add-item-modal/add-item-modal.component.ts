import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  imports: [],
  templateUrl: './add-item-modal.component.html',
  styleUrl: './add-item-modal.component.css'
})
export class AddItemModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<{name: string, quantity: number, reorderThreshold: number}>();

  closeAddItemModal() {
    this.close.emit();
  }

  AddItem() {}
}
