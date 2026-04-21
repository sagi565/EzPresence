import React, { useState, useEffect, useRef } from 'react';
import { VisionPlan } from '@hooks/useVisionPlan';
import { Banner } from '@pages/Studio/VisionPage/styles';
import {
  ConsoleWrapper, TopBar, TopBarTitle, TopBarMeta, ReadyDot,
  ReadyPill, TypeBadge, CategoryChip, SplitPane,
  Sidebar, SidebarSection, SidebarLabel, NavItem, NavIcon, NavLabel,
  SidebarDivider, SceneCountLabel, SceneTile, SceneTileNum, SceneTileInfo,
  SceneTilePrompt, DurationChip,
  ContentPanel, ContentInner, SectionHeading, HeadingIcon, HeadingText, HeadingSubtext,
  FieldCard, FieldLabel, ReadOnlyText, ReadOnlyPlaceholder,
  VoiceSection, GenderDisplay, GenderBadge, GenderIcon,
  SceneTabs, SceneTab, SceneFieldGroup,
  DurationDisplay, DurationValue, DurationUnit,
  TimelineWrapper, TimelineTrack, TimelineSegment, TimelineDot,
  TimelineSegmentLabel, TimelineSegmentDur, TimelineEndDot, TimelineTotalLabel,
  BottomBar, PromptSlotWrap, StatusText, GenerateBtn, BtnSpinner,
} from './styles';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCENE_COLORS = ['#9b5de5', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scenesToArray(scenes: any): any[] {
  if (!scenes) return [];
  return Array.isArray(scenes) ? scenes : Object.values(scenes);
}

function getSceneLabel(scene: any, idx: number): string {
  const prompt: string = scene.sceneGenerationPrompt || scene.prompt || '';
  const trimmed = prompt.slice(0, 52);
  return trimmed ? (trimmed.length < prompt.length ? trimmed + '…' : trimmed) : `Scene ${idx + 1}`;
}

// ─── Section metadata ─────────────────────────────────────────────────────────
type SectionId = 'visual' | 'music' | 'voice' | 'scenes';

const SECTION_META: Record<SectionId, { icon: string; label: string; color: string; subtext: string }> = {
  visual: { icon: '🎬', label: 'Visual Style', color: '#9b5de5', subtext: 'How the video looks and feels' },
  music:  { icon: '🎵', label: 'Music',         color: '#14b8a6', subtext: 'Music composition and mood' },
  voice:  { icon: '🎤', label: 'Voice',          color: '#ec4899', subtext: 'Narration style and gender' },
  scenes: { icon: '🎞',  label: 'Scenes',         color: '#f59e0b', subtext: 'Individual scene details' },
};

// ─── Timeline Component ───────────────────────────────────────────────────────
interface TimelineProps {
  scenes: any[];
  planType?: string;
  activeIdx: number;
  onSelect: (i: number) => void;
}

const SceneTimeline: React.FC<TimelineProps> = ({ scenes, planType, activeIdx, onSelect }) => {
  const isSpeechless = planType === 'SPEECHLESS';
  const durations = scenes.map(s => isSpeechless ? (s.sceneDuration || 6) : 1);
  const total = durations.reduce((a, b) => a + b, 0) || 1;
  const totalSecs = isSpeechless ? total : null;

  return (
    <TimelineWrapper>
      <TimelineTrack>
        {scenes.map((_, i) => {
          const color = SCENE_COLORS[i % SCENE_COLORS.length];
          const isActive = activeIdx === i;
          return (
            <TimelineSegment
              key={i}
              style={{ flex: durations[i] / total }}
              $color={color}
              $active={isActive}
              onClick={() => onSelect(i)}
              title={`Scene ${i + 1}${isSpeechless ? ` · ${durations[i]}s` : ''}`}
            >
              <TimelineDot $color={color} $active={isActive} />
              <TimelineSegmentLabel $active={isActive}>
                {i + 1}
                {isSpeechless && <TimelineSegmentDur>{durations[i]}s</TimelineSegmentDur>}
              </TimelineSegmentLabel>
            </TimelineSegment>
          );
        })}
        <TimelineEndDot
          $color={SCENE_COLORS[(scenes.length - 1) % SCENE_COLORS.length] || '#9b5de5'}
        />
      </TimelineTrack>
      {totalSecs !== null && (
        <TimelineTotalLabel>{totalSecs}s total</TimelineTotalLabel>
      )}
    </TimelineWrapper>
  );
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
  plan, executePlan, isExecuting, apiError, promptBoxSlot,
}) => {
  const isSpeechless = plan.planType === 'SPEECHLESS';

  const [activeSection, setActiveSection] = useState<SectionId>('visual');
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [status, setStatus] = useState('');
  const statusRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setActiveSceneIdx(0);
    if (isSpeechless && activeSection === 'voice') {
      setActiveSection('visual');
    }
  }, [plan.planUuid]);

  const showStatus = (msg: string) => {
    setStatus(msg);
    if (statusRef.current) clearTimeout(statusRef.current);
    statusRef.current = setTimeout(() => setStatus(''), 3500);
  };

  const handleGenerate = async () => {
    if (isExecuting) return;
    showStatus('Executing plan…');
    await executePlan(plan.planUuid, plan.version);
  };

  const handleSceneTileClick = (idx: number) => {
    setActiveSection('scenes');
    setActiveSceneIdx(idx);
  };

  const handleTimelineSelect = (idx: number) => {
    setActiveSection('scenes');
    setActiveSceneIdx(idx);
  };

  const scenes = scenesToArray(plan.scenes);
  const safeSceneIdx = Math.min(activeSceneIdx, Math.max(0, scenes.length - 1));
  const activeScene = scenes[safeSceneIdx];

  const navSections: SectionId[] = isSpeechless
    ? ['visual', 'music']
    : ['visual', 'music', 'voice'];

  const contentKey = activeSection === 'scenes' ? `scenes-${safeSceneIdx}` : activeSection;
  const activeMeta = SECTION_META[activeSection];

  return (
    <ConsoleWrapper>
      {/* ── Top Bar ── */}
      <TopBar>
        <TopBarTitle>{plan.clipTitle || 'Untitled Vision'}</TopBarTitle>
        <TopBarMeta>
          <TypeBadge $speechless={isSpeechless}>
            {isSpeechless ? 'Speechless' : 'Narrated'}
          </TypeBadge>
          {plan.category && <CategoryChip>{plan.category}</CategoryChip>}
          <ReadyPill><ReadyDot />Ready</ReadyPill>
        </TopBarMeta>
      </TopBar>

      {/* ── Scene Timeline ── */}
      {scenes.length > 0 && (
        <SceneTimeline
          scenes={scenes}
          planType={plan.planType}
          activeIdx={activeSection === 'scenes' ? safeSceneIdx : -1}
          onSelect={handleTimelineSelect}
        />
      )}

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
              const color = SCENE_COLORS[i % SCENE_COLORS.length];
              return (
                <SceneTile key={i} $active={isActive} $color={color}
                  onClick={() => handleSceneTileClick(i)}>
                  <SceneTileNum $active={isActive} $color={color}>{i + 1}</SceneTileNum>
                  <SceneTileInfo>
                    <SceneTilePrompt $active={isActive}>
                      {getSceneLabel(scene, i)}
                    </SceneTilePrompt>
                    {scene.sceneDuration && (
                      <DurationChip $color={color}>{scene.sceneDuration}s</DurationChip>
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
                  <ReadOnlyText>
                    {plan.clipVisualStyle || <ReadOnlyPlaceholder>No visual style defined</ReadOnlyPlaceholder>}
                  </ReadOnlyText>
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
                  <ReadOnlyText>
                    {plan.clipMusicInstructions || <ReadOnlyPlaceholder>No music instructions defined</ReadOnlyPlaceholder>}
                  </ReadOnlyText>
                </FieldCard>
              </>
            )}

            {/* ── Voice (NARRATED only) ── */}
            {activeSection === 'voice' && !isSpeechless && (
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
                    <ReadOnlyText>
                      {plan.clipVoiceInstructions || <ReadOnlyPlaceholder>No voice instructions defined</ReadOnlyPlaceholder>}
                    </ReadOnlyText>
                  </FieldCard>
                  <FieldCard $color={activeMeta.color}>
                    <FieldLabel>Gender</FieldLabel>
                    <GenderDisplay>
                      <GenderBadge $active={plan.clipVoiceGender === 'MALE'} $gender="MALE">
                        <GenderIcon>♂</GenderIcon>
                        Male
                      </GenderBadge>
                      <GenderBadge $active={plan.clipVoiceGender === 'FEMALE'} $gender="FEMALE">
                        <GenderIcon>♀</GenderIcon>
                        Female
                      </GenderBadge>
                    </GenderDisplay>
                  </FieldCard>
                </VoiceSection>
              </>
            )}

            {/* ── Scenes ── */}
            {activeSection === 'scenes' && scenes.length > 0 && (
              <>
                <SectionHeading>
                  <HeadingIcon $color={SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length]}>
                    {activeMeta.icon}
                  </HeadingIcon>
                  <div>
                    <HeadingText $color={SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length]}>
                      Scene {safeSceneIdx + 1}
                    </HeadingText>
                    <HeadingSubtext>{getSceneLabel(activeScene, safeSceneIdx)}</HeadingSubtext>
                  </div>
                </SectionHeading>

                <SceneTabs>
                  {scenes.map((_, i) => {
                    const color = SCENE_COLORS[i % SCENE_COLORS.length];
                    return (
                      <SceneTab key={i} $active={safeSceneIdx === i} $color={color}
                        onClick={() => setActiveSceneIdx(i)}>
                        {i + 1}
                      </SceneTab>
                    );
                  })}
                </SceneTabs>

                {activeScene && (() => {
                  const activeColor = SCENE_COLORS[safeSceneIdx % SCENE_COLORS.length];
                  const isObjOffset = typeof activeScene.sceneOffsetFrame === 'object'
                    && activeScene.sceneOffsetFrame !== null;
                  const visualInstructions = isObjOffset
                    ? activeScene.sceneOffsetFrame?.staticVisualInstructions || ''
                    : typeof activeScene.sceneOffsetFrame === 'string'
                      ? activeScene.sceneOffsetFrame : '';

                  return (
                    <SceneFieldGroup>
                      {activeScene.sceneDuration && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Duration</FieldLabel>
                          <DurationDisplay>
                            <DurationValue>{activeScene.sceneDuration}</DurationValue>
                            <DurationUnit>seconds</DurationUnit>
                          </DurationDisplay>
                        </FieldCard>
                      )}

                      {activeScene.sceneScriptSegment && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Script</FieldLabel>
                          <ReadOnlyText $italic>
                            "{activeScene.sceneScriptSegment}"
                          </ReadOnlyText>
                        </FieldCard>
                      )}

                      {(visualInstructions || isObjOffset) && (
                        <FieldCard $color={activeColor}>
                          <FieldLabel>Visual Setup</FieldLabel>
                          <ReadOnlyText>
                            {visualInstructions || <ReadOnlyPlaceholder>No visual setup defined</ReadOnlyPlaceholder>}
                          </ReadOnlyText>
                        </FieldCard>
                      )}

                      <FieldCard $color={activeColor}>
                        <FieldLabel>Generation Prompt</FieldLabel>
                        <ReadOnlyText>
                          {activeScene.sceneGenerationPrompt
                            || <ReadOnlyPlaceholder>No generation prompt defined</ReadOnlyPlaceholder>}
                        </ReadOnlyText>
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
        <PromptSlotWrap>{promptBoxSlot}</PromptSlotWrap>
        {status && <StatusText>{status}</StatusText>}
        <GenerateBtn $loading={isExecuting} onClick={handleGenerate} disabled={isExecuting}>
          {isExecuting ? <BtnSpinner /> : '▶'}
          {isExecuting ? 'Generating…' : 'Generate Video'}
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
