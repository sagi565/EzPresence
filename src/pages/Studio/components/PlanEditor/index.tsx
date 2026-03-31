import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import {
  Wrap, HeaderCard, TopRow, Badges, ReadyBadge, ReadyDot, VersionBadge,
  ChangedDot, TitleInput, MetaRow, EditPill, PillLabel,
  SectionCard, SectionHeader, SectionIcon, SectionTitle, SectionBody,
  EditArea, EditInput, VoiceRow, GenderToggle, GenderBtn,
  ScenesHeader, SceneCount, SceneItem, SceneToggle, SceneNum, SceneToggleTitle, Chevron, SceneBody, SceneFields,
  FieldLabel, DurationRow, DurationInput, DurationUnit,
  ActionsRow, PromptEditBtn, ComingSoonTag, Spacer, StatusText, GenerateBtn, BtnSpinner
} from './styles';

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
