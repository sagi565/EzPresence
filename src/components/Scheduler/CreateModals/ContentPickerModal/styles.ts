import styled, { keyframes, css } from 'styled-components';
import { theme } from '@/theme/theme';

const slideUp = keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 2100;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Modal = styled.div`
    width: 900px;
    max-width: 95vw;
    height: 85vh;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: ${slideUp} 0.3s ease-out;
    border: 1px solid rgba(0, 0, 0, 0.05);
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    background-color: #fff;
`;

export const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const TitleIcon = styled.span`
    fontSize: 24px;
`;

export const Title = styled.span`
    font-size: 20px;
    font-weight: 600;
    color: ${theme.colors.text};
`;

export const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: ${theme.colors.muted};
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transition: all 0.2s;

    &:hover {
        background-color: #f3f4f6;
        color: ${theme.colors.text};
    }
`;

export const Body = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    background-color: #f9fafb;
`;

export const Sidebar = styled.div`
    width: 240px;
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    overflow-y: auto;
`;

export const SidebarItem = styled.div<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 14px;
    color: ${theme.colors.text};
    font-weight: 500;
    border-left: 3px solid transparent;

    ${props => props.$active && css`
        background-color: rgba(155, 93, 229, 0.08);
        color: ${theme.colors.primary};
        border-left-color: ${theme.colors.primary};
    `}

    &:hover {
        background-color: #f9fafb;
        ${props => props.$active && css`background-color: rgba(155, 93, 229, 0.08);`}
    }
`;

export const SidebarIcon = styled.span`
    font-size: 18px;
    width: 24px;
    text-align: center;
`;

export const Divider = styled.div`
    height: 1px;
    background: rgba(0,0,0,0.06);
    margin: 8px 0;
`;

export const ContentArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const Toolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

export const SearchBox = styled.div`
    display: flex;
    align-items: center;
    background: #f3f4f6;
    border-radius: 8px;
    padding: 8px 12px;
    width: 300px;
    gap: 8px;
    transition: all 0.2s;

    &:focus-within {
        background-color: #fff;
        box-shadow: 0 0 0 2px rgba(155, 93, 229, 0.2);
    }
`;

export const SearchIcon = styled.span`
    color: ${theme.colors.muted};
    font-size: 16px;
`;

export const SearchInput = styled.input`
    border: none;
    background: transparent;
    font-size: 14px;
    color: ${theme.colors.text};
    outline: none;
    width: 100%;
`;

export const Grid = styled.div`
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    align-content: start;
`;

export const Card = styled.div`
    background-color: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
    aspect-ratio: 1 / 1.1;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        border-color: ${theme.colors.primary};
    }
`;

export const ThumbnailContainer = styled.div`
    flex: 1;
    position: relative;
    background-color: #f0f0f0;
    overflow: hidden;
`;

export const Thumbnail = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const TypeIcon = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
`;

export const Duration = styled.div`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
`;

export const CardInfo = styled.div`
    padding: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

export const CardTitle = styled.div`
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
`;

export const CardMeta = styled.div`
    font-size: 11px;
    color: ${theme.colors.muted};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${theme.colors.muted};
    gap: 12px;
`;

export const EmptyIcon = styled.span`
    font-size: 48px;
    opacity: 0.5;
`;
