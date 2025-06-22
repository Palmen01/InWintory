import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService, Item } from '../service/api.service';

@Component({
  selector: 'app-item-button',
  imports: [],
  templateUrl: './item-button.component.html',
  styleUrl: './item-button.component.css'
})
export class ItemButtonComponent {

  
  constructor(private apiService: ApiService) {}

  @Input() variant: 'primary' | 'danger' | 'neutral' = 'primary';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();

  order(item: Item) {
  
  }

  sell(item: Item) {
    
  }

  remove(item: Item) {
    
  }
}
