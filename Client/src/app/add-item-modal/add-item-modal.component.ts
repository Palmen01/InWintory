import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-item-modal',
  imports: [NgIf, CurrencyPipe, FormsModule],
  templateUrl: './add-item-modal.component.html',
  styleUrl: './add-item-modal.component.css'
})
export class AddItemModalComponent {
  itemName: string = "";
  itemQuantity: number = 0;
  itemThreshhold: number = 0;
  itemCost: number = 0;
  showErrors = false;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(private apiService: ApiService) { }

  addItem(form: NgForm) {
    this.showErrors = true;

    if (form.valid) {
      this.apiService.AddItem(this.itemName, this.itemQuantity, this.itemThreshhold, this.itemCost)
        .subscribe({
          next: (response) => {
            console.log('Item added successfully:', response);
            this.closeAddItemModal();
            window.location.reload();
          },
          error: (error) => {
            console.error('Error adding item:', error);
          }
        });
    }
  }

  closeAddItemModal() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeAddItemModal();
    }
  }

  //#region movable modal
  // Dragging state
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  modalPosition = { x: 0, y: 0 };

  // Performance optimization variables
  private animationFrameId: number | null = null;
  private viewportWidth = window.innerWidth;
  private viewportHeight = window.innerHeight;
  private modalWidth = 448; // max-w-md
  private modalHeight = 400;

  // Start dragging when mouse down on header
  onHeaderMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;

    // Cache viewport dimensions
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    const modalElement = document.getElementById('addItemModal')?.querySelector('.bg-white') as HTMLElement;
    if (modalElement) {
      const rect = modalElement.getBoundingClientRect();
      this.dragOffset.x = event.clientX - rect.left;
      this.dragOffset.y = event.clientY - rect.top;

      // Cache actual modal dimensions
      this.modalWidth = rect.width;
      this.modalHeight = rect.height;
    }
  }

  // Handle mouse move for dragging
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();

    // Use requestAnimationFrame to throttle updates
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => {
        // Calculate new position
        const newX = event.clientX - this.dragOffset.x;
        const newY = event.clientY - this.dragOffset.y;

        // Constrain to viewport (with cached dimensions)
        this.modalPosition.x = Math.max(0, Math.min(newX, this.viewportWidth - this.modalWidth));
        this.modalPosition.y = Math.max(0, Math.min(newY, this.viewportHeight - this.modalHeight));

        this.animationFrameId = null;
      });
    }
  }

  // Stop dragging on mouse up
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;

    // Cancel any pending animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Reset position when modal opens
  ngOnChanges() {
    if (this.isOpen) {
      this.modalPosition = { x: 0, y: 0 };
    }
  }

  // Get transform style for positioning
  getModalTransform(): string {
    return `translate(${this.modalPosition.x}px, ${this.modalPosition.y}px)`;
  }
  //#endregion
}