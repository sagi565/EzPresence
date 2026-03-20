import styled from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const Wrapper = styled.div`
    position: relative;
`;

export const Backdrop = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    line-height: 1.5;
    color: ${theme.colors.text};
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    pointer-events: none;
    border: 1.5px solid transparent;
    border-radius: 8px;
    background: #fff;

    .hashtag {
        font-weight: 700;
        color: ${theme.colors.primary};
    }
`;

export const Textarea = styled.textarea`
    width: 100%;
    padding: 8px 12px;
    border: 1.5px solid rgba(0, 0, 0, .1);
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    color: transparent;
    caret-color: ${theme.colors.text};
    background: transparent;
    transition: border-color .18s, box-shadow .18s;
    outline: none;
    resize: vertical;
    min-height: 60px;
    line-height: 1.5;
    position: relative;
    z-index: 1;

    &::selection {
        background: rgba(155, 93, 229, .2);
        color: transparent;
    }

    &:focus {
        border-color: ${theme.colors.primary} !important;
        box-shadow: 0 0 0 3px rgba(155, 93, 229, .08) !important;
    }
`;

export const CharCount = styled.div`
    font-size: 10px;
    color: #b0b3b8;
    text-align: right;
    marginTop: -2px;
`;
