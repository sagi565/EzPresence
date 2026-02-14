import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles';
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
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.titleRow}>
                        <span style={styles.titleIcon}>📂</span>
                        <span style={styles.title}>Select Content</span>
                    </div>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div style={styles.body}>
                    {/* Sidebar */}
                    <div style={styles.sidebar}>
                        <div
                            style={{ ...styles.sidebarItem, ...(selectedListId === 'all' ? styles.sidebarItemActive : {}) }}
                            onClick={() => setSelectedListId('all')}
                        >
                            <span style={styles.sidebarIcon}>📑</span>
                            All Content
                        </div>
                        <div
                            style={{ ...styles.sidebarItem, ...(selectedListId === 'videos' ? styles.sidebarItemActive : {}) }}
                            onClick={() => setSelectedListId('videos')}
                        >
                            <span style={styles.sidebarIcon}>🎥</span>
                            Videos
                        </div>
                        <div
                            style={{ ...styles.sidebarItem, ...(selectedListId === 'images' ? styles.sidebarItemActive : {}) }}
                            onClick={() => setSelectedListId('images')}
                        >
                            <span style={styles.sidebarIcon}>🖼️</span>
                            Images
                        </div>

                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '8px 0' }} />

                        {lists.map(list => (
                            <div
                                key={list.id}
                                style={{ ...styles.sidebarItem, ...(selectedListId === list.id ? styles.sidebarItemActive : {}) }}
                                onClick={() => setSelectedListId(list.id)}
                            >
                                <span style={styles.sidebarIcon}>{list.icon || '📁'}</span>
                                {list.title}
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div style={styles.contentArea}>
                        {/* Toolbar */}
                        <div style={styles.toolbar}>
                            <div style={styles.searchBox}>
                                <span style={styles.searchIcon}>🔍</span>
                                <input
                                    type="text"
                                    style={styles.searchInput}
                                    placeholder="Search content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>
                                {filteredContent.length} items found
                            </div>
                        </div>

                        {/* Grid */}
                        <div style={styles.grid}>
                            {filteredContent.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <span style={styles.emptyIcon}>📭</span>
                                    <span>No content found</span>
                                </div>
                            ) : (
                                filteredContent.map(item => (
                                    <div
                                        key={item.id}
                                        style={styles.card}
                                        onClick={() => onSelect(item)}
                                        className="content-card-hover"
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
                                            e.currentTarget.style.borderColor = '#9b5de5'; // Primary color
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
                                        }}
                                    >
                                        <div style={styles.thumbnailContainer}>
                                            <img
                                                src={item.thumbnail || '/placeholder-image.png'}
                                                alt={item.title}
                                                style={styles.thumbnail}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                            />
                                            <div style={styles.typeIcon}>
                                                {item.type === 'video' ? '▶' : '🖼'}
                                            </div>
                                            {item.durationSec && (
                                                <div style={styles.duration}>
                                                    {Math.floor(item.durationSec / 60)}:{(item.durationSec % 60).toString().padStart(2, '0')}
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.cardInfo}>
                                            <div style={styles.cardTitle}>{item.title}</div>
                                            <div style={styles.cardMeta}>
                                                <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ContentPickerModal;
