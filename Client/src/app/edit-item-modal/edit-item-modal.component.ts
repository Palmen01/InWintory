import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-edit-item-modal',
  imports: [],
  templateUrl: './edit-item-modal.component.html',
  styleUrl: './edit-item-modal.component.css'
})
export class EditItemModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }
  
  EditItem() {
    
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
