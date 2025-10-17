import React, { useState, useRef } from 'react';
import { useBrands } from '@hooks/useBrands';
import { useContentLists } from '@hooks/useContentLists';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import ContentList from '@components/Content/ContentList/ContentList';
import ScrollNavigation from '@components/Content/ScrollNavigation/ScrollNavigation';
import EmojiPicker from '@components/Content/EmojiPicker/EmojiPicker';
import { styles } from './styles';

const ContentPage: React.FC = () => {
  const { brands, currentBrand, switchBrand } = useBrands();
  const {
    lists,
    addNewList,
    deleteList,
    updateListTitle,
    updateListIcon,
    moveItem,
    deleteItem,
    toggleFavorite,
    uploadContent,
  } = useContentLists();

  const [emojiPicker, setEmojiPicker] = useState<{
    isOpen: boolean;
    listId: string;
    anchorElement: HTMLElement | null;
  }>({
    isOpen: false,
    listId: '',
    anchorElement: null,
  });

  const [hoveredAddButton, setHoveredAddButton] = useState(false);

  const handleIconClick = (listId: string) => {
    // Find the icon element by querying the DOM
    const iconElement = document.querySelector(
      `[data-list-id="${listId}"] .list-icon`
    ) as HTMLElement;
    
    setEmojiPicker({
      isOpen: true,
      listId,
      anchorElement: iconElement,
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (emojiPicker.listId) {
      updateListIcon(emojiPicker.listId, emoji);
    }
  };

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const sourceListId = e.dataTransfer.getData('listId');
    
    if (itemId && sourceListId && sourceListId !== targetListId) {
      moveItem(itemId, sourceListId, targetListId);
    }
  };

  const handleScrollNavigate = (listId: string) => {
    const element = document.querySelector(`[data-list-id="${listId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleItemClick = (itemId: string) => {
    // Open content modal (to be implemented)
    console.log('Open content modal for item:', itemId);
  };

  const addButtonStyle = {
    ...styles.addListButton,
    ...(hoveredAddButton ? styles.addListButtonHover : {}),
  };

  return (
    <div style={styles.container}>
      <GlobalNav
        brands={brands}
        currentBrand={currentBrand}
        onBrandChange={switchBrand}
      />

      <div style={styles.contentArea}>
        {lists.map((list) => (
          <ContentList
            key={list.id}
            list={list}
            onDelete={() => {
              if (confirm('Are you sure you want to delete this list and remove all its content?')) {
                deleteList(list.id);
              }
            }}
            onTitleChange={(newTitle) => updateListTitle(list.id, newTitle)}
            onIconClick={() => handleIconClick(list.id)}
            onItemMove={(itemId) => {}}
            onItemDelete={(itemId) => {
              if (confirm('Are you sure you want to remove this content?')) {
                deleteItem(itemId, list.id);
              }
            }}
            onToggleFavorite={(itemId) => toggleFavorite(itemId, list.id)}
            onUpload={(file) => uploadContent(list.id, file)}
            onItemClick={handleItemClick}
            onDragOver={(e) => handleDragOver(e, list.id)}
            onDrop={(e) => handleDrop(e, list.id)}
          />
        ))}

        <button
          style={addButtonStyle}
          onClick={addNewList}
          onMouseEnter={() => setHoveredAddButton(true)}
          onMouseLeave={() => setHoveredAddButton(false)}
        >
          <span>➕</span>
          <span>Add new list</span>
        </button>
      </div>

      <ScrollNavigation
        lists={lists}
        onNavigate={handleScrollNavigate}
        onDelete={(listId) => {
          if (confirm('Are you sure you want to delete this list?')) {
            deleteList(listId);
          }
        }}
      />

      <EmojiPicker
        isOpen={emojiPicker.isOpen}
        onClose={() => setEmojiPicker({ isOpen: false, listId: '', anchorElement: null })}
        onSelect={handleEmojiSelect}
        anchorElement={emojiPicker.anchorElement}
      />
    </div>
  );
};

export default ContentPage;