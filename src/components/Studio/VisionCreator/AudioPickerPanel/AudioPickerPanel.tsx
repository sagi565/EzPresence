import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Panel, UrlRow, UrlInput, ClearBtn,
  InfoRow, PlatformRow, PlatformIconImg, VideoName,
  LoadingChip, InlineSpinner,
  PlayerWrap, WaveStage, WaveInner, WaveCanvas, TrimFill,
  ScrollbarTrack, ScrollbarThumb,
  PlayheadLine, PlayheadHandle, HoverLine, HoverTime, RangeHandle,
  ControlsRow, PlayBtn, TimeText, TrimGroup, ResetTrimBtn,
  ErrorBanner, TOKENS,
} from './styles';
import { SocialVideoContext } from '@hooks/useVisionPlan';
import { useAudioUrl } from '@hooks/useAudioUrl';
import { getAuthToken } from '@utils/apiClient';

type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';
type Status = 'idle' | 'fetching' | 'decoding' | 'ready' | 'error';

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: 'youtube',   label: 'YouTube',   icon: '/icons/social/youtube.png' },
  { key: 'tiktok',    label: 'TikTok',    icon: '/icons/social/tiktok.png' },
  { key: 'instagram', label: 'Instagram', icon: '/icons/social/instagram.png' },
  { key: 'facebook',  label: 'Facebook',  icon: '/icons/social/facebook.png' },
];

function detectPlatform(url: string): Platform | null {
  const u = url.trim().toLowerCase();
  if (!u) return null;
  if (/youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts/.test(u)) return 'youtube';
  if (/instagram\.com\/(p|reels?|tv|stories)/.test(u)) return 'instagram';
  if (/tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com|tiktok\.com\/t\//.test(u)) return 'tiktok';
  if (/facebook\.com\/(watch|video|reel)|fb\.watch/.test(u)) return 'facebook';
  return null;
}

function fmtSec(s: number) {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`;
}

const BAR_COUNT       = 120;
const MIN_TRIM_SEC    = 1;
const MAX_VISIBLE_SEC = 300;
const MAX_FETCH_BYTES = 120 * 1024 * 1024;

/* Static "fake waveform" silhouette used during loading — smoothed noise with
   sharp peaks so it reads as a real audio waveform rather than a generic bar. */
const PLACEHOLDER_BARS = (() => {
  const raw = Array.from({ length: BAR_COUNT }, () => Math.random());
  let smoothed = [...raw];
  const next = new Array(BAR_COUNT);
  for (let i = 0; i < BAR_COUNT; i++) {
    const prev = smoothed[Math.max(0, i - 1)];
    const curr = smoothed[i];
    const nxt  = smoothed[Math.min(BAR_COUNT - 1, i + 1)];
    next[i] = (prev + curr * 2 + nxt) / 4;
  }
  smoothed = next;
  const max = Math.max(...smoothed);
  return smoothed.map(v => 0.10 + 0.85 * Math.pow(v / max, 1.35));
})();

async function fetchAudioBytes(audioUrl: string): Promise<ArrayBuffer> {
  const token = await getAuthToken();
  const authHeaders: HeadersInit = token
    ? { 'X-Firebase-Token': token, 'Authorization': `Bearer ${token}` }
    : {};

  const readAll = async (r: Response): Promise<ArrayBuffer> => {
    if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}`);
    const chunks: Uint8Array[] = [];
    let total = 0;
    const reader = r.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.byteLength;
      if (total >= MAX_FETCH_BYTES) { reader.cancel().catch(() => {}); break; }
    }
    const merged = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { merged.set(c, off); off += c.byteLength; }
    return merged.buffer;
  };

  try {
    const r = await fetch(audioUrl, { headers: authHeaders, mode: 'cors' });
    return await readAll(r);
  } catch {
    const r = await fetch(`/__audio-proxy?url=${encodeURIComponent(audioUrl)}`);
    return await readAll(r);
  }
}

/* Peak-amplitude per bucket — what every consumer audio app shows.
   Loud transients give tall bars, quiet sections give short bars. We mix in
   a small RMS term so sustained loud regions don't look identical to a single
   spike, then normalize to the 99th-percentile peak (ignoring outlier clips)
   so a single louder-than-everything sample doesn't squash the whole song. */
function computePeaks(buf: AudioBuffer, bars: number): number[] {
  const channel = buf.getChannelData(0);
  const block = Math.max(1, Math.floor(channel.length / bars));
  const raw: number[] = new Array(bars);

  for (let i = 0; i < bars; i++) {
    const start = i * block;
    const end = Math.min(start + block, channel.length);
    let peak = 0;
    let sumSq = 0;
    for (let j = start; j < end; j++) {
      const v = channel[j];
      const av = v < 0 ? -v : v;
      if (av > peak) peak = av;
      sumSq += v * v;
    }
    const rms = Math.sqrt(sumSq / Math.max(1, end - start));
    raw[i] = peak * 0.85 + rms * 0.15;
  }

  // Robust normalization — 99th percentile so a single outlier sample
  // (e.g. a digital clip) doesn't crush the rest of the waveform.
  const sorted = [...raw].sort((a, b) => a - b);
  const p99 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99))] || 1;
  const norm = p99 < 1e-4 ? 1 : p99;

  return raw.map(p => Math.max(0.02, Math.min(1, p / norm)));
}

interface Props {
  onClose: () => void;
  value: SocialVideoContext | null;
  onChange: (v: SocialVideoContext | null) => void;
  minDurationSec: number;
  maxDurationSec: number;
  onTrimLimitHit?: () => void;
  onAudioLoaded?: (audioDurSec: number) => void;
}

const AudioPickerPanel: React.FC<Props> = ({
  onClose, value, onChange,
  minDurationSec, maxDurationSec,
  onTrimLimitHit, onAudioLoaded,
}) => {
  const [url, setUrl] = useState(value?.url ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { fetchAudioUrl, data: audioInfo, isLoading: apiLoading, error: apiError, reset: resetAudio } = useAudioUrl();

  const [status, setStatus]       = useState<Status>('idle');
  const [localError, setLocalError] = useState<string | null>(null);
  const [audioDur, setAudioDur]   = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selStart, setSelStart] = useState(value?.offsetSeconds ?? 0);
  const [selEnd,   setSelEnd]   = useState(value ? value.offsetSeconds + value.durationSeconds : 0);
  const [dragging, setDragging] = useState<null | 'start' | 'end' | 'both' | 'playhead'>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; t: number } | null>(null);

  // refs mirroring state used inside window listeners / RAF
  const audioDurRef  = useRef(0);
  const isPlayingRef = useRef(false);
  const selStartRef  = useRef(selStart);
  const selEndRef    = useRef(selEnd);
  useEffect(() => { audioDurRef.current  = audioDur;  }, [audioDur]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { selStartRef.current  = selStart;  }, [selStart]);
  useEffect(() => { selEndRef.current    = selEnd;    }, [selEnd]);

  // Audio + Web Audio
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef     = useRef<string | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const analyserBufRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef  = useRef<MediaElementAudioSourceNode | null>(null);
  const liveLevelsRef  = useRef<Float32Array>(new Float32Array(BAR_COUNT));
  const globalEnergyRef = useRef(0);

  // Canvas / waveform
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const stageRef     = useRef<HTMLDivElement | null>(null);
  const playheadRef  = useRef<HTMLDivElement | null>(null);
  const peaksRef     = useRef<number[]>([]);

  // Smooth playhead time interpolation
  const syncedTimeRef = useRef({ value: 0, at: 0 });
  const syncTime = (t: number) => { syncedTimeRef.current = { value: t, at: performance.now() }; };
  const readCurrentTime = useCallback(() => {
    if (!isPlayingRef.current) return syncedTimeRef.current.value;
    const dt = (performance.now() - syncedTimeRef.current.at) / 1000;
    return Math.min(audioDurRef.current || 0, Math.max(0, syncedTimeRef.current.value + dt));
  }, []);

  const platform = detectPlatform(url);
  const ready = status === 'ready';

  /* ── Teardown ── */
  const teardownAudio = useCallback(() => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.disconnect(); } catch {}
      sourceNodeRef.current = null;
    }
    if (analyserRef.current) {
      try { analyserRef.current.disconnect(); } catch {}
      analyserRef.current = null;
    }
    analyserBufRef.current = null;
    liveLevelsRef.current = new Float32Array(BAR_COUNT);
    globalEnergyRef.current = 0;
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => () => {
    teardownAudio();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [teardownAudio]);

  // Cancellation token so a newer load supersedes an older one
  const loadTokenRef = useRef(0);

  /* ── Fetch + decode pipeline ── */
  const loadAudio = useCallback(async (mediaLink: string, preserve?: { start: number; end: number }) => {
    if (!mediaLink.trim()) return;
    teardownAudio();
    peaksRef.current = [];
    setStatus('fetching');
    setLocalError(null);
    setAudioDur(0);
    setCurrentTime(0);
    setIsPlaying(false);
    syncTime(0);

    const myToken = ++loadTokenRef.current;

    const apiRes = await fetchAudioUrl(mediaLink);
    if (myToken !== loadTokenRef.current) return;
    if (!apiRes) { setStatus('error'); return; }

    setStatus('decoding');

    let bytes: ArrayBuffer;
    try {
      bytes = await fetchAudioBytes(apiRes.audioLink);
    } catch (e) {
      if (myToken !== loadTokenRef.current) return;
      setLocalError("We couldn't load the audio for this link.");
      setStatus('error');
      return;
    }
    if (myToken !== loadTokenRef.current) return;

    // Decode
    const Ctx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!Ctx) { setLocalError('Audio decoding not supported in this browser.'); setStatus('error'); return; }
    const offline = new Ctx(1, 44100, 44100);
    let decoded: AudioBuffer;
    try {
      decoded = await offline.decodeAudioData(bytes.slice(0));
    } catch {
      if (myToken !== loadTokenRef.current) return;
      setLocalError("We couldn't decode this audio.");
      setStatus('error');
      return;
    }
    if (myToken !== loadTokenRef.current) return;

    const dur = decoded.duration > 0 && isFinite(decoded.duration)
      ? decoded.duration
      : apiRes.durationMs / 1000;

    const totalBars = Math.round(BAR_COUNT * Math.max(1, dur / MAX_VISIBLE_SEC));
    peaksRef.current = computePeaks(decoded, totalBars);

    // Build playable audio element from a same-origin blob (analyser-friendly)
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    const blobUrl = URL.createObjectURL(blob);
    blobUrlRef.current = blobUrl;

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.src = blobUrl;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      const t = audio.currentTime;
      syncTime(t);
      setCurrentTime(t);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      audio.currentTime = selStartRef.current;
      syncTime(selStartRef.current);
      setCurrentTime(selStartRef.current);
    });

    setAudioDur(dur);
    onAudioLoaded?.(dur);

    if (preserve && preserve.end > preserve.start) {
      setSelStart(preserve.start);
      setSelEnd(preserve.end);
    } else {
      const minD = Math.min(minDurationSec, Math.max(MIN_TRIM_SEC, dur));
      const maxD = Math.min(maxDurationSec, dur);
      const len = Math.max(minD, Math.min(maxD, dur));
      setSelStart(0);
      setSelEnd(len);
    }

    // Wire analyser
    try {
      const ACtx = window.AudioContext || (window as any).webkitAudioContext;
      if (ACtx) {
        if (!audioCtxRef.current) audioCtxRef.current = new ACtx();
        const ctx = audioCtxRef.current!;
        const src = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.78;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        sourceNodeRef.current = src;
        analyserRef.current = analyser;
        analyserBufRef.current = new Uint8Array(analyser.frequencyBinCount);
      }
    } catch {}

    setStatus('ready');

    // Autoplay
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setIsPlaying(true);
    }
  }, [fetchAudioUrl, teardownAudio, onAudioLoaded, minDurationSec, maxDurationSec]);

  /* ── Auto-load on mount when reopening with existing value ── */
  useEffect(() => {
    if (value?.url) {
      loadAudio(value.url, { start: value.offsetSeconds, end: value.offsetSeconds + value.durationSeconds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-sync trim back to parent (idle, not dragging) ── */
  useEffect(() => {
    if (!ready || dragging || audioDur === 0) return;
    const dur = Math.max(MIN_TRIM_SEC, Math.floor(selEnd - selStart));
    onChange({
      platform: platform ?? 'youtube',
      url: url.trim(),
      offsetSeconds: Math.max(0, Math.floor(selStart)),
      durationSeconds: dur,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, dragging, selStart, selEnd, audioDur]);

  /* ── Re-clamp trim when duration tier changes ── */
  useEffect(() => {
    if (audioDur === 0) return;
    const minD = Math.max(MIN_TRIM_SEC, Math.min(minDurationSec, audioDur));
    const maxD = Math.min(maxDurationSec, audioDur);
    const len = selEnd - selStart;
    if (len >= minD && len <= maxD) return;
    let s = selStart;
    let e = selEnd;
    if (len < minD) {
      e = Math.min(audioDur, s + minD);
      if (e - s < minD) s = Math.max(0, e - minD);
    } else if (len > maxD) {
      e = s + maxD;
    }
    setSelStart(s);
    setSelEnd(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDurationSec, maxDurationSec, audioDur]);

  /* ── Draw loop ── */
  const drawRef = useRef<() => void>(() => {});
  drawRef.current = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    if (cssW < 2 || cssH < 2) return;
    const wantW = Math.floor(cssW * dpr);
    const wantH = Math.floor(cssH * dpr);
    if (canvas.width !== wantW)  canvas.width  = wantW;
    if (canvas.height !== wantH) canvas.height = wantH;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = cssW, H = cssH;
    ctx.clearRect(0, 0, W, H);

    const peaks = peaksRef.current;
    const haveReal = ready && peaks.length > 0;
    const nBars = haveReal ? peaks.length : BAR_COUNT;

    let barW = (W - (nBars - 1)) / nBars;
    barW = Math.max(1.4, Math.min(2.4, barW));
    const gap = (W - nBars * barW) / Math.max(1, nBars - 1);
    const ox = (W - (nBars * barW + (nBars - 1) * gap)) / 2;

    const cy = H / 2;
    const MID_GAP = 1;
    const TOP_RATIO = 1.0;
    const BOT_RATIO = 0.62;
    const topMax = cy - MID_GAP / 2 - 1;
    const botMax = H - cy - MID_GAP / 2 - 1;

    /* No edge fade on real waveforms — bar height should reflect actual
       audio amplitude, not its position in the canvas. The loading silhouette
       still uses a fade (applied below) for a softer pulsing look. */
    const envReal = () => 1;
    const envLoad = (t: number) => {
      const FADE = 0.08;
      const sm = (x: number) => x * x * (3 - 2 * x);
      if (t < FADE) return sm(t / FADE);
      if (t > 1 - FADE) return sm((1 - t) / FADE);
      return 1;
    };

    const paintHalf = (x: number, h: number, half: 'top' | 'bot', color: string) => {
      if (h < 0.5) return;
      const r = Math.min(barW / 2, h / 2);
      const y = half === 'top' ? cy - MID_GAP / 2 - h : cy + MID_GAP / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      if ((ctx as any).roundRect) {
        (ctx as any).roundRect(x, y, barW, h, r);
      } else {
        const w = barW;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
      ctx.fill();
    };

    if (!haveReal) {
      /* Loading: real-looking waveform silhouette (PLACEHOLDER_BARS) with a
         scanner-style traveling crest, gentle global "inhale", and a subtle
         per-bar ripple — same look as the previous version. */
      const now = performance.now() / 1000;
      const crestT = (now * 0.56) % 1.0;
      const hue = 270 + 10 * Math.sin(now * 1.4);
      const inhale = 0.91 + 0.09 * Math.sin(now * 1.1);
      const ripplePhase = now * 2.8;
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = Math.round(ox + i * (barW + gap));
        const t = i / (BAR_COUNT - 1);
        const ripple = 1.0 + 0.18 * Math.sin(ripplePhase + i * 0.55);
        const peak = (PLACEHOLDER_BARS[i] ?? 0.4) * envLoad(t) * inhale * ripple;
        const dist = t - crestT;
        const crest = Math.exp(-dist * dist / (2 * 0.012));
        const baseAlpha = 0.55 + 0.10 * crest;
        const baseLight = 58 + 6 * crest;
        const baseSat   = 72 + 8 * crest;
        const col = `hsla(${hue.toFixed(1)}, ${baseSat}%, ${baseLight}%, ${baseAlpha})`;
        paintHalf(x, peak * topMax * TOP_RATIO, 'top', col);
        paintHalf(x, peak * botMax * BOT_RATIO, 'bot', col);
        if (crest > 0.05) {
          const crCol = `hsla(${(hue + 8).toFixed(1)}, 90%, 78%, ${(crest * 0.72).toFixed(3)})`;
          paintHalf(x, peak * topMax * TOP_RATIO, 'top', crCol);
          paintHalf(x, peak * botMax * BOT_RATIO, 'bot', crCol);
        }
      }
      return;
    }

    // Real waveform
    const dur = audioDurRef.current;
    const haveSel = dur > 0 && selEnd > selStart;
    const selStartPx = haveSel ? (selStart / dur) * W : 0;
    const selEndPx   = haveSel ? (selEnd   / dur) * W : W;
    const liveTime = readCurrentTime();
    const progress = dur > 0 ? Math.min(liveTime / dur, 1) : 0;

    if (playheadRef.current && dur > 0) {
      playheadRef.current.style.left = `calc(6px + (100% - 12px) * ${progress})`;
    }

    // Sample analyser → live levels
    const analyser = analyserRef.current;
    const buf = analyserBufRef.current;
    const live = liveLevelsRef.current;
    if (analyser && buf && isPlayingRef.current) {
      analyser.getByteFrequencyData(buf as any);
      const bins = buf.length;
      let sum = 0;
      for (let i = 0; i < BAR_COUNT; i++) {
        const t = i / (BAR_COUNT - 1);
        const bin = Math.min(bins - 1, Math.floor(Math.pow(t, 1.6) * bins));
        const v = buf[bin] / 255;
        live[i] = live[i] * 0.65 + v * 0.35;
        sum += v;
      }
      globalEnergyRef.current = globalEnergyRef.current * 0.7 + (sum / BAR_COUNT) * 0.3;
    } else {
      for (let i = 0; i < BAR_COUNT; i++) live[i] *= 0.92;
      globalEnergyRef.current *= 0.92;
    }
    const globalPulse = analyser ? (1 + 0.45 * globalEnergyRef.current) : 1;

    const playedBars = progress * nBars;
    for (let i = 0; i < nBars; i++) {
      const x = Math.round(ox + i * (barW + gap));
      const liveIdx = Math.min(BAR_COUNT - 1, Math.floor(i / nBars * BAR_COUNT));
      const liveBoost = analyser ? (0.85 + 0.30 * live[liveIdx]) : 1;
      const peak = (peaks[i] ?? 0.4) * envReal() * liveBoost * globalPulse;

      const barCenterPx = x + barW / 2;
      const inSel = !haveSel || (barCenterPx >= selStartPx && barCenterPx <= selEndPx);
      const played = (i + 0.5) <= playedBars;

      const color = played ? TOKENS.ACCENT : (inSel ? TOKENS.BAR_IN : TOKENS.BAR_OUT);
      paintHalf(x, peak * topMax * TOP_RATIO, 'top', color);
      paintHalf(x, peak * botMax * BOT_RATIO, 'bot', color);
    }
  };

  const needsAnimation = !ready || isPlaying || !!dragging;
  useEffect(() => {
    drawRef.current();
    if (!needsAnimation) return;
    let id = requestAnimationFrame(function loop() {
      drawRef.current();
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, [needsAnimation, audioDur, currentTime, hoverInfo, selStart, selEnd, status]);

  /* ── Play / pause ── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    if (isPlayingRef.current) {
      audio.pause();
      setIsPlaying(false);
      syncTime(audio.currentTime);
      return;
    }
    const dur = audioDurRef.current;
    if (dur > 0 && audio.currentTime >= dur - 0.08) {
      audio.currentTime = selStartRef.current;
      setCurrentTime(selStartRef.current);
    }
    syncTime(audio.currentTime);
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => { syncTime(audio.currentTime); setIsPlaying(true); }).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, []);

  /* ── Seek & hover ── */
  const seekTo = useCallback((t: number) => {
    const audio = audioRef.current;
    const dur = audioDurRef.current;
    if (!audio || !ready || dur === 0) return;
    const clamped = Math.max(0, Math.min(dur, t));
    audio.currentTime = clamped;
    syncTime(clamped);
    setCurrentTime(clamped);
  }, [ready]);

  const mouseDownInSelRef = useRef(false);
  const dragOffsetRef = useRef(0);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ready || audioDur === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width * audioDur;
    const trimLen = selEnd - selStart;
    const dead = Math.max(0.4, trimLen * 0.08);
    const inMiddle = trimLen > dead * 2 && t > selStart + dead && t < selEnd - dead;
    mouseDownInSelRef.current = inMiddle;
    if (!inMiddle) return;

    e.preventDefault();
    const startX = e.clientX;
    const dragOffset = t - selStart;
    let promoted = false;

    const cleanup = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    const onMove = (me: MouseEvent) => {
      if (!promoted && Math.abs(me.clientX - startX) > 5) {
        promoted = true;
        dragOffsetRef.current = dragOffset;
        setDragging('both');
        cleanup();
      }
    };
    const onUp = () => {
      cleanup();
      if (!promoted) seekTo(t);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [ready, audioDur, selStart, selEnd, seekTo]);

  const onCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseDownInSelRef.current) { mouseDownInSelRef.current = false; return; }
    if (!ready || audioDur === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width * audioDur;
    seekTo(t);
  }, [ready, audioDur, seekTo]);

  const onCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ready || audioDur === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = Math.max(0, Math.min(1, x / rect.width)) * audioDur;
    setHoverInfo({ x, t });
  }, [ready, audioDur]);

  const onCanvasLeave = useCallback(() => setHoverInfo(null), []);

  /* ── Drag handlers (start / end / both / playhead) ── */
  const wasPlayingBeforeDragRef = useRef(false);
  useEffect(() => {
    if (!dragging) return;

    if (dragging === 'playhead') {
      const audio = audioRef.current;
      if (audio) {
        wasPlayingBeforeDragRef.current = !audio.paused;
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      const audio = audioRef.current;
      if (audio) audio.muted = true;
    }

    let lastHit = 0;
    const pingLimit = () => {
      const now = performance.now();
      if (now - lastHit < 700) return;
      lastHit = now;
      onTrimLimitHit?.();
    };

    /* Apply the current drag at the given mouse screen X. Reads canvas
       getBoundingClientRect() each call, so when the stage scrolls, the same
       mouse X yields a different time value — that's exactly the behavior
       that makes the dragged element appear stationary on screen while the
       waves slide past underneath. */
    const applyDragAt = (clientX: number) => {
      const canvas = canvasRef.current;
      const dur = audioDurRef.current;
      if (!canvas || dur === 0) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const x = Math.max(6, Math.min(rect.width - 6, rawX));
      const t = ((x - 6) / (rect.width - 12)) * dur;

      const minD = Math.max(MIN_TRIM_SEC, Math.min(minDurationSec, dur));
      const maxD = Math.min(maxDurationSec, dur);

      if (dragging === 'playhead') {
        const timeT = Math.max(0, Math.min(dur, t));
        const audio = audioRef.current;
        if (audio) { audio.currentTime = timeT; syncTime(timeT); setCurrentTime(timeT); }
        return;
      }
      if (dragging === 'both') {
        const trimLen = selEndRef.current - selStartRef.current;
        const newStart = Math.max(0, Math.min(dur - trimLen, t - dragOffsetRef.current));
        setSelStart(newStart);
        setSelEnd(newStart + trimLen);
        const audio = audioRef.current;
        if (audio) { audio.currentTime = newStart; syncTime(newStart); setCurrentTime(newStart); }
        return;
      }
      if (dragging === 'start') {
        const curEnd = selEndRef.current;
        const lo = Math.max(0, curEnd - maxD);
        const hi = Math.max(0, curEnd - minD);
        let next = t;
        let hit = false;
        if (next < lo) { next = lo; hit = true; }
        if (next > hi) { next = hi; hit = true; }
        if (hit) pingLimit();
        setSelStart(next);
        const audio = audioRef.current;
        if (audio) { audio.currentTime = next; syncTime(next); setCurrentTime(next); }
        return;
      }
      // 'end'
      const curStart = selStartRef.current;
      const lo = Math.min(dur, curStart + minD);
      const hi = Math.min(dur, curStart + maxD);
      let next = t;
      let hit = false;
      if (next < lo) { next = lo; hit = true; }
      if (next > hi) { next = hi; hit = true; }
      if (hit) pingLimit();
      setSelEnd(next);
      const audio = audioRef.current;
      if (audio && !isPlayingRef.current) {
        const preview = Math.max(curStart, next - 0.5);
        audio.currentTime = preview;
        syncTime(preview);
        setCurrentTime(preview);
      }
    };

    /* Constant-speed edge auto-scroll. While the mouse is held within
       EDGE_PX of either WaveStage edge, the stage scrolls at SCROLL_SPEED
       px/sec (no easing — same speed at the edge as inside). The drag is
       re-applied each frame from the current mouse position, so the dragged
       element keeps the same screen position while waves move past it. */
    const SCROLL_SPEED = 360;
    const EDGE_PX = 60;
    let lastMouseClientX = 0;
    let edgeDir: -1 | 0 | 1 = 0;
    let lastTickAt = performance.now();

    const updateEdgeDir = () => {
      const stage = stageRef.current;
      if (!stage) { edgeDir = 0; return; }
      const sw = stage.scrollWidth, cw = stage.clientWidth;
      if (sw <= cw) { edgeDir = 0; return; }
      const r = stage.getBoundingClientRect();
      if (lastMouseClientX < r.left + EDGE_PX && stage.scrollLeft > 0) edgeDir = -1;
      else if (lastMouseClientX > r.right - EDGE_PX && stage.scrollLeft < sw - cw) edgeDir = 1;
      else edgeDir = 0;
    };

    let scrollRaf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastTickAt) / 1000);
      lastTickAt = now;
      const stage = stageRef.current;
      if (stage && edgeDir !== 0) {
        const sw = stage.scrollWidth, cw = stage.clientWidth;
        if (sw > cw) {
          stage.scrollLeft = Math.max(0, Math.min(sw - cw, stage.scrollLeft + edgeDir * SCROLL_SPEED * dt));
          updateEdgeDir(); // stop at the limit
          applyDragAt(lastMouseClientX);
        }
      }
      scrollRaf = requestAnimationFrame(tick);
    };
    scrollRaf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      lastMouseClientX = e.clientX;
      updateEdgeDir();
      applyDragAt(e.clientX);
    };
    const onUp = () => {
      const audio = audioRef.current;
      if (audio) audio.muted = false;
      if (dragging === 'playhead' && wasPlayingBeforeDragRef.current) togglePlay();
      setDragging(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, [dragging, minDurationSec, maxDurationSec, onTrimLimitHit, togglePlay]);

  /* ── URL change ── */
  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUrl(v);
    resetAudio();
    setStatus('idle');
    setLocalError(null);
    setAudioDur(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelStart(0);
    setSelEnd(0);
    peaksRef.current = [];
    teardownAudio();
    if (value) onChange(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim()) debounceRef.current = setTimeout(() => loadAudio(v), 600);
  };

  const removeSound = () => {
    onChange(null);
    setUrl('');
    resetAudio();
    setStatus('idle');
    setLocalError(null);
    setAudioDur(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelStart(0);
    setSelEnd(0);
    peaksRef.current = [];
    if (debounceRef.current) clearTimeout(debounceRef.current);
    teardownAudio();
  };

  const resetTrim = () => {
    const minD = Math.max(MIN_TRIM_SEC, Math.min(minDurationSec, audioDur));
    const maxD = Math.min(maxDurationSec, audioDur);
    const len = Math.max(minD, Math.min(maxD, audioDur));
    setSelStart(0);
    setSelEnd(len);
  };

  const pctOf = (t: number) => audioDur > 0 ? Math.min(100, Math.max(0, (t / audioDur) * 100)) : 0;
  const startPct = pctOf(selStart);
  const endPct = pctOf(selEnd);
  const progressPct = pctOf(currentTime);

  const scrollRatio = audioDur > MAX_VISIBLE_SEC ? audioDur / MAX_VISIBLE_SEC : 1;

  /* ── Custom always-visible scrollbar — driven by stage scrollLeft ── */
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollFrac, setScrollFrac] = useState({ thumb: 1, pos: 0 });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const sw = stage.scrollWidth;
      const cw = stage.clientWidth;
      const thumb = sw > 0 ? Math.min(1, cw / sw) : 1;
      const pos   = sw > cw ? stage.scrollLeft / (sw - cw) : 0;
      setScrollFrac({ thumb, pos });
    };
    update();
    stage.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    return () => { stage.removeEventListener('scroll', update); ro.disconnect(); };
  }, [scrollRatio, ready]);

  const scrollDisabled = scrollFrac.thumb >= 0.999;
  const onScrollbarThumbDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollDisabled) return;
    e.preventDefault();
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const trackRect = track.getBoundingClientRect();
    const thumbW = trackRect.width * scrollFrac.thumb;
    const grabOff = e.clientX - (trackRect.left + scrollFrac.pos * (trackRect.width - thumbW));
    const onMove = (me: MouseEvent) => {
      const sw = stage.scrollWidth, cw = stage.clientWidth;
      if (sw <= cw) return;
      const trackUsable = trackRect.width - thumbW;
      const newPos = Math.max(0, Math.min(1, (me.clientX - trackRect.left - grabOff) / trackUsable));
      stage.scrollLeft = newPos * (sw - cw);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  const onScrollbarTrackDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollDisabled) return;
    if (e.target !== e.currentTarget) return;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const trackRect = track.getBoundingClientRect();
    const thumbW = trackRect.width * scrollFrac.thumb;
    const sw = stage.scrollWidth, cw = stage.clientWidth;
    const newPos = Math.max(0, Math.min(1, (e.clientX - trackRect.left - thumbW / 2) / (trackRect.width - thumbW)));
    stage.scrollLeft = newPos * (sw - cw);
  };

  let friendlyApiError = apiError;
  if (friendlyApiError === 'An unexpected error occurred') {
    friendlyApiError = "We couldn't load the audio for this link. Please check the URL and try again.";
  }
  const displayError = friendlyApiError || localError;
  const loading = apiLoading || status === 'fetching' || status === 'decoding';
  const showPlayer = (loading || ready) && !displayError;
  const trimChanged = audioDur > 0 && (selStart > 0.5 || selEnd < audioDur - 0.5);
  const hasSound = !!audioInfo && ready;

  const canvasCursor = (() => {
    if (!ready) return 'default';
    if (dragging === 'both') return 'grabbing';
    if (hoverInfo && audioDur > 0) {
      const trimLen = selEnd - selStart;
      const dead = Math.max(0.4, trimLen * 0.08);
      if (trimLen > dead * 2 && hoverInfo.t > selStart + dead && hoverInfo.t < selEnd - dead) return 'grab';
    }
    return 'pointer';
  })();

  return (
    <Panel>
      <UrlRow>
        <UrlInput
          value={url}
          onChange={onUrlChange}
          placeholder="Paste social media link…"
          autoFocus
          spellCheck={false}
        />
        <ClearBtn
          onClick={hasSound ? removeSound : onClose}
          aria-label={hasSound ? 'Remove sound' : 'Close panel'}
          title={hasSound ? 'Remove sound' : 'Close'}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </ClearBtn>
      </UrlRow>

      <InfoRow>
        <PlatformRow>
          {PLATFORMS.map(p => (
            <PlatformIconImg
              key={p.key}
              src={p.icon}
              alt={p.label}
              title={p.label}
              $active={platform === p.key}
              $visible={!platform || platform === p.key}
              $small
              draggable={false}
            />
          ))}
        </PlatformRow>
        {audioInfo ? (
          <VideoName key={audioInfo.videoName} title={audioInfo.videoName}>{audioInfo.videoName}</VideoName>
        ) : loading ? (
          <LoadingChip><InlineSpinner /></LoadingChip>
        ) : (
          <span style={{ flex: 1 }} />
        )}
      </InfoRow>

      {displayError && (
        <ErrorBanner>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {displayError}
        </ErrorBanner>
      )}

      {showPlayer && (
        <PlayerWrap>
          <WaveStage ref={stageRef}>
            <WaveInner style={{ width: scrollRatio > 1 ? `${scrollRatio * 100}%` : '100%' }}>
              <WaveCanvas
                ref={canvasRef}
                onMouseDown={onCanvasMouseDown}
                onClick={onCanvasClick}
                onMouseMove={onCanvasMove}
                onMouseLeave={onCanvasLeave}
                style={{ cursor: canvasCursor }}
              />

              {ready && audioDur > 0 && (
                <TrimFill
                  style={{
                    left:  `calc(6px + (100% - 12px) * ${startPct / 100})`,
                    width: `calc((100% - 12px) * ${(endPct - startPct) / 100})`,
                  }}
                />
              )}

              {ready && audioDur > 0 && (
                <PlayheadLine
                  ref={playheadRef}
                  style={{ left: `calc(6px + (100% - 12px) * ${progressPct / 100})` }}
                >
                  <PlayheadHandle onMouseDown={(e) => { e.preventDefault(); setDragging('playhead'); }} />
                </PlayheadLine>
              )}

              {ready && hoverInfo && !dragging && (
                <>
                  <HoverLine style={{ left: `${hoverInfo.x + 6}px` }} />
                  <HoverTime style={{ left: `${hoverInfo.x + 6}px` }}>{fmtSec(hoverInfo.t)}</HoverTime>
                </>
              )}

              {ready && audioDur > 0 && (
                <>
                  <RangeHandle
                    $side="start"
                    $active={dragging === 'start'}
                    style={{ left: `calc(6px + (100% - 12px) * ${startPct / 100})` }}
                    onMouseDown={(e) => { e.preventDefault(); setDragging('start'); }}
                    title="Drag to set start"
                    aria-label="Set start"
                  />
                  <RangeHandle
                    $side="end"
                    $active={dragging === 'end'}
                    style={{ left: `calc(6px + (100% - 12px) * ${endPct / 100})` }}
                    onMouseDown={(e) => { e.preventDefault(); setDragging('end'); }}
                    title="Drag to set end"
                    aria-label="Set end"
                  />
                </>
              )}
            </WaveInner>
          </WaveStage>

          {ready && (
            <ScrollbarTrack ref={trackRef} onMouseDown={onScrollbarTrackDown}>
              <ScrollbarThumb
                $disabled={scrollDisabled}
                onMouseDown={onScrollbarThumbDown}
                style={{
                  left:  `${scrollFrac.pos * (1 - scrollFrac.thumb) * 100}%`,
                  width: `${scrollFrac.thumb * 100}%`,
                }}
              />
            </ScrollbarTrack>
          )}

          <ControlsRow>
            <PlayBtn
              onClick={togglePlay}
              disabled={!ready}
              $playing={isPlaying}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {loading ? (
                <InlineSpinner />
              ) : isPlaying ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'translateX(1px)' }}>
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </PlayBtn>
            <TimeText>
              <span>{fmtSec(currentTime)}</span>
              <span className="sep">/</span>
              <span className="total">{fmtSec(audioDur || (audioInfo?.durationMs ?? 0) / 1000)}</span>
            </TimeText>
            {hasSound && audioDur > 0 && (
              <TrimGroup>
                <span className="val">{fmtSec(selStart)}</span>
                <span className="arrow">→</span>
                <span className="val">{fmtSec(selEnd)}</span>
                {trimChanged && (
                  <ResetTrimBtn onClick={resetTrim} title="Reset trim" aria-label="Reset trim">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                  </ResetTrimBtn>
                )}
              </TrimGroup>
            )}
          </ControlsRow>
        </PlayerWrap>
      )}
    </Panel>
  );
};

export default AudioPickerPanel;
