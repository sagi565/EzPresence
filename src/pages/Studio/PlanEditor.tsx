import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { VisionPlan } from '@hooks/useVisionPlan';

// ─── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}`;
const shimmer = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const slideInScene = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;

// ─── Layout ────────────────────────────────────────────────────────────────────
const Wrap = styled.div`
  width:100%;max-width:760px;
  display:flex;flex-direction:column;gap:16px;
  animation:${fadeUp} .55s cubic-bezier(.4,0,.2,1) both;
`;

// ─── Header card ───────────────────────────────────────────────────────────────
const HeaderCard = styled.div`
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.14);
  border-radius:20px;padding:24px 26px 20px;
  display:flex;flex-direction:column;gap:12px;
`;
const TopRow = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:12px;`;
const Badges = styled.div`display:flex;align-items:center;gap:8px;flex-wrap:wrap;`;
const ReadyDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#22c55e;
  box-shadow:0 0 8px #22c55e;animation:${pulse} 1.6s ease-in-out infinite;
`;
const ReadyBadge = styled.div`
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 11px;border-radius:999px;
  background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.18);
  font-size:11px;font-weight:700;color:#16a34a;letter-spacing:.06em;text-transform:uppercase;
`;
const VersionBadge = styled.div`
  padding:4px 11px;border-radius:999px;
  background:rgba(139,92,246,.07);border:1px solid rgba(139,92,246,.15);
  font-size:11px;font-weight:700;color:rgba(139,92,246,.6);letter-spacing:.05em;
`;
const ChangedDot = styled.div`
  width:7px;height:7px;border-radius:50%;background:#f59e0b;
  box-shadow:0 0 7px #f59e0b;animation:${pulse} 1.2s ease-in-out infinite;
`;
const TitleInput = styled.input`
  width:100%;background:transparent;border:none;outline:none;
  font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-1px;
  color:${p=>p.theme.colors.text};font-family:inherit;padding:0;
  caret-color:#8b5cf6;
  &::placeholder{color:${p=>p.theme.colors.muted};opacity:.35;}
  &:focus{border-bottom:2px solid rgba(139,92,246,.25);}
  transition:border-bottom .15s;
`;
const MetaRow = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;
const EditPill = styled.div<{$active?:boolean}>`
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 12px;border-radius:8px;cursor:pointer;
  border:1.5px solid ${p=>p.$active?'rgba(139,92,246,.4)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(139,92,246,.1)':'transparent'};
  font-size:12px;font-weight:700;color:${p=>p.theme.colors.muted};
  transition:all .18s;
  &:hover{border-color:rgba(139,92,246,.35);background:rgba(139,92,246,.07);}
`;
const PillLabel = styled.span`opacity:.55;font-size:10px;margin-right:2px;`;

// ─── Section card ───────────────────────────────────────────────────────────────
const SectionCard = styled.div<{$delay?:string}>`
  background:${p=>p.theme.colors.surface};
  border:1.5px solid rgba(139,92,246,.1);
  border-radius:16px;overflow:hidden;
  animation:${fadeUp} .55s cubic-bezier(.4,0,.2,1) ${p=>p.$delay||'0s'} both;
`;
const SectionHeader = styled.div`
  display:flex;align-items:center;gap:10px;
  padding:14px 18px;
  border-bottom:1px solid rgba(139,92,246,.07);
`;
const SectionIcon = styled.div`
  width:32px;height:32px;border-radius:9px;flex-shrink:0;
  background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(109,40,217,.1));
  border:1px solid rgba(139,92,246,.15);
  display:flex;align-items:center;justify-content:center;font-size:15px;
`;
const SectionTitle = styled.div`
  font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  color:${p=>p.theme.colors.muted};
`;
const SectionBody = styled.div`padding:14px 18px 16px;`;
const EditArea = styled.textarea`
  width:100%;min-height:80px;background:rgba(139,92,246,.03);
  border:1.5px solid rgba(139,92,246,.09);border-radius:10px;
  outline:none;resize:vertical;padding:12px 14px;
  font-size:13px;line-height:1.65;color:${p=>p.theme.colors.text};
  font-family:inherit;box-sizing:border-box;caret-color:#8b5cf6;
  transition:border-color .18s,box-shadow .18s;
  &:focus{border-color:rgba(139,92,246,.35);box-shadow:0 0 0 3px rgba(139,92,246,.06);}
  scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.15) transparent;
`;
const EditInput = styled.input`
  width:100%;background:rgba(139,92,246,.03);
  border:1.5px solid rgba(139,92,246,.09);border-radius:10px;
  outline:none;padding:10px 14px;
  font-size:13px;color:${p=>p.theme.colors.text};
  font-family:inherit;box-sizing:border-box;caret-color:#8b5cf6;
  transition:border-color .18s;
  &:focus{border-color:rgba(139,92,246,.35);}
`;
const VoiceRow = styled.div`display:flex;gap:10px;align-items:flex-end;`;
const GenderToggle = styled.div`display:flex;gap:6px;`;
const GenderBtn = styled.button<{$active:boolean}>`
  padding:9px 16px;border-radius:8px;border:1.5px solid;
  font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;
  transition:all .18s;
  border-color:${p=>p.$active?'rgba(139,92,246,.45)':'rgba(139,92,246,.1)'};
  background:${p=>p.$active?'rgba(139,92,246,.12)':'transparent'};
  color:${p=>p.$active?'#a78bfa':p.theme.colors.muted};
  &:hover{border-color:rgba(139,92,246,.3);background:rgba(139,92,246,.07);}
`;

// ─── Scenes ────────────────────────────────────────────────────────────────────
const ScenesHeader = styled.div`
  padding:14px 18px;border-bottom:1px solid rgba(139,92,246,.07);
  display:flex;align-items:center;justify-content:space-between;
`;
const SceneCount = styled.div`
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  color:rgba(139,92,246,.6);background:rgba(139,92,246,.07);
  padding:3px 10px;border-radius:6px;
`;
const SceneItem = styled.div<{$open:boolean;$i:number}>`
  border-bottom:1px solid rgba(139,92,246,.06);
  animation:${slideInScene} .4s cubic-bezier(.4,0,.2,1) ${p=>p.$i*0.06}s both;
  &:last-child{border-bottom:none;}
`;
const SceneToggle = styled.button<{$open:boolean}>`
  width:100%;display:flex;align-items:center;gap:12px;
  padding:13px 18px;background:none;border:none;cursor:pointer;text-align:left;
  transition:background .15s;
  &:hover{background:rgba(139,92,246,.04);}
`;
const SceneNum = styled.div`
  width:26px;height:26px;border-radius:8px;flex-shrink:0;
  background:linear-gradient(135deg,#a78bfa,#7c3aed);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;color:white;
`;
const SceneToggleTitle = styled.div`
  flex:1;font-size:13px;font-weight:600;color:${p=>p.theme.colors.text};
  text-align:left;line-height:1.4;
`;
const Chevron = styled.div<{$open:boolean}>`
  color:rgba(139,92,246,.4);font-size:14px;
  transform:${p=>p.$open?'rotate(180deg)':'rotate(0deg)'};
  transition:transform .22s;flex-shrink:0;
`;
const SceneBody = styled.div<{$open:boolean}>`
  max-height:${p=>p.$open?'1200px':'0'};
  overflow:hidden;
  transition:max-height .35s cubic-bezier(.4,0,.2,1);
`;
const SceneFields = styled.div`padding:4px 18px 18px;display:flex;flex-direction:column;gap:12px;`;
const FieldLabel = styled.div`
  font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  color:rgba(139,92,246,.55);margin-bottom:5px;
`;
const DurationRow = styled.div`display:flex;align-items:center;gap:10px;`;
const DurationInput = styled.input`
  width:80px;padding:8px 12px;border-radius:8px;
  border:1.5px solid rgba(139,92,246,.12);background:rgba(139,92,246,.04);
  color:${p=>p.theme.colors.text};font-size:13px;font-weight:700;
  font-family:inherit;outline:none;text-align:center;
  &:focus{border-color:rgba(139,92,246,.35);}
`;
const DurationUnit = styled.span`font-size:12px;color:${p=>p.theme.colors.muted};`;

// ─── Actions ───────────────────────────────────────────────────────────────────
const ActionsRow = styled.div`
  display:flex;align-items:center;gap:10px;
  padding:16px 18px;border-top:1px solid rgba(139,92,246,.08);
  background:rgba(139,92,246,.02);
`;
const PromptEditBtn = styled.button`
  display:inline-flex;align-items:center;gap:7px;
  padding:10px 16px;border-radius:11px;cursor:not-allowed;
  border:1.5px solid rgba(139,92,246,.12);background:transparent;
  font-size:13px;font-weight:600;color:${p=>p.theme.colors.muted};
  font-family:inherit;opacity:.5;
  position:relative;
`;
const ComingSoonTag = styled.span`
  position:absolute;top:-8px;right:-4px;
  background:linear-gradient(135deg,#f59e0b,#d97706);
  color:white;font-size:9px;font-weight:800;letter-spacing:.05em;
  padding:2px 6px;border-radius:4px;text-transform:uppercase;white-space:nowrap;
`;
const Spacer = styled.div`flex:1;`;
const StatusText = styled.div`font-size:12px;color:rgba(139,92,246,.55);font-weight:600;`;
const GenerateBtn = styled.button<{$loading:boolean;$hasChanges:boolean}>`
  display:inline-flex;align-items:center;gap:8px;
  padding:11px 22px;border-radius:12px;border:none;cursor:pointer;
  font-size:13.5px;font-weight:700;font-family:inherit;
  background:${p=>p.$hasChanges
    ?'linear-gradient(135deg,#f59e0b,#d97706)'
    :'linear-gradient(135deg,#a78bfa,#7c3aed)'};
  color:white;transition:all .22s cubic-bezier(.4,0,.2,1);
  box-shadow:${p=>p.$hasChanges
    ?'0 4px 18px rgba(245,158,11,.35)'
    :'0 4px 18px rgba(124,58,237,.35)'};
  opacity:${p=>p.$loading?.7:1};
  &:hover:not(:disabled){transform:translateY(-2px);
    box-shadow:${p=>p.$hasChanges
      ?'0 7px 24px rgba(245,158,11,.48)'
      :'0 7px 24px rgba(124,58,237,.48)'};}
  &:active{transform:translateY(0);}
`;
const BtnSpinner = styled.div`
  width:13px;height:13px;border:2px solid rgba(255,255,255,.3);
  border-top-color:white;border-radius:50%;animation:${spin} .65s linear infinite;
`;

// ─── Helpers ───────────────────────────────────────────────────────────────────
function scenesToArray(scenes: any): any[] {
  if (!scenes) return [];
  return Array.isArray(scenes) ? scenes : Object.values(scenes);
}

function getSceneLabel(scene: any, idx: number): string {
  const prompt: string = scene.sceneGenerationPrompt || scene.prompt || '';
  const trimmed = prompt.slice(0, 60);
  return trimmed ? (trimmed.length < prompt.length ? trimmed + '…' : trimmed) : `Scene ${idx + 1}`;
}

function buildDiff(original: VisionPlan, edited: VisionPlan): Record<string, any> | null {
  const keys: (keyof VisionPlan)[] = [
    'clipTitle', 'planType', 'category', 'clipVisualStyle',
    'clipMusicInstructions', 'clipVoiceInstructions', 'clipVoiceGender',
    'includeAudioInVideoGeneration', 'scenes',
  ];
  const diff: Record<string, any> = {};
  for (const k of keys) {
    const origVal = JSON.stringify(original[k] ?? null);
    const editVal = JSON.stringify(edited[k] ?? null);
    if (origVal !== editVal) diff[k] = edited[k];
  }
  return Object.keys(diff).length > 0 ? diff : null;
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface Props {
  originalPlan: VisionPlan;
  onUpdate: (uuid: string, props: Record<string, any>) => Promise<boolean>;
  onExecute: (uuid: string, version?: number) => Promise<boolean>;
  isUpdating: boolean;
  isExecuting: boolean;
}

const PlanEditor: React.FC<Props> = ({ originalPlan, onUpdate, onExecute, isUpdating, isExecuting }) => {
  const [edited, setEdited] = useState<VisionPlan>(() => JSON.parse(JSON.stringify(originalPlan)));
  const [expandedScenes, setExpandedScenes] = useState<Set<number>>(new Set([0]));
  const [status, setStatus] = useState<string>('');
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEdited(JSON.parse(JSON.stringify(originalPlan)));
    setExpandedScenes(new Set([0]));
  }, [originalPlan]);

  const setField = useCallback((key: keyof VisionPlan, val: any) => {
    setEdited(p => ({ ...p, [key]: val }));
  }, []);

  const setSceneField = useCallback((idx: number, field: string, val: any) => {
    setEdited(p => {
      const arr = scenesToArray(p.scenes).map((s, i) => i === idx ? { ...s, [field]: val } : s);
      return { ...p, scenes: arr };
    });
  }, []);

  const setSceneOffsetField = useCallback((idx: number, field: string, val: any) => {
    setEdited(p => {
      const arr = scenesToArray(p.scenes).map((s, i) => {
        if (i !== idx) return s;
        const off = typeof s.sceneOffsetFrame === 'object' && s.sceneOffsetFrame !== null
          ? s.sceneOffsetFrame : {};
        return { ...s, sceneOffsetFrame: { ...off, [field]: val } };
      });
      return { ...p, scenes: arr };
    });
  }, []);

  const showStatus = (msg: string) => {
    setStatus(msg);
    if (statusRef.current) clearTimeout(statusRef.current);
    statusRef.current = setTimeout(() => setStatus(''), 3500);
  };

  const diff = buildDiff(originalPlan, edited);
  const hasChanges = diff !== null;
  const isBusy = isUpdating || isExecuting;

  const handleGenerate = async () => {
    if (isBusy) return;
    if (hasChanges && diff) {
      showStatus('Saving changes…');
      const ok = await onUpdate(originalPlan.planUuid, diff);
      if (!ok) return;
    }
    showStatus('Executing plan…');
    await onExecute(originalPlan.planUuid, originalPlan.version);
  };

  const toggleScene = (i: number) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const scenes = scenesToArray(edited.scenes);
  const planTypes = ['NARRATED', 'SPEECHLESS'];
  const genders = ['MALE', 'FEMALE', 'NEUTRAL'];

  return (
    <Wrap>
      {/* ── Header ── */}
      <HeaderCard>
        <TopRow>
          <Badges>
            <ReadyBadge><ReadyDot />Plan Ready</ReadyBadge>
            <VersionBadge>v{originalPlan.version || 1}</VersionBadge>
            {hasChanges && <ReadyBadge style={{background:'rgba(245,158,11,.07)',border:'1px solid rgba(245,158,11,.2)',color:'#b45309'}}>
              <ChangedDot />Edited
            </ReadyBadge>}
          </Badges>
        </TopRow>
        <TitleInput
          value={edited.clipTitle || ''}
          onChange={e => setField('clipTitle', e.target.value)}
          placeholder="Untitled Vision"
        />
        <MetaRow>
          {planTypes.map(t => (
            <EditPill key={t} $active={edited.planType === t} onClick={() => setField('planType', t)}>
              <PillLabel>Type</PillLabel>{t}
            </EditPill>
          ))}
          <EditPill $active={!!edited.category}>
            <PillLabel>Category</PillLabel>
            <input
              value={edited.category || ''}
              onChange={e => setField('category', e.target.value)}
              placeholder="Hypnotic…"
              style={{background:'transparent',border:'none',outline:'none',
                color:'inherit',font:'inherit',width:90,fontSize:12}}
            />
          </EditPill>
          <EditPill
            $active={!!edited.includeAudioInVideoGeneration}
            onClick={() => setField('includeAudioInVideoGeneration', !edited.includeAudioInVideoGeneration)}
          >
            {edited.includeAudioInVideoGeneration ? '🔊' : '🔇'} Audio
          </EditPill>
        </MetaRow>
      </HeaderCard>

      {/* ── Visual Style ── */}
      <SectionCard $delay=".05s">
        <SectionHeader>
          <SectionIcon>🎬</SectionIcon>
          <SectionTitle>Visual Style</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <EditArea
            value={edited.clipVisualStyle || ''}
            onChange={e => setField('clipVisualStyle', e.target.value)}
            placeholder="Describe the visual style…"
            style={{minHeight:88}}
          />
        </SectionBody>
      </SectionCard>

      {/* ── Music ── */}
      <SectionCard $delay=".1s">
        <SectionHeader>
          <SectionIcon>🎵</SectionIcon>
          <SectionTitle>Music Instructions</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <EditArea
            value={edited.clipMusicInstructions || ''}
            onChange={e => setField('clipMusicInstructions', e.target.value)}
            placeholder="Describe the music direction…"
            style={{minHeight:96}}
          />
        </SectionBody>
      </SectionCard>

      {/* ── Voice ── */}
      <SectionCard $delay=".15s">
        <SectionHeader>
          <SectionIcon>🎤</SectionIcon>
          <SectionTitle>Voice</SectionTitle>
        </SectionHeader>
        <SectionBody style={{display:'flex',flexDirection:'column',gap:12}}>
          <VoiceRow>
            <div style={{flex:1}}>
              <FieldLabel>Direction</FieldLabel>
              <EditInput
                value={edited.clipVoiceInstructions || ''}
                onChange={e => setField('clipVoiceInstructions', e.target.value)}
                placeholder="Voice instructions…"
              />
            </div>
          </VoiceRow>
          <div>
            <FieldLabel>Gender</FieldLabel>
            <GenderToggle>
              {genders.map(g => (
                <GenderBtn key={g} $active={edited.clipVoiceGender === g}
                  onClick={() => setField('clipVoiceGender', g)}>
                  {g}
                </GenderBtn>
              ))}
            </GenderToggle>
          </div>
        </SectionBody>
      </SectionCard>

      {/* ── Scenes ── */}
      <SectionCard $delay=".2s">
        <ScenesHeader>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <SectionIcon>🎞</SectionIcon>
            <SectionTitle>Scenes</SectionTitle>
          </div>
          <SceneCount>{scenes.length} Scene{scenes.length !== 1 ? 's' : ''}</SceneCount>
        </ScenesHeader>

        {scenes.map((scene, i) => {
          const open = expandedScenes.has(i);
          const isObjOffset = typeof scene.sceneOffsetFrame === 'object' && scene.sceneOffsetFrame !== null;
          const visualInstructions = isObjOffset
            ? scene.sceneOffsetFrame?.staticVisualInstructions || ''
            : typeof scene.sceneOffsetFrame === 'string' ? scene.sceneOffsetFrame : '';

          return (
            <SceneItem key={i} $open={open} $i={i}>
              <SceneToggle $open={open} onClick={() => toggleScene(i)}>
                <SceneNum>{i + 1}</SceneNum>
                <SceneToggleTitle>{getSceneLabel(scene, i)}</SceneToggleTitle>
                <Chevron $open={open}>▼</Chevron>
              </SceneToggle>
              <SceneBody $open={open}>
                <SceneFields>
                  <div>
                    <FieldLabel>Scene Duration (seconds)</FieldLabel>
                    <DurationRow>
                      <DurationInput
                        type="number" min={1} max={60}
                        value={scene.sceneDuration || ''}
                        onChange={e => setSceneField(i, 'sceneDuration', Number(e.target.value))}
                      />
                      <DurationUnit>sec</DurationUnit>
                    </DurationRow>
                  </div>
                  {(isObjOffset || typeof scene.sceneOffsetFrame === 'string') && (
                    <div>
                      <FieldLabel>Visual Setup</FieldLabel>
                      <EditArea
                        value={isObjOffset ? visualInstructions : (scene.sceneOffsetFrame || '')}
                        onChange={e => {
                          if (isObjOffset) setSceneOffsetField(i, 'staticVisualInstructions', e.target.value);
                          else setSceneField(i, 'sceneOffsetFrame', e.target.value);
                        }}
                        placeholder="Static visual setup for this scene…"
                        style={{minHeight:80}}
                      />
                    </div>
                  )}
                  <div>
                    <FieldLabel>Generation Prompt</FieldLabel>
                    <EditArea
                      value={scene.sceneGenerationPrompt || ''}
                      onChange={e => setSceneField(i, 'sceneGenerationPrompt', e.target.value)}
                      placeholder="Describe what happens in this scene…"
                      style={{minHeight:100}}
                    />
                  </div>
                </SceneFields>
              </SceneBody>
            </SceneItem>
          );
        })}

        {/* ── Actions row ── */}
        <ActionsRow>
          <PromptEditBtn disabled title="Coming soon">
            <ComingSoonTag>Soon</ComingSoonTag>
            ✨ Edit with Prompt
          </PromptEditBtn>
          <Spacer />
          {status && <StatusText>{status}</StatusText>}
          <GenerateBtn
            $loading={isBusy}
            $hasChanges={hasChanges}
            onClick={handleGenerate}
            disabled={isBusy}
          >
            {isBusy ? <BtnSpinner /> : hasChanges ? '💾' : '▶'}
            {isUpdating ? 'Saving…' : isExecuting ? 'Generating…' : hasChanges ? 'Save & Generate' : 'Generate Video'}
          </GenerateBtn>
        </ActionsRow>
      </SectionCard>
    </Wrap>
  );
};

export default PlanEditor;
