// Simple shared state for drag-and-drop preview
// This avoids complex context tunneling between the drawer (portal) and modals

let currentDragItem: any = null;

export const setDragItem = (item: any) => {
    currentDragItem = item;
};

export const getDragItem = () => {
    return currentDragItem;
};
