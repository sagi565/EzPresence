import styled from 'styled-components';
import { theme } from '@/theme/theme';

export const Container = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 14px;
`;

export const Icon = styled.div`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    margin-top: 4px;
    opacity: 0.65;

    @media (max-width: ${theme.breakpoints.mobile}) {
        display: none !important;
    }
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const styles: Record<string, any> = {};
