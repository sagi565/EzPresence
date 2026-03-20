import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as S from './styles';
import { useContentLists } from '@/hooks/contents/useContentLists';
import { ContentItem } from '@/models/ContentList';

interface ContentPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (content: ContentItem) => void;
    brandId: string;
}

const ContentPickerModal: React.FC<ContentPickerModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    brandId,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedListId, setSelectedListId] = useState<string>('all');

    // Fetch content lists
    const { lists } = useContentLists(brandId);

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    // Flatten all content
    const allContent = useMemo(() => {
        return lists.flatMap(list => list.items);
    }, [lists]);

    // Filter content based on selection and search
    const filteredContent = useMemo(() => {
        let items: ContentItem[] = [];

        if (selectedListId === 'all') {
            items = allContent;
        } else if (selectedListId === 'videos') {
            items = allContent.filter(item => item.type === 'video');
        } else if (selectedListId === 'images') {
            items = allContent.filter(item => item.type === 'image');
        } else {
            const list = lists.find(l => l.id === selectedListId);
            items = list ? list.items : [];
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                (item.title || '').toLowerCase().includes(query)
            );
        }

        return items;
    }, [selectedListId, allContent, lists, searchQuery]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <S.Overlay onClick={onClose}>
            <S.Modal onClick={e => e.stopPropagation()}>
                {/* Header */}
                <S.Header>
                    <S.TitleRow>
                        <S.TitleIcon>📂</S.TitleIcon>
                        <S.Title>Select Content</S.Title>
                    </S.TitleRow>
                    <S.CloseBtn onClick={onClose}>✕</S.CloseBtn>
                </S.Header>

                <S.Body>
                    {/* Sidebar */}
                    <S.Sidebar>
                        <S.SidebarItem
                            $active={selectedListId === 'all'}
                            onClick={() => setSelectedListId('all')}
                        >
                            <S.SidebarIcon>📑</S.SidebarIcon>
                            All Content
                        </S.SidebarItem>
                        <S.SidebarItem
                            $active={selectedListId === 'videos'}
                            onClick={() => setSelectedListId('videos')}
                        >
                            <S.SidebarIcon>🎥</S.SidebarIcon>
                            Videos
                        </S.SidebarItem>
                        <S.SidebarItem
                            $active={selectedListId === 'images'}
                            onClick={() => setSelectedListId('images')}
                        >
                            <S.SidebarIcon>🖼️</S.SidebarIcon>
                            Images
                        </S.SidebarItem>

                        <S.Divider />

                        {lists.map(list => (
                            <S.SidebarItem
                                key={list.id}
                                $active={selectedListId === list.id}
                                onClick={() => setSelectedListId(list.id)}
                            >
                                <S.SidebarIcon>{list.icon || '📁'}</S.SidebarIcon>
                                {list.title}
                            </S.SidebarItem>
                        ))}
                    </S.Sidebar>

                    {/* Main Content */}
                    <S.ContentArea>
                        {/* Toolbar */}
                        <S.Toolbar>
                            <S.SearchBox>
                                <S.SearchIcon>🔍</S.SearchIcon>
                                <S.SearchInput
                                    type="text"
                                    placeholder="Search content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </S.SearchBox>
                            <S.CardMeta style={{ color: '#666' }}>
                                {filteredContent.length} items found
                            </S.CardMeta>
                        </S.Toolbar>

                        {/* Grid */}
                        <S.Grid>
                            {filteredContent.length === 0 ? (
                                <S.EmptyState>
                                    <S.EmptyIcon>📭</S.EmptyIcon>
                                    <span>No content found</span>
                                </S.EmptyState>
                            ) : (
                                filteredContent.map(item => (
                                    <S.Card
                                        key={item.id}
                                        onClick={() => onSelect(item)}
                                    >
                                        <S.ThumbnailContainer>
                                            <S.Thumbnail
                                                src={item.thumbnail || '/placeholder-image.png'}
                                                alt={item.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                            />
                                            <S.TypeIcon>
                                                {item.type === 'video' ? '▶' : '🖼'}
                                            </S.TypeIcon>
                                            {item.durationSec && (
                                                <S.Duration>
                                                    {Math.floor(item.durationSec / 60)}:{(item.durationSec % 60).toString().padStart(2, '0')}
                                                </S.Duration>
                                            )}
                                        </S.ThumbnailContainer>
                                        <S.CardInfo>
                                            <S.CardTitle>{item.title}</S.CardTitle>
                                            <S.CardMeta>
                                                <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </S.CardMeta>
                                        </S.CardInfo>
                                    </S.Card>
                                ))
                            )}
                        </S.Grid>
                    </S.ContentArea>
                </S.Body>
            </S.Modal>
        </S.Overlay>,
        document.body
    );
};

export default ContentPickerModal;
