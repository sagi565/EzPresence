import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@/models/ContentList';
import ContentCard from './ContentCard';
import { useContentLists } from '@/hooks/contents/useContentLists';
import ContentDetailModal from '@/components/Content/ContentDetailModal/ContentDetailModal';
import * as S from './ContentDrawer.styles';

interface ContentDrawerProps {
  brandId: string;
  isOpen: boolean;
  onClose?: () => void;
  onToggle: () => void;
  isPicking?: boolean;
  onContentDragStart?: () => void;
  onSelect?: (content: ContentItem) => void;
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({
  brandId,
  isOpen,
  onToggle,
  isPicking,
  onContentDragStart,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    item: ContentItem | null;
    listId: string;
  }>({ isOpen: false, item: null, listId: '' });

  const { lists, renameItem, deleteItem, toggleFavorite } = useContentLists(brandId);

  const allContent = useMemo(() => lists.flatMap(list => list.items), [lists]);

  const filteredContent = useMemo(() => {
    let itemsToFilter: ContentItem[] = [];
    if (selectedListId === 'all') {
      itemsToFilter = allContent;
    } else {
      const targetList = lists.find(l => l.id === selectedListId);
      itemsToFilter = targetList ? targetList.items : [];
    }
    if (searchQuery) {
      return itemsToFilter.filter(item =>
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return itemsToFilter;
  }, [selectedListId, allContent, lists, searchQuery]);

  const portal = (
    <>
      <S.GlobalDrawerStyles />
      <S.DrawerContainer
        id="contentDrawer"
        className="content-drawer"
        $isOpen={isOpen}
        $isPicking={isPicking}
      >
        <S.DrawerHandle className="content-drawer-handle" onClick={onToggle}>
          <S.DrawerArrow $isOpen={isOpen}>▲</S.DrawerArrow>
          {!isOpen && (
            <S.DrawerTitle className="content-drawer-title">My Content</S.DrawerTitle>
          )}
        </S.DrawerHandle>

        <S.DrawerContent className="content-drawer-content">
          <S.DrawerInner className="content-drawer-inner">
            <S.DrawerControls className="content-drawer-controls">
              <S.SearchBar
                type="text"
                className="content-drawer-search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <S.ContentList className="content-list-mobile">
                {filteredContent.length === 0 ? (
                  <S.EmptyState>No content found.</S.EmptyState>
                ) : (
                  filteredContent.map((item) => (
                    <ContentCard
                      key={item.id}
                      content={item}
                      onDragStart={() => {
                        onContentDragStart?.();
                      }}
                      onSelect={onSelect}
                      onClickDetail={(content) => {
                        const parentList = lists.find(l => l.items.some(i => i.id === content.id));
                        if (parentList) {
                          setDetailModal({ isOpen: true, item: content, listId: parentList.id });
                        }
                      }}
                      brandId={brandId}
                    />
                  ))
                )}
              </S.ContentList>
            </S.DrawerControls>

            <S.ListsContainer className="content-drawer-lists">
              <S.ListPill
                className="content-drawer-list-pill"
                $isActive={selectedListId === 'all'}
                $isAllActive={selectedListId === 'all'}
                onClick={() => setSelectedListId('all')}
              >
                <S.ListPillIcon>✨</S.ListPillIcon>
                <span>All Content</span>
              </S.ListPill>
              {lists.length > 0 && <S.ListSeparator />}
              {lists.map(list => (
                <S.ListPill
                  key={list.id}
                  className="content-drawer-list-pill"
                  $isActive={selectedListId === list.id}
                  onClick={() => setSelectedListId(list.id)}
                >
                  <S.ListPillIcon>{list.icon || '📁'}</S.ListPillIcon>
                  <span>{list.title}</span>
                </S.ListPill>
              ))}
            </S.ListsContainer>
          </S.DrawerInner>
        </S.DrawerContent>
      </S.DrawerContainer>

      <ContentDetailModal
        isOpen={detailModal.isOpen}
        item={detailModal.item}
        onClose={() => setDetailModal({ isOpen: false, item: null, listId: '' })}
        onRename={(newName) => {
          if (detailModal.item && detailModal.listId) {
            renameItem(detailModal.item.id, detailModal.listId, newName);
            setDetailModal(prev => ({
              ...prev,
              item: prev.item ? { ...prev.item, title: newName } : null,
            }));
          }
        }}
        onDelete={() => {
          if (detailModal.item && detailModal.listId) {
            deleteItem(detailModal.item.id, detailModal.listId);
            setDetailModal({ isOpen: false, item: null, listId: '' });
          }
        }}
        onToggleFavorite={() => {
          if (detailModal.item && detailModal.listId) {
            toggleFavorite(detailModal.item.id, detailModal.listId);
            setDetailModal(prev => ({
              ...prev,
              item: prev.item ? { ...prev.item, favorite: !prev.item.favorite } : null,
            }));
          }
        }}
      />
    </>
  );

  return ReactDOM.createPortal(portal, document.body);
};

export default ContentDrawer;