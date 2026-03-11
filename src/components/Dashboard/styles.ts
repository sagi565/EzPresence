import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const ShimmerBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`;

// --- MetricCard Styles ---
export const MetricCardContainer = styled.div<{ $hovered: boolean; $color: string; $gradient: string }>`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 20px 24px;
  box-shadow: ${props => props.$hovered 
    ? `0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px ${props.$color}30` 
    : theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$hovered ? 'translateY(-4px)' : 'translateY(0)'};
  cursor: default;

  @media (max-width: 480px) {
    padding: 12px;
    gap: 6px;
  }

  @media (max-width: 360px) {
    padding: 10px;
    gap: 4px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$gradient};
    opacity: 0.8;
  }
`;

export const MetricCardGlow = styled.div<{ $gradient: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.$gradient};
  border-radius: 16px 16px 0 0;
  opacity: 0.8;
`;

export const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MetricLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const MetricIconBox = styled.div<{ $color: string; $hovered: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${props => props.$color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: transform 0.2s;
  transform: ${props => props.$hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)'};
`;

export const MetricLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.muted};
  letter-spacing: 0.05em;
  text-transform: uppercase;

  @media (max-width: 400px) {
    font-size: 11px;
  }
`;

export const DeltaBadge = styled.div<{ $isPositive: boolean; $isZero: boolean }>`
  display: flex;
  align-items: center;
  gap: 3px;
  background: ${props => props.$isZero
    ? 'rgba(107, 114, 128, 0.1)'
    : props.$isPositive ? 'rgba(20, 184, 166, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$isZero
    ? theme.colors.muted
    : props.$isPositive ? '#14b8a6' : '#ef4444'};
  border-radius: 20px;
  padding: 3px 8px;
  font-size: 12px;
  @media (max-width: 400px) {
    padding: 2px 4px;
    font-size: 9px;
    gap: 1px;
  }

  @media (max-width: 350px) {
    padding: 1px 3px;
    font-size: 8px;
  }
`;

export const MetricValue = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: ${theme.colors.text};
  letter-spacing: -1.5px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 400px) {
    font-size: 22px;
    letter-spacing: -1px;
  }

  @media (max-width: 350px) {
    font-size: 20px;
  }
`;

export const SparklineWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

// --- PlatformTabs Styles ---
export const PlatformTabsContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

export const PlatformEmptyState = styled.div`
  padding: 14px 20px;
  background: white;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.muted};
  font-size: 14px;
`;

export const PlatformButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: ${theme.borderRadius.md};
  border: ${props => props.$active
    ? `2px solid ${props.$color}`
    : '2px solid #e5e7eb'};
  background: ${props => props.$active ? `${props.$color}12` : 'white'};
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: ${props => props.$active ? `0 2px 12px ${props.$color}28` : '0 1px 4px rgba(0,0,0,0.06)'};
  opacity: ${props => !props.$active ? 0.75 : 1};

  @media (max-width: 1024px) {
    padding: 8px 12px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    gap: 6px;
  }

  @media (max-width: 400px) {
    padding: 5px 8px;
    gap: 5px;
  }

  @media (max-width: 360px) {
    padding: 4px 6px;
    gap: 4px;
  }

  &:hover {
    opacity: 1;
    border-color: ${props => props.$active ? props.$color : '#d1d5db'};
  }
`;

export const CheckboxIndicator = styled.div<{ $active: boolean; $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid ${props => props.$active ? props.$color : '#d1d5db'};
  background: ${props => props.$active ? props.$color : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;

  @media (max-width: 360px) {
    width: 12px;
    height: 12px;
  }
`;

export const PlatformIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 3px;

  @media (max-width: 1024px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 360px) {
    width: 14px;
    height: 14px;
  }
`;

export const PlatformTextWrapper = styled.div`
  text-align: left;
`;

export const PlatformName = styled.div<{ $active: boolean; $color: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.$active ? props.$color : theme.colors.text};
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }

  @media (max-width: 360px) {
    font-size: 10px;
  }
`;

export const PlatformUsername = styled.div`
  font-size: 11px;
  color: ${theme.colors.muted};

  @media (max-width: 1024px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }

  @media (max-width: 360px) {
    font-size: 8.5px;
  }
`;

export const ProfilePicture = styled.img<{ $active: boolean; $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.$active ? props.$color : '#e5e7eb'};
  margin-left: 2px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 360px) {
    width: 16px;
    height: 16px;
  }
`;

// --- TimelineChart Styles ---
export const ChartContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.md};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const LegendContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
    justify-content: flex-start;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const LegendButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 13px;
  border-radius: 20px;
  border: 1.5px solid ${props => props.$active ? props.$color : '#e5e7eb'};
  background: ${props => props.$active ? `${props.$color}15` : 'transparent'};
  color: ${props => props.$active ? props.$color : theme.colors.muted};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    border-color: ${props => props.$active ? props.$color : '#d1d5db'};
  }

  @media (max-width: 480px) {
    padding: 4px 10px;
    font-size: 11px;
    white-space: nowrap;
  }
`;

export const LegendDot = styled.span<{ $active: boolean; $color: string }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${props => props.$active ? props.$color : '#d1d5db'};
  display: inline-block;
`;

export const TooltipContainer = styled.div`
  background: rgba(17, 24, 39, 0.93);
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  min-width: 140px;
`;

export const TooltipLabel = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 6px;
`;

export const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
`;

export const TooltipDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

export const TooltipValue = styled.span`
  font-size: 12px;
  color: white;
  font-weight: 600;
`;

// --- PostsTable Styles ---
export const PostsContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.md};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const PostCardContainer = styled.div<{ $hovered: boolean; $index: number }>`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.$hovered
    ? '0 8px 32px rgba(0,0,0,0.13)'
    : '0 1px 6px rgba(0,0,0,0.07)'};
  transition: all 0.22s ease;
  transform: ${props => props.$hovered ? 'translateY(-3px)' : 'translateY(0)'};
  animation: ${fadeInUp} 0.3s ease ${props => props.$index * 0.07}s both;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PostThumbnailWrapper = styled.div<{ $bg: string; $isClickable: boolean }>`
  position: relative;
  height: 220px;
  background: ${props => props.$bg.startsWith('http') ? `url("${props.$bg}") center/cover no-repeat` : props.$bg};
  flex-shrink: 0;
  overflow: hidden;
  cursor: ${props => props.$isClickable ? 'pointer' : 'default'};
`;

export const PlatformBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const PlatformIconBadge = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: drop-shadow(0 1px 4px rgba(0,0,0,0.6)) brightness(1.1);
`;

export const BadgesContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const TypeBadge = styled.div`
  background: rgba(0,0,0,0.55);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.06em;
  backdrop-filter: blur(4px);
  text-transform: uppercase;
`;

export const EzBadge = styled.div`
  background: linear-gradient(135deg, #9b5de5 0%, #fbbf24 100%);
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.08em;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(155,93,229,0.45);
`;

export const PostContent = styled.div`
  padding: 14px 16px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const StatItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.$color || theme.colors.muted};
  font-size: 13px;
  font-weight: 600;
`;

export const PublishedDate = styled.span`
  font-size: 12px;
  color: ${theme.colors.muted};
`;

export const PostCaption = styled.p`
  font-size: 13px;
  color: ${theme.colors.text};
  margin: 0 0 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

export const CommentsToggleWrapper = styled.div`
  border-top: 1px solid #f3f4f6;
`;

export const CommentsToggleButton = styled.button<{ $active: boolean; $color: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$active ? props.$color : theme.colors.muted};
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s;

  &:hover {
    color: ${props => props.$color};
  }
`;

export const ChevronIcon = styled.svg<{ $open: boolean }>`
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s;
  flex-shrink: 0;
`;

// --- CommentsList Styles ---
export const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #f3f4f6;
  animation: ${fadeInUp} 0.2s ease;
`;

export const EmptyComments = styled.div`
  padding: 16px 20px;
  color: ${theme.colors.muted};
  font-size: 13px;
  font-style: italic;
`;

export const CommentItem = styled.div<{ $even: boolean }>`
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: ${props => props.$even ? '#fafafa' : 'white'};
  align-items: flex-start;
`;

export const CommentAvatar = styled.div<{ $hue: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  background: hsl(${props => props.$hue}, 65%, 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
`;

export const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
`;

export const CommentUser = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: ${theme.colors.text};
`;

export const CommentDate = styled.span`
  font-size: 11px;
  color: ${theme.colors.muted};
`;

export const CommentLikes = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
  flex-shrink: 0;
`;

export const CommentText = styled.p`
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.4;
`;

// --- ExportButton Styles ---
export const StyledExportButton = styled.button<{ $hovered: boolean; $clicked: boolean; $loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid ${props => props.$hovered ? theme.colors.teal : 'rgba(20,184,166,0.4)'};
  background: ${props => props.$hovered
    ? 'rgba(20, 184, 166, 0.1)'
    : props.$clicked
      ? 'rgba(20, 184, 166, 0.05)'
      : 'white'};
  color: ${theme.colors.teal};
  font-weight: 600;
  font-size: 14px;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  box-shadow: ${props => props.$hovered ? '0 4px 16px rgba(20,184,166,0.2)' : 'none'};
  transform: ${props => props.$hovered ? 'translateY(-1px)' : 'translateY(0)'};

  @media (max-width: 480px) {
    padding: 10px;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ExportButtonText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export const ExportIcon = styled.svg<{ $hovered: boolean }>`
  transition: transform 0.2s;
  transform: ${props => props.$hovered ? 'translateY(2px)' : 'translateY(0)'};
`;

// --- ExportModal Styles ---
export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 2000;
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2001;
  width: 480px;
  max-width: 95vw;
  background: white;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 24px 80px rgba(0,0,0,0.18);
  animation: focusAppear 0.2s ease;
  overflow: hidden;

  @keyframes focusAppear {
    from { transform: translate(-50%, -45%); opacity: 0; }
    to { transform: translate(-50%, -50%); opacity: 1; }
  }
`;

export const ModalHeader = styled.div`
  background: ${theme.gradients.momentum};
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalHeaderContent = styled.div`
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: white;
`;

export const ModalSubtitle = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: rgba(255,255,255,0.75);
`;

export const CloseButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.3);
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionLabel = styled.p`
  font-size: 12px;
  color: ${theme.colors.muted};
  margin: 0 0 4px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const ExportOption = styled.label<{ $selected: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1.5px solid ${props => props.$selected ? theme.colors.primary : '#e5e7eb'};
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.$selected ? `${theme.colors.primary}08` : '#fafafa'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: all 0.15s;
  user-select: none;

  &:hover {
    ${props => !props.$disabled && css`
      border-color: ${props.$selected ? theme.colors.primary : '#d1d5db'};
    `}
  }
`;

export const CustomCheckbox = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  border: 2px solid ${props => props.$selected ? theme.colors.primary : '#d1d5db'};
  background: ${props => props.$selected ? theme.colors.primary : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
`;

export const OptionIcon = styled.span`
  font-size: 22px;
  flex-shrink: 0;
`;

export const OptionText = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${theme.colors.text};
`;

export const OptionDescription = styled.div`
  font-size: 12px;
  color: ${theme.colors.muted};
  margin-top: 1px;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: 9px 20px;
  border-radius: ${theme.borderRadius.md};
  border: 1.5px solid #e5e7eb;
  background: white;
  color: ${theme.colors.muted};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
`;

export const ActionButton = styled.button<{ $done: boolean; $disabled: boolean }>`
  padding: 9px 24px;
  border-radius: ${theme.borderRadius.md};
  border: none;
  background: ${props => props.$done ? '#14b8a6' : theme.gradients.momentum};
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
  opacity: ${props => props.$disabled ? 0.5 : 1};
`;
