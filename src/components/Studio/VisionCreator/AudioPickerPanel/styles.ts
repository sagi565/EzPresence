import styled, { keyframes } from 'styled-components';

const fadeDown = keyframes`from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}`;

export const Panel = styled.div`
  width: 100%;
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid rgba(139,92,246,.28);
  border-radius: 16px;
  box-shadow: 0 6px 28px rgba(0,0,0,.13), 0 0 0 3px rgba(139,92,246,.05);
  padding: 10px 12px 10px;
  margin-top: 6px;
  animation: ${fadeDown} .15s ease-out;
`;

export const UrlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PlatformIcon = styled.img<{$active: boolean}>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  object-fit: contain;
  flex-shrink: 0;
  opacity: ${p => p.$active ? 1 : 0.2};
  transition: opacity .2s, transform .15s;
  transform: ${p => p.$active ? 'scale(1.1)' : 'scale(1)'};
`;

export const UrlInput = styled.input`
  flex: 1;
  background: rgba(139,92,246,.04);
  border: 1.5px solid rgba(139,92,246,.1);
  border-radius: 9px;
  outline: none;
  font-size: 12.5px;
  font-family: inherit;
  color: ${p => p.theme.colors.text};
  padding: 7px 10px;
  caret-color: #8b5cf6;
  transition: border-color .18s;
  &::placeholder { color: ${p => p.theme.colors.muted}; opacity: .55; }
  &:focus { border-color: rgba(139,92,246,.32); }
`;

export const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
  color: ${p => p.theme.colors.muted};
  font-size: 16px;
  line-height: 1;
  opacity: .5;
  flex-shrink: 0;
  border-radius: 5px;
  transition: opacity .15s;
  &:hover { opacity: 1; }
`;

export const RangeSection = styled.div`
  margin-top: 9px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RangeLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors.muted};
  width: 26px;
  flex-shrink: 0;
  opacity: .7;
`;

export const RangeInput = styled.input`
  flex: 1;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(139,92,246,.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #8b5cf6;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(139,92,246,.45);
    transition: transform .15s;
  }
  &::-webkit-slider-thumb:hover { transform: scale(1.25); }
  &::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #8b5cf6;
    border: none;
    cursor: pointer;
  }
`;

export const TimeTag = styled.span`
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: #8b5cf6;
  font-weight: 600;
  width: 34px;
  text-align: right;
  flex-shrink: 0;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  gap: 8px;
`;

export const AttachedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #8b5cf6;
  font-weight: 500;
  background: rgba(139,92,246,.07);
  border: 1px solid rgba(139,92,246,.15);
  border-radius: 6px;
  padding: 3px 8px;
`;

export const VideoInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 5px 8px;
  background: rgba(139,92,246,.04);
  border: 1px solid rgba(139,92,246,.1);
  border-radius: 8px;
  font-size: 11.5px;
  color: ${p => p.theme.colors.muted};
`;

export const VideoTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
`;

export const VideoDurationHint = styled.span`
  font-size: 10.5px;
  color: rgba(139,92,246,.6);
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const ConfirmBtn = styled.button<{$ready: boolean}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 9px;
  border: none;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: ${p => p.$ready ? 'pointer' : 'default'};
  background: ${p => p.$ready ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'rgba(139,92,246,.07)'};
  color: ${p => p.$ready ? '#fff' : 'rgba(139,92,246,.3)'};
  transition: all .2s;
  ${p => p.$ready && `box-shadow: 0 2px 10px rgba(124,58,237,.28); &:hover{transform:translateY(-1px);} &:active{transform:translateY(0);}`}
`;
