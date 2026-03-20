import React, { useRef } from 'react';
import * as S from './styles';

interface HashtagTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    showCharCount?: boolean;
    rows?: number;
    minHeight?: string;
}

const HashtagTextarea: React.FC<HashtagTextareaProps> = ({
    value,
    onChange,
    placeholder = '',
    maxLength,
    showCharCount = false,
    rows = 3,
    minHeight,
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
        <S.Container style={{ minHeight }}>
            <S.Wrapper style={{ minHeight }}>
                {/* Backdrop with highlighted text */}
                <S.Backdrop ref={backdropRef}>
                    {renderHighlightedText(value)}
                </S.Backdrop>

                {/* Transparent textarea */}
                <S.Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={handleScroll}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={rows}
                />
            </S.Wrapper>

            {showCharCount && maxLength && (
                <S.CharCount>
                    {value.length}/{maxLength}
                </S.CharCount>
            )}
        </S.Container>
    );
};

export default HashtagTextarea;
