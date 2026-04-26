import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyledPromptBox, DragOverlay, TextareaWrap, Placeholder, TwText, Cursor,
  Textarea, AttachList, AttachChip, AttachName, RemoveBtn, Toolbar, IconBtn,
  Spacer, SendBtn, Spinner, RippleEl, TooltipWrap,
  DurationWrap, DurationDropdown, DurationOption, DurOptLabel, DurOptRange,
  DurationBadge, AutoIconBtn,
} from './styles';
import { Zap } from 'lucide-react';
import AudioPickerPanel from '@components/Studio/VisionCreator/AudioPickerPanel/AudioPickerPanel';
import { SocialVideoContext } from '@hooks/useVisionPlan';

const DURATIONS = [
  { key: 'snappy',        label: 'Teaser',  range: '5–15s',  avg: '10s', minSec: 5,  maxSec: 15 },
  { key: 'standard',      label: 'Clip',    range: '15–25s', avg: '20s', minSec: 15, maxSec: 25 },
  { key: 'extended',      label: 'Short',   range: '25–40s', avg: '30s', minSec: 25, maxSec: 40 },
  { key: 'comprehensive', label: 'Feature', range: '40–60s', avg: '50s', minSec: 40, maxSec: 60 },
] as const;
type DurationKey = typeof DURATIONS[number]['key'];

const PROMPTS = [
  'A hungry monkey discovering a giant yellow banana in a neon jungle…',
  'A cinematic sunrise over a misty mountain valley, golden hour…',
  'A cyberpunk detective in a dark rainy alleyway…',
  'A lone astronaut floating above Earth, stars reflected…',
  'Time-lapse of a city waking up, neon fading into morning light…',
];

const PLAN_PROMPTS = [
  'Make the second scene more detailed.',
  'Have the monkey eat an apple instead of a banana.',
  'Add a final scene that summarizes everything.',
  'Make the overall vibe more friendly.',
  "Change the main character's name to John.",
  'Add a new character: a skinny, old man with a big mustache…',
  'Make the script more thrilling.',
  "Increase the humor—it's not funny enough yet.",
];
const MAX=1000, TYPE=40, DEL=16, PAUSE=2200;

export interface FileAtt { id:string; name:string; }

interface PromptBoxProps {
    prompt: string;
    setPrompt: (v: string) => void;
    focused: boolean;
    setFocused: (v: boolean) => void;
    dragging: boolean;
    files: FileAtt[];
    setFiles: React.Dispatch<React.SetStateAction<FileAtt[]>>;
    handleSend: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleQuickSend: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isReady: boolean;
    isBusy: boolean;
    isLoading: boolean;
    isPolling: boolean;
    ripple: {x:number;y:number} | null;
    fileRef: React.RefObject<HTMLInputElement>;
    showReady: boolean;
    withCaptions: boolean;
    setWithCaptions: (v: boolean) => void;
    socialVideo: SocialVideoContext | null;
    setSocialVideo: (v: SocialVideoContext | null) => void;
    duration: DurationKey;
    setDuration: (v: DurationKey) => void;
    autoMode: boolean;
    setAutoMode: (v: boolean) => void;
    minimalist?: boolean;
}

const PromptBox: React.FC<PromptBoxProps> = ({
    prompt, setPrompt, focused, setFocused, dragging, files, setFiles,
    handleSend, handleQuickSend, isReady, isBusy, isLoading, isPolling, ripple, fileRef, showReady,
    withCaptions, setWithCaptions, socialVideo, setSocialVideo,
    duration, setDuration, autoMode, setAutoMode,
    minimalist = false,
}) => {
    const [audioOpen,    setAudioOpen]    = useState(false);
    const [durationOpen, setDurationOpen] = useState(false);
    const durationRef = useRef<HTMLDivElement>(null);
    const durationBtnRef = useRef<HTMLButtonElement>(null);

    /* Briefly twitches the duration button to signal: "trim is capped by your
       chosen video duration — change it here if you want a longer/shorter clip". */
    const nudgeDurationButton = useCallback(() => {
      const el = durationBtnRef.current;
      if (!el) return;
      el.classList.remove('twitch');
      // force reflow so the animation restarts even if class was just added
      void el.offsetWidth;
      el.classList.add('twitch');
      window.setTimeout(() => el.classList.remove('twitch'), 520);
    }, []);

    /* When audio loads shorter than the current tier's min, drop to the highest
       tier whose min still fits. (User explicitly: "if duration is something and
       the sound is less than minimum, make the duration relate to this".) */
    const handleAudioLoaded = useCallback((audioDurSec: number) => {
      const current = DURATIONS.find(d => d.key === duration);
      if (!current) return;
      if (audioDurSec >= current.minSec) return;
      const fit = [...DURATIONS].reverse().find(d => d.minSec <= audioDurSec);
      if (fit && fit.key !== duration) setDuration(fit.key);
    }, [duration, setDuration]);

    // Close duration dropdown on outside click
    useEffect(() => {
        if (!durationOpen) return;
        const handler = (e: MouseEvent) => {
            if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
                setDurationOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [durationOpen]);

    // Typewriter
    const [tw,    setTw]    = useState('');
    const [twIdx, setTwIdx] = useState(0);
    const [twDel, setTwDel] = useState(false);
    const twRef = useRef<ReturnType<typeof setTimeout>|null>(null);

    const activePrompts = minimalist ? PLAN_PROMPTS : PROMPTS;
    const clearTw = ()=>{ if(twRef.current) clearTimeout(twRef.current); };
    const tick = useCallback(()=>{
        const t=activePrompts[twIdx];
        if(!twDel){
            if(tw.length<t.length){ setTw(t.slice(0,tw.length+1)); twRef.current=setTimeout(tick,TYPE); }
            else { twRef.current=setTimeout(()=>setTwDel(true),PAUSE); }
        } else {
            if(tw.length>0){ setTw(p=>p.slice(0,-1)); twRef.current=setTimeout(tick,DEL); }
            else { setTwDel(false); setTwIdx(i=>(i+1)%activePrompts.length); }
        }
    },[tw,twDel,twIdx,activePrompts]);

    useEffect(()=>{
        if(prompt){clearTw();return;}
        clearTw(); twRef.current=setTimeout(tick,TYPE);
        return clearTw;
    },[tick,prompt]);

    const currentDuration = DURATIONS.find(d => d.key === duration)!;

    return (
    <>
    <StyledPromptBox $drag={dragging} $focus={focused} style={showReady?{marginTop:0}:{marginTop:16}}>
      <DragOverlay $v={dragging}>
        <div style={{color:'#a78bfa',fontSize:32}}>📎</div>
        <div style={{fontSize:'12px',fontWeight:700,letterSpacing:'.06em',color:'#a78bfa',textTransform:'uppercase'}}>Drop images here</div>
      </DragOverlay>
      <TextareaWrap $minimalist={minimalist}>
        <Placeholder $v={!focused&&!prompt}>
          <TwText>{tw}</TwText><Cursor/>
        </Placeholder>
        <Textarea
          $minimalist={minimalist}
          value={prompt}
          onChange={e=>setPrompt(e.target.value.slice(0,MAX))}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          rows={minimalist?1:(showReady?2:3)}
          aria-label="Vision prompt"
        />
      </TextareaWrap>
      {files.length>0&&(
        <AttachList>
          {files.map(f=>(
            <AttachChip key={f.id}>
              <span>📎</span><AttachName title={f.name}>{f.name}</AttachName>
              <RemoveBtn onClick={()=>setFiles(p=>p.filter(x=>x.id!==f.id))}>×</RemoveBtn>
            </AttachChip>
          ))}
        </AttachList>
      )}
      <Toolbar $minimalist={minimalist}>
        {!minimalist && (
          <>
            <TooltipWrap data-tip="Attach image">
              <IconBtn $active={files.length > 0} onClick={()=>fileRef.current?.click()} aria-label="Attach image">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </IconBtn>
            </TooltipWrap>
            <TooltipWrap data-tip="Add default captions">
              <IconBtn $active={withCaptions} onClick={()=>setWithCaptions(!withCaptions)} aria-label="Toggle captions">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="3"/>
                  <path d="M7 12h2m2 0h6M7 15h4m2 0h2"/>
                </svg>
              </IconBtn>
            </TooltipWrap>
            <TooltipWrap data-tip="Use sound from social media">
              <IconBtn $active={!!socialVideo||audioOpen} onClick={()=>setAudioOpen(v=>!v)} aria-label="Social media audio">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </IconBtn>
            </TooltipWrap>
            <DurationWrap ref={durationRef}>
              <TooltipWrap data-tip={`Duration: ${currentDuration.label} (${currentDuration.range})`}>
                <IconBtn
                  ref={durationBtnRef}
                  $active={durationOpen || true}
                  onClick={() => setDurationOpen(v => !v)}
                  aria-label="Set video duration"
                  style={{ position: 'relative' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="13" r="8"/>
                    <polyline points="12 9 12 13 14.5 15.5"/>
                    <path d="M9 2h6M12 2v3"/>
                  </svg>
                  <DurationBadge>{currentDuration.avg}</DurationBadge>
                </IconBtn>
              </TooltipWrap>
              <DurationDropdown $open={durationOpen}>
                {DURATIONS.map(d => (
                  <DurationOption key={d.key} $active={duration === d.key}
                    onClick={() => {
                      setDuration(d.key);
                      setDurationOpen(false);
                    }}>
                    <DurOptLabel $active={duration === d.key}>{d.label}</DurOptLabel>
                    <DurOptRange>{d.range}</DurOptRange>
                  </DurationOption>
                ))}
              </DurationDropdown>
            </DurationWrap>
          </>
        )}
        <Spacer/>
        {!minimalist && (
          <TooltipWrap data-tip="Auto — skip plan">
            <AutoIconBtn
              $active={autoMode}
              onClick={() => setAutoMode(!autoMode)}
              aria-label="Toggle auto mode" aria-pressed={autoMode}
            >
              <Zap size={15} strokeWidth={2.2} fill={autoMode ? '#fbbf24' : 'none'}/>
            </AutoIconBtn>
          </TooltipWrap>
        )}
        <TooltipWrap data-tip={minimalist ? 'Update the plan with this prompt' : autoMode ? 'Generate instantly — no review' : 'Review and edit the plan before generating'}>
          <SendBtn $ready={isReady} $loading={isBusy}
            onClick={minimalist ? handleSend : autoMode ? handleQuickSend : handleSend}
            disabled={!isReady||isBusy}>
            {ripple&&<RippleEl style={{left:ripple.x-5,top:ripple.y-5}}/>}
            {isLoading?<><Spinner/>Sending…</>:isPolling?<><Spinner/>Planning…</>:minimalist?<>Update Plan</>:<>Create</>}
          </SendBtn>
        </TooltipWrap>
      </Toolbar>
    </StyledPromptBox>
    {audioOpen&&(
      <AudioPickerPanel
        onClose={()=>setAudioOpen(false)}
        value={socialVideo}
        onChange={v=>setSocialVideo(v)}
        minDurationSec={currentDuration.minSec}
        maxDurationSec={currentDuration.maxSec}
        onTrimLimitHit={nudgeDurationButton}
        onAudioLoaded={handleAudioLoaded}
      />
    )}
    </>
    );
}

export default PromptBox;
