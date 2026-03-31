import React, { useState, useEffect, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useVisionPlan } from '@hooks/useVisionPlan';
import PlanEditor from './components/PlanEditor';

// ─── Keyframes ─────────────────────────────────────────────────────────────────
const fadeInUp  = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn    = keyframes`from{opacity:0}to{opacity:1}`;
const fadeOut   = keyframes`from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.06)}`;
const blink     = keyframes`0%,100%{opacity:1}50%{opacity:0}`;
const shimmer   = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const rippleA   = keyframes`0%{transform:scale(0);opacity:.6}100%{transform:scale(2.8);opacity:0}`;
const spin      = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const drift     = keyframes`0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(28px,-18px) scale(1.04)}66%{transform:translate(-18px,8px) scale(.97)}`;
const pulseDot  = keyframes`0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.6);opacity:1}`;
const orbit     = keyframes`from{transform:rotate(0deg) translateX(var(--r)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r)) rotate(-360deg)}`;
const bgAnim    = keyframes`0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}`;
const planPulse = keyframes`0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}`;
const planRing  = keyframes`0%{transform:scale(.6);opacity:.8}100%{transform:scale(2.2);opacity:0}`;
const planSpin  = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const planTextC = keyframes`0%{opacity:0;transform:translateY(8px)}8%,20%{opacity:1;transform:translateY(0)}27%,100%{opacity:0;transform:translateY(-8px)}`;
const floatUp   = keyframes`from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}`;
const barSlide  = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;

// ─── Page Shell ────────────────────────────────────────────────────────────────
const VisionContainer = styled.div`
  flex:1;height:calc(100vh - 76px);display:flex;flex-direction:column;align-items:center;
  position:relative;overflow-y:auto;overflow-x:hidden;
  background:linear-gradient(-45deg,${p=>p.theme.colors.bg},rgba(139,92,246,.03),${p=>p.theme.colors.bg},rgba(109,40,217,.02));
  background-size:300% 300%;animation:${bgAnim} 20s ease-in-out infinite;
  padding:40px 24px 80px;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent;
`;

// ─── Background elements ───────────────────────────────────────────────────────
const BgOrb = styled.div<{$s:number;$x:string;$y:string;$c:string;$op:number;$delay?:string}>`
  position:fixed;width:${p=>p.$s}px;height:${p=>p.$s}px;
  left:${p=>p.$x};top:${p=>p.$y};
  background:radial-gradient(circle,${p=>p.$c} 0%,transparent 65%);
  opacity:${p=>p.$op};border-radius:50%;pointer-events:none;filter:blur(52px);
  animation:${drift} 20s ease-in-out ${p=>p.$delay||'0s'} infinite;
`;
const OrbitsWrap = styled.div`position:absolute;top:40%;left:50%;pointer-events:none;z-index:0;`;
const OrbitRing = styled.div<{$size:number}>`
  position:absolute;width:${p=>p.$size}px;height:${p=>p.$size}px;
  border-radius:50%;border:1.5px dashed rgba(139,92,246,.1);
  top:50%;left:50%;transform:translate(-50%,-50%);
`;
const OrbitDot = styled.div<{$r:number;$dur:string;$delay:string;$size:number}>`
  --r:${p=>p.$r}px;position:absolute;top:50%;left:50%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;margin:-${p=>p.$size/2}px;
  border-radius:50%;background:rgba(139,92,246,.7);box-shadow:0 0 12px rgba(139,92,246,.6);
  animation:${orbit} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
const FloatDot = styled.div<{$x:string;$y:string;$size:number;$delay:string}>`
  position:fixed;left:${p=>p.$x};top:${p=>p.$y};
  width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;
  background:rgba(139,92,246,.2);pointer-events:none;
  animation:${pulseDot} ${p=>3+parseFloat(p.$delay)}s ease-in-out ${p=>p.$delay} infinite;
`;

// ─── Back button ───────────────────────────────────────────────────────────────
const BackBtn = styled.button`
  position:fixed;right:24px;top:94px;z-index:20;
  display:inline-flex;align-items:center;gap:6px;
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.12);border-radius:10px;
  padding:7px 14px;cursor:pointer;font-size:12.5px;font-weight:700;
  color:${p=>p.theme.colors.muted};font-family:inherit;transition:all .18s;
  &:hover{border-color:rgba(139,92,246,.35);color:#8b5cf6;background:rgba(139,92,246,.06);}
`;

// ─── Idle layout ───────────────────────────────────────────────────────────────
const ContentWrapper = styled.div`
  display:flex;flex-direction:column;align-items:center;
  gap:24px;width:100%;max-width:700px;position:relative;z-index:1;
  animation:${fadeInUp} .7s cubic-bezier(.4,0,.2,1) both;
`;
const CreatorBadge = styled.div`
  display:inline-flex;align-items:center;gap:8px;padding:5px 16px 5px 7px;
  background:${p=>p.theme.colors.surface};border:1px solid rgba(139,92,246,.18);
  border-radius:999px;font-size:11px;font-weight:700;color:${p=>p.theme.colors.muted};
  letter-spacing:.08em;text-transform:uppercase;
`;
const BadgeDot = styled.span`width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#6d28d9);display:flex;align-items:center;justify-content:center;font-size:9px;`;
const PageTitle = styled.h1`font-size:clamp(2rem,4vw,3.2rem);font-weight:800;letter-spacing:-2px;line-height:1.05;margin:0;color:${p=>p.theme.colors.text};text-align:center;`;
const TitleAccent = styled.span`background:linear-gradient(135deg,#a78bfa 0%,#8b5cf6 45%,#6d28d9 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:${shimmer} 4s linear infinite;`;
const PageSubtitle = styled.p`font-size:14px;color:${p=>p.theme.colors.muted};margin:0;line-height:1.6;max-width:440px;text-align:center;`;
const Header = styled.div`display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:8px;width:100%;`;

// ─── Prompt Box ────────────────────────────────────────────────────────────────
const PromptBox = styled.div<{$drag:boolean;$focus:boolean}>`
  width:100%;background:${p=>p.theme.colors.surface};border-radius:20px;
  border:1.5px solid ${p=>p.$drag?'rgba(139,92,246,.8)':p.$focus?'rgba(139,92,246,.38)':'rgba(139,92,246,.1)'};
  position:relative;transition:border-color .25s,box-shadow .25s;
  box-shadow:${p=>(p.$drag||p.$focus)?'0 0 0 3px rgba(139,92,246,.06)':'none'};
`;
const DragOverlay = styled.div<{$v:boolean}>`position:absolute;inset:0;z-index:10;border-radius:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:rgba(139,92,246,.05);backdrop-filter:blur(8px);border:1px solid rgba(139,92,246,.2);opacity:${p=>p.$v?1:0};pointer-events:none;transition:opacity .2s;`;
const TextareaWrap = styled.div`padding:18px 18px 0;position:relative;`;
const Placeholder = styled.div<{$v:boolean}>`position:absolute;top:18px;left:18px;right:18px;pointer-events:none;font-size:15px;line-height:1.6;color:${p=>p.theme.colors.muted};opacity:${p=>p.$v?1:0};transition:opacity .15s;`;
const TwText = styled.span`color:${p=>p.theme.colors.muted};`;
const Cursor = styled.span`display:inline-block;width:2px;height:1em;background:#8b5cf6;margin-left:2px;vertical-align:text-bottom;border-radius:1px;animation:${blink} 1s step-end infinite;`;
const Textarea = styled.textarea`width:100%;min-height:76px;max-height:200px;background:transparent;border:none;outline:none;resize:none;font-size:15px;line-height:1.6;color:${p=>p.theme.colors.text};font-family:inherit;box-sizing:border-box;padding:0;caret-color:#8b5cf6;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent;&::placeholder{color:transparent;}`;
const AttachList = styled.div`display:flex;flex-wrap:wrap;gap:6px;padding:10px 18px 0;`;
const AttachChip = styled.div`display:inline-flex;align-items:center;gap:5px;padding:4px 9px 4px 7px;background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.16);border-radius:7px;font-size:11.5px;color:#8b5cf6;font-weight:500;max-width:200px;`;
const AttachName = styled.span`overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
const RemoveBtn = styled.button`background:none;border:none;cursor:pointer;padding:0;color:${p=>p.theme.colors.muted};font-size:16px;line-height:1;display:flex;align-items:center;flex-shrink:0;opacity:.5;&:hover{opacity:1;color:#8b5cf6;}`;
const Toolbar   = styled.div`display:flex;align-items:center;padding:10px 13px;gap:6px;border-top:1px solid ${p=>p.theme.colors.primaryLight};margin-top:10px;`;
const IconBtn   = styled.button<{$active?:boolean}>`display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9px;flex-shrink:0;border:1.5px solid ${p=>p.$active?'rgba(139,92,246,.4)':'rgba(139,92,246,.1)'};background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};color:${p=>p.$active?'#8b5cf6':p.theme.colors.muted};cursor:pointer;transition:all .18s;&:hover{background:rgba(139,92,246,.08);border-color:rgba(139,92,246,.3);color:#8b5cf6;}`;
const Spacer    = styled.div`flex:1;`;
const CharCount = styled.span<{$w:boolean}>`font-size:11.5px;color:${p=>p.$w?'#f59e0b':p.theme.colors.muted};opacity:.65;font-variant-numeric:tabular-nums;`;
const SendBtn   = styled.button<{$ready:boolean;$loading:boolean}>`position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 20px;border-radius:12px;border:none;cursor:${p=>(p.$ready&&!p.$loading)?'pointer':'default'};font-size:13.5px;font-weight:700;font-family:inherit;background:${p=>p.$ready?'linear-gradient(135deg,#a78bfa,#7c3aed)':'rgba(139,92,246,.08)'};color:${p=>p.$ready?'white':'rgba(139,92,246,.35)'};transition:all .25s cubic-bezier(.4,0,.2,1);overflow:hidden;${p=>p.$ready&&!p.$loading&&css`box-shadow:0 4px 18px rgba(124,58,237,.35);&:hover{transform:translateY(-2px);box-shadow:0 7px 24px rgba(124,58,237,.48);}&:active{transform:translateY(0);}`}`;
const Spinner   = styled.div`width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:${spin} .65s linear infinite;`;
const RippleEl  = styled.span`position:absolute;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.4);animation:${rippleA} .55s ease-out forwards;`;
const Banner    = styled.div<{$ok:boolean}>`width:100%;padding:11px 15px;background:${p=>p.$ok?'rgba(34,197,94,.07)':'rgba(239,68,68,.07)'};border:1px solid ${p=>p.$ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.18)'};border-radius:12px;font-size:13px;font-weight:500;color:${p=>p.$ok?'#16a34a':'#ef4444'}`;

// ─── Planning Overlay ──────────────────────────────────────────────────────────
const PlanningOverlay = styled.div<{$leaving:boolean}>`
  flex:1;width:100%;min-height:calc(100vh - 76px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:40px;position:relative;overflow:hidden;
  animation:${p=>p.$leaving?css`${fadeOut} .5s cubic-bezier(.4,0,.2,1) forwards`:css`${fadeIn} .4s ease both`};
`;
const PlanningOrbitRing = styled.div<{$size:number;$dur:string;$delay:string;$op:number}>`
  position:absolute;top:50%;left:50%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;
  border:1px solid rgba(139,92,246,${p=>p.$op});margin:-${p=>p.$size/2}px;
  animation:${planSpin} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
const PlanningOrbitDot = styled.div<{$r:number;$dur:string;$delay:string}>`
  --r:${p=>p.$r}px;position:absolute;top:50%;left:50%;
  width:6px;height:6px;margin:-3px;border-radius:50%;
  background:rgba(167,139,250,.9);box-shadow:0 0 10px rgba(139,92,246,.8);
  animation:${orbit} ${p=>p.$dur} linear ${p=>p.$delay} infinite;
`;
const PlanningGlow = styled.div`position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 65%);pointer-events:none;animation:${planPulse} 3s ease-in-out infinite;`;
const PlanningRing = styled.div<{$size:number;$delay:string}>`position:absolute;top:50%;left:50%;width:${p=>p.$size}px;height:${p=>p.$size}px;border-radius:50%;border:1px solid rgba(139,92,246,.3);margin:-${p=>p.$size/2}px;animation:${planRing} 2.4s ease-out ${p=>p.$delay} infinite;`;
const ConstellationWrap = styled.div`position:relative;width:220px;height:160px;`;
const PlanningTitle = styled.div`font-size:22px;font-weight:800;letter-spacing:-.5px;background:linear-gradient(135deg,#a78bfa,#8b5cf6,#6d28d9);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:${shimmer} 3s linear infinite;`;
const PlanningTextWrap = styled.div`position:relative;height:24px;overflow:hidden;width:100%;text-align:center;`;
const PlanningTextLine = styled.div<{$delay:string;$total:number}>`position:absolute;width:100%;font-size:13.5px;font-weight:600;color:${p=>p.theme.colors.muted};letter-spacing:.02em;animation:${planTextC} ${p=>p.$total*2.5}s ease-in-out ${p=>p.$delay} infinite backwards;`;
const PlanningDots = styled.div`display:flex;gap:8px;align-items:center;`;
const PlanningDot = styled.div<{$delay:string}>`width:5px;height:5px;border-radius:50%;background:#8b5cf6;animation:${pulseDot} 1.4s ease-in-out ${p=>p.$delay} infinite;`;
const ProgressBarWrap = styled.div`width:100%;max-width:280px;height:3px;background:rgba(139,92,246,.1);border-radius:999px;overflow:hidden;`;
const ProgressBarFill = styled.div`height:100%;background:linear-gradient(90deg,#a78bfa,#7c3aed);border-radius:999px;animation:${css`@keyframes prog{0%{width:0%}85%{width:82%}100%{width:88%}}prog 18s cubic-bezier(.4,0,.2,1) forwards`};`;

// ─── Ready layout ──────────────────────────────────────────────────────────────
const ReadyWrapper = styled.div`
  width:100%;max-width:780px;position:relative;z-index:1;
  padding-bottom:160px;
  animation:${floatUp} .6s cubic-bezier(.34,1.1,.64,1) .1s both;
`;

// ─── Floating bottom bar (ready state) ────────────────────────────────────────
const FloatingBar = styled.div`
  position:fixed;bottom:0;left:0;right:0;z-index:100;
  display:flex;justify-content:center;padding:16px 24px 24px;
  background:linear-gradient(to top,${p=>p.theme.colors.bg} 60%,transparent);
  animation:${barSlide} .5s cubic-bezier(.4,0,.2,1) .2s both;
`;
const FloatingInner = styled.div`
  width:100%;max-width:700px;
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.18);border-radius:18px;
  box-shadow:0 -4px 40px rgba(139,92,246,.12),0 8px 30px rgba(0,0,0,.25);
  overflow:hidden;
`;
const BarHint = styled.div`
  padding:8px 18px 0;font-size:11px;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;color:rgba(139,92,246,.4);
`;

// ─── Constellation SVG ─────────────────────────────────────────────────────────
const ConstellationSVG: React.FC = () => {
  const nodes = [
    {cx:110,cy:80,r:5,delay:0},{cx:50,cy:50,r:4,delay:.3},{cx:170,cy:55,r:4,delay:.6},
    {cx:40,cy:120,r:3,delay:.9},{cx:185,cy:115,r:3,delay:1.2},{cx:110,cy:140,r:4,delay:1.5},
    {cx:80,cy:100,r:3,delay:.5},{cx:145,cy:95,r:3,delay:.8},
  ];
  const edges = [[0,1],[0,2],[0,6],[0,7],[1,3],[2,4],[0,5],[6,3],[7,4],[5,3],[5,4]];
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" style={{overflow:'visible'}}>
      <defs>
        <radialGradient id="ng2"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient>
        <filter id="gl2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {edges.map(([a,b],i)=>{
        const na=nodes[a],nb=nodes[b],len=Math.hypot(nb.cx-na.cx,nb.cy-na.cy);
        return <line key={i} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
          stroke="rgba(167,139,250,.4)" strokeWidth="1" strokeDasharray={len} strokeDashoffset={len}
          style={{animation:`planLine2 0.6s cubic-bezier(.4,0,.2,1) ${(nodes[a].delay+.2).toFixed(1)}s forwards`}}/>;
      })}
      {nodes.map((n,i)=><circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="url(#ng2)" filter="url(#gl2)"
        style={{opacity:0,animation:`planNode2 0.5s cubic-bezier(.34,1.56,.64,1) ${n.delay}s forwards`}}/>)}
      <style>{`
        @keyframes planNode2{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}
        @keyframes planLine2{from{stroke-dashoffset:var(--len,120);opacity:0}to{stroke-dashoffset:0;opacity:.5}}
      `}</style>
    </svg>
  );
};

// ─── Constants ─────────────────────────────────────────────────────────────────
const PLANNING_MESSAGES = [
  'Analyzing your prompt…','Crafting scene structure…',
  'Planning visual sequences…','Defining music & voice…','Building your vision plan…',
];
const PROMPTS = [
  'A hungry monkey discovering a giant yellow banana in a neon jungle…',
  'A cinematic sunrise over a misty mountain valley, golden hour…',
  'A cyberpunk detective in a dark rainy alleyway…',
  'A lone astronaut floating above Earth, stars reflected…',
  'Time-lapse of a city waking up, neon fading into morning light…',
];
const MAX=1000, TYPE=40, DEL=16, PAUSE=2200;
interface FileAtt { id:string; name:string; }

// ─── Component ─────────────────────────────────────────────────────────────────
const VisionPage: React.FC = () => {
  const { isLoading, isPolling, isUpdating, isExecuting, error:apiError, plan, generatePlan, updatePlan, executePlan } = useVisionPlan();
  const navigate = useNavigate();

  const [prompt,   setPrompt]   = useState('');
  const [focused,  setFocused]  = useState(false);
  const [dragging, setDragging] = useState(false);
  const [files,    setFiles]    = useState<FileAtt[]>([]);
  const [ripple,   setRipple]   = useState<{x:number;y:number}|null>(null);
  const [planLeaving, setPlanLeaving] = useState(false);

  // Typewriter
  const [tw,    setTw]    = useState('');
  const [twIdx, setTwIdx] = useState(0);
  const [twDel, setTwDel] = useState(false);
  const twRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Planning elapsed
  const [planElapsed, setPlanElapsed] = useState(0);
  const planTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const fileRef  = useRef<HTMLInputElement>(null);

  const isBusy  = isLoading || isPolling;
  const isReady = prompt.trim().length > 0;

  // Planning timer
  useEffect(()=>{
    if(isPolling){
      setPlanElapsed(0);
      planTimerRef.current = setInterval(()=>setPlanElapsed(e=>e+1),1000);
    } else {
      if(planTimerRef.current) clearInterval(planTimerRef.current);
    }
    return ()=>{ if(planTimerRef.current) clearInterval(planTimerRef.current); };
  },[isPolling]);

  // Typewriter
  const clearTw = ()=>{ if(twRef.current) clearTimeout(twRef.current); };
  const tick = useCallback(()=>{
    const t=PROMPTS[twIdx];
    if(!twDel){
      if(tw.length<t.length){ setTw(t.slice(0,tw.length+1)); twRef.current=setTimeout(tick,TYPE); }
      else { twRef.current=setTimeout(()=>setTwDel(true),PAUSE); }
    } else {
      if(tw.length>0){ setTw(p=>p.slice(0,-1)); twRef.current=setTimeout(tick,DEL); }
      else { setTwDel(false); setTwIdx(i=>(i+1)%PROMPTS.length); }
    }
  },[tw,twDel,twIdx]);
  useEffect(()=>{ if(prompt){clearTw();return;} clearTw(); twRef.current=setTimeout(tick,TYPE); return clearTw; },[tick,prompt]);

  // Drag & Drop
  const onDragOver  = (e:DragEvent)=>{ e.preventDefault(); setDragging(true); };
  const onDragLeave = (e:DragEvent)=>{ if(!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); };
  const onDrop      = (e:DragEvent)=>{ e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(f=>setFiles(p=>[...p,{id:`${f.name}-${Date.now()}`,name:f.name}]));
  };
  const onFile = (e:ChangeEvent<HTMLInputElement>)=>{
    Array.from(e.target.files||[]).forEach(f=>setFiles(p=>[...p,{id:`${f.name}-${Date.now()}`,name:f.name}]));
    e.target.value='';
  };

  const handleSend = async (e:React.MouseEvent<HTMLButtonElement>)=>{
    if(!isReady||isBusy) return;
    const rect=e.currentTarget.getBoundingClientRect();
    setRipple({x:e.clientX-rect.left,y:e.clientY-rect.top});
    setTimeout(()=>setRipple(null),600);
    await generatePlan(prompt);
  };

  // State logic
  const showPlanning = isBusy;
  const showReady    = !!plan && !isBusy;
  const showIdle     = !plan && !isBusy;

  const promptBox = (
    <PromptBox $drag={dragging} $focus={focused} style={showReady?{marginTop:0}:{marginTop:16}}>
      <DragOverlay $v={dragging}>
        <div style={{color:'#a78bfa',fontSize:32}}>📎</div>
        <div style={{fontSize:'12px',fontWeight:700,letterSpacing:'.06em',color:'#a78bfa',textTransform:'uppercase'}}>Drop images here</div>
      </DragOverlay>
      <TextareaWrap>
        <Placeholder $v={!focused&&!prompt}>
          <TwText>{tw}</TwText><Cursor/>
        </Placeholder>
        <Textarea
          value={prompt}
          onChange={e=>setPrompt(e.target.value.slice(0,MAX))}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          rows={showReady?2:3}
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
      <Toolbar>
        <IconBtn onClick={()=>fileRef.current?.click()} title="Attach image">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </IconBtn>
        <Spacer/>
        {prompt.length>0&&<CharCount $w={prompt.length>MAX*.85}>{prompt.length}/{MAX}</CharCount>}
        <SendBtn $ready={isReady} $loading={isBusy} onClick={handleSend} disabled={!isReady||isBusy}>
          {ripple&&<RippleEl style={{left:ripple.x-5,top:ripple.y-5}}/>}
          {isLoading?<><Spinner/>Sending…</>:isPolling?<><Spinner/>Planning…</>:(
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Generate</>
          )}
        </SendBtn>
      </Toolbar>
    </PromptBox>
  );

  return (
    <VisionContainer onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <BgOrb $s={550} $x="-10%" $y="-18%" $c="rgba(139,92,246,1)" $op={.04}/>
      <BgOrb $s={380} $x="70%"  $y="50%"  $c="rgba(109,40,217,1)" $op={.03} $delay="3s"/>
      <OrbitsWrap>
        <OrbitRing $size={300}/><OrbitRing $size={450}/><OrbitRing $size={600}/>
        <OrbitDot $r={150} $dur="20s" $delay="0s"   $size={5}/>
        <OrbitDot $r={225} $dur="26s" $delay="-5s"  $size={4}/>
        <OrbitDot $r={300} $dur="35s" $delay="-12s" $size={6}/>
        <OrbitDot $r={225} $dur="28s" $delay="-15s" $size={3}/>
      </OrbitsWrap>
      <FloatDot $x="12%" $y="22%" $size={6} $delay="0s"/>
      <FloatDot $x="88%" $y="15%" $size={4} $delay="1.2s"/>
      <FloatDot $x="7%"  $y="65%" $size={5} $delay="2s"/>

      <BackBtn onClick={()=>navigate('/studio')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Studio
      </BackBtn>

      {/* ── IDLE ── */}
      {showIdle && (
        <ContentWrapper>
          <Header>
            <CreatorBadge><BadgeDot>✨</BadgeDot>Vision Creator</CreatorBadge>
            <PageTitle>What will <TitleAccent>Vision</TitleAccent><br/>create for you?</PageTitle>
            <PageSubtitle>Describe your idea — Vision plans every scene.</PageSubtitle>
          </Header>
          {promptBox}
          {apiError&&<Banner $ok={false}>⚠️ {apiError}</Banner>}
        </ContentWrapper>
      )}

      {/* ── PLANNING ── */}
      {showPlanning && (
        <PlanningOverlay $leaving={planLeaving}>
          <PlanningGlow/>
          <PlanningOrbitRing $size={240}  $dur="12s"  $delay="0s"   $op={.10}/>
          <PlanningOrbitRing $size={380}  $dur="20s"  $delay="-3s"  $op={.08}/>
          <PlanningOrbitRing $size={520}  $dur="32s"  $delay="-8s"  $op={.06}/>
          <PlanningOrbitRing $size={660}  $dur="46s"  $delay="-12s" $op={.04}/>
          <PlanningOrbitRing $size={800}  $dur="60s"  $delay="-5s"  $op={.025}/>
          <PlanningOrbitRing $size={940}  $dur="78s"  $delay="-22s" $op={.015}/>
          <PlanningOrbitDot $r={120} $dur="6s"  $delay="0s"/>
          <PlanningOrbitDot $r={120} $dur="9s"  $delay="-3s"/>
          <PlanningOrbitDot $r={190} $dur="10s" $delay="0s"/>
          <PlanningOrbitDot $r={190} $dur="20s" $delay="-10s"/>
          <PlanningOrbitDot $r={260} $dur="14s" $delay="0s"/>
          <PlanningOrbitDot $r={260} $dur="32s" $delay="-16s"/>
          <PlanningOrbitDot $r={330} $dur="8s"  $delay="0s"/>
          <PlanningOrbitDot $r={330} $dur="46s" $delay="-23s"/>
          <PlanningRing $size={90} $delay="0s"/><PlanningRing $size={90} $delay="1.2s"/>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:20,position:'relative',zIndex:1}}>
            <ConstellationWrap><ConstellationSVG/></ConstellationWrap>
            <PlanningTitle>{isLoading?'Sending your vision…':'Building your Vision'}</PlanningTitle>
            <PlanningTextWrap>
              {PLANNING_MESSAGES.map((msg,i)=>(
                <PlanningTextLine key={i} $delay={`${i*2.5}s`} $total={PLANNING_MESSAGES.length}>{msg}</PlanningTextLine>
              ))}
            </PlanningTextWrap>
            <PlanningDots>
              <PlanningDot $delay="0s"/><PlanningDot $delay=".25s"/><PlanningDot $delay=".5s"/>
            </PlanningDots>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,width:'100%',maxWidth:300,position:'relative',zIndex:1}}>
            <ProgressBarWrap><ProgressBarFill/></ProgressBarWrap>
            <span style={{fontSize:11,color:'rgba(139,92,246,.4)',fontWeight:600,letterSpacing:'.04em'}}>
              {isLoading?'CONTACTING SERVER…':`${planElapsed}S ELAPSED`}
            </span>
          </div>
        </PlanningOverlay>
      )}

      {/* ── READY ── */}
      {showReady && plan && (
        <>
          <ReadyWrapper>
            <PlanEditor
              originalPlan={plan}
              onUpdate={updatePlan}
              onExecute={executePlan}
              isUpdating={isUpdating}
              isExecuting={isExecuting}
            />
            {apiError&&(
              <Banner $ok={false} style={{marginTop:12}}>⚠️ {apiError}</Banner>
            )}
          </ReadyWrapper>

          <FloatingBar>
            <FloatingInner>
              <BarHint>Re-generate with a new prompt</BarHint>
              {promptBox}
            </FloatingInner>
          </FloatingBar>
        </>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={onFile}/>
    </VisionContainer>
  );
};

export default VisionPage;