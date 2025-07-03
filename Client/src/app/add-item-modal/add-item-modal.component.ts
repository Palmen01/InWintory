import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  imports: [NgIf],
  templateUrl: './add-item-modal.component.html',
  styleUrl: './add-item-modal.component.css'
})
export class AddItemModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<{ name: string, quantity: number, reorderThreshold: number }>();

  closeAddItemModal() {
    this.close.emit();
  }

  AddItem() { }

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