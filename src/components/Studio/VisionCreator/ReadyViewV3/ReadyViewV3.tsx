import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import { Banner } from '@pages/Studio/VisionPage/styles';
import {
  StageWrapper, AmbientLayer,
  TopBar, TopBarTitle, TopBarMeta, VersionBadge, ReadyDot, ChangedDot, ReadyPill, SaveBtn,
  TabsBar, SectionTab, TabRow, TabEmoji, TabInfo, TabName, TabPreview, TabBadge, TabProgressBar,
  StageArea, SectionPane,
  SectionHeroRow, HeroEmoji, HeroTextGroup, SectionTitle, SectionSubtext, CharArcWrap,
  TextFieldWrap, BigTextarea, FieldFooter, CharLabel,
  GenderRow, GenderLabel, GenderBtn,
  ScenesPane, FilmStripHeader, FilmStripTitle, FilmStripCount,
  FilmStrip, SceneCard, SceneCardNum, SceneCardSnippet, SceneDurChip,
  SceneDetailWrap, SceneDetailGrid, SceneFieldBlock, InlineLabel,
  DurInput, DurUnit, SceneTextarea, SceneCharRow, SceneCharLabel,
  BottomBar, BottomLeft, StatusText, GenerateBtn, BtnSpinner,
} from './styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
    if (JSON.stringify(original[k] ?? null) !== JSON.stringify(edited[k] ?? null)) {
      diff[k] = edited[k];
    }
  }
  return Object.keys(diff).length > 0 ? diff : null;
}

// ─── Circular char-arc SVG ────────────────────────────────────────────────────
const CharArc: React.FC<{ current: number; max: number; color: string }> = ({ current, max, color }) => {
  const ratio = Math.min(current / max, 1);
  const r = 16;
  const circ = 2 * Math.PI * r;
  const warn = ratio > 0.9;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'block' }}>
      <circle cx="20" cy="20" r={r} fill="none"
        stroke="currentColor" strokeOpacity=".1" strokeWidth="2.5" />
      <circle cx="20" cy="20" r={r} fill="none"
        stroke={warn ? '#f59e0b' : color}
        strokeWidth="2.5"
        strokeDasharray={`${circ * ratio} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray .35s, stroke .3s' }} />
      {ratio > 0.05 && (
        <text x="20" y="24" textAnchor="middle"
          fontSize="7.5" fontWeight="800" fill={warn ? '#f59e0b' : color} opacity=".85">
          {Math.round(ratio * 100)}%
        </text>
      )}
    </svg>
  );
};

// ─── Section metadata ─────────────────────────────────────────────────────────
type SectionId = 'visual' | 'music' | 'voice' | 'scenes';

const SECTION_META: Record<SectionId, { icon: string; label: string; color: string; subtext: string; placeholder: string }> = {
  visual: {
    icon: '🎬', label: 'Visual Style', color: '#9b5de5',
    subtext: 'Define how the video looks and feels',
    placeholder: 'Paint the picture — describe colors, cinematic mood, lighting, movement, transitions…',
  },
  music: {
    icon: '🎵', label: 'Music', color: '#14b8a6',
    subtext: 'Guide the music composition and mood',
    placeholder: 'Set the tempo — genre, instruments, energy, emotional arc as the story unfolds…',
  },
  voice: {
    icon: '🎤', label: 'Voice', color: '#ec4899',
    subtext: 'Configure narration style and character',
    placeholder: 'Find the voice — tone, pace, warmth, authority, how it makes the listener feel…',
  },
  scenes: {
    icon: '🎞', label: 'Scenes', color: '#f59e0b',
    subtext: 'Edit individual scene details',
    placeholder: '',
  },
};

const CHAR_LIMITS = { visual: 600, music: 600, voice: 400, sceneVisual: 400, scenePrompt: 600 };
const SECTIONS: SectionId[] = ['visual', 'music', 'voice', 'scenes'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReadyViewV3Props {
  plan: VisionPlan;
  updatePlan: (uuid: string, props: Record<string, any>) => Promise<boolean>;
  executePlan: (uuid: string, version?: number) => Promise<boolean>;
  isUpdating: boolean;
  isExecuting: boolean;
  apiError: string | null;
  promptBoxSlot: React.ReactNode;
  onRequestDelete: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const ReadyViewV3: React.FC<ReadyViewV3Props> = ({
  plan, updatePlan, executePlan, isUpdating, isExecuting, apiError, promptBoxSlot,
}) => {
  const [edited, setEdited] = useState<VisionPlan>(() => JSON.parse(JSON.stringify(plan)));
  const [activeSection, setActiveSection] = useState<SectionId>('visual');
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [status, setStatus] = useState('');
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEdited(JSON.parse(JSON.stringify(plan)));
    setActiveSceneIdx(0);
  }, [plan]);

  const showStatus = (msg: string) => {
    setStatus(msg);
    if (statusRef.current) clearTimeout(statusRef.current);
    statusRef.current = setTimeout(() => setStatus(''), 3500);
  };

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

  const diff = buildDiff(plan, edited);
  const hasChanges = diff !== null;
  const isBusy = isUpdating || isExecuting;

  const handleSave = async () => {
    if (!hasChanges || isBusy || !diff) return;
    showStatus('Saving…');
    const ok = await updatePlan(plan.planUuid, diff);
    if (ok) showStatus('Saved.');
  };

  const handleGenerate = async () => {
    if (isBusy) return;
    if (hasChanges && diff) {
      showStatus('Saving changes…');
      const ok = await updatePlan(plan.planUuid, diff);
      if (!ok) return;
    }
    showStatus('Executing plan…');
    await executePlan(plan.planUuid, plan.version);
  };

  const scenes = scenesToArray(edited.scenes);
  const safeSceneIdx = Math.min(activeSceneIdx, Math.max(0, scenes.length - 1));
  const activeScene = scenes[safeSceneIdx];
  const activeMeta = SECTION_META[activeSection];

  // ── Tab progress values ────────────────────────────────────────────────────
  const tabProgress: Record<SectionId, number> = {
    visual: (edited.clipVisualStyle?.length || 0) / CHAR_LIMITS.visual,
    music:  (edited.clipMusicInstructions?.length || 0) / CHAR_LIMITS.music,
    voice:  (edited.clipVoiceInstructions?.length || 0) / CHAR_LIMITS.voice,
    scenes: scenes.length > 0 ? 1 : 0,
  };

  // ── Tab preview text ───────────────────────────────────────────────────────
  const tabPreview: Record<SectionId, string> = {
    visual: edited.clipVisualStyle?.slice(0, 36) || 'Not set',
    music:  edited.clipMusicInstructions?.slice(0, 36) || 'Not set',
    voice:  edited.clipVoiceInstructions?.slice(0, 36) || 'Not set',
    scenes: scenes.length > 0 ? `${scenes.length} scene${scenes.length !== 1 ? 's' : ''}` : 'No scenes',
  };

  // ── Scene detail helpers ───────────────────────────────────────────────────
  const isObjOffset = activeScene && typeof activeScene.sceneOffsetFrame === 'object' && activeScene.sceneOffsetFrame !== null;
  const visualInstructions = isObjOffset
    ? (activeScene?.sceneOffsetFrame?.staticVisualInstructions || '')
    : (typeof activeScene?.sceneOffsetFrame === 'string' ? activeScene.sceneOffsetFrame : '');

  return (
    <StageWrapper>

      {/* ── Ambient colour layers ─────────────────────────────────────────── */}
      <AmbientLayer $color="#9b5de5" $visible={activeSection === 'visual'} />
      <AmbientLayer $color="#14b8a6" $visible={activeSection === 'music'} />
      <AmbientLayer $color="#ec4899" $visible={activeSection === 'voice'} />
      <AmbientLayer $color="#f59e0b" $visible={activeSection === 'scenes'} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <TopBar>
        <TopBarTitle
          value={edited.clipTitle || ''}
          onChange={e => setField('clipTitle', e.target.value)}
          placeholder="Untitled Vision"
        />
        <TopBarMeta>
          <VersionBadge>v{plan.version || 1}</VersionBadge>
          <ReadyPill><ReadyDot />Ready</ReadyPill>
          {hasChanges && (
            <ReadyPill style={{ background: 'rgba(245,158,11,.07)', border: '1px solid rgba(245,158,11,.2)', color: '#b45309' }}>
              <ChangedDot />Edited
            </ReadyPill>
          )}
          <SaveBtn onClick={handleSave} disabled={!hasChanges || isBusy}>Save</SaveBtn>
        </TopBarMeta>
      </TopBar>

      {/* ── Section tabs ─────────────────────────────────────────────────── */}
      <TabsBar>
        {SECTIONS.map(id => {
          const meta = SECTION_META[id];
          const active = activeSection === id;
          return (
            <SectionTab key={id} $active={active} $color={meta.color}
              onClick={() => setActiveSection(id)}>
              <TabRow>
                <TabEmoji $active={active} $color={meta.color}>{meta.icon}</TabEmoji>
                <TabInfo>
                  <TabName $active={active} $color={meta.color}>{meta.label}</TabName>
                  <TabPreview>{tabPreview[id]}</TabPreview>
                </TabInfo>
                {id === 'scenes' && scenes.length > 0 && (
                  <TabBadge $color={meta.color}>{scenes.length}</TabBadge>
                )}
              </TabRow>
              <TabProgressBar
                $pct={tabProgress[id]}
                $color={meta.color}
                $active={active}
              />
            </SectionTab>
          );
        })}
      </TabsBar>

      {/* ── Stage ────────────────────────────────────────────────────────── */}
      <StageArea>

        {/* Visual / Music / Voice ─── */}
        {activeSection !== 'scenes' && (
          <SectionPane key={activeSection}>
            <SectionHeroRow>
              <HeroEmoji $color={activeMeta.color}>{activeMeta.icon}</HeroEmoji>
              <HeroTextGroup>
                <SectionTitle $color={activeMeta.color}>{activeMeta.label}</SectionTitle>
                <SectionSubtext>{activeMeta.subtext}</SectionSubtext>
              </HeroTextGroup>
              <CharArcWrap>
                <CharArc
                  current={
                    activeSection === 'visual' ? (edited.clipVisualStyle?.length || 0) :
                    activeSection === 'music'  ? (edited.clipMusicInstructions?.length || 0) :
                    (edited.clipVoiceInstructions?.length || 0)
                  }
                  max={
                    activeSection === 'visual' ? CHAR_LIMITS.visual :
                    activeSection === 'music'  ? CHAR_LIMITS.music  :
                    CHAR_LIMITS.voice
                  }
                  color={activeMeta.color}
                />
              </CharArcWrap>
            </SectionHeroRow>

            <TextFieldWrap $color={activeMeta.color}>
              {activeSection === 'visual' && (
                <>
                  <BigTextarea
                    value={edited.clipVisualStyle || ''}
                    onChange={e => setField('clipVisualStyle', e.target.value)}
                    placeholder={activeMeta.placeholder}
                  />
                  <FieldFooter>
                    <CharLabel $warn={(edited.clipVisualStyle?.length || 0) > CHAR_LIMITS.visual * 0.9}>
                      {edited.clipVisualStyle?.length || 0} / {CHAR_LIMITS.visual}
                    </CharLabel>
                  </FieldFooter>
                </>
              )}

              {activeSection === 'music' && (
                <>
                  <BigTextarea
                    value={edited.clipMusicInstructions || ''}
                    onChange={e => setField('clipMusicInstructions', e.target.value)}
                    placeholder={activeMeta.placeholder}
                  />
                  <FieldFooter>
                    <CharLabel $warn={(edited.clipMusicInstructions?.length || 0) > CHAR_LIMITS.music * 0.9}>
                      {edited.clipMusicInstructions?.length || 0} / {CHAR_LIMITS.music}
                    </CharLabel>
                  </FieldFooter>
                </>
              )}

              {activeSection === 'voice' && (
                <>
                  <BigTextarea
                    value={edited.clipVoiceInstructions || ''}
                    onChange={e => setField('clipVoiceInstructions', e.target.value)}
                    placeholder={activeMeta.placeholder}
                  />
                  <FieldFooter>
                    <CharLabel $warn={(edited.clipVoiceInstructions?.length || 0) > CHAR_LIMITS.voice * 0.9}>
                      {edited.clipVoiceInstructions?.length || 0} / {CHAR_LIMITS.voice}
                    </CharLabel>
                  </FieldFooter>
                  <GenderRow>
                    <GenderLabel>Gender</GenderLabel>
                    {['MALE', 'FEMALE', 'NEUTRAL'].map(g => (
                      <GenderBtn key={g} $active={edited.clipVoiceGender === g}
                        onClick={() => setField('clipVoiceGender', g)}>
                        {g}
                      </GenderBtn>
                    ))}
                  </GenderRow>
                </>
              )}
            </TextFieldWrap>
          </SectionPane>
        )}

        {/* Scenes ─── */}
        {activeSection === 'scenes' && scenes.length > 0 && (
          <ScenesPane>
            <FilmStripHeader>
              <FilmStripTitle>Scenes</FilmStripTitle>
              <FilmStripCount>{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</FilmStripCount>
            </FilmStripHeader>

            <FilmStrip>
              {scenes.map((scene, i) => {
                const isActive = safeSceneIdx === i;
                return (
                  <SceneCard key={i} $active={isActive}
                    onClick={() => setActiveSceneIdx(i)}
                    style={{ animationDelay: `${i * 0.04}s` }}>
                    <SceneCardNum $active={isActive}>{i + 1}</SceneCardNum>
                    <SceneCardSnippet $active={isActive}>
                      {getSceneLabel(scene, i)}
                    </SceneCardSnippet>
                    {scene.sceneDuration && (
                      <SceneDurChip>{scene.sceneDuration}s</SceneDurChip>
                    )}
                  </SceneCard>
                );
              })}
            </FilmStrip>

            {activeScene && (
              <SceneDetailWrap key={`detail-${safeSceneIdx}`}>
                <SceneDetailGrid>
                  {/* Duration */}
                  <SceneFieldBlock>
                    <InlineLabel>Duration</InlineLabel>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <DurInput
                        type="number" min={1} max={60}
                        value={activeScene.sceneDuration || ''}
                        onChange={e => setSceneField(safeSceneIdx, 'sceneDuration', Number(e.target.value))}
                      />
                      <DurUnit>sec</DurUnit>
                    </div>
                  </SceneFieldBlock>

                  {/* Visual setup */}
                  {(isObjOffset || typeof activeScene.sceneOffsetFrame === 'string') && (
                    <SceneFieldBlock style={{ gridColumn: '1 / -1' }}>
                      <InlineLabel>Visual Setup</InlineLabel>
                      <SceneTextarea
                        value={isObjOffset ? visualInstructions : (activeScene.sceneOffsetFrame || '')}
                        onChange={e => {
                          if (isObjOffset) setSceneOffsetField(safeSceneIdx, 'staticVisualInstructions', e.target.value);
                          else setSceneField(safeSceneIdx, 'sceneOffsetFrame', e.target.value);
                        }}
                        placeholder="Static visual setup for this scene…"
                      />
                      <SceneCharRow>
                        <SceneCharLabel $warn={visualInstructions.length > CHAR_LIMITS.sceneVisual * 0.9}>
                          {visualInstructions.length} / {CHAR_LIMITS.sceneVisual}
                        </SceneCharLabel>
                      </SceneCharRow>
                    </SceneFieldBlock>
                  )}

                  {/* Generation prompt */}
                  <SceneFieldBlock style={{ gridColumn: '1 / -1' }}>
                    <InlineLabel>Generation Prompt</InlineLabel>
                    <SceneTextarea
                      value={activeScene.sceneGenerationPrompt || ''}
                      onChange={e => setSceneField(safeSceneIdx, 'sceneGenerationPrompt', e.target.value)}
                      placeholder="Describe what happens in this scene — action, mood, visuals…"
                      style={{ minHeight: 110 }}
                    />
                    <SceneCharRow>
                      <SceneCharLabel $warn={(activeScene.sceneGenerationPrompt?.length || 0) > CHAR_LIMITS.scenePrompt * 0.9}>
                        {activeScene.sceneGenerationPrompt?.length || 0} / {CHAR_LIMITS.scenePrompt}
                      </SceneCharLabel>
                    </SceneCharRow>
                  </SceneFieldBlock>
                </SceneDetailGrid>
              </SceneDetailWrap>
            )}
          </ScenesPane>
        )}
      </StageArea>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <BottomBar>
        <BottomLeft>{promptBoxSlot}</BottomLeft>
        {status && <StatusText>{status}</StatusText>}
        <GenerateBtn $loading={isBusy} $hasChanges={hasChanges}
          onClick={handleGenerate} disabled={isBusy}>
          {isBusy ? <BtnSpinner /> : hasChanges ? '💾' : '▶'}
          {isUpdating ? 'Saving…' : isExecuting ? 'Generating…' : hasChanges ? 'Save & Generate' : 'Generate Video'}
        </GenerateBtn>
      </BottomBar>

      {apiError && (
        <Banner $ok={false} style={{ margin: '0 20px 12px', borderRadius: 12 }}>
          ⚠️ {apiError}
        </Banner>
      )}
    </StageWrapper>
  );
};

export default ReadyViewV3;
