import React, {
  useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent,
} from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useVisionPlan } from '@hooks/useVisionPlan';

// ─── Keyframes ────────────────────────────────────────────────────────────────
const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
`;
const drift = keyframes`
  0%,100% { transform:translate(0,0)   scale(1);    }
  33%      { transform:translate(28px,-18px)  scale(1.04); }
  66%      { transform:translate(-18px, 8px) scale(0.97); }
`;
const orbit = keyframes`
  from { transform:rotate(0deg) translateX(var(--r)) rotate(0deg); }
  to   { transform:rotate(360deg) translateX(var(--r)) rotate(-360deg); }
`;

const blink = keyframes`
  0%,100% { opacity:1; } 50% { opacity:0; }
`;
const shimmer = keyframes`
  0%   { background-position:-200% center; }
  100% { background-position: 200% center; }
`;
const rippleAnim = keyframes`
  0%   { transform:scale(0);   opacity:.6; }
  100% { transform:scale(2.8); opacity:0;  }
`;
const spin = keyframes`
  from { transform:rotate(0deg); }
  to   { transform:rotate(360deg); }
`;
const slideDown = keyframes`
  from { opacity:0; transform:translateY(-6px); }
  to   { opacity:1; transform:translateY(0); }
`;
const scaleIn = keyframes`
  from { opacity:0; transform:scale(.9); }
  to   { opacity:1; transform:scale(1); }
`;
const pulseDot = keyframes`
  0%,100% { transform:scale(1); opacity:.5; }
  50%      { transform:scale(1.5); opacity:1; }
`;

// ─── Background ───────────────────────────────────────────────────────────────
const bgAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const VisionContainer = styled.div`
  flex:1;
  height:calc(100vh - 76px);
  display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
  position:relative;
  overflow-y:auto; overflow-x:hidden;
  background: linear-gradient(-45deg, ${p=>p.theme.colors.bg}, rgba(139,92,246,0.03), ${p=>p.theme.colors.bg}, rgba(109,40,217,0.02));
  background-size: 300% 300%;
  animation: ${bgAnim} 20s ease-in-out infinite;
  padding:40px 24px 80px;
  scrollbar-width:thin;
  scrollbar-color:rgba(139,92,246,.15) transparent;
`;

// Large blurry gradient orbs
const BgOrb = styled.div<{ $s:number; $x:string; $y:string; $c:string; $op:number; $delay?:string }>`
  position:fixed;
  width:${p=>p.$s}px; height:${p=>p.$s}px;
  left:${p=>p.$x}; top:${p=>p.$y};
  background:radial-gradient(circle, ${p=>p.$c} 0%, transparent 65%);
  opacity:${p=>p.$op};
  border-radius:50%; pointer-events:none;
  filter:blur(52px);
  animation:${drift} 20s ease-in-out ${p=>p.$delay??'0s'} infinite;
`;

// Concentric orbital rings with rotating dots
const OrbitsWrap = styled.div`
  position:absolute; top:40%; left:50%;
  pointer-events:none; z-index:0;
`;
const OrbitRing = styled.div<{ $size:number }>`
  position:absolute;
  width:${p=>p.$size}px; height:${p=>p.$size}px;
  border-radius:50%;
  border:1.5px dashed rgba(139,92,246,.12);
  top:50%; left:50%;
  transform:translate(-50%,-50%);
`;
const OrbitDot = styled.div<{ $r:number; $dur:string; $delay:string; $size:number }>`
  --r:${p=>p.$r}px;
  position:absolute;
  top:50%; left:50%;
  width:${p=>p.$size}px; height:${p=>p.$size}px;
  margin:-${p=>p.$size/2}px;
  border-radius:50%;
  background:rgba(139,92,246,.7);
  box-shadow:0 0 12px rgba(139,92,246,.6);
  animation:${orbit} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
const FloatDot = styled.div<{ $x:string; $y:string; $size:number; $delay:string }>`
  position:fixed;
  left:${p=>p.$x}; top:${p=>p.$y};
  width:${p=>p.$size}px; height:${p=>p.$size}px;
  border-radius:50%;
  background:rgba(139,92,246,.25);
  box-shadow:0 0 ${p=>p.$size*2}px rgba(139,92,246,.2);
  pointer-events:none;
  animation:${pulseDot} ${p=>3+parseFloat(p.$delay)}s ease-in-out ${p=>p.$delay} infinite;
`;


// ─── Layout ───────────────────────────────────────────────────────────────────
const ContentWrapper = styled.div`
  display:flex; flex-direction:column; align-items:center;
  gap:28px; width:100%; max-width:720px;
  position:relative; z-index:1;
  animation:${fadeInUp} .7s cubic-bezier(.4,0,.2,1) both;
`;

// ─── Header ───────────────────────────────────────────────────────────────────
const CreatorBadge = styled.div`
  display:inline-flex; align-items:center; gap:8px;
  padding:5px 16px 5px 7px;
  background:${p=>p.theme.colors.surface};
  border:1px solid rgba(139,92,246,.18); border-radius:999px;
  font-size:11px; font-weight:700; color:${p=>p.theme.colors.muted};
  letter-spacing:.08em; text-transform:uppercase;
`;
const BadgeDot = styled.span`
  width:18px; height:18px; border-radius:50%;
  background:linear-gradient(135deg,#a78bfa,#6d28d9);
  display:flex; align-items:center; justify-content:center; font-size:9px;
`;
const PageTitle = styled.h1`
  font-size:clamp(2rem,4vw,3.2rem);
  font-weight:800; letter-spacing:-2px; line-height:1.05; margin:0;
  color:${p=>p.theme.colors.text}; text-align:center;
`;
const TitleAccent = styled.span`
  background:linear-gradient(135deg,#a78bfa 0%,#8b5cf6 45%,#6d28d9 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation:${shimmer} 4s linear infinite;
`;
const PageSubtitle = styled.p`
  font-size:14px; color:${p=>p.theme.colors.muted}; margin:0;
  line-height:1.6; max-width:440px; text-align:center;
`;
const Header = styled.div`
  display:flex; flex-direction:column; align-items:center; gap:12px; margin-bottom: 8px;
`;

// ─── Prompt Box ───────────────────────────────────────────────────────────────
const PromptBox = styled.div<{ $drag:boolean; $focus:boolean }>`
  width:100%;
  background:${p=>p.theme.colors.surface};
  border-radius:20px;
  border:1.5px solid ${p=>
    p.$drag ? 'rgba(139,92,246,.8)' :
    p.$focus ? 'rgba(139,92,246,.38)' : 'rgba(139,92,246,.1)'};
  position:relative;
  transition:border-color .25s, box-shadow .25s;
  box-shadow:${p=>(p.$drag||p.$focus)?'0 0 0 3px rgba(139,92,246,.06)':'none'};
`;

const DragOverlay = styled.div<{ $v:boolean }>`
  position:absolute; inset:0; z-index:10; border-radius:inherit;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
  background:rgba(139,92,246,.05); backdrop-filter:blur(8px);
  border:1px solid rgba(139,92,246,.2);
  opacity:${p=>p.$v?1:0}; pointer-events:none; transition:opacity .2s;
`;
const DragIcon = styled.div`
  color:#a78bfa; opacity:0.8;
  display:flex; align-items:center; justify-content:center;
  width:44px; height:44px; border-radius:50%; background:rgba(139,92,246,.1);
`;
const DragText = styled.p`font-size:12.5px; font-weight:500; letter-spacing:0.04em; color:#a78bfa; margin:0; text-transform:uppercase;`;

const TextareaWrap = styled.div`padding:18px 18px 0; position:relative;`;
const Placeholder = styled.div<{ $v:boolean }>`
  position:absolute; top:18px; left:18px; right:18px; pointer-events:none;
  font-size:15px; line-height:1.6; color:${p=>p.theme.colors.muted};
  opacity:${p=>p.$v?1:0}; transition:opacity .15s;
`;
const TwText = styled.span`color:${p=>p.theme.colors.muted};`;
const Cursor = styled.span`
  display:inline-block; width:2px; height:1em;
  background:#8b5cf6; margin-left:2px; vertical-align:text-bottom;
  border-radius:1px; animation:${blink} 1s step-end infinite;
`;
const Textarea = styled.textarea`
  width:100%; min-height:76px; max-height:200px;
  background:transparent; border:none; outline:none; resize:none;
  font-size:15px; line-height:1.6; color:${p=>p.theme.colors.text};
  font-family:inherit; box-sizing:border-box; padding:0;
  caret-color:#8b5cf6; overflow-y:auto;
  scrollbar-width:thin; scrollbar-color:rgba(139,92,246,.15) transparent;
  &::placeholder { color:transparent; }
`;

// ─── Attachments ──────────────────────────────────────────────────────────────
const AttachList = styled.div`
  display:flex; flex-wrap:wrap; gap:6px; padding:10px 18px 0;
`;
const AttachChip = styled.div`
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 9px 4px 7px;
  background:rgba(139,92,246,.07); border:1px solid rgba(139,92,246,.16);
  border-radius:7px; font-size:11.5px; color:#8b5cf6; font-weight:500; max-width:200px;
`;
const AttachName = styled.span`overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`;
const RemoveBtn = styled.button`
  background:none; border:none; cursor:pointer; padding:0;
  color:#8b5cf6; opacity:.5; font-size:14px; line-height:1;
  display:flex; align-items:center; flex-shrink:0;
  &:hover { opacity:1; }
`;

// ─── Toolbar ──────────────────────────────────────────────────────────────────
const Toolbar = styled.div`
  display:flex; align-items:center;
  padding:10px 13px; gap:6px;
  border-top:1px solid ${p=>p.theme.colors.primaryLight};
  margin-top:10px;
`;
const IconBtn = styled.button<{ $active?:boolean }>`
  display:inline-flex; align-items:center; justify-content:center;
  width:34px; height:34px; border-radius:9px; flex-shrink:0;
  border:1.5px solid ${p=>p.$active?'rgba(139,92,246,.4)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};
  color:${p=>p.$active?'#8b5cf6':p.theme.colors.muted};
  cursor:pointer; transition:all .18s;
  &:hover { background:rgba(139,92,246,.08); border-color:rgba(139,92,246,.3); color:#8b5cf6; }
`;
// Platform icon badges next to link button (tiny, no text)
const PlatformBadge = styled.img<{ $active:boolean }>`
  width:16px; height:16px; object-fit:contain; border-radius:3px;
  opacity:${p=>p.$active?1:.35};
  transition:opacity .2s;
`;
const Spacer = styled.div`flex:1;`;
const CharCount = styled.span<{ $w:boolean }>`
  font-size:11.5px; color:${p=>p.$w?'#f59e0b':p.theme.colors.muted}; opacity:.65;
  font-variant-numeric:tabular-nums;
`;
const SendBtn = styled.button<{ $ready:boolean; $loading:boolean }>`
  position:relative;
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  padding:9px 20px; border-radius:12px; border:none;
  cursor:${p=>(p.$ready&&!p.$loading)?'pointer':'default'};
  font-size:13.5px; font-weight:700; font-family:inherit;
  background:${p=>p.$ready?'linear-gradient(135deg,#a78bfa,#7c3aed)':'rgba(139,92,246,.08)'};
  color:${p=>p.$ready?'white':'rgba(139,92,246,.35)'};
  transition:all .25s cubic-bezier(.4,0,.2,1); overflow:hidden;
  ${p=>p.$ready&&!p.$loading&&css`
    box-shadow:0 4px 18px rgba(124,58,237,.35);
    &:hover { transform:translateY(-2px); box-shadow:0 7px 24px rgba(124,58,237,.48); }
    &:active { transform:translateY(0); }
  `}
`;
const Spinner = styled.div`
  width:13px; height:13px; border:2px solid rgba(255,255,255,.3);
  border-top-color:white; border-radius:50%; animation:${spin} .65s linear infinite;
`;
const RippleEl = styled.span`
  position:absolute; width:10px; height:10px; border-radius:50%;
  background:rgba(255,255,255,.4);
  animation:${rippleAnim} .55s ease-out forwards;
`;

// ─── Link Popover ─────────────────────────────────────────────────────────────
const LinkPopover = styled.div<{ $open:boolean }>`
  position:absolute;
  bottom:calc(100% + 8px); left:50%; width:540px; margin-left:-270px;
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.15);
  border-radius:16px;
  padding:10px 12px;
  box-shadow:0 8px 32px rgba(0,0,0,.12);
  z-index:20;
  pointer-events:${p=>p.$open?'all':'none'};
  opacity:${p=>p.$open?1:0};
  transform:${p=>p.$open?'translateY(0)':'translateY(6px)'};
  transition:opacity .2s, transform .2s;
`;
const LinkRow = styled.div`display:flex; align-items:center;`;
const LinkInput = styled.input<{ $error:boolean; $ok:boolean }>`
  flex:1; padding:9px 13px; border-radius:10px;
  border:1.5px solid ${p=>p.$error?'rgba(239,68,68,.3)':p.$ok?'rgba(139,92,246,.3)':'rgba(139,92,246,.1)'};
  background:${p=>p.theme.colors.bg};
  color:${p=>p.theme.colors.text};
  font-size:13px; font-family:inherit; outline:none;
  transition:border-color .18s;
  &:focus { border-color:${p=>p.$error?'#ef4444':p.$ok?'#22c55e':'rgba(139,92,246,.4)'}; }
  &::placeholder { color:${p=>p.theme.colors.muted}; opacity:.6; }
`;

// Tooltip style for the "?" help icon
const HelpWrap = styled.div`
  position:relative; display:flex; align-items:center; justify-content:center;
  color:#a78bfa; cursor:help; flex-shrink:0; margin-left:10px; opacity:0.7;
  transition:opacity .2s;
  &:hover { opacity:1; }
  &:hover > div { opacity:1; transform:translateY(0); pointer-events:auto; }
`;
const HelpBubble = styled.div`
  position:absolute; bottom:calc(100% + 14px); right:-10px;
  width:260px; background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.25); border-radius:12px;
  padding:12px 14px; box-shadow:0 12px 40px rgba(0,0,0,.3);
  font-size:12px; line-height:1.5; color:${p=>p.theme.colors.text}; font-weight:500;
  opacity:0; transform:translateY(8px); pointer-events:none;
  transition:opacity .25s, transform .25s; z-index:50;
  &::after {
    content:''; position:absolute; bottom:-6px; right:16px;
    width:10px; height:10px; background:${p=>p.theme.colors.surface};
    border-right:1.5px solid rgba(139,92,246,.25);
    border-bottom:1.5px solid rgba(139,92,246,.25);
    transform:rotate(45deg);
  }
`;


// ─── Video Panel ──────────────────────────────────────────────────────────────
const VideoPanel = styled.div`
  width:100%;
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.1);
  border-radius:20px; overflow:hidden;
  animation:${scaleIn} .35s cubic-bezier(.4,0,.2,1) both;
`;
const VideoHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px 0;
`;
const VideoTitle = styled.p`
  font-size:11px; font-weight:700; text-transform:uppercase;
  letter-spacing:.08em; color:${p=>p.theme.colors.muted}; margin:0;
  display:flex; align-items:center; gap:6px;
`;
const VideoClose = styled.button`
  background:none; border:none; cursor:pointer;
  color:${p=>p.theme.colors.muted}; font-size:18px; line-height:1;
  opacity:.5; padding:0; &:hover { opacity:1; }
`;
const VideoFrame = styled.div`
  position:relative; margin:12px 16px 0;
  aspect-ratio:16/9; border-radius:12px; overflow:hidden;
  background:#000; box-shadow:0 8px 30px rgba(0,0,0,.2);
`;
const StyledIframe = styled.iframe`
  width:100%; height:100%; border:none;
`;
// Time range overlay on the video
const TimeRangeBar = styled.div`
  position:absolute; bottom:0; left:0; right:0; height:4px; background:rgba(0,0,0,.4);
`;
const TimeRangeFill = styled.div<{ $left:number; $width:number }>`
  position:absolute; top:0; height:100%;
  left:${p=>p.$left}%; width:${p=>p.$width}%;
  background:linear-gradient(90deg,#a78bfa,#7c3aed);
  border-radius:999px;
  transition:left .1s, width .1s;
`;
// Overlay showing selected time range on video
const TimeOverlay = styled.div<{ $left:number; $width:number }>`
  position:absolute; top:0; bottom:0;
  left:${p=>p.$left}%; width:${p=>p.$width}%;
  border:2px solid rgba(167,139,250,.7);
  background:rgba(139,92,246,.08);
  border-radius:4px;
  pointer-events:none;
  transition:left .1s, width .1s;
`;
const TimeTag = styled.div<{ $left:number }>`
  position:absolute; top:8px; left:${p=>Math.min(Math.max(p.$left,0),88)}%;
  background:#7c3aed; color:white;
  font-size:10px; font-weight:700; padding:2px 7px; border-radius:5px;
  pointer-events:none; white-space:nowrap;
`;

// ─── Timeline Sliders ─────────────────────────────────────────────────────────
const TimelineWrap = styled.div`
  padding:14px 16px 16px;
  display:flex; flex-direction:column; gap:14px;
  border-top:1px solid ${p=>p.theme.colors.primaryLight};
  margin-top:12px;
`;
const SliderRow = styled.div`display:flex; flex-direction:column; gap:6px;`;
const SliderHead = styled.div`
  display:flex; justify-content:space-between; align-items:center;
`;
const SliderLabel = styled.span`
  font-size:11.5px; font-weight:600; color:${p=>p.theme.colors.muted};
`;
const SliderVal = styled.span`
  font-size:11.5px; font-weight:700; color:#8b5cf6;
  font-variant-numeric:tabular-nums;
  background:rgba(139,92,246,.09); padding:2px 9px; border-radius:6px;
`;
const SliderTrack = styled.div`
  position:relative; height:22px; display:flex; align-items:center;
`;
const SliderBg = styled.div`
  position:absolute; left:0; right:0;
  height:5px; background:rgba(139,92,246,.1); border-radius:999px;
  top:50%; transform:translateY(-50%); pointer-events:none;
`;
const SliderFill = styled.div<{ $left:number; $width:number }>`
  position:absolute; height:5px;
  left:${p=>p.$left}%; width:${p=>p.$width}%;
  background:linear-gradient(90deg,#a78bfa,#7c3aed);
  border-radius:999px; pointer-events:none;
  top:50%; transform:translateY(-50%);
  transition:left .05s, width .05s;
`;
const SliderInput = styled.input`
  position:absolute; left:0; right:0; width:100%;
  -webkit-appearance:none; appearance:none;
  background:transparent; cursor:pointer; margin:0; height:22px; z-index:2;
  &::-webkit-slider-thumb {
    -webkit-appearance:none;
    width:17px; height:17px; border-radius:50%;
    background:white; border:2.5px solid #7c3aed;
    box-shadow:0 2px 8px rgba(124,58,237,.38);
    cursor:pointer; transition:transform .12s, box-shadow .12s;
    margin-top:-6px;
  }
  &::-webkit-slider-thumb:hover, &:focus::-webkit-slider-thumb {
    transform:scale(1.18); box-shadow:0 3px 12px rgba(124,58,237,.55);
  }
  &::-webkit-slider-runnable-track { height:5px; background:transparent; border-radius:999px; }
  &::-moz-range-thumb {
    width:17px; height:17px; border-radius:50%;
    background:white; border:2.5px solid #7c3aed;
    box-shadow:0 2px 8px rgba(124,58,237,.38); cursor:pointer;
  }
  &::-moz-range-track { height:5px; background:transparent; border-radius:999px; }
  &:focus { outline:none; }
`;
const SliderInfo = styled.p`
  font-size:11px; color:${p=>p.theme.colors.muted}; margin:0; opacity:.7; line-height:1.4;
`;

// ─── Misc ─────────────────────────────────────────────────────────────────────
const Banner = styled.div<{ $ok:boolean }>`
  width:100%; padding:11px 15px;
  background:${p=>p.$ok?'rgba(34,197,94,.07)':'rgba(239,68,68,.07)'};
  border:1px solid ${p=>p.$ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.18)'};
  border-radius:12px; font-size:13px; font-weight:500;
  color:${p=>p.$ok?'#16a34a':'#ef4444'};
  animation:${slideDown} .2s both;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
type Platform = 'youtube'|'instagram'|'tiktok'|'facebook';


function getPlatformBg(p:string):string {
  return ({youtube:'rgba(255,0,0,.07)',instagram:'rgba(225,48,108,.07)',tiktok:'rgba(45,45,45,.07)',facebook:'rgba(24,119,242,.07)'} as any)[p]??'rgba(139,92,246,.07)';
}

const PLATFORMS:{id:Platform;icon:string;label:string}[] = [
  {id:'youtube',   icon:'/icons/social/youtube.png',    label:'YouTube'},
  {id:'instagram', icon:'/icons/social/instagram.png',  label:'Instagram'},
  {id:'tiktok',    icon:'/icons/social/tiktok.png',     label:'TikTok'},
  {id:'facebook',  icon:'/icons/social/facebook.png',   label:'Facebook'},
];

const PATTERNS:Record<Platform,RegExp> = {
  youtube:   /youtube\.com|youtu\.be/i,
  instagram: /instagram\.com/i,
  tiktok:    /tiktok\.com|vm\.tiktok\.com/i,
  facebook:  /facebook\.com|fb\.watch/i,
};

function detectPlatform(url:string):Platform|null {
  for(const[k,re] of Object.entries(PATTERNS)) if(re.test(url)) return k as Platform;
  return null;
}
function getYouTubeId(url:string):string|null {
  const m=url.match(/(?:v=|\/)([\w-]{11})(?:\?|&|\/|$)/);
  return m?m[1]:null;
}
function getEmbedUrl(platform:Platform, url:string, startSec:number, endSec:number):string|null {
  if(platform==='youtube') {
    const id=getYouTubeId(url); if(!id) return null;
    return `https://www.youtube.com/embed/${id}?start=${Math.floor(startSec)}&end=${Math.floor(endSec)}&autoplay=0&rel=0&modestbranding=1`;
  }
  if(platform==='instagram') {
    const m=url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/i);
    if(!m) return null;
    return `https://www.instagram.com/p/${m[1]}/embed/`;
  }
  if(platform==='facebook') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  }
  if(platform==='tiktok') {
    const m=url.match(/video\/(\d+)/i);
    if(m) return `https://www.tiktok.com/embed/v2/${m[1]}`;
  }
  return null;
}
function fmt(sec:number):string {
  const m=Math.floor(sec/60), s=Math.floor(sec%60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

const PROMPTS=[
  'A hungry monkey discovering a giant yellow banana in a neon jungle, cinematic lighting...',
  'A cinematic sunrise over a misty mountain valley, golden hour...',
  'A cyberpunk detective inspecting a strange glowing artifact in a dark rainy alleyway...',
  'A lone astronaut floating above Earth, stars reflecting in their visor...',
  'An ancient map unfolding magically to reveal a hidden glowing treasure path...',
  'Time-lapse of a city waking up, neon fading into morning light...',
  'Slow motion waves crashing on a black sand beach at dusk...',
  'A mischievous cat knocking a glass of water off a table in slow motion, water splashing everywhere...',
  'Abstract geometric forms morphing into a brand logo, electric violet, 3D render...',
];
const MAX=1000, TYPE=40, DEL=16, PAUSE=2200, MAX_DUR=300;

// ─── Component ────────────────────────────────────────────────────────────────
interface FileAtt { id:string; name:string; }

const VisionPage:React.FC = () => {
  const { isLoading, error:apiError, planUuid, generatePlan } = useVisionPlan();

  // Prompt / Drag
  const [prompt,   setPrompt]   = useState('');
  const [focused,  setFocused]  = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files,    setFiles]    = useState<FileAtt[]>([]);
  const [ripple,   setRipple]   = useState<{x:number;y:number}|null>(null);

  // Typewriter
  const [tw,      setTw]      = useState('');
  const [twIdx,   setTwIdx]   = useState(0);
  const [twDel,   setTwDel]   = useState(false);
  const twRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Link panel
  const [linkOpen,  setLinkOpen]  = useState(false);
  const [urlInput,  setUrlInput]  = useState('');
  const [urlError,  setUrlError]  = useState<string|null>(null);
  const [platform,  setPlatform]  = useState<Platform|null>(null);
  const [verified,  setVerified]  = useState<string|null>(null);

  // Video sliders — user selects START and END
  const [startSec, setStartSec] = useState(0);
  const [endSec,   setEndSec]   = useState(30);
  const [vidDur]                = useState(MAX_DUR);

  // iframe key to force re-render when start changes
  const [iframeKey, setIframeKey] = useState(0);

  const fileRef   = useRef<HTMLInputElement>(null);
  const linkRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Typewriter ──────────────────────────────────────────────────────────────
  const clearTw = ()=> { if(twRef.current) clearTimeout(twRef.current); };
  const tick = useCallback(()=>{
    const t=PROMPTS[twIdx];
    if(!twDel) {
      if(tw.length<t.length) { setTw(t.slice(0,tw.length+1)); twRef.current=setTimeout(tick,TYPE); }
      else                   { twRef.current=setTimeout(()=>setTwDel(true),PAUSE); }
    } else {
      if(tw.length>0) { setTw(p=>p.slice(0,-1)); twRef.current=setTimeout(tick,DEL); }
      else            { setTwDel(false); setTwIdx(i=>(i+1)%PROMPTS.length); }
    }
  },[tw,twDel,twIdx]);
  useEffect(()=>{ if(prompt){clearTw();return;} clearTw(); twRef.current=setTimeout(tick,TYPE); return clearTw; },[tick,prompt]);

  // ── Click outside to close link panel ──────────────────────────────────────
  useEffect(()=>{
    const h=(e:MouseEvent)=>{ if(linkRef.current&&!linkRef.current.contains(e.target as Node)) setLinkOpen(false); };
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[]);

  // ── Focus link input when panel opens ──────────────────────────────────────
  useEffect(()=>{ if(linkOpen) setTimeout(()=>inputRef.current?.focus(),80); },[linkOpen]);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────
  const onDragOver  = (e:DragEvent)=>{ e.preventDefault(); setDragging(true); };
  const onDragLeave = (e:DragEvent)=>{ if(!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); };
  const onDrop      = (e:DragEvent)=>{ e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(f=>setFiles(p=>[...p,{id:`${f.name}-${Date.now()}`,name:f.name}])); };
  const onFile      = (e:ChangeEvent<HTMLInputElement>)=>{
    Array.from(e.target.files||[]).forEach(f=>setFiles(p=>[...p,{id:`${f.name}-${Date.now()}`,name:f.name}]));
    e.target.value='';
  };

  // ── URL handling ─────────────────────────────────────────────────────────────
  const handleUrlChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const val=e.target.value;
    setUrlInput(val);
    setUrlError(null);
    // Auto-detect and verify as user types
    if(val.trim().length>10) {
      const det=detectPlatform(val.trim());
      if(det) {
        setPlatform(det);
        setVerified(val.trim());
        setUrlError(null);
        setStartSec(0); setEndSec(30); setIframeKey(k=>k+1);
      } else {
        setPlatform(null); setVerified(null);
      }
    } else {
      setPlatform(null); setVerified(null);
    }
  };
  const handleUrlKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==='Enter') {
      if(!verified && urlInput.trim()) {
        setUrlError('Not a recognized YouTube, Instagram, TikTok, or Facebook link.');
      } else if(verified) {
        setLinkOpen(false);
      }
    }
    if(e.key==='Escape') setLinkOpen(false);
  };
  const clearVideo=()=>{ setVerified(null); setUrlInput(''); setUrlError(null); setPlatform(null); setStartSec(0); setEndSec(30); };

  // ── Sliders ─────────────────────────────────────────────────────────────────
  const leftPct  = (startSec/vidDur)*100;
  const widthPct = ((endSec-startSec)/vidDur)*100;

  const handleStartChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const v=Number(e.target.value);
    setStartSec(v);
    if(v>=endSec) setEndSec(Math.min(v+5,vidDur));
  };
  const handleEndChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const v=Number(e.target.value);
    setEndSec(v);
    if(v<=startSec) setStartSec(Math.max(v-5,0));
  };
  // Reload iframe when start changes (debounced)
  const iframeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const handleStartRelease=()=>{
    if(iframeTimer.current) clearTimeout(iframeTimer.current);
    iframeTimer.current=setTimeout(()=>setIframeKey(k=>k+1),400);
  };

  // ── Send ────────────────────────────────────────────────────────────────────
  const isReady=prompt.trim().length>0;
  const handleSend=async(e:React.MouseEvent<HTMLButtonElement>)=>{
    if(!isReady||isLoading) return;
    const rect=e.currentTarget.getBoundingClientRect();
    setRipple({x:e.clientX-rect.left,y:e.clientY-rect.top});
    setTimeout(()=>setRipple(null),600);
    await generatePlan(prompt,{
      socialVideo: verified&&platform
        ? {platform,url:verified,offsetSeconds:startSec,durationSeconds:endSec-startSec}
        : undefined,
    });
  };

  const embedUrl = verified&&platform ? getEmbedUrl(platform,verified,startSec,endSec) : null;
  const canEmbed = !!embedUrl;

  const p = platform;

  return (
    <VisionContainer onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      {/* Large blurry orbs */}
      <BgOrb $s={550} $x="-10%" $y="-18%" $c="rgba(139,92,246,1)" $op={.04} />
      <BgOrb $s={380} $x="70%"  $y="50%"  $c="rgba(109,40,217,1)" $op={.03} $delay="3s"/>

      {/* Orbiting concentric rings decoration */}
      <OrbitsWrap>
        <OrbitRing $size={300} />
        <OrbitRing $size={450} />
        <OrbitRing $size={600} />
        <OrbitRing $size={750} />
        
        <OrbitDot $r={150} $dur="20s" $delay="0s"  $size={5} />
        <OrbitDot $r={225} $dur="26s" $delay="-5s" $size={4} />
        <OrbitDot $r={300} $dur="35s" $delay="-12s" $size={6} />
        <OrbitDot $r={375} $dur="45s" $delay="-20s" $size={4} />
        
        {/* Additional varied dots */}
        <OrbitDot $r={225} $dur="28s" $delay="-15s" $size={3} />
        <OrbitDot $r={300} $dur="40s" $delay="-2s"  $size={5} />
      </OrbitsWrap>

      {/* Scattered pulsing dots */}
      <FloatDot $x="12%"  $y="22%" $size={6}  $delay="0s"  />
      <FloatDot $x="88%"  $y="15%" $size={4}  $delay="1.2s"/>
      <FloatDot $x="80%"  $y="70%" $size={7}  $delay="0.5s"/>
      <FloatDot $x="7%"   $y="65%" $size={5}  $delay="2s"  />
      <FloatDot $x="55%"  $y="85%" $size={4}  $delay="1.8s"/>

      <ContentWrapper>
        {/* ── Header ── */}
        <Header>
          <CreatorBadge>
            <BadgeDot>✨</BadgeDot>
            Vision Creator
          </CreatorBadge>
          <PageTitle>What will <TitleAccent>Vision</TitleAccent><br/>create for you?</PageTitle>
          <PageSubtitle>
            Describe your idea clearly in plain words.
          </PageSubtitle>
        </Header>

        {/* ── Prompt Box ── */}
        <PromptBox $drag={dragging} $focus={focused}>
          <DragOverlay $v={dragging}>
            <DragIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </DragIcon>
            <DragText>Drop images</DragText>
          </DragOverlay>

          <TextareaWrap>
            <Placeholder $v={!focused&&!prompt}>
              <TwText>{tw}</TwText><Cursor/>
            </Placeholder>
            <Textarea
              id="vision-prompt-input"
              value={prompt}
              onChange={e=>setPrompt(e.target.value.slice(0,MAX))}
              onFocus={()=>setFocused(true)}
              onBlur={()=>setFocused(false)}
              rows={3}
              aria-label="Vision prompt"
            />
          </TextareaWrap>

          {files.length>0 && (
            <AttachList>
              {files.map(f=>(
                <AttachChip key={f.id}>
                  <span>📎</span>
                  <AttachName title={f.name}>{f.name}</AttachName>
                  <RemoveBtn onClick={()=>setFiles(p=>p.filter(x=>x.id!==f.id))}>×</RemoveBtn>
                </AttachChip>
              ))}
            </AttachList>
          )}

          {/* Toolbar */}
          <Toolbar>
            {/* Attach file */}
            <IconBtn id="vision-attach-btn" onClick={()=>fileRef.current?.click()} title="Attach image">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </IconBtn>

            {/* Link button + popover — positioned relative wrapper */}
            <div ref={linkRef} style={{position:'relative'}}>
              <IconBtn
                id="vision-link-btn"
                $active={linkOpen||!!verified}
                onClick={()=>setLinkOpen(o=>!o)}
                title="Add social video link"
              >
                {/* Show tiny platform icon if verified, else link icon */}
                {verified && platform ? (
                  <PlatformBadge
                    src={PLATFORMS.find(x=>x.id===platform)?.icon}
                    alt={platform}
                    $active
                  />
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                )}
              </IconBtn>

              <LinkPopover $open={linkOpen}>
                <LinkRow>
                  {/* Inline platform icons */}
                  <div style={{display:'flex', alignItems:'center', gap:6, marginRight:10, marginLeft:4}}>
                    {PLATFORMS.map(pl=>(
                      <div key={pl.id} style={{
                        display:'flex', alignItems:'center', justifyContent:'center',
                        width:22, height:22, borderRadius:'50%',
                        background:platform===pl.id ? getPlatformBg(pl.id) : 'transparent',
                        opacity:platform===pl.id ? 1 : 0.4,
                        transition:'all .2s',
                        boxShadow:platform===pl.id ? `0 0 10px ${getPlatformBg(pl.id)}` : 'none'
                      }}>
                        <img src={pl.icon} alt={pl.label} style={{width:14,height:14}} />
                      </div>
                    ))}
                  </div>

                  <LinkInput
                    ref={inputRef}
                    id="vision-url-input"
                    placeholder="Paste a social video URL..."
                    value={urlInput}
                    onChange={handleUrlChange}
                    onKeyDown={handleUrlKeyDown}
                    $error={!!urlError && !verified}
                    $ok={!!verified}
                  />
                  {verified && (
                    <RemoveBtn onClick={clearVideo} style={{opacity:.6, position:'absolute', right:50}} title="Remove link">×</RemoveBtn>
                  )}
                  {/* Redesigned SVG Help Icon */}
                  <HelpWrap>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <HelpBubble>
                      Vision uses its audio as a reference for your video.<br/>
                      <span style={{color:'#a78bfa', opacity:.8}}>Supported: YouTube, Instagram, TikTok, Facebook.</span>
                    </HelpBubble>
                  </HelpWrap>
                </LinkRow>
              </LinkPopover>
            </div>

            <Spacer/>

            {prompt.length>0 && (
              <CharCount $w={prompt.length>MAX*.85}>
                {prompt.length}/{MAX}
              </CharCount>
            )}

            <SendBtn
              id="vision-send-btn"
              $ready={isReady}
              $loading={isLoading}
              onClick={handleSend}
              disabled={!isReady||isLoading}
              aria-label="Generate video"
            >
              {ripple && <RippleEl style={{left:ripple.x-5,top:ripple.y-5}}/>}
              {isLoading ? (
                <><Spinner/>Planning...</>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Generate
                </>
              )}
            </SendBtn>
          </Toolbar>
        </PromptBox>

        {/* ── API banners ── */}
        {apiError && <Banner $ok={false}>⚠️ {apiError}</Banner>}
        {planUuid && !apiError && <Banner $ok>✅ Vision plan created — ID: {planUuid}</Banner>}

        {/* ── Video Panel (only when verified) ── */}
        {verified && (
          <VideoPanel>
            <VideoHeader>
              <VideoTitle>
                {p && <PlatformBadge src={PLATFORMS.find(x=>x.id===p)?.icon} alt={p??''} $active style={{width:14,height:14}}/>}
                Reference Audio
                {p && <span style={{color:'#8b5cf6',textTransform:'capitalize'}}>{p}</span>}
              </VideoTitle>
              <VideoClose onClick={clearVideo}>×</VideoClose>
            </VideoHeader>

            <VideoFrame>
              {canEmbed ? (
                <StyledIframe
                  key={iframeKey}
                  src={embedUrl!}
                  title="Video preview"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{
                  width:'100%',height:'100%', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', gap:10,
                  background:'linear-gradient(135deg,#1a1a2e,#16213e)',
                }}>
                  <span style={{fontSize:32}}>{p==='tiktok'?'🎵':'📹'}</span>
                  <p style={{color:'#a78bfa',fontSize:12,fontWeight:600,margin:0}}>
                    {p==='tiktok'?'TikTok':'Facebook'} video linked
                  </p>
                  <a href={verified} target="_blank" rel="noopener noreferrer"
                    style={{color:'#c4b5fd',fontSize:11,textDecoration:'underline'}}>
                    Open in new tab →
                  </a>
                </div>
              )}

              {/* Time range overlay on video */}
              <TimeOverlay $left={leftPct} $width={widthPct}/>
              <TimeTag $left={leftPct}>{fmt(startSec)}</TimeTag>
              <TimeRangeBar>
                <TimeRangeFill $left={leftPct} $width={widthPct}/>
              </TimeRangeBar>
            </VideoFrame>

            {/* Sliders: Start & End */}
            <TimelineWrap>
              {/* Start slider */}
              <SliderRow>
                <SliderHead>
                  <SliderLabel>Start</SliderLabel>
                  <SliderVal>{fmt(startSec)}</SliderVal>
                </SliderHead>
                <SliderTrack>
                  <SliderBg/>
                  <SliderFill $left={0} $width={leftPct}/>
                  <SliderInput
                    id="vision-start-slider"
                    type="range" min={0} max={vidDur-5} step={1}
                    value={startSec}
                    onChange={handleStartChange}
                    onMouseUp={handleStartRelease}
                    onTouchEnd={handleStartRelease}
                  />
                </SliderTrack>
              </SliderRow>

              {/* End slider */}
              <SliderRow>
                <SliderHead>
                  <SliderLabel>End</SliderLabel>
                  <SliderVal>{fmt(endSec)}</SliderVal>
                </SliderHead>
                <SliderTrack>
                  <SliderBg/>
                  <SliderFill $left={0} $width={(endSec/vidDur)*100}/>
                  <SliderInput
                    id="vision-end-slider"
                    type="range" min={5} max={vidDur} step={1}
                    value={endSec}
                    onChange={handleEndChange}
                  />
                </SliderTrack>
              </SliderRow>

              {/* Summary line */}
              <SliderInfo>
                Extracting <strong style={{color:'#8b5cf6'}}>{endSec-startSec}s</strong> of audio
                from <strong style={{color:'#8b5cf6'}}>{fmt(startSec)}</strong> to <strong style={{color:'#8b5cf6'}}>{fmt(endSec)}</strong>
              </SliderInfo>
            </TimelineWrap>
          </VideoPanel>
        )}
      </ContentWrapper>

      {/* Hidden inputs */}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={onFile} id="vision-file-input"/>
    </VisionContainer>
  );
};

export default VisionPage;
