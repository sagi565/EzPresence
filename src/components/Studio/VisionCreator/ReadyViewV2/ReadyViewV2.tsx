import React, { useState, useCallback, useEffect, useRef } from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import { Banner } from '@pages/Studio/VisionPage/styles';
import {
  ConsoleWrapper, TopBar, TopBarTitle, TopBarMeta, VersionBadge, ReadyDot, ChangedDot,
  ReadyPill, SaveBtn, SplitPane,
  Sidebar, SidebarSection, SidebarLabel, NavItem, NavIcon, NavLabel,
  SidebarDivider, SceneCountLabel, SceneTile, SceneTileNum, SceneTileInfo,
  SceneTilePrompt, DurationChip,
  ContentPanel, ContentInner, SectionHeading, HeadingIcon, HeadingText, HeadingSubtext,
  ContentTextarea, FieldLabel, FieldCard, CharCountRow, CharCount,
  VoiceSection, VoiceInput, GenderToggle, GenderBtn,
  SceneTabs, SceneTab, SceneFieldGroup, DurationRow, DurationInput, DurationUnit,
  BottomBar, BottomLeft, StatusText, GenerateBtn, BtnSpinner,
} from './styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scenesToArray(scenes: any): any[] {
  if (!scenes) return [];
  return Array.isArray(scenes) ? scenes : Object.values(scenes);
}

function getSceneLabel(scene: any, idx: number): string {
  const prompt: string = scene.sceneGenerationPrompt || scene.prompt || '';
  const trimmed = prompt.slice(0, 50);
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

// ─── Section metadata ─────────────────────────────────────────────────────────
type SectionId = 'visual' | 'music' | 'voice' | 'scenes';

const SECTION_META: Record<SectionId, { icon: string; label: string; color: string; subtext: string }> = {
  visual: { icon: '🎬', label: 'Visual Style', color: '#9b5de5', subtext: 'Define how the video looks and feels' },
  music:  { icon: '🎵', label: 'Music',         color: '#14b8a6', subtext: 'Guide the music composition and mood' },
  voice:  { icon: '🎤', label: 'Voice',          color: '#ec4899', subtext: 'Configure narration style and gender' },
  scenes: { icon: '🎞',  label: 'Scenes',         color: '#f59e0b', subtext: 'Edit individual scene details' },
};

const CHAR_LIMITS = {
  visual: 600,
  music: 600,
  voiceInstructions: 400,
  sceneVisual: 400,
  scenePrompt: 600,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReadyViewV2Props {
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
const ReadyViewV2: React.FC<ReadyViewV2Props> = ({
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

  const handleSceneTileClick = (idx: number) => {
    setActiveSection('scenes');
    setActiveSceneIdx(idx);
  };

  const scenes = scenesToArray(edited.scenes);
  const safeSceneIdx = Math.min(activeSceneIdx, Math.max(0, scenes.length - 1));
  const activeScene = scenes[safeSceneIdx];

  const navSections: SectionId[] = ['visual', 'music', 'voice'];

  const contentKey = activeSection === 'scenes'
    ? `scenes-${safeSceneIdx}`
    : activeSection;

  const activeMeta = SECTION_META[activeSection];

  return (
    <ConsoleWrapper>
      {/* ── Top Bar ── */}
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
          <SaveBtn onClick={handleSave} disabled={!hasChanges || isBusy}>
            Save
          </SaveBtn>
        </TopBarMeta>
      </TopBar>

      {/* ── Split Pane ── */}
      <SplitPane>
        {/* ── Sidebar ── */}
        <Sidebar>
          <SidebarSection>
            <SidebarLabel>Director</SidebarLabel>
            {navSections.map(id => {
              const meta = SECTION_META[id];
              return (
                <NavItem key={id} $active={activeSection === id} $color={meta.color}
                  onClick={() => setActiveSection(id)}>
                  <NavIcon $active={activeSection === id} $color={meta.color}>{meta.icon}</NavIcon>
                  <NavLabel>{meta.label}</NavLabel>
                </NavItem>
              );
            })}
          </SidebarSection>

          <SidebarDivider />

          <SidebarSection>
            <SceneCountLabel>
              <span>Scenes</span>
              <span>{scenes.length}</span>
            </SceneCountLabel>
            {scenes.map((scene, i) => {
              const isActive = activeSection === 'scenes' && safeSceneIdx === i;
              return (
                <SceneTile key={i} $active={isActive} onClick={() => handleSceneTileClick(i)}>
                  <SceneTileNum $active={isActive}>{i + 1}</SceneTileNum>
                  <SceneTileInfo>
                    <SceneTilePrompt $active={isActive}>
                      {getSceneLabel(scene, i)}
                    </SceneTilePrompt>
                    {scene.sceneDuration && (
                      <DurationChip>{scene.sceneDuration}s</DurationChip>
                    )}
                  </SceneTileInfo>
                </SceneTile>
              );
            })}
          </SidebarSection>
        </Sidebar>

        {/* ── Content Panel ── */}
        <ContentPanel>
          <ContentInner key={contentKey}>

            {/* ── Visual Style ── */}
            {activeSection === 'visual' && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <FieldCard $color={activeMeta.color}>
                  <FieldLabel>Style Description</FieldLabel>
                  <ContentTextarea
                    value={edited.clipVisualStyle || ''}
                    onChange={e => setField('clipVisualStyle', e.target.value)}
                    placeholder="Describe the visual style — colors, mood, cinematography, transitions…"
                    style={{ minHeight: 160 }}
                  />
                  <CharCountRow>
                    <CharCount $warn={(edited.clipVisualStyle?.length || 0) > CHAR_LIMITS.visual * 0.9}>
                      {edited.clipVisualStyle?.length || 0} / {CHAR_LIMITS.visual}
                    </CharCount>
                  </CharCountRow>
                </FieldCard>
              </>
            )}

            {/* ── Music ── */}
            {activeSection === 'music' && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <FieldCard $color={activeMeta.color}>
                  <FieldLabel>Music Direction</FieldLabel>
                  <ContentTextarea
                    value={edited.clipMusicInstructions || ''}
                    onChange={e => setField('clipMusicInstructions', e.target.value)}
                    placeholder="Describe the music direction — tempo, genre, emotional arc…"
                    style={{ minHeight: 160 }}
                  />
                  <CharCountRow>
                    <CharCount $warn={(edited.clipMusicInstructions?.length || 0) > CHAR_LIMITS.music * 0.9}>
                      {edited.clipMusicInstructions?.length || 0} / {CHAR_LIMITS.music}
                    </CharCount>
                  </CharCountRow>
                </FieldCard>
              </>
            )}

            {/* ── Voice ── */}
            {activeSection === 'voice' && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>{activeMeta.label}</HeadingText>
                    <HeadingSubtext>{activeMeta.subtext}</HeadingSubtext>
                  </div>
                </SectionHeading>
                <VoiceSection>
                  <FieldCard $color={activeMeta.color}>
                    <FieldLabel>Direction</FieldLabel>
                    <VoiceInput
                      value={edited.clipVoiceInstructions || ''}
                      onChange={e => setField('clipVoiceInstructions', e.target.value)}
                      placeholder="Voice instructions — tone, pace, energy…"
                    />
                    <CharCountRow>
                      <CharCount $warn={(edited.clipVoiceInstructions?.length || 0) > CHAR_LIMITS.voiceInstructions * 0.9}>
                        {edited.clipVoiceInstructions?.length || 0} / {CHAR_LIMITS.voiceInstructions}
                      </CharCount>
                    </CharCountRow>
                  </FieldCard>
                  <FieldCard $color={activeMeta.color}>
                    <FieldLabel>Gender</FieldLabel>
                    <GenderToggle>
                      {['MALE', 'FEMALE', 'NEUTRAL'].map(g => (
                        <GenderBtn key={g} $active={edited.clipVoiceGender === g}
                          onClick={() => setField('clipVoiceGender', g)}>
                          {g}
                        </GenderBtn>
                      ))}
                    </GenderToggle>
                  </FieldCard>
                </VoiceSection>
              </>
            )}

            {/* ── Scenes ── */}
            {activeSection === 'scenes' && scenes.length > 0 && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={activeMeta.color}>{activeMeta.icon}</HeadingIcon>
                  <div>
                    <HeadingText $color={activeMeta.color}>Scene {safeSceneIdx + 1}</HeadingText>
                    <HeadingSubtext>{getSceneLabel(activeScene, safeSceneIdx)}</HeadingSubtext>
                  </div>
                </SectionHeading>

                <SceneTabs>
                  {scenes.map((_, i) => (
                    <SceneTab key={i} $active={safeSceneIdx === i}
                      onClick={() => setActiveSceneIdx(i)}>
                      {i + 1}
                    </SceneTab>
                  ))}
                </SceneTabs>

                {activeScene && (() => {
                  const isObjOffset = typeof activeScene.sceneOffsetFrame === 'object' && activeScene.sceneOffsetFrame !== null;
                  const visualInstructions = isObjOffset
                    ? activeScene.sceneOffsetFrame?.staticVisualInstructions || ''
                    : typeof activeScene.sceneOffsetFrame === 'string' ? activeScene.sceneOffsetFrame : '';

                  return (
                    <SceneFieldGroup>
                      <FieldCard $color={activeMeta.color}>
                        <FieldLabel>Duration</FieldLabel>
                        <DurationRow>
                          <DurationInput
                            type="number" min={1} max={60}
                            value={activeScene.sceneDuration || ''}
                            onChange={e => setSceneField(safeSceneIdx, 'sceneDuration', Number(e.target.value))}
                          />
                          <DurationUnit>seconds</DurationUnit>
                        </DurationRow>
                      </FieldCard>

                      {(isObjOffset || typeof activeScene.sceneOffsetFrame === 'string') && (
                        <FieldCard $color={activeMeta.color}>
                          <FieldLabel>Visual Setup</FieldLabel>
                          <ContentTextarea
                            value={isObjOffset ? visualInstructions : (activeScene.sceneOffsetFrame || '')}
                            onChange={e => {
                              if (isObjOffset) setSceneOffsetField(safeSceneIdx, 'staticVisualInstructions', e.target.value);
                              else setSceneField(safeSceneIdx, 'sceneOffsetFrame', e.target.value);
                            }}
                            placeholder="Static visual setup for this scene…"
                            style={{ minHeight: 100 }}
                          />
                          <CharCountRow>
                            <CharCount $warn={visualInstructions.length > CHAR_LIMITS.sceneVisual * 0.9}>
                              {visualInstructions.length} / {CHAR_LIMITS.sceneVisual}
                            </CharCount>
                          </CharCountRow>
                        </FieldCard>
                      )}

                      <FieldCard $color={activeMeta.color}>
                        <FieldLabel>Generation Prompt</FieldLabel>
                        <ContentTextarea
                          value={activeScene.sceneGenerationPrompt || ''}
                          onChange={e => setSceneField(safeSceneIdx, 'sceneGenerationPrompt', e.target.value)}
                          placeholder="Describe what happens in this scene…"
                          style={{ minHeight: 140 }}
                        />
                        <CharCountRow>
                          <CharCount $warn={(activeScene.sceneGenerationPrompt?.length || 0) > CHAR_LIMITS.scenePrompt * 0.9}>
                            {activeScene.sceneGenerationPrompt?.length || 0} / {CHAR_LIMITS.scenePrompt}
                          </CharCount>
                        </CharCountRow>
                      </FieldCard>
                    </SceneFieldGroup>
                  );
                })()}
              </>
            )}

          </ContentInner>
        </ContentPanel>
      </SplitPane>

      {/* ── Bottom Bar ── */}
      <BottomBar>
        <BottomLeft>{promptBoxSlot}</BottomLeft>
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
      </BottomBar>

      {apiError && (
        <Banner $ok={false} style={{ margin: '0 20px 12px', borderRadius: 12 }}>
          ⚠️ {apiError}
        </Banner>
      )}
    </ConsoleWrapper>
  );
};

export default ReadyViewV2;
