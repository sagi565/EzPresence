import React, { useRef, useEffect, useState } from 'react';
import { theme } from '@/theme/theme';

interface HashtagTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    style?: React.CSSProperties;
    className?: string;
}

const HashtagTextarea: React.FC<HashtagTextareaProps> = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    style,
    className
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync scroll between textarea and backdrop
    const handleScroll = () => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    // Render text with hashtags highlighted
    const renderHighlights = (text: string) => {
        if (!text) return <br />;

        // Split by hashtags using regex, keeping delimiters
        const parts = text.split(/(#[\w\u0590-\u05FF]+)/g);

        return parts.map((part, index) => {
            if (part.match(/^#[\w\u0590-\u05FF]+$/)) {
                return (
                    <span key={index} style={{ color: theme.colors.primary, fontWeight: 600 }}>
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    // Ensure backdrop scroll matches textarea on value change
    useEffect(() => {
        handleScroll();
    }, [value]);

    return (
        <div style={{ position: 'relative', width: '100%', ...style }} className={className}>
            {/* Backdrop for rendering highlights */}
            <div
                ref={backdropRef}
                style={{
                    ...styles.backdrop,
                    ...(isFocused ? styles.backdropFocused : {}),
                }}
                aria-hidden="true"
            >
                {renderHighlights(value)}
                {/* Add a trailing space if ending with newline to ensure height matches */}
                {value.endsWith('\n') && <br />}
            </div>

            {/* Transparent textarea for input */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                rows={rows}
                style={styles.textarea}
            />
        </div>
    );
};

const styles = {
    backdrop: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '8px 12px',
        fontSize: '13px',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        color: theme.colors.text,
        whiteSpace: 'pre-wrap' as const,
        wordWrap: 'break-word' as const,
        overflow: 'hidden',
        pointerEvents: 'none' as const,
        border: '1.5px solid rgba(0, 0, 0, .1)', // Match default border
        borderRadius: '8px',
        background: '#fff',
        transition: 'border-color .18s, box-shadow .18s',
    },
    backdropFocused: {
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}15`, // 15 = roughly 0.08 alpha
    },
    textarea: {
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        fontSize: '13px',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        background: 'transparent',
        color: 'transparent',
        caretColor: theme.colors.text,
        border: 'none', // Border is handled by backdrop
        borderRadius: '8px',
        outline: 'none',
        resize: 'vertical' as const,
        minHeight: '60px',
        position: 'relative' as const,
        zIndex: 1,
    }
};

export default HashtagTextarea;
