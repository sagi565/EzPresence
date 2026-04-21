import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Panel, UrlRow, UrlInput, ClearBtn,
  InfoRow, PlatformRow, PlatformIconImg,
  VideoName,
  LoadingChip, InlineSpinner,
  PlayerWrap, WaveStage, WaveCanvas, PlayheadLine,
  HoverLine, HoverTime,
  RangeHandle,
  ControlsRow, PlayBtn, TimeText, TrimGroup, ResetTrimBtn,
  ErrorBanner,
  TOKENS,
} from './styles';
import { SocialVideoContext } from '@hooks/useVisionPlan';
import { useAudioUrl } from '@hooks/useAudioUrl';

type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

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

interface Props {
  onClose: () => void;
  value: SocialVideoContext | null;
  onChange: (v: SocialVideoContext | null) => void;
  /* Trim must stay between these (bounded by the chosen video-duration tier). */
  minDurationSec: number;
  maxDurationSec: number;
  /* Called when the user tries to drag a handle past the min/max trim —
     parent nudges the duration button to hint "change tier to go further". */
  onTrimLimitHit?: () => void;
  /* Called once when audio metadata arrives, so parent can auto-lower the
     duration tier if the audio is shorter than the current tier's minimum. */
  onAudioLoaded?: (audioDurSec: number) => void;
}

const BAR_COUNT  = 120;
const MIN_TRIM_SEC = 1;

const PLACEHOLDER_BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const x = i / BAR_COUNT;
  const v = (
    0.55 * Math.abs(Math.sin(x * Math.PI * 3.1 + 0.6)) +
    0.30 * Math.abs(Math.sin(x * Math.PI * 6.7 + 1.9)) +
    0.15 * Math.abs(Math.sin(x * Math.PI * 11.3 + 3.4))
  );
  // Wider dynamic range so peaks pop clearly against troughs
  return 0.10 + 0.82 * Math.pow(v, 0.62);
});

/* Flat, low-amplitude profile used when decode fails (CORS / unsupported codec).
   Visually distinct from a real waveform — the user can immediately tell the
   bars are NOT representing the playing audio. */
const FALLBACK_BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  return 0.18 + 0.04 * Math.sin(i * 0.45);
});

async function decodePeaks(audioUrl: string, bars: number): Promise<number[] | null> {
  try {
    const res = await fetch(audioUrl);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const Ctx = (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext);
    if (!Ctx) return null;
    const offline = new Ctx(1, 44100, 44100);
    const decoded = await offline.decodeAudioData(buf.slice(0));
    const channel = decoded.getChannelData(0);
    const block = Math.max(1, Math.floor(channel.length / bars));
    const peaks: number[] = [];
    for (let i = 0; i < bars; i++) {
      let max = 0;
      const start = i * block;
      const end = Math.min(start + block, channel.length);
      for (let j = start; j < end; j++) {
        const v = Math.abs(channel[j]);
        if (v > max) max = v;
      }
      peaks.push(max);
    }
    const norm = Math.max(...peaks) || 1;
    // Lower exponent → stronger contrast between peaks and quiet sections.
    // Lower floor → quiet sections actually look quiet. Together this gives
    // the "more dynamic" wave heights without distorting the true shape.
    return peaks.map(p => Math.max(0.06, Math.pow(p / norm, 0.62)));
  } catch { return null; }
}

const AudioPickerPanel: React.FC<Props> = ({
  onClose, value, onChange,
  minDurationSec, maxDurationSec,
  onTrimLimitHit, onAudioLoaded,
}) => {
  const [url, setUrl] = useState(value?.url ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { fetchAudioUrl, data: audioInfo, isLoading: loading, error, reset: resetAudio } = useAudioUrl();

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDur,   setAudioDur]     = useState(0);
  const [audioReady, setAudioReady]   = useState(false);

  const [selStart, setSelStart] = useState(value?.offsetSeconds ?? 0);
  const [selEnd,   setSelEnd]   = useState(value ? value.offsetSeconds + value.durationSeconds : 0);
  const [dragging, setDragging] = useState<null | 'start' | 'end' | 'both'>(null);
  /* 'both' drag — stores how far into the selection the grab started */
  const dragOffsetRef      = useRef(0);
  /* prevents onClick→seek when a 'both' drag was initiated on mousedown */
  const mouseDownInSelRef  = useRef(false);

  const selStartRef  = useRef(selStart);
  const selEndRef    = useRef(selEnd);
  const audioDurRef  = useRef(audioDur);
  const isPlayingRef = useRef(isPlaying);
  const minDurRef    = useRef(minDurationSec);
  const maxDurRef    = useRef(maxDurationSec);
  useEffect(() => { selStartRef.current = selStart; }, [selStart]);
  useEffect(() => { selEndRef.current   = selEnd;   }, [selEnd]);
  useEffect(() => { audioDurRef.current = audioDur; }, [audioDur]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { minDurRef.current   = minDurationSec; }, [minDurationSec]);
  useEffect(() => { maxDurRef.current   = maxDurationSec; }, [maxDurationSec]);

  /* Smooth-playhead interpolation — HTMLAudioElement 'timeupdate' fires only
     every ~250ms, which looks visibly jumpy on short audio. We store the last
     sync point and interpolate on every animation frame (60fps). */
  const syncedTimeRef = useRef({ value: 0, at: 0 });
  const readCurrentTime = useCallback(() => {
    if (!isPlayingRef.current) return syncedTimeRef.current.value;
    const dt = (performance.now() - syncedTimeRef.current.at) / 1000;
    const t = syncedTimeRef.current.value + dt;
    return Math.min(audioDurRef.current || 0, Math.max(0, t));
  }, []);

  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const playheadRef  = useRef<HTMLDivElement | null>(null);
  const peaksRef     = useRef<number[]>([...PLACEHOLDER_BARS]);
  /* Reactive flag so the RAF effect re-subscribes when decode finishes.
     Mirrored to a ref for synchronous reads inside the draw loop. */
  const [hasRealPeaks, setHasRealPeaks] = useState(false);
  const hasRealPeaksRef = useRef(false);
  useEffect(() => { hasRealPeaksRef.current = hasRealPeaks; }, [hasRealPeaks]);

  const hoverXRef  = useRef<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; t: number } | null>(null);

  /* ── Live Web-Audio analyser (best-effort) ──
     If the audio CDN allows CORS, we hook the playing HTMLAudioElement into
     an AnalyserNode and read live frequency data each frame to modulate the
     waveform bars during playback — making the bars visibly DANCE to the
     sound. If CORS is denied (most third-party CDNs), playback still works
     and the bars stay static (their decoded shape only). */
  const audioCtxRef       = useRef<AudioContext | null>(null);
  const analyserRef       = useRef<AnalyserNode | null>(null);
  const analyserBufRef    = useRef<Uint8Array | null>(null);
  const sourceNodeRef     = useRef<MediaElementAudioSourceNode | null>(null);
  const liveLevelsRef     = useRef<Float32Array>(new Float32Array(BAR_COUNT));

  const platform = detectPlatform(url);

  /* ── Draw loop ─────────────────────────────────────────────────── */
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
    if (canvas.width  !== wantW) canvas.width  = wantW;
    if (canvas.height !== wantH) canvas.height = wantH;

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = cssW;
    const H = cssH;
    ctx.clearRect(0, 0, W, H);

    /* ── Bar geometry: thin rounded capsules, auto-fit, integer-snapped x ── */
    const targetGap = 1;
    let barW = (W - (BAR_COUNT - 1) * targetGap) / BAR_COUNT;
    barW = Math.max(1.4, Math.min(2.4, barW));
    const gap = (W - BAR_COUNT * barW) / (BAR_COUNT - 1);
    const totalW = BAR_COUNT * barW + (BAR_COUNT - 1) * gap;
    const ox = (W - totalW) / 2;

    /* ── SoundCloud-style asymmetric silhouette ──
       Top half is drawn at full envelope; bottom is intentionally shorter
       (~62%). A 1px centerline gap separates the two halves — this is the
       single most "premium" detail of professional waveform UIs. */
    const cy = H / 2;
    const MID_GAP = 1;
    const TOP_RATIO = 1.0;
    const BOT_RATIO = 0.62;
    const topMax = cy - MID_GAP / 2 - 1;
    const botMax = H - cy - MID_GAP / 2 - 1;

    /* ── Edge fade (smoothstep over first/last 8% of bars) ──
       Prevents hard rectangular cut-off at the canvas edges; the waveform
       breathes into the surrounding UI. */
    const FADE_FRAC = 0.08;
    const envAt = (t: number) => {
      const sm = (x: number) => x * x * (3 - 2 * x);
      if (t < FADE_FRAC) return sm(t / FADE_FRAC);
      if (t > 1 - FADE_FRAC) return sm((1 - t) / FADE_FRAC);
      return 1;
    };

    /* Paint a single rounded-capsule HALF (above or below the centerline). */
    const paintHalf = (x: number, h: number, half: 'top' | 'bot', color: string) => {
      if (h < 0.5) return;
      const r = Math.min(barW / 2, h / 2); // full pill cap
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

    /* ── Loading: same asymmetric capsules + same gamma'd shape as the real
       waveform — uses peaksRef (which holds PLACEHOLDER_BARS until decode
       finishes), brightened by a gentle spotlight that sweeps left→right
       AND a slow global hue cycle. This makes the loader feel alive across
       BOTH network phases (API call + audio file fetch/decode), so the user
       perceives one continuous loading state until real peaks arrive. */
    if (!hasRealPeaksRef.current) {
      const now = performance.now() / 1000;
      const sweep = (now * 0.42) % 1.6;
      const spotX = -0.3 + sweep;
      // Hue cycles ~258 → ~288 over ~3.2s — deep purple ↔ violet-pink.
      const hue = 273 + 15 * Math.sin(now * 1.95);
      // A slow secondary wave passes through left→right so the whole silhouette
      // feels like it's inhaling.
      const wave1Phase = now * 1.55;
      const wave2Phase = now * 2.6;
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = Math.round(ox + i * (barW + gap));
        const t = i / (BAR_COUNT - 1);
        // Two stacked sines per bar, offset by bar index, give an organic
        // "breathing" motion — each bar pulses up and down on its own beat.
        const breath =
          0.55 + 0.30 * Math.sin(wave1Phase + i * 0.32)
               + 0.15 * Math.sin(wave2Phase + i * 0.74);
        const peak = (peaksRef.current[i] ?? 0.4) * envAt(t) * breath;
        const dist = Math.abs((x + barW / 2) / W - spotX);
        const lift = Math.exp(-dist * dist * 22);
        const alpha = 0.18 + 0.55 * lift;
        const sat   = 80 + 10 * lift;
        const light = 62 + 8  * lift;
        const col = `hsla(${hue.toFixed(1)}, ${sat}%, ${light}%, ${alpha})`;
        paintHalf(x, peak * topMax * TOP_RATIO, 'top', col);
        paintHalf(x, peak * botMax * BOT_RATIO, 'bot', col);
      }
      return;
    }

    /* ── Real waveform — uses interpolated time so progress is smooth even
       between HTMLAudio's ~250ms timeupdate events. */
    const haveSel  = audioDur > 0 && selEnd > selStart;
    const selStartPx = haveSel ? (selStart / audioDur) * W : 0;
    const selEndPx   = haveSel ? (selEnd   / audioDur) * W : W;
    const liveTime   = readCurrentTime();
    const progress   = audioDur > 0 ? Math.min(liveTime / audioDur, 1) : 0;
    const playedBars = progress * BAR_COUNT;

    /* Drive the playhead imperatively at 60fps — far smoother than waiting
       for React state updates on each timeupdate. */
    if (playheadRef.current && audioDur > 0) {
      const pct = progress * 100;
      playheadRef.current.style.left = `calc(6px + (100% - 12px) * ${pct / 100})`;
    }

    /* Sample live frequency data once per frame and map to per-bar levels.
       When playing, we use these as a SUBTLE multiplier on each bar's
       static height so the waveform visibly reacts to the sound. We keep a
       smoothed envelope (liveLevelsRef) so adjacent bars don't jitter. */
    const analyser = analyserRef.current;
    const buf      = analyserBufRef.current;
    const live     = liveLevelsRef.current;
    if (analyser && buf && isPlayingRef.current) {
      analyser.getByteFrequencyData(buf as any);
      const bins = buf.length;
      for (let i = 0; i < BAR_COUNT; i++) {
        const bin = Math.min(bins - 1, Math.floor((i / BAR_COUNT) * bins));
        const v = buf[bin] / 255; // 0..1
        live[i] = live[i] * 0.65 + v * 0.35; // EMA smoothing
      }
    } else if (!isPlayingRef.current) {
      // Decay live envelope back toward 0 when not playing.
      for (let i = 0; i < BAR_COUNT; i++) live[i] *= 0.92;
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = Math.round(ox + i * (barW + gap)); // crisp, no sub-pixel blur
      const t = i / (BAR_COUNT - 1);
      // Static decoded peak * envelope, then a gentle live multiplier so the
      // waveform stays recognisable but visibly dances with the music.
      const liveBoost = analyser ? (0.85 + 0.55 * live[i]) : 1;
      const peak = (peaksRef.current[i] ?? 0.4) * envAt(t) * liveBoost;

      const topH = peak * topMax * TOP_RATIO;
      const botH = peak * botMax * BOT_RATIO;

      const barCenterPx = x + barW / 2;
      const inSel = !haveSel || (barCenterPx >= selStartPx && barCenterPx <= selEndPx);
      const played = (i + 0.5) <= playedBars; // bar "flips" at its midpoint

      let color: string;
      if (!inSel)        color = TOKENS.BAR_OUT;
      else if (played)   color = TOKENS.ACCENT;
      else               color = TOKENS.BAR_DIM;

      paintHalf(x, topH, 'top', color);
      paintHalf(x, botH, 'bot', color);
    }
  };

  /* Animate while: loading (Phase A), waveform peaks not yet ready (Phase B),
     audio is playing, or the user is dragging a trim handle. */
  const needsAnimation = loading || !hasRealPeaks || isPlaying || !!dragging;
  useEffect(() => {
    drawRef.current();
    if (!needsAnimation) return;
    let id: number;
    const loop = () => { drawRef.current(); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [needsAnimation, audioInfo, audioReady, audioDur, currentTime, hoverInfo, selStart, selEnd, hasRealPeaks]);

  /* ── Teardown ── */
  const teardownAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    /* Disconnect any live analyser graph from the previous audio. The shared
       AudioContext stays alive (we reuse it for subsequent fetches). */
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
  }, []);

  /* Attempt to connect the playing HTMLAudioElement to a Web-Audio analyser.
     Throws (caught here) on CORS-denied content. Safe to call multiple times —
     MediaElementSource can only be created once per element, so we guard. */
  const setupLiveAnalyser = useCallback((audio: HTMLAudioElement) => {
    if (sourceNodeRef.current) return; // already wired
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current!;
      const src = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;            // 128 frequency bins — plenty for 120 bars
      analyser.smoothingTimeConstant = 0.78;
      src.connect(analyser);
      analyser.connect(ctx.destination); // keep audio audible
      sourceNodeRef.current = src;
      analyserRef.current = analyser;
      analyserBufRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      /* CORS-tainted source — leave bars static. */
    }
  }, []);

  useEffect(() => () => {
    teardownAudio();
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, [teardownAudio]);

  /* ── Fetch ── */
  const fetchAudio = useCallback(async (mediaLink: string, preserveSelection?: { start: number; end: number }) => {
    if (!mediaLink.trim()) return;
    setAudioReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioDur(0);
    peaksRef.current = [...PLACEHOLDER_BARS];
    hasRealPeaksRef.current = false;
    setHasRealPeaks(false);
    teardownAudio();

    const res = await fetchAudioUrl(mediaLink);
    if (!res) return;

    const apiFallbackDur = res.durationMs / 1000;

    const syncTime = (t: number) => {
      syncedTimeRef.current = { value: t, at: performance.now() };
    };

    /* Build an HTMLAudioElement, optionally with crossOrigin so we can hook
       it into Web-Audio for live frequency analysis. If the CDN doesn't
       send CORS headers, the request errors out and we silently rebuild the
       element WITHOUT crossOrigin so playback still works (just no live
       dancing bars in that case). */
    let triedFallbackNoCors = false;

    const wireAudio = (a: HTMLAudioElement, onLoadError: () => void) => {
      a.addEventListener('loadedmetadata', () => {
        const d = a.duration > 0 && isFinite(a.duration) ? a.duration : apiFallbackDur;
        setAudioDur(d);
        setAudioReady(true);
        onAudioLoaded?.(d);
      });
      a.addEventListener('canplay', () => {
        setAudioReady(true);
        // Only attempt analyser when crossOrigin is honored (no CORS taint).
        if (a.crossOrigin === 'anonymous') setupLiveAnalyser(a);
      });
      a.addEventListener('timeupdate', () => {
        const t = a.currentTime;
        syncTime(t);
        setCurrentTime(t);
        // No trim-based stopping — playback runs freely so the user can
        // listen to any part of the audio, not just the selected clip.
      });
      a.addEventListener('ended', () => {
        setIsPlaying(false);
        a.currentTime = selStartRef.current;
        syncTime(selStartRef.current);
        setCurrentTime(selStartRef.current);
      });
      a.addEventListener('error', onLoadError);
    };

    const buildAudio = (withCors: boolean): HTMLAudioElement => {
      const a = new Audio();
      if (withCors) a.crossOrigin = 'anonymous';
      a.preload = 'auto';
      a.src = res.audioLink;
      return a;
    };

    let audio = buildAudio(true);
    audioRef.current = audio;

    const onCorsLoadError = () => {
      // First failure with crossOrigin set → assume CORS denied, rebuild plain.
      if (audioRef.current !== audio) return;       // superseded by newer fetch
      if (triedFallbackNoCors) { setAudioReady(false); return; }
      triedFallbackNoCors = true;
      try { audio.pause(); audio.src = ''; } catch {}
      audio = buildAudio(false);
      audioRef.current = audio;
      wireAudio(audio, () => setAudioReady(false));
      audio.load();
    };

    wireAudio(audio, onCorsLoadError);
    audio.load();

    /* Pick an initial trim that respects the current duration tier:
       within [minDur, min(maxDur, audioDur)]. */
    const fitTrim = () => {
      const audioLen = apiFallbackDur || audio.duration || 0;
      const minD = Math.min(minDurRef.current, Math.max(MIN_TRIM_SEC, audioLen));
      const maxD = Math.min(maxDurRef.current, audioLen);
      // Default: start at 0, length = clamp(maxD, minD, audioLen)
      const len = Math.max(minD, Math.min(maxD, audioLen));
      return { s: 0, e: len };
    };

    if (preserveSelection && preserveSelection.end > preserveSelection.start) {
      setSelStart(preserveSelection.start);
      setSelEnd(preserveSelection.end);
    } else {
      const { s, e } = fitTrim();
      setSelStart(s);
      setSelEnd(e);
    }

    setAudioDur(apiFallbackDur);
    setAudioReady(true);
    syncTime(0);
    onAudioLoaded?.(apiFallbackDur);

    decodePeaks(res.audioLink, BAR_COUNT).then(peaks => {
      if (audioRef.current !== audio) return; // a newer fetch superseded us
      // Real peaks if decode worked; otherwise a clearly-flat placeholder so
      // the user can SEE that we couldn't read the audio (rather than tricking
      // them with the structured PLACEHOLDER_BARS shape used during loading).
      peaksRef.current = peaks ?? [...FALLBACK_BARS];
      hasRealPeaksRef.current = true;
      setHasRealPeaks(true);
    });
  }, [fetchAudioUrl, teardownAudio, onAudioLoaded]);

  /* If the API call errors out, stop the loader animation — the ErrorBanner
     takes over and the waveform area should just settle. */
  useEffect(() => {
    if (error) {
      hasRealPeaksRef.current = true;
      setHasRealPeaks(true);
    }
  }, [error]);

  /* Auto-fetch on mount when reopening with existing value */
  useEffect(() => {
    if (value?.url) {
      fetchAudio(value.url, {
        start: value.offsetSeconds,
        end:   value.offsetSeconds + value.durationSeconds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-attach to parent on load + on trim changes (idle, not dragging) ── */
  useEffect(() => {
    if (!audioInfo || !audioReady || dragging) return;
    if (audioDur === 0) return;
    const dur = Math.max(MIN_TRIM_SEC, Math.floor(selEnd - selStart));
    onChange({
      platform: platform ?? 'youtube',
      url: url.trim(),
      offsetSeconds: Math.max(0, Math.floor(selStart)),
      durationSeconds: dur,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInfo, audioReady, dragging, selStart, selEnd, audioDur]);

  /* ── Play / Pause (clamped to selection) ── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Resume any suspended Web-Audio context so the live analyser receives
    // samples (some browsers start the ctx suspended until a user gesture).
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      // freeze interpolation at current time so the playhead stops dead
      syncedTimeRef.current = { value: audio.currentTime, at: performance.now() };
      return;
    }
    // If the audio has ended (at or past the total duration), restart from
    // the trim start. Otherwise play from wherever the playhead currently is
    // so the user can freely listen outside the trim region.
    const dur = audioDurRef.current;
    if (dur > 0 && audio.currentTime >= dur - 0.08) {
      audio.currentTime = selStartRef.current;
      setCurrentTime(selStartRef.current);
    }
    syncedTimeRef.current = { value: audio.currentTime, at: performance.now() };
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        syncedTimeRef.current = { value: audio.currentTime, at: performance.now() };
        setIsPlaying(true);
      }).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  }, [isPlaying, selStart, selEnd]);

  /* ── Seek + hover ── */
  const seekTo = useCallback((t: number) => {
    const audio = audioRef.current;
    if (!audio || !audioReady || audioDur === 0) return;
    const clamped = Math.max(0, Math.min(audioDur, t));
    audio.currentTime = clamped;
    syncedTimeRef.current = { value: clamped, at: performance.now() };
    setCurrentTime(clamped);
  }, [audioReady, audioDur]);

  /* Clicking in the MIDDLE of the selection grabs both handles at once.
     Clicking outside the selection (or at a handle) seeks normally.
     We use mousedown (not onClick) so the drag starts immediately without
     waiting for the click event. onClick is kept for the seek path. */
  const onCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioReady || audioDur === 0 || !hasRealPeaks) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width * audioDur;
    const trimLen = selEnd - selStart;
    // Deadzone: 8% of trim length (or 0.4s min) near each handle so that
    // clicking near a handle doesn't accidentally start a 'both' drag.
    const dead = Math.max(0.4, trimLen * 0.08);
    const inMiddle = trimLen > dead * 2 && t > selStart + dead && t < selEnd - dead;
    mouseDownInSelRef.current = inMiddle;
    if (inMiddle) {
      e.preventDefault();
      dragOffsetRef.current = t - selStart; // preserve cursor position within selection
      setDragging('both');
    }
  }, [audioReady, audioDur, hasRealPeaks, selStart, selEnd]);

  const onCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // If mousedown started a 'both' drag, ignore the resulting click.
    if (mouseDownInSelRef.current) { mouseDownInSelRef.current = false; return; }
    if (!audioReady || audioDur === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = (e.clientX - rect.left) / rect.width * audioDur;
    seekTo(t);
  }, [audioReady, audioDur, seekTo]);

  const onCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioReady || audioDur === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    hoverXRef.current = x;
    const t = Math.max(0, Math.min(1, x / rect.width)) * audioDur;
    setHoverInfo({ x, t });
  }, [audioReady, audioDur]);

  const onCanvasLeave = useCallback(() => {
    hoverXRef.current = null;
    setHoverInfo(null);
  }, []);

  /* ── Handle drag ── clamped to [minDuration, min(maxDuration, audioDur)].
     When the clamp kicks in (user is trying to go past the tier boundary),
     ping onTrimLimitHit so the parent can nudge the duration button. */
  useEffect(() => {
    if (!dragging) return;
    /* Throttle the nudge so fast drags don't spam it */
    let lastHitAt = 0;
    const pingLimit = () => {
      const now = performance.now();
      if (now - lastHitAt < 700) return;
      lastHitAt = now;
      onTrimLimitHit?.();
    };

    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      const dur = audioDurRef.current;
      if (!canvas || dur === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const t = (x / rect.width) * dur;

      const minD = Math.max(MIN_TRIM_SEC, Math.min(minDurRef.current, dur));
      const maxD = Math.min(maxDurRef.current, dur);

      if (dragging === 'both') {
        /* Shift the whole selection preserving its length. */
        const trimLen = selEndRef.current - selStartRef.current;
        const newStart = Math.max(0, Math.min(dur - trimLen, t - dragOffsetRef.current));
        setSelStart(newStart);
        setSelEnd(newStart + trimLen);
        return;
      }

      if (dragging === 'start') {
        const curEnd = selEndRef.current;
        // start in [curEnd - maxD, curEnd - minD], also in [0, curEnd - MIN_TRIM_SEC]
        const lo = Math.max(0, curEnd - maxD);
        const hi = Math.max(0, curEnd - minD);
        let next = t;
        let hit = false;
        if (next < lo) { next = lo; hit = true; }
        if (next > hi) { next = hi; hit = true; }
        if (hit) pingLimit();
        setSelStart(next);
        const audio = audioRef.current;
        if (audio && !isPlayingRef.current) {
          audio.currentTime = next;
          syncedTimeRef.current = { value: next, at: performance.now() };
          setCurrentTime(next);
        }
      } else {
        const curStart = selStartRef.current;
        // end in [curStart + minD, curStart + maxD], also in [0, dur]
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
          syncedTimeRef.current = { value: preview, at: performance.now() };
          setCurrentTime(preview);
        }
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, onTrimLimitHit]);

  /* Re-clamp current trim when the duration tier changes — e.g. user switched
     from "Short" (25-40s) to "Clip" (15-25s); existing 30s trim no longer
     fits the max, so we shrink selEnd to satisfy the new tier. */
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

  /* ── URL change ── */
  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUrl(v);
    resetAudio();
    setAudioReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioDur(0);
    setSelStart(0);
    setSelEnd(0);
    peaksRef.current = [...PLACEHOLDER_BARS];
    hasRealPeaksRef.current = false;
    setHasRealPeaks(false);
    teardownAudio();
    if (value) onChange(null); // detach previous sound when URL is being changed
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim()) debounceRef.current = setTimeout(() => fetchAudio(v), 600);
  };

  /* ── Remove sound ── */
  const removeSound = () => {
    onChange(null);
    setUrl('');
    resetAudio();
    setAudioReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setAudioDur(0);
    setSelStart(0);
    setSelEnd(0);
    peaksRef.current = [...PLACEHOLDER_BARS];
    hasRealPeaksRef.current = false;
    setHasRealPeaks(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    teardownAudio();
  };

  const resetTrim = () => {
    setSelStart(0);
    setSelEnd(audioDur);
  };

  const pctOf = (t: number) => audioDur > 0 ? Math.min(100, Math.max(0, (t / audioDur) * 100)) : 0;
  const startPct    = pctOf(selStart);
  const endPct      = pctOf(selEnd);
  const progressPct = pctOf(currentTime);
  const showPlayer  = loading || !!audioInfo;
  const playDisabled = !audioReady || loading;
  const trimChanged = audioDur > 0 && (selStart > 0.5 || selEnd < audioDur - 0.5);
  const hasSound = !!audioInfo;

  /* Canvas cursor: 'grab' when hovering over the moveable middle of the
     selection, 'grabbing' while actively dragging both handles together,
     'pointer' everywhere else (click-to-seek). */
  const canvasCursor = (() => {
    if (!audioReady || !hasRealPeaks) return 'default';
    if (dragging === 'both') return 'grabbing';
    if (hoverInfo && audioDur > 0) {
      const ht = hoverInfo.t;
      const trimLen = selEnd - selStart;
      const dead = Math.max(0.4, trimLen * 0.08);
      if (trimLen > dead * 2 && ht > selStart + dead && ht < selEnd - dead) return 'grab';
    }
    return 'pointer';
  })();

  return (
    <Panel>

      {/* URL + smart top-right X (removes sound if attached, otherwise closes panel) */}
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

      {/* Platforms + name.
          When a platform is detected, only that icon stays visible — the
          others collapse horizontally (max-width / margin / scale animate to
          zero). The detected icon naturally "slides to the left" because
          DOM order is fixed and flexbox reflows as siblings collapse. */}
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
            />
          ))}
        </PlatformRow>
        {audioInfo ? (
          /* Phase B+: API returned name/length. Slides in from the right. */
          <VideoName key={audioInfo.videoName} title={audioInfo.videoName}>{audioInfo.videoName}</VideoName>
        ) : loading ? (
          /* Phase A: API in flight. */
          <LoadingChip>
            <InlineSpinner />
            Fetching info…
          </LoadingChip>
        ) : (
          <span style={{ flex: 1 }} />
        )}
      </InfoRow>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      {/* Waveform + handles + controls */}
      {showPlayer && (
        <PlayerWrap>
          <WaveStage>
            <WaveCanvas
              ref={canvasRef}
              onMouseDown={onCanvasMouseDown}
              onClick={onCanvasClick}
              onMouseMove={onCanvasMove}
              onMouseLeave={onCanvasLeave}
              style={{ cursor: canvasCursor }}
            />

            {/* Selection is now conveyed solely by the waveform bars themselves
                (brighter inside selection, dimmer outside) + the handles.
                No tinted background behind the bars — "just the waves". */}

            {/* Overlays wait for hasRealPeaks — during Phase B (audio file +
                decode in flight) the loading silhouette is still animating and
                handles/playhead would clutter it. */}
            {hasRealPeaks && audioDur > 0 && (
              <PlayheadLine
                ref={playheadRef}
                style={{ left: `calc(6px + (100% - 12px) * ${progressPct / 100})` }}
              />
            )}

            {hasRealPeaks && hoverInfo && !dragging && (
              <>
                <HoverLine  style={{ left: `${hoverInfo.x + 6}px` }} />
                <HoverTime  style={{ left: `${hoverInfo.x + 6}px` }}>{fmtSec(hoverInfo.t)}</HoverTime>
              </>
            )}

            {hasRealPeaks && audioDur > 0 && (
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
          </WaveStage>

          <ControlsRow>
            <PlayBtn
              onClick={togglePlay}
              disabled={playDisabled}
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
