import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService} from '../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-button',
  imports: [CommonModule],
  templateUrl: './item-button.component.html',
  styleUrl: './item-button.component.css'
})
export class ItemButtonComponent {

  @Input() variant: 'primary' | 'neutral' | 'danger' = 'primary';
  @Input() loading = false;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();

  variantClasses = {
    primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
    neutral: 'bg-green-600 text-gray-700 border-green-300 hover:bg-green-700',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700'
  }
}
