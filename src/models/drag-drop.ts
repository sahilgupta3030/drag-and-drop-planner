// Drag & Drop Interfaces
export interface Draggable {
    dragStartHandler(event: DragEvent): void; // Triggered when dragging starts
    dragEndHandler(event: DragEvent): void;   // Triggered when dragging ends
}

// Interface for drop targets
export interface DragTarget {
    dragOverHandler(event: DragEvent): void;  // Triggered when an item is dragged over the target
    dropHandler(event: DragEvent): void;      // Triggered when the item is dropped on the target
    dragLeaveHandler(event: DragEvent): void; // Triggered when the item leaves the target
}
