import React, { useRef, useEffect } from 'react';
import { styles } from './styles';

interface HashtagTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    showCharCount?: boolean;
    rows?: number;
}

const HashtagTextarea: React.FC<HashtagTextareaProps> = ({
    value,
    onChange,
    placeholder = '',
    maxLength,
    showCharCount = false,
    rows = 3,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    // Sync scroll position between textarea and backdrop
    const handleScroll = () => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
            backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    // Render highlighted text with hashtags
    const renderHighlightedText = (text: string): JSX.Element[] => {
        const parts: JSX.Element[] = [];
        const regex = /#\w+/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before hashtag
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {text.substring(lastIndex, match.index)}
                    </span>
                );
            }

            // Add hashtag
            parts.push(
                <span key={`hashtag-${match.index}`} className="hashtag">
                    {match[0]}
                </span>
            );

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(
                <span key={`text-${lastIndex}`}>
                    {text.substring(lastIndex)}
                </span>
            );
        }

        return parts;
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Backdrop with highlighted text */}
                <div
                    ref={backdropRef}
                    style={styles.backdrop}
                    className="npm-hashtag-backdrop"
                >
                    {renderHighlightedText(value)}
                </div>

                {/* Transparent textarea */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={handleScroll}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows}
                    style={styles.textarea}
                    className="npm-field-textarea"
                />
            </div>

            {showCharCount && maxLength && (
                <div style={styles.charCount}>
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
};

export default HashtagTextarea;
