import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Panel, UrlRow, PlatformIcon, UrlInput, ClearBtn,
  RangeSection, RangeRow, RangeLabel, RangeInput, TimeTag,
  Footer, AttachedBadge, ConfirmBtn,
  VideoInfoRow, VideoTitle, VideoDurationHint,
} from './styles';
import { SocialVideoContext } from '@hooks/useVisionPlan';

type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: 'youtube',   label: 'YouTube',   icon: '/icons/social/youtube.png' },
  { key: 'tiktok',    label: 'TikTok',    icon: '/icons/social/tiktok.png' },
  { key: 'instagram', label: 'Instagram', icon: '/icons/social/instagram.png' },
  { key: 'facebook',  label: 'Facebook',  icon: '/icons/social/facebook.png' },
];

const PLATFORM_MAX_SEC: Record<Platform, number> = {
  youtube:   600,
  tiktok:    180,
  instagram:  90,
  facebook:  600,
};

function detectPlatform(url: string): Platform | null {
  const u = url.trim().toLowerCase();
  if (!u) return null;
  if (/youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts/.test(u)) return 'youtube';
  if (/instagram\.com\/(p|reels?|tv|stories)/.test(u)) return 'instagram';
  if (/tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com|tiktok\.com\/t\//.test(u)) return 'tiktok';
  if (/facebook\.com\/(watch|video|reel)|fb\.watch/.test(u)) return 'facebook';
  return null;
}

function getYouTubeId(url: string): string | null {
  const patterns = [/[?&]v=([^&]+)/, /youtu\.be\/([^?/]+)/, /shorts\/([^?/]+)/];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// Module-level singleton so the script is only injected once
let ytApiPromise: Promise<void> | null = null;
function loadYTScript(): Promise<void> {
  if ((window as any).YT?.Player) return Promise.resolve();
  if (!ytApiPromise) {
    ytApiPromise = new Promise(resolve => {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        resolve();
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
  }
  return ytApiPromise;
}

function getYouTubeDuration(videoId: string): Promise<number | null> {
  return loadYTScript().then(() => new Promise(resolve => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(container);
    const player = new (window as any).YT.Player(container, {
      width: '1', height: '1', videoId,
      playerVars: { autoplay: 0, controls: 0 },
      events: {
        onReady: (e: any) => {
          const dur: number = e.target.getDuration();
          e.target.destroy();
          if (document.body.contains(container)) document.body.removeChild(container);
          resolve(dur > 0 ? Math.ceil(dur) : null);
        },
        onError: () => {
          if (document.body.contains(container)) document.body.removeChild(container);
          resolve(null);
        },
      },
    });
    // Safety timeout — if YT player stalls
    setTimeout(() => {
      try { player.destroy(); } catch {}
      if (document.body.contains(container)) document.body.removeChild(container);
      resolve(null);
    }, 8000);
  }));
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface AudioPickerPanelProps {
  onClose: () => void;
  value: SocialVideoContext | null;
  onChange: (v: SocialVideoContext | null) => void;
}

const AudioPickerPanel: React.FC<AudioPickerPanelProps> = ({ onClose, value, onChange }) => {
  const [url,             setUrl]             = useState(value?.url ?? '');
  const [start,           setStart]           = useState(value?.offsetSeconds ?? 0);
  const [end,             setEnd]             = useState(value ? value.offsetSeconds + value.durationSeconds : 30);
  const [videoTitle,      setVideoTitle]      = useState<string | null>(null);
  const [fetchingMeta,    setFetchingMeta]    = useState(false);
  const [videoDuration,   setVideoDuration]   = useState<number | null>(null);
  const [fetchingDur,     setFetchingDur]     = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const platform = detectPlatform(url);
  const maxSec   = videoDuration ?? (platform ? PLATFORM_MAX_SEC[platform] : 600);

  // Fetch video title from noembed
  useEffect(() => {
    if (!platform || !url.trim()) { setVideoTitle(null); return; }
    setFetchingMeta(true);
    const controller = new AbortController();
    fetch(`https://noembed.com/embed?url=${encodeURIComponent(url.trim())}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data: { title?: string; error?: string }) => {
        setVideoTitle(data?.title && !data?.error ? data.title : null);
      })
      .catch(() => setVideoTitle(null))
      .finally(() => setFetchingMeta(false));
    return () => controller.abort();
  }, [url, platform]);

  // Fetch actual duration for YouTube via IFrame Player API
  useEffect(() => {
    setVideoDuration(null);
    if (cancelRef.current) { cancelRef.current(); cancelRef.current = null; }
    if (platform !== 'youtube') return;
    const videoId = getYouTubeId(url);
    if (!videoId) return;

    let cancelled = false;
    cancelRef.current = () => { cancelled = true; };
    setFetchingDur(true);

    getYouTubeDuration(videoId).then(dur => {
      if (cancelled) return;
      setFetchingDur(false);
      if (dur) {
        setVideoDuration(dur);
        // Clamp sliders to actual duration
        setEnd(prev => Math.min(prev, dur));
        setStart(prev => Math.min(prev, dur - 1));
      }
    });

    return () => { cancelled = true; };
  }, [url, platform]);

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setStart(0);
    setEnd(30);
    setVideoDuration(null);
    setVideoTitle(null);
  };

  const onStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setStart(v);
    if (v >= end) setEnd(Math.min(v + 1, maxSec));
  }, [end, maxSec]);

  const onEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setEnd(v);
    if (v <= start) setStart(Math.max(v - 1, 0));
  }, [start]);

  const confirm = () => {
    if (!platform) return;
    onChange({ platform, url: url.trim(), offsetSeconds: start, durationSeconds: Math.max(end - start, 1) });
  };

  const clear = () => {
    onChange(null);
    setUrl('');
    setStart(0);
    setEnd(30);
    setVideoTitle(null);
    setVideoDuration(null);
  };

  const durationLabel = fetchingDur
    ? 'fetching length…'
    : videoDuration
      ? `${fmt(videoDuration)}`
      : platform
        ? `up to ${fmt(PLATFORM_MAX_SEC[platform])}`
        : null;

  return (
    <Panel>
      <UrlRow>
        <UrlInput
          value={url}
          onChange={onUrlChange}
          placeholder="Paste link…"
          autoFocus
          spellCheck={false}
        />
        <ClearBtn onClick={onClose} aria-label="Close" style={{opacity:.4}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </ClearBtn>
      </UrlRow>

      {platform && (
        <VideoInfoRow>
          <PlatformIcon
            src={PLATFORMS.find(p => p.key === platform)?.icon ?? ''}
            alt={platform}
            $active={true}
            style={{width:14,height:14,flexShrink:0}}
          />
          <VideoTitle>
            {fetchingMeta ? 'Fetching video info…' : (videoTitle ?? url.trim())}
          </VideoTitle>
          {durationLabel && <VideoDurationHint>{durationLabel}</VideoDurationHint>}
        </VideoInfoRow>
      )}

      {platform && (
        <RangeSection>
          <RangeRow>
            <RangeLabel>From</RangeLabel>
            <RangeInput type="range" min={0} max={maxSec} step={1} value={start} onChange={onStartChange} />
            <TimeTag>{fmt(start)}</TimeTag>
          </RangeRow>
          <RangeRow>
            <RangeLabel>To</RangeLabel>
            <RangeInput type="range" min={0} max={maxSec} step={1} value={end} onChange={onEndChange} />
            <TimeTag>{fmt(end)}</TimeTag>
          </RangeRow>
        </RangeSection>
      )}

      <Footer>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          {PLATFORMS.map(p => (
            <PlatformIcon key={p.key} src={p.icon} alt={p.label} title={p.label} $active={platform === p.key} />
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {value && (
            <AttachedBadge>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Clip attached
              <button onClick={clear} style={{background:'none',border:'none',cursor:'pointer',padding:0,marginLeft:3,color:'inherit',opacity:.55,fontSize:13,lineHeight:1}} aria-label="Remove">×</button>
            </AttachedBadge>
          )}
          <ConfirmBtn $ready={!!platform} disabled={!platform} onClick={confirm}>
            {value ? 'Update' : 'Use clip'}
          </ConfirmBtn>
        </div>
      </Footer>
    </Panel>
  );
};

export default AudioPickerPanel;
